const express = require('express');
const next = require('next');
const Cache = require('lru-cache');
const compression = require('compression');

const expressStaticGzip = require('express-static-gzip');
const { createMiddleware: createPrometheusMiddleware } = require('@promster/express');
const { createServer } = require('@promster/server');

const port = parseInt(process.env.PORT, 10) || 3000;
const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const loggingMiddleware = require('./logging');

const handle = app.getRequestHandler();

const ssrCache = new Cache({
  max: 3500,
  maxAge: 1000 * 60 * 60, // 1hour
  updateAgeOnGet: true,
});

const getPageProps = payload => {
  const string = payload
    .split('id="__NEXT_DATA__" type="application/json">')[1]
    .split('</script>')[0];
  const json = JSON.parse(string);
  if (json && json.props && json.props.pageProps) {
    return json.props.pageProps;
  }
};

const getCanCache = (pagePath, payload) => {
  // cache block pages
  if (pagePath.includes('block') && !pagePath.includes('blocks')) {
    return true;
  }
  const props = getPageProps(payload);
  if (
    props &&
    props.initialData &&
    props.initialData.transaction &&
    props.initialData.transaction.tx_status
  ) {
    if (props.initialData.transaction.tx_status !== 'pending') {
      return true;
    }
  } else {
    return false;
  }
};

const renderAndCache = app =>
  async function (req, res, pagePath, queryParams) {
    const { host } = req.headers;
    // Define the cache key as you wish here:
    const key = host + req.url;

    // if page is in cache, server from cache
    if (ssrCache.has(key)) {
      console.info('SSR Response from cache for ', key);
      res.setHeader('x-cache', 'HIT');
      res.end(ssrCache.get(key));
      return;
    }

    try {
      /**
       * Override res.end method before sending it to app.renderToHTML
       * to be able to get the payload (renderedHTML) and save it to cache.
       */
      const _resEnd = res.end.bind(res);
      res.end = function (payload) {
        // Add here custom logic for when you do not want to cache the page, for example when
        // the status is not 200
        const canCache = getCanCache(pagePath, payload);

        if (res.statusCode !== 200) {
          console.warn('Oops, something is wrong, will skip the cache');
        } else if (canCache) {
          ssrCache.set(key, payload);
        }
        return _resEnd(payload);
      };
      // if not in cache, render the page into HTML
      res.setHeader('x-cache', 'MISS');
      console.info('SSR rendering without cache and try caching for ', key);
      await app.renderToHTML(req, res, pagePath, queryParams);
    } catch (err) {
      app.renderError(err, req, res, pagePath, queryParams);
    }
  };

app.prepare().then(() => {
  const server = express();

  server.use(createPrometheusMiddleware({ app: server }));

  server.get(
    '/_next/',
    expressStaticGzip('/static/', {
      enableBrotli: true,
    })
  );

  if (!dev) {
    createServer({ port: 9153 }).then(() => console.log(`@promster/server started on port 9153.`));
    server.use(loggingMiddleware());
  }

  server.get('/', (req, res) => {
    // since we don't use next's requestHandler, we lose compression, so we manually add it
    server.use(compression());
    renderAndCache(app)(req, res, '/');
  });

  server.get('/*.js', (req, res, next) => {
    req.url = req.url + '.br';
    res.set('Content-Encoding', 'br');
    res.set('Content-Type', 'application/javascript; charset=UTF-8');
    next();
  });

  server.get('/txid/:txid', (req, res) => {
    server.use(compression());
    const queryParams = { txid: req.params.txid };
    const pagePath = '/txid/[txid]';
    renderAndCache(app)(req, res, pagePath, queryParams);
  });
  server.get('/tx/:txid', (req, res) => {
    server.use(compression());
    const queryParams = { txid: req.params.txid };
    const pagePath = '/txid/[txid]';
    renderAndCache(app)(req, res, pagePath, queryParams);
  });

  server.get('/block/:hash', (req, res) => {
    server.use(compression());
    const queryParams = { hash: req.params.hash };
    const pagePath = '/block/[hash]';
    renderAndCache(app)(req, res, pagePath, queryParams);
  });

  server.get('/address/:principal', (req, res) => {
    server.use(compression());
    const queryParams = { principal: req.params.principal };
    const pagePath = '/address/[principal]';
    renderAndCache(app)(req, res, pagePath, queryParams);
  });

  server.get('*', (req, res, next) => {
    server.use(compression());
    return handle(req, res);
  });

  server.listen(port, err => {
    if (err) throw err;
    console.log(`> Ready on http://localhost:${port}`);
  });
});

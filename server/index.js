const cacheableResponse = require('cacheable-response');
const express = require('express');
const next = require('next');

const loggingMiddleware = require('./logging');

const { createMiddleware: createPrometheusMiddleware } = require('@promster/express');
const { createServer } = require('@promster/server');

const port = parseInt(process.env.PORT, 10) || 3000;
const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });

const handle = app.getRequestHandler();

/**
 * SSR caching
 */

const ssrCache = cacheableResponse({
  ttl: 1000 * 60 * 2, // 5 minutes
  get: async ({ req, res, pagePath, queryParams }) => {
    const data = await app.renderToHTML(req, res, pagePath, queryParams);

    if (res.statusCode === 404 || res.statusCode === 500) {
      res.end(data);
      return;
    }

    if (pagePath.includes('txid')) {
      res.end(data);
      return;
    }

    return { data };
  },
  send: ({ data, res }) => res.send(data),
});

/**
 * App server
 */

app.prepare().then(() => {
  const server = express();

  server.use(createPrometheusMiddleware({ app: server }));

  if (!dev) {
    createServer({ port: 9153 }).then(() => console.log(`@promster/server started on port 9153.`));
    server.use(loggingMiddleware());
  }

  server.get('/', (req, res) => ssrCache({ req, res, pagePath: '/' }));

  server.get('/txid/:txid', (req, res) => {
    const queryParams = { txid: req.params.txid };
    const pagePath = '/txid/[txid]';
    return ssrCache({ req, res, pagePath, queryParams });
  });

  server.get('*', (req, res) => handle(req, res));

  server.listen(port, err => {
    if (err) throw err;
    console.log(`> Ready on http://localhost:${port}`);
  });
});

const express = require('express');
const next = require('next');
const compression = require('compression');

const expressStaticGzip = require('express-static-gzip');
const { createMiddleware: createPrometheusMiddleware } = require('@promster/express');
const { createServer } = require('@promster/server');
const { pathToRegexp } = require('path-to-regexp');
const expressListEndpoints = require('express-list-endpoints');

const port = parseInt(process.env.PORT, 10) || 3000;
const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const loggingMiddleware = require('./logging');

const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = express();

  server.get(
    '/_next/',
    expressStaticGzip('/static/', {
      enableBrotli: true,
    })
  );

  let routes = [];

  if (!dev) {
    const promMiddleware = createPrometheusMiddleware({
      options: {
        normalizePath: path => {
          // Get the url pathname without a query string or fragment
          // (note base url doesn't matter, but required by URL constructor)
          let pathTemplate = new URL(path, 'http://x').pathname;
          // Match request url to the Express route, e.g.:
          // `/extended/v1/address/ST26DR4VGV507V1RZ1JNM7NN4K3DTGX810S62SBBR/stx` to
          // `/extended/v1/address/:stx_address/stx`
          for (const pathRegex of routes) {
            if (pathRegex.regexp.test(pathTemplate)) {
              pathTemplate = pathRegex.path;
              break;
            }
          }
          return pathTemplate;
        },
      },
    });
    server.use(promMiddleware);
    createServer({ port: 9153 }).then(() => console.log(`@promster/server started on port 9153.`));
    server.use(loggingMiddleware());
  }

  // Store all the registered express routes for usage with metrics reporting
  routes = expressListEndpoints(app).map(endpoint => ({
    path: endpoint.path,
    regexp: pathToRegexp(endpoint.path),
  }));

  // Manual route definitions for the /v2/ proxied endpoints
  routes.push({
    path: '/txid/*',
    regexp: /^\/txid(.*)/,
  });
  routes.push({
    path: '/tx/*',
    regexp: /^\/tx(.*)/,
  });
  routes.push({
    path: '/block/*',
    regexp: /^\/block(.*)/,
  });
  routes.push({
    path: '/address/*',
    regexp: /^\/address(.*)/,
  });

  server.get('/', (req, res) => {
    // since we don't use next's requestHandler, we lose compression, so we manually add it
    server.use(compression());
  });

  server.get('/*.js', (req, res, next) => {
    req.url = req.url + '.br';
    res.set('Content-Encoding', 'br');
    res.set('Content-Type', 'application/javascript; charset=UTF-8');
    next();
  });

  server.get('*', (req, res) => {
    server.use(compression());
    return handle(req, res);
  });

  server.listen(port, err => {
    if (err) throw err;
    console.log(`> Ready on http://localhost:${port}`);
  });
});

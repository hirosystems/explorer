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
const router = express.Router();

const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = express();

  server.get(
    '/_next/',
    expressStaticGzip('/static/', {
      enableBrotli: true,
    })
  );

  server.use(
    (() => {
      const router = express.Router();
      router.use('/txid', next());
      router.use('/microblock', next());
      router.use('/block', next());
      router.use('/address', next());
      return router;
    })()
  );

  let routes = [];

  // Store all the registered express routes for usage with metrics reporting
  routes = expressListEndpoints(server).map(endpoint => ({
    path: endpoint.path,
    regexp: pathToRegexp(endpoint.path),
  }));

  // Manual route definitions for the proxied endpoints
  routes.push({
    path: '/txid/*',
    regexp: /^\/txid(.*)/,
  });
  routes.push({
    path: '/microblock/*',
    regexp: /^\/microblock(.*)/,
  });
  routes.push({
    path: '/block/*',
    regexp: /^\/block(.*)/,
  });
  routes.push({
    path: '/address/*',
    regexp: /^\/address(.*)/,
  });

  if (!dev) {
    const promMiddleware = createPrometheusMiddleware({
      options: {
        normalizePath: path => {
          // Get the url pathname without a query string or fragment
          // (note base url doesn't matter, but required by URL constructor)
          try {
            let pathTemplate = new URL(path, 'http://x').pathname;
            // Match request url to the Express route
            for (const pathRegex of routes) {
              if (pathRegex.regexp.test(pathTemplate)) {
                pathTemplate = pathRegex.path;
                break;
              }
            }
            return pathTemplate;
          } catch (error) {
            logger.warn(`Warning: ${error}`);
            return path;
          }
        },
      },
    });
    server.use(promMiddleware);
    createServer({ port: 9153 }).then(() => console.log(`@promster/server started on port 9153.`));
    server.use(loggingMiddleware());
  }

  server.get('*', (req, res) => {
    server.use(compression());
    return handle(req, res);
  });

  server.listen(port, err => {
    if (err) throw err;
    console.log(`> Ready on http://localhost:${port}`);
  });
});

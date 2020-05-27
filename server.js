const cacheableResponse = require('cacheable-response');
const express = require('express');
const next = require('next');
const morgan = require('morgan');

const port = parseInt(process.env.PORT, 10) || 3000;
const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });

const handle = app.getRequestHandler();

const ssrCache = cacheableResponse({
  ttl: 1000 * 60 * 5, // 5 minutes
  get: async ({ req, res, pagePath, queryParams }) => {
    const data = await app.renderToHTML(req, res, pagePath, queryParams);

    // Add here custom logic for when you do not want to cache the page, for
    // example when the page returns a 404 status code:
    if (res.statusCode === 404) {
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

app.prepare().then(() => {
  const server = express();

  server.use(morgan('combined'));

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

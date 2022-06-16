const express = require('express');
const { getSummary, getContentType } = require('@promster/express');
const app = express();

app.get('/metrics', async (req, res) => {
  req.statusCode = 200;

  res.setHeader('Content-Type', getContentType());
  res.end(await getSummary());
});

module.exports = app;

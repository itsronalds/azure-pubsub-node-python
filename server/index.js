const express = require('express');
const { WebPubSubServiceClient } = require('@azure/web-pubsub');
require('dotenv').config();

const models = require('./models');

const app = express();
const port = process.env.PORT || 8000;

// Set up the Web PubSub service client
const connectionString = process.env.AZURE_WEBPUBSUB_CONNECTION_STRING;
const hubName = process.env.HUB_NAME;
const serviceClient = new WebPubSubServiceClient(connectionString, hubName);

// Middlewares
app.use(express.json());

// Endpoint to negotiate the connection
app.get('/api/negotiate', async (_req, res) => {
  const token = await serviceClient.getClientAccessToken();
  res.json({
    url: token.url,
  });
});

app.post('/api/send-invoice', async (req, res) => {
  const data = req.body;

  if (!data.clientName || !data.amount || !data.status) {
    return res.status(400).json({ message: 'Fields are required' });
  }

  const result = await models.createInvoice(data.clientName, data.amount, data.status);

  if (!result) {
    return res.status(500).json({ message: 'Internal Server Error' });
  }

  const invoice = await models.getLastInvoice();

  if (!invoice) {
    return res.status(500).json({ message: 'Internal Server Error' });
  }

  // Send the invoice to all connected clients
  await serviceClient.sendToAll(invoice);

  res.json({ message: 'Invoice send' });
});

app.post('/api/notify-invoice', async (_req, res) => {
  const data = JSON.parse(body);

  if (!data.invoiceID) {
    return res.status(400).json({ message: 'Fields are required' });
  }

  const result = await models.invoiceProcessed(data.invoiceID);

  if (!result) {
    return res.status(500).json({ message: 'Internal Server Error' });
  }

  return res.json({ message: 'Invoice processed' });
});

app.listen(port, () => {
  console.log(`Server on port ${port}`);
});

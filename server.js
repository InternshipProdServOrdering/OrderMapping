const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const orderMappingService = require('./order-mapping');

const app = express();
const port = 4200;

const mongoUri = "mongodb://localhost:27017/mappingDB"; // Ensure the DB name is included

mongoose.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

app.use(bodyParser.json());

app.post('/addMapping', async (req, res) => {
  const { productOrderId, serviceOrderId } = req.body;
  if (!productOrderId || !serviceOrderId) {
    return res.status(400).send('Bot--h productOrderId and serviceOrderId are required');
  }

  try {
    await orderMappingService.addMapping(productOrderId, serviceOrderId);
    res.send('Mapping added successfully');
  } catch (error) {
    res.status(500).send('Error adding mapping: ' + error.message);
  }
});

app.get('/getServiceOrderId/:productOrderId', async (req, res) => {
  const { productOrderId } = req.params;
  try {
    const serviceOrderId = await orderMappingService.getServiceOrderId(productOrderId);
    if (!serviceOrderId) {
      return res.status(404).send('Service Order ID not found for given Product Order ID');
    }

    res.send({ serviceOrderId });
  } catch (error) {
    res.status(500).send('Error retrieving service order ID: ' + error.message);
  }
});

app.get('/getProductOrderId/:serviceOrderId', async (req, res) => {
  const { serviceOrderId } = req.params;
  try {
    const productOrderId = await orderMappingService.getProductOrderId(serviceOrderId);
    if (!productOrderId) {
      return res.status(404).send('Product Order ID not found for given Service Order ID');
    }

    res.send({ productOrderId });
  } catch (error) {
    res.status  (500).send('Error retrieving product order ID: ' + error.message);
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

const request = require('supertest');
const express = require('express');
const bodyParser = require('body-parser');
const { router } = require('../routes/main.js');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use('/', router);

describe('Create deal', function () {

  test('Without errors', async () => {
    const body = JSON.stringify({
        buyer: "0x1CBd3b2770909D4e10f157cABC84C7264073C9Ec",
        seller: "0xdF3e18d64BC6A983f673Ab319CCaE4f1a57C7097",
        value: 5,
    });
    const res = await request(app).post('/fetch/createDeal').send(body).set('Content-Type', 'application/json');
    expect(res.statusCode).toBe(200);
    expect(JSON.parse(res.text).code).toEqual(0);
  });

  test('Self transaction error', async () => {
    const body = JSON.stringify({
        buyer: "0x1CBd3b2770909D4e10f157cABC84C7264073C9Ec",
        seller: "0x1CBd3b2770909D4e10f157cABC84C7264073C9Ec",
        value: 5,
    });
    const res = await request(app).post('/fetch/createDeal').send(body).set('Content-Type', 'application/json');
    expect(res.statusCode).toBe(200);
    expect(JSON.parse(res.text).code).toEqual(612);
  });

  test('Value <=0', async () => {
    const body = JSON.stringify({
        buyer: "0x1CBd3b2770909D4e10f157cABC84C7264073C9Ec",
        seller: "0xdF3e18d64BC6A983f673Ab319CCaE4f1a57C7097",
        value: -5,
    });
    const res = await request(app).post('/fetch/createDeal').send(body).set('Content-Type', 'application/json');
    expect(res.statusCode).toBe(200);
    expect(JSON.parse(res.text).code).toEqual(613);
  });

  test('Buyer == null', async () => {
    const body = JSON.stringify({
        buyer: null,
        seller: "0xdF3e18d64BC6A983f673Ab319CCaE4f1a57C7097",
        value: 5,
    });
    const res = await request(app).post('/fetch/createDeal').send(body).set('Content-Type', 'application/json');
    expect(res.statusCode).toBe(200);
    expect(JSON.parse(res.text).code).toEqual(614);
  });

  test('Value == null', async () => {
    const body = JSON.stringify({
        buyer: "0x1CBd3b2770909D4e10f157cABC84C7264073C9Ec",
        seller: "0xdF3e18d64BC6A983f673Ab319CCaE4f1a57C7097",
        value: null,
    });
    const res = await request(app).post('/fetch/createDeal').send(body).set('Content-Type', 'application/json');
    expect(res.statusCode).toBe(200);
    expect(JSON.parse(res.text).code).toEqual(614);
  });

  test('Value is undefinde', async () => {
    const body = JSON.stringify({
        buyer: "0x1CBd3b2770909D4e10f157cABC84C7264073C9Ec",
        seller: "0xdF3e18d64BC6A983f673Ab319CCaE4f1a57C7097",
    });
    const res = await request(app).post('/fetch/createDeal').send(body).set('Content-Type', 'application/json');
    expect(res.statusCode).toBe(200);
    expect(JSON.parse(res.text).code).toEqual(614);
  });
});
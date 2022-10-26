const request = require('supertest');
const express = require('express');
const bodyParser = require('body-parser');
const { router } = require('../routes/main.js');
const {openSQLite, closeSQLite} = require('../lib/sqlite.js');
openSQLite();

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use('/', router);

process.on('SIGINT', () => {
  console.log("SIGINT");
  closeSQLite();
  console.log("db close");
  server.close();
});

process.on('uncaughtExceptionMonitor', (err, origin) => {
  console.log('uncaughtExceptionMonitor');
  closeSQLite();
  console.log("db close");
});

process.on('uncaughtException', (err, origin) => {
  console.log('uncaughtException');
  console.log(err, origin);
  process.exit(1);
});

const jsonSerialize = data => JSON.stringify(data, (key, value) =>
  typeof value === "bigint" ? `BIGINT::${value}` : value
);

describe('Create deal', function () {

  test('Without errors', async () => {
    const body = JSON.stringify({
        buyer: "0x1CBd3b2770909D4e10f157cABC84C7264073C9Ec",
        seller: "0xdF3e18d64BC6A983f673Ab319CCaE4f1a57C7097",
        value: 5,
        unit: 0,
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
        unit: 0,
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
        unit: 0,
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
        unit: 0,
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
        unit: 0,
    });
    const res = await request(app).post('/fetch/createDeal').send(body).set('Content-Type', 'application/json');
    expect(res.statusCode).toBe(200);
    expect(JSON.parse(res.text).code).toEqual(614);
  });

  test('Value is str', async () => {
    const body = JSON.stringify({
        buyer: "0x1CBd3b2770909D4e10f157cABC84C7264073C9Ec",
        seller: "0xdF3e18d64BC6A983f673Ab319CCaE4f1a57C7097",
        value: "5",
        unit: 0,
    });
    const res = await request(app).post('/fetch/createDeal').send(body).set('Content-Type', 'application/json');
    expect(res.statusCode).toBe(200);
    expect(JSON.parse(res.text).code).toEqual(613);
  });

  test('Value is undefinde', async () => {
    const body = JSON.stringify({
        buyer: "0x1CBd3b2770909D4e10f157cABC84C7264073C9Ec",
        seller: "0xdF3e18d64BC6A983f673Ab319CCaE4f1a57C7097",
        unit: 0,
    });
    const res = await request(app).post('/fetch/createDeal').send(body).set('Content-Type', 'application/json');
    expect(res.statusCode).toBe(200);
    expect(JSON.parse(res.text).code).toEqual(614);
  });
});

describe('Delete deal', function () {

  test('Without errors', async () => {
    const body = JSON.stringify({
        id: 5,
    });
    const res = await request(app).post('/fetch/deleteDeal').send(body).set('Content-Type', 'application/json');
    expect(res.statusCode).toBe(200);
    expect(JSON.parse(res.text).code).toEqual(0);
  });

  test('id < 0', async () => {
    const body = JSON.stringify({
      id: -5,
  });
    const res = await request(app).post('/fetch/deleteDeal').send(body).set('Content-Type', 'application/json');
    expect(res.statusCode).toBe(200);
    expect(JSON.parse(res.text).code).toEqual(621);
  });

  test('id undefined', async () => {
    const body = JSON.stringify({
    });
    const res = await request(app).post('/fetch/deleteDeal').send(body).set('Content-Type', 'application/json');
    expect(res.statusCode).toBe(200);
    expect(JSON.parse(res.text).code).toEqual(624);
  });

  test('id == null', async () => {
    const body = JSON.stringify({
        id: null,
    });
    const res = await request(app).post('/fetch/deleteDeal').send(body).set('Content-Type', 'application/json');
    expect(res.statusCode).toBe(200);
    expect(JSON.parse(res.text).code).toEqual(624);
  });
});

describe('Get deals by account', function () {

  test('Without errors', async () => {
    const account = "0x1CBd3b2770909D4e10f157cABC84C7264073C9Ec";
    const res = await request(app).get(`/fetch/getDeals?account=${account}`).set('Content-Type', 'application/json');
    expect(res.statusCode).toBe(200);
    expect(JSON.parse(res.text).code).toEqual(0);
  });

  test('Account isn`t valid', async () => {
    const account = "0x001";
    const res = await request(app).get(`/fetch/getDeals?account=${account}`).set('Content-Type', 'application/json');
    expect(res.statusCode).toBe(200);
    expect(JSON.parse(res.text).code).toEqual(631);
  });

  test('account is number', async () => {
    const account = 5;
    const res = await request(app).get(`/fetch/getDeals?account=${account}`).set('Content-Type', 'application/json');
    expect(res.statusCode).toBe(200);
    expect(JSON.parse(res.text).code).toEqual(631);
  });

  test('account == null', async () => {
    const account = null;
    const res = await request(app).get(`/fetch/getDeals?account=${account}`).set('Content-Type', 'application/json');
    expect(res.statusCode).toBe(200);
    expect(JSON.parse(res.text).code).toEqual(631);
  });
});

describe('Update deal status', function () {

  test('Without errors', async () => {
    const body = JSON.stringify({
        id: 5,
        status: 1,
    });
    const res = await request(app).post('/fetch/updateDealStatus').send(body).set('Content-Type', 'application/json');
    expect(res.statusCode).toBe(200);
    expect(JSON.parse(res.text).code).toEqual(0);
  });

  test('id < 0', async () => {
    const body = JSON.stringify({
        id: -5,
        status: 1,
    });
    const res = await request(app).post('/fetch/updateDealStatus').send(body).set('Content-Type', 'application/json');
    expect(res.statusCode).toBe(200);
    expect(JSON.parse(res.text).code).toEqual(641);
  });

  test('status < 0 || status > 4', async () => {
    const body = JSON.stringify({
        id: 5,
        status: 6,
    });
    const res = await request(app).post('/fetch/updateDealStatus').send(body).set('Content-Type', 'application/json');
    expect(res.statusCode).toBe(200);
    expect(JSON.parse(res.text).code).toEqual(642);
  });

  test('id undefined', async () => {
    const body = JSON.stringify({
        status: 1,
    });
    const res = await request(app).post('/fetch/updateDealStatus').send(body).set('Content-Type', 'application/json');
    expect(res.statusCode).toBe(200);
    expect(JSON.parse(res.text).code).toEqual(644);
  });

  test('status is str', async () => {
    const body = JSON.stringify({
        id: 5,
        status: "null",
    });
    const res = await request(app).post('/fetch/updateDealStatus').send(body).set('Content-Type', 'application/json');
    expect(res.statusCode).toBe(200);
    expect(JSON.parse(res.text).code).toEqual(644);
  });
});
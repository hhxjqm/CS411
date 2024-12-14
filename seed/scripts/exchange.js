"use strict";

const dotenv = require('dotenv');
const { Axios } = require("axios");
const mysql = require("mysql2/promise");
dotenv.config();

const request = new Axios({
  baseURL:
    `https://v6.exchangerate-api.com/v6/${process.env.EXCHANGE_RATE_API_KEY}/`,
});

async function insert(conn, src, target, rate) {
    console.log('inserting', src, target, rate)
 await conn.execute(
    "INSERT INTO CurrencyExchange (SourceCurrency, TargetCurrency, Rate) VALUES (?, ?, ?)",
    [src, target, rate]
  );
}

async function main() {
  const connection = await mysql.createConnection({
    host: "34.121.84.53",
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: "cs411",
  });

  const codes = [
    'USD',
    'EUR',
    'JPY',
    'CAD',
    'GBP',
    'CNY',
    'KRW',
    'AUD',
    'HKD',
    'SGD',
    'INR',
    'RUB',
    'BRL',
    'MXN'
  ]


  for (const code of codes) {
    console.log('fetching', code)
    try {
        const response = await request.get(`latest/${code}`);
        const data = JSON.parse(response.data);
        const base = data.base_code;
        const rates = data["conversion_rates"];
    
        for (const [key, value] of Object.entries(rates)) {
          if (!codes.includes(key)) {
            continue;
          }

          await insert(connection, base, key, value);
        }
      } catch (error) {
        console.error(error);
      }
  }


    connection.end();
    console.log('done')
}

main();

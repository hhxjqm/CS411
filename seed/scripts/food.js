'use strict';

const dotenv = require('dotenv');
const {createInterface} = require("readline/promises");
const {createReadStream} = require("fs");
const path = require("path");
const mysql = require("mysql2/promise");

dotenv.config();

async function readline(file, cb) {
    
    const stream = createReadStream(file)
    let first = true
    
    return new Promise((resolve, reject) => {
        createInterface({input: stream})
        .on('line', (line) => {
            if (first) {
                first = false
                return
            }
            const items = line.split('\t');
            cb(items)
        })
        .on('close', () => resolve())
        .on('end', () => resolve())
        .on('error', reject)
    })
}


async function main() {
    const file = path.join(__dirname, "..", "food_inflation.csv")
    const connection = await mysql.createConnection({
        host: "34.121.84.53",
        user: env.DB_USER,
        password: env.DB_PASSWORD,
        database: "cs411",
      });

    const values = []

    console.log('Reading', file)
    await readline(file, (line) => {
        const [_, year, month, rate] = line
        const y = parseInt(year)
        const m  = parseInt(month.substring(1))
        const r = parseFloat(rate)
        if (isNaN(y) || isNaN(m) || isNaN(r)) {
            console.log('Invalid line', line)
            return
        }
        values.push([y, m, r])
    })

    console.log('Pushing', values.length)
    await connection.query(
        "INSERT INTO Inflation (Year, Month, Rate) VALUES ?",
        [values]
    )
}

main()


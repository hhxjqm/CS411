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
            const items = line.split(',');
            cb(items)
        })
        .on('close', () => resolve())
        .on('end', () => resolve())
        .on('error', reject)
    })
}


async function main() {
    const file = path.join(__dirname, "..", "user.csv")
    const connection = await mysql.createConnection({
        host: "34.121.84.53",
        user: "root",
        password: "+~r2j*rXMrf)5S,s",
        database: "cs411",
      });

    const values = []

    console.log('Reading', file)
    await readline(file, (line) => {
        const [id, user, phone, time] = line
        const userId = parseInt(id)
        values.push([userId, user, phone, time])
    })

    await connection.query(
        "INSERT INTO User (UserId, Name, PhoneNumber, DateCreated) VALUES ?",
        [values]
    )
    await connection.end()
}

main()


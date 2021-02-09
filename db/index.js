const mysql = require('mysql');
const dotenv = require('dotenv');
dotenv.config();

// Configures the connection settings to the MySQL database, then connects to it. Runs on startup of the server.

const nana = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    port: 3306,
    password: process.env.DB_PASS,
    database: process.env.DB_DATABASE
})

nana.connect((err) => {
    if(err) throw err
    console.log('Connected to the nanabase')
})

let db = {};

/* Most of these are redundant as I just decided to generate the SQL statements in their respective routes, then 
use one middleware (getImg) for executing any db calls. Creates a new promise that calls the database using whatever 
SQL statement is given, then returns the result if successfull and rejects the promise if there is an error. */
db.img = (img) => {
    return new Promise((resolve, reject) => {
        nana.query(`select * from images where image_id = '${img}';`, (err, result) => {
            if (err){
                return reject(err);
            }
            return resolve(result);
        });
    });
};

db.upload = (sql) => {
    return new Promise((resolve, reject) => {
        nana.query(sql, (err, result) => {
            if (err){
                return reject(err);
            }
            return resolve(result);
        });
    });
};

db.postComment = (sql) => {
    return new Promise((resolve, reject) => {
        nana.query(sql, (err, result) => {
            if (err){
                return reject(err);
            }
            return resolve(result);
        });
    });
};

db.fetchComments = (sql) => {
    return new Promise((resolve, reject) => {
        nana.query(sql, (err, result) => {
            if (err){
                return reject(err);
            }
            return resolve(result);
        });
    });
};

db.getImg = (sql) => {
    return new Promise((resolve, reject) => {
        nana.query(sql, (err, result) => {
            if (err){
                return reject(err);
            }
            return resolve(result);
        });
    });
};

module.exports = db;
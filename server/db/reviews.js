const pg = require('pg');
require('dotenv').config();

const connection = new pg.Pool({
  user: process.env.PGUSER,
  host: process.env.PGHOST,
  database: process.env.PGDATABASE,
  password: process.env.PGPASSWORD,
  port: process.env.PGPORT
});


// const connection = new pg.Client({
//   host: '127.0.0.1',
//   user: 'xiaohan',
//   password: '',
//   database: 'ratingsandreviews'
// });

connection.connect((err) => {
  if (err) {
    console.error(err);
  } else {
    console.log('Connected!');
  }
});

module.exports = connection;
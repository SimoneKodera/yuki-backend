const mysql = require('mysql');
const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());

const db = mysql.createPool({
  // host: '127.0.0.1',
  host: '0.0.0.0',
  user: "root",
  password: "123456",
  database: "todo-list",
  port: 3306,
});


app.post('/task', (err, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "*");

  db.query(`insert into todolist (name) values (${"中森明菜"})`,
    (err, result) => {
      console.log(1);
      if (err) {
        res.end([]);
      }
      console.log("添加 task 成功!", result);
    }
  )

  db.query("select * from todolist ", (err, result) => {
    console.log(2);
    if (err) {
      res.end([]);
    }
    res.send(result);
  });
  
});

app.listen(9090);

// db.query('select * from todolist', (err, res) => {
//     if (err) {
//         console.log('err occurred');
//     }
//     console.log(res)
// });

// db.query("insert into todolist (name) values ('loremalsdkja')", (err, res) => {
//   if (err) {
//     console.log("err occurred");
//   }
//   console.log(res);
// });

// db.query("select * from todolist", (err, res) => {
//   if (err) {
//     console.log("err occurred");
//   }
//   console.log(res);
// });

// db.query("delete from todolist where id = 3", (err, res) => {
//   if (err) {
//     console.log("err occurred");
//   }
//   console.log(res);
// });

// db.query("update todolist set name = 'newSimoneKodera' where id = 1", (err, res) => {
//   if (err) {
//     console.log("err occurred");
//   }
//   console.log(res);
// });
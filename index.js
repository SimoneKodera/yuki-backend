const mysql = require('mysql');
const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());

const db = mysql.createPool({
  host: '0.0.0.0',
  user: "root",
  password: "123456",
  database: "japanese_learning",
  port: 3306,
});

// get 请求 - 查询数据库
app.get('/allWords', (err, res) => { 
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "*");
  db.query('SELECT * FROM all_words', (err, result) => { 
    if (err) {
      console.log('err occurred')
    }
    // 结果要json.stringify一下
    res.end(JSON.stringify(result))
  })
})

// 初始化数据
const initData = async () => { 
  await db.query('TRUNCATE table all_words')
  const res = require('./words.json');
  // 由于forEach是不会等待每个操作执行完毕再执行下一个操作, 所以会导致数据的顺序发生错乱.
  for (let i = 0; i < res.data.length; i++){
    const words = res.data[i];
    // value 都要加引号, 代表字符串
    const cmd = (`insert into all_words (word, nirakana, type, meaning, lesson_number, tone) values ('${words[4]}', '${words[0].split('@')[0]}', '${words[2]}', '${words[1]}', '${words[5]}', '${words[0].split('@')[1]}')`);
    await db.query(cmd);
  }
  console.log('finished')
}


// app.post('/task', (err, res) => {
//   res.setHeader("Access-Control-Allow-Origin", "*");
//   res.setHeader("Access-Control-Allow-Methods", "*");

//   db.query(`insert into todolist (name) values (${"中森明菜"})`,
//     (err, result) => {
//       console.log(1);
//       if (err) {
//         res.end([]);
//       }
//       console.log("添加 task 成功!", result);
//     }
//   )

//   db.query("select * from todolist ", (err, result) => {
//     console.log(2);
//     if (err) {
//       res.end([]);
//     }
//     res.send(result);
//   });
  
// });

app.listen(9090);
console.log('port listen on 9090')


// db.query("insert into todolist (name) values ('loremalsdkja')", (err, res) => {
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
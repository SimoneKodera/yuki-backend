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

// 托管静态资源
// app.use(express.static('public'));

// 测试接口
app.get('/test', (req, res) => {
  res.send('hello world');
});

// get 请求 - 查询数据库
app.get('/all', (req, res0) => { 
  // db.query('SELECT * FROM all_words', (err, result) => { 
  //   // 结果要json.stringify一下
  //   res.end(JSON.stringify(result))
  // })
  db.query('SELECT * FROM deleted_ids', (err, ids) => {
    db.query('SELECT * FROM all_words', (err, list) => {
      res0.json(list.filter(word => {
        return !ids.map(item => item.id).includes(word.id)
      }));
    })
  })
});

app.delete('/all', async (req, res0) => {
  try {
    const promises = req.query.list.map(id => db.query(`INSERT INTO deleted_ids (id) VALUES (${id})`));
    await Promise.all(promises);

    // const [deletedIds, allWords] = await Promise.all([
    //   db.query('SELECT * FROM deleted_ids'),
    //   db.query('SELECT * FROM all_words')
    // ]);
    // const result = allWords.filter(word => !deletedIds.includes(word.id));
    // res0.json(result);
    

    // TODO: 处理异步的问题
    setTimeout(() => {
      db.query('SELECT * FROM deleted_ids', (err, ids) => {
        console.log('ids:', ids);
        db.query('SELECT * FROM all_words', (err, list) => {
          res0.json(list.filter(word => {
            return !ids.map(item => item.id).includes(word.id)
          }));
        })
      })
    }, 100);
    
  }catch (err) {
    res0.status(500).send(err.message);
  }
})

app.get('/deleted', (req, res0) => {
  db.query('SELECT * FROM deleted_ids', (err, ids) => {
    db.query('SELECT * FROM all_words', (err, list) => {
      res0.json(list.filter(word => {
        return ids.map(item => item.id).includes(word.id)
      }));
    })
  })
})

app.get('/test', async (req, res) => {
  db.query('SELECT * FROM deleted_ids', (err, ids) => {
    db.query('SELECT * FROM all_words', (err, list) => {
      res.json(list.slice(0, 10).filter(word => {
        return !ids.map(item => item.id).includes(word.id)
      }));
    })
  })
})

// 区分前后端路由
// app.get('*', function(req, res) {
//   res.sendFile(__dirname + '/public/index.html');
// });

// 初始化数据
const initData = async () => { 
  await db.query('TRUNCATE table all_words')
  const res = require('./words.json');
  // 由于forEach是不会等待每个操作执行完毕再执行下一个操作, 所以会导致数据的顺序发生错乱.
  for (let i = 0; i < res.data.length; i++){
    const words = res.data[i];
    // value 都要加引号, 代表字符串
    const cmd = (`insert into all_words (word, nirakana, type, meaning, lesson_number, tone) values ('${words[4]}', '${words[0].split('@')[0]}', '${words[2]}', '${words[3]}', '${words[5]}', '${words[0].split('@')[1]}')`);
    await db.query(cmd);
  }
  console.log('finished')
}

// initData();


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

app.listen(80);
console.log('port listen on 80')


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
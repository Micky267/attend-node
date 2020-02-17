//test.js
var express = require("express");
var bodyParser = require('body-parser');
var app = express();
var mysql = require('mysql');
var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',  
    password: '123456', 
    database: 'attendance'
});

//配置body-parser
//只要加入这个配置，就会在req加一个属性body
//可以通过req.body获取post表单请求体数据
app.use(bodyParser.urlencoded({extend:false}));
app.use(bodyParser.json());

//增
app.get("/addStudent", (req, res) => {

    const id = req.query.id;
    const name = req.query.name;
    const age = req.query.age;


    const sql = 'INSERT INTO student (id,name,age) VALUES (?,?,?)'
    const value = [id, name, age];

    connection.query(sql, value, (error, data) => {
        if (error) {
            var result = {
                "status": "500",
                "message": "服务器错误"
            }
            return res.jsonp(result);
        } else {
            var result = {
                "status": "200",
                "message": "success",
                data: data
            }
            return res.jsonp(result);
        }


    });
})
//查
app.post("/getCourse", (req, res) => {

    const body = req.body.name
    console.log('Post参数',body)
    const sql = 'select sid,name from course '
    connection.query(sql, id, (error, data) => {
        if (error) {
            var result = {
                "status": "500",
                "message": error
            }
            return res.jsonp(result);
        } else {
            var result = {
                "status": "200",
                "message": "success",
                data: data
            }
            return res.jsonp(result);
        }


    });
})


//删
app.get("/deleteStudent",(req,res)=>{
    const id = req.query.id
    const sql = "delete from student where id = ?"
    connection.query(sql,id,(error,data)=>{
        if (error) {
            var result = {
                "status": "500",
                "message": error
            }
            return res.jsonp(result);
        } else {
            var result = {
                "status": "200",
                "message": "success",
                data: data
            }
            return res.jsonp(result);
        }
    })
})

//如果没有路径取静态目录
app.use(express.static("public"));


// Listen

app.listen(7878)
console.log("我启动了")
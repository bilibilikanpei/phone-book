const express = require("express");
const http=require("http");
var bodyParser = require('body-parser');
//创建服务对像
const app = express();

//引入路由组件
const list=require("./src/list");
const user=require("./src/user");
const valid=require("./src/valid");
const update=require("./src/update");
const create=require("./src/create");
//支持post提交
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

//注册静态资源目录
app.use(express.static(`${__dirname}/public/`));

//注册路由组件
app.use("/list",list);
app.use("/user",user);
//验证
app.use("*",valid);
//后续都是需要验证的操作
app.use("/update",update);
app.use("/create",create);

//注册一个路由pathname
// app.get("/", (req, res, next) => {
//     res.writeHead(200, { 'content-Type': "text/html;charset=UTF-8" });
//     res.write("这是我们的第一个express程序");
//     res.end();
// });


//错误中间件
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// 再加一个中间件 处理错误信息
app.use(function (error,req, res, next) {
    res.writeHead(404, { 'content-Type': "text/html;charset=UTF-8" });
    res.end("404:没找着！ ");
});




const server=http.createServer(app);
server.listen(8082,()=>{console.log("启动服务：8082")});

//启动服务
// server.listen(8085, (err) => {
//     if (err) throw err
// });


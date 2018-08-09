const router = require("express").Router();
const mongodb = require("mongodb");

const guid = require("guid");
const md5 = require("md5")

const async = require('async')


const get_mime = require("./mime")
// 加载mongo的组件
const db_client = mongodb.MongoClient;

const db_connstr = 'mongodb://127.0.0.1:27017/students';


module.exports = router;

router.use("*", (req, res, next) => {
    //验证
    const token = req.headers.token;
    db_client.connect(db_connstr, (err, db) => {
        let u = db.collection("user");
        u.findOne({ token }, (err, result) => {
            if (!!result) {
                next();
            } else {
                //验证失败
                res.writeHead(401, { 'Content-Type': `${get_mime('json')};charset=UTF-8` });
                res.end('此操作需要验证身份')
            }
            db.close();
        });
    });
});
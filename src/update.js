const router = require("express").Router();
const mongodb = require("mongodb");

const guid = require("guid");
const md5 = require("md5")

const async = require('async')


const get_mime = require("./mime")
// 加载mongo的组件
const db_client = mongodb.MongoClient;

const db_connstr = 'mongodb://127.0.0.1:27017/c4_phonebook';


router.post("/", (req, res) => {
    const { id,name, phone, mobile, weichatUrl, remark } = req.body;
    db_client.connect(db_connstr, (err, db) => {
        const c = db.collection("linkman");
        c.update({ _id: mongodb.ObjectID(id) }, {
            $set: { name, phone, mobile, weichatUrl, remark }
        }, (err, result) => {
            if (!err) {
                res.writeHead(200, { 'Content-Type': `${get_mime('json')};charset=UTF-8` });
                res.end(JSON.stringify({ success: true }));
            }
            db.close();
        });
    });
});

module.exports = router;
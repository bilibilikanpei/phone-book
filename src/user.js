const router = require("express").Router();
const mongodb = require("mongodb");

const guid = require("guid");
const md5 = require("md5")

const async = require('async')


const get_mime = require("./mime")
// 加载mongo的组件
const db_client = mongodb.MongoClient;

const db_connstr = 'mongodb://127.0.0.1:27017/students';


router.post("/login", (req, res) => {
    var param = req.body;
    const { user_id, password } = param;
    // let ps_md5 = md5(password);
    let ps_md5 = password;
    //使用async组件进行改造 

    async.waterfall([
        //创建数据库链接
        (next_callback) => {
            db_client.connect(db_connstr, (err, db) => {
                next_callback(err, db);
            });
        },
        //得到指定集合
        (db, next_callback) => {
            let collection = db.collection("user");
            next_callback(null, { collection, db });
        },
        //查找管理员,如果成功，证明登录成功
        (prev, next_callback) => {
            const { db, collection } = prev;
            collection.findOne({ user_id, password: ps_md5 }, (err, result) => {
                if (result) {
                    next_callback(err, { user: result, collection, db });
                } else {
                    next_callback({ message: '用户名密码错误' }, { db });
                }

            });
        },
        //生成token，更新数据
        (prev, next_callback) => {
            //生成token
            const { db, collection, user } = prev;
            let token_str = guid.raw();
            collection.update(
                { _id: user._id },
                { $set: { token: token_str } },
                (err, result) => {
                    next_callback(err, { token_str, db })
                }
            )
        }
    ], (err, result) => {
        result && result.db && result.db.close();
        //最终回调
        if (err) {
            let err_msg = !result ? "数据库连接失败" : err.message;

            res.writeHead(401, { 'Content-Type': get_mime('json') });
            res.end(JSON.stringify({ message: err_msg }));
        } else {
            //把生成的token发送给前端 
            res.writeHead(200, { 'Content-Type': get_mime('json') });
            res.end(JSON.stringify({ token: result.token_str }));
        }
    });
});


module.exports = router;
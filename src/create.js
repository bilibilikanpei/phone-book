const router = require("express").Router();
const mongodb = require("mongodb");

const guid = require("guid");
const md5 = require("md5")

const get_mime = require("./mime")
// 加载mongo的组件
const db_client = mongodb.MongoClient;

const db_connstr = 'mongodb://127.0.0.1:27017/students';


router.post('/',(req,res)=>{
    var param = req.body;

    db_client.connect(db_connstr,(err,db)=>{
        if(err){
            console.log("连接数据库失败",err)
        }else{
            let collection=db.collection("linkman");
            // 插入数据post
            collection.insert(param,(err,result)=>{
                res.writeHead(200, { 'Content-Type': get_mime('json') });                    
                res.end(JSON.stringify(result));  
                db.close();
            });
        }
         
    })
})

module.exports = router;
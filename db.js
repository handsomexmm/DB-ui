
var mongodb = require('mongodb');
var MongoClient = mongodb.MongoClient;
var ObjectId = mongodb.ObjectId;

var dbUrl = 'mongodb://localhost:27017/';

var dbName = 'qianfeng';

//封装一个连接数据库的方法
function __connect(cb){

    MongoClient.connect(dbUrl,function(err,client){
        if(err){
            console.log(err);
            return false;
        }
        //成功  client
        cb(err,client);
    })
}

exports.ObjectId=ObjectId;

/*
 DB.find('user',{},function(data){

    console.log(data)
 })


 DB.find('user',{条件},{字段},{
     page:1,
     pageSize：20
 },function(data){

    console.log(data)
 })

db.user.find({},{"title":1})


 collectionName表名称

 json1条件

json2 查询的字段

json3  对象 page  和pageSize

cb回调函数

DB.find('user',{"name":"zhangsna"},{"name":1},function(){
})

* */
exports.find=function(collectionName,json1,json2,json3,cb){
    //条件
    if(arguments.length==3){
        var slipNum=0;       /*跳过的条数据*/
        var pageSize=0;
        var attr={};  /*要查询的字段*/
        cb=json2;
    }else if(arguments.length==4){
        var slipNum=0;
        var pageSize=0;
        var attr=json2;  /*要查询的制度*/
        cb=json3;
    }else if(arguments.length==5){
        var attr=json2;  /*要查询的字段*/
        var slipNum=(json3.page-1)*json3.pageSize;
        var pageSize=json3.pageSize;
    } else{
        console.log('参数错误');
    }
    __connect(function(err,client){
        var db=client.db(dbName);
        //条件

        //console.log(JSON.stringify());

        /*db库改造*/
        var result=db.collection(collectionName).find(json1,{fields:attr}).skip(slipNum).limit(pageSize);
        result.toArray(function(err,docs){
            //docs  查询到的数据
            console.log(docs);
            if(err){
                console.log(err);
                return;
            }
            cb(docs);
            client.close();  /*关闭数据库*/
        })
    })

}

//增加数据的方法

/*
DB.insert('user',{},function(){

})
* */

exports.insert=function(collectionName,json,cb){

        __connect(function(err,client){
            //增加数据
            var db=client.db(dbName);

            db.collection(collectionName).insertOne(json,function(err){
                cb(err);
            })

        })
}
//修改

/*
 DB.update('user',{},{},function(){
 })
* */
exports.update=function(collectionName,json1,json2,cb){

    __connect(function(err,client){
        //增加数据
        var db=client.db(dbName);

        db.collection(collectionName).updateOne(json1,{
            $set:json2
        },function(err){
            cb(err);
        })

    })
}

exports.count=function(collectionName,json,cb){

    __connect(function(err,client){
        //增加数据
        var db=client.db(dbName);
        //注意  新版本mongodb 返回的是一个promise
        var result=  db.collection(collectionName).count(json);

        result.then(function(count){
            cb(count);
        })
    })
}


/**
 * Created by zhangjunbo on 2017/4/7.
 */
var express = require("express");
var mysql = require("mysql");

var conn = mysql.createConnection({
    host:"localhost",
    user:'root',
    password:"1234",
    database:"kfl"
});

conn.connect();

var app = express();

app.use(express.static("kfl"));
app.get("/getDishes",function(req,res){
    var num = req.query.num;
    var index = req.query.index-1;
    var searchText = req.query.searchText;
    var sqlStr;
    if(searchText==""){
        sqlStr = "select * from kf_dish limit " + index*num + "," + num;
    }else{
        sqlStr = "select * from kf_dish where name like '%" + searchText + "%' or material like '%" + searchText +"%'";
    }

    console.log(sqlStr);
    conn.query(sqlStr,function(err,result){
        if(err) throw err;
        //console.log(result);
        res.send(result);
    })

});
app.get("/getDish",function(req,res){
    //1.取得前端传过来的菜id
    var id = req.query.did;
    //2.写sql语句
    var sqlStr = "select * from kf_dish where did=" + id;
    //3.conn.query 查询,并把结果返回前端
    conn.query(sqlStr,function(err,result){
        if(err) throw err;
        res.send(result);
    });
})
app.get("/orderDish",function(req,res){
    //1.接收订单信息
    var dish = {
        user_Name : req.query.userName,
        sex : req.query.sex,
        phone : req.query.phone,
        addr : req.query.addr,
        did:req.query.did
    };
    console.log(dish);
    //console.log(userName,sex,phone,addr);
    //2.拼接查询语句(insert)
    conn.query("insert into kf_order set ?",dish,function(err,results){
        if(err) throw err;
        res.send({"result":results.insertId})
    });
    // insert into 表名 values(值,值,....)
    // insert into 表名 set 列名=值,....
    //3.执行语句，并返回信息
});
app.get("/getMyOrders",function(req,res){
    var phone = req.query.phone;
    var sqlStr = "select * from kf_order inner join kf_dish on kf_order.did = kf_dish.did where phone ='" + phone + "' order by oid desc";
    conn.query(sqlStr,function(err,result){
        if(err) throw err;
        res.json(result);
    })
})
app.listen(3000);
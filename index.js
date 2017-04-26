/**
 * Created by Administrator on 2017/4/7.
 */
var express=require('express');

var mysql=require('mysql');
var app=express();
var conn=mysql.createConnection({
    host:"localhost",
    user:"root",
    password:"1234",
    database:"kaifanla"

});
conn.connect();

app.use(express.static('kfl'));
app.get("/getDishes",function (req,res) {
    var num=req.query.num;
    var index=req.query.index-1;
    var sqlStrl;
    var searchText=req.query.searchText;
    if(searchText==""){
        sqlStrl="select * from kf_dish limit "+index*num+","+num;
    }else{
        sqlStrl="select * from kf_dish where name like '%"+searchText+"%' or material  like '%"+searchText+"%' " ;

    }
    console.log(sqlStrl);
    conn.query(sqlStrl,function (err,result) {
        if(err) throw err;
        res.send(result)

    })
    // conn.query("select * from kf_dish limit "+index*num+","+num,function (err,result) {
    //     if(err) throw err;
    //     // console.log(result);
    //     res.send(result)
    // })

})
app.get("/getDish",function(req,res){
    var did=req.query.did;
    conn.query("select * from kf_dish where did="+did,function (err,result) {
        if (err) throw err;
        res.send(result);
        console.log(result);

    })
})

app.get("/orderDish",function(req,res){

        var dish={
             user_name:req.query.username,
             sex:req.query.sex,
             addr:req.query.addr,
             phone:req.query.phone,
            did:req.query.did
        }
    conn.query("insert into kf_order set ?",dish,function (err,result) {
        if (err) throw err;
        res.send({"result":result.insertId});

    })


    })
app.get("/getMyOrder",function (req,res) {
     var phone=req.query.phone;
     var sqlStr="select * from kf_order inner join kf_dish on kf_order.did=kf_dish.did where phone='"+phone+"' order" +
         " by oid desc";
     conn.query(sqlStr,function (err,result) {
         if(err) throw err;
         res.json(result);
     })

})

//提交注册信息
app.post('/register',function (req,res) {
    console.log("提交注册信息");
    //获得用户提交的表单数据
    var user = {
        username:req.query.username,
        username:req.query.password
    };
    conn.query("insert into kf_user set ?",user,function(err,results ) {
        if (err) throw err;
        res.send({"result":results.insertId});
    })

});

// 使用post方式提交登陆信息
app.post('/login', function(req, res) {
    console.log("提交登陆信息");
    var user = req.body;
    var sqlStr="select * from kf_user where username='"+user.username+"' and password='"+user.password+"'";
    conn.query(sqlStr,function (err,result) {
        if(err) throw err;
        if (result.length>0){
            req.session.token=result[0].username;
            res.send(result)
        } else{
                res.send('err')
        }
    })



});

//注销用户登陆
app.get('/logout',function (req,res) {
    req.session.user=null;
    console.log("退出登陆");
    res.redirect("/");

});

app.listen(3000);

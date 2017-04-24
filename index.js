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
app.get('/login', function(req, res, next) {
    var keyword = "";
    console.log("打开登陆页面");
    res.render("template/login",{"title":"登陆",keyword:keyword})
});

//使用post方式提交登陆信息
app.post('/login', function(req, res,next) {
    console.log("提交登陆信息");
    var user = req.body;
    user.password= md5(user.password);
    //查询数据库,找到是否有匹配的记录
    Model("User").findOne(user,function (err,u) {
        console.log(u);
        if(u)
        {
            //用户登陆成功  将用户的登陆信息保存到session中
            req.flash("success","登陆成功");
            req.session.user =u;
            return res.redirect("/");
        }
        req.flash("error","登陆失败,用户名或密码错");
        return res.redirect("/template/login");

    })
});

//打开注册页面
app.get('/register',function (req,res,next) {
    console.log("打开注册页面");
    var keyword = "";
    res.render("template/register",{title:"注册",keyword:keyword});
});
//提交注册信息
app.post('/register',function (req,res,next) {

    console.log("提交注册信息");

    //获得用户提交的表单数据
    var user = req.body;
    if(user.password != user.pwd2)
    {
        //密码和确认密码不一致
        req.flash('error',"两次密码不一致");
        //重定向到注册页面
        return res.redirect("/template/register");
    }
    //删除确认密码的属性
    delete user.pwd2;
    //把密码用md5加密
    user.password = md5(user.password);
    //将user对象保存到数据库中
    new Model("User")(user).save(function (err,user) {
        if(err)
        {
            req.flash("error","注册失败");
            res.redirect("/template/register");
        }
        //在session中保存用户的登陆信息
        req.flash("success","注册成功");
        req.session.user=user;
        res.redirect("/");
    })
});
//注销用户登陆
app.get('/logout',function (req,res,next) {

    req.session.user=null;
    console.log("退出登陆");
    req.flash("success","用户登陆已注销");
    res.redirect("/");

});

app.listen(3000);

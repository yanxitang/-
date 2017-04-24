/**
 * Created by Administrator on 2017/4/6.
 */
angular.module("myApp",["ng","ngRoute"])
    .controller("startCtrl",function ($timeout,$location) {
        $timeout(function () {
            $location.path("/main")
        },2000)
    })
    .controller("mainCtrl",function($scope,$http){
        $scope.dishes=[];
        $scope.loadStatus=1;//1未加载 2加载中 3 没有更多
        $scope.searchText="";
        var num=4;
        var index=1;
        function getDishes() {
            $http({
                url:'getDishes',
                method:'get',
                params:{
                    num:num,
                    index:index,
                    searchText:$scope.searchText
                }
            }).success(function(data){
                    $scope.dishes=$scope.dishes.concat(data);
                    index++;

                if(data.length==0){
                    $scope.loadStatus=3;
                }else{
                    $scope.loadStatus=1;
                }

                console.log($scope.dishes);
            })
        }
        $scope.getMoreDishes=function(){
            getDishes();
        }
        getDishes();
        $scope.searchDishes=function (event) {
           if(event.keyCode==13){
               if($scope.searchText==""){
                   $scope.dishes=[];
                   getDishes();
               }else{

               $http({
                   url:'getDishes',
                   method:'get',
                   params:{
                       num:num,
                       index:index,
                       searchText:$scope.searchText
                   }
               }).success(function(data){
                       $scope.dishes=data;
                       index=1;

                   $scope.loadStatus=3;


                   console.log($scope.dishes);
               })
           }
           }
        }
    })
    .controller("detailCtrl",function ($routeParams,$scope,$http) {
                var did=$routeParams.did;
                $http({
                url:'getDish',
                    method:'get',
                    params:{
                        did:did

                    }
        }).success(function(data){
            $scope.dish=data[0];
        })

    })
    .controller("orderCtrl",function ($routeParams,$timeout,$scope,$http,$location) {
        function SetLocalStorage(key,value){
             localStorage.setItem("kfl_"+key,value)
        }
        function GetLocalStorage(key){
            return   localStorage.getItem("kfl_"+key)
        }
        var id=$routeParams.did;
        $scope.msg="";
        $scope.username=GetLocalStorage("username");
        $scope.sex =GetLocalStorage("sex");
        $scope.phone=GetLocalStorage("phone");
        $scope.addr=GetLocalStorage("addr");

        $scope.orderDish=function () {
            var username=$scope.username;
            var sex =$scope.sex;
            var phone=$scope.phone;
            var addr=$scope.addr;


                if(username==""){
                showMsg("联系人");
                    return;
                }
                if(sex=="" ){
                    showMsg('性别');
                    return;
                }
                if(phone=="" ){
                    showMsg('电话号码');
                    return;
                }
                if(addr=="" ){
                    showMsg('地址');
                    return;
                }
                $http({
                    url:"orderDish",
                    method:'get',
                    params:{
                        username:username,
                        sex:sex,
                        phone:phone,
                        addr:addr,
                        did:id
                    }

            }).success(function(data){
                console.log(data);
                if(data.result>0){
                    SetLocalStorage("username",username);
                    SetLocalStorage("sex",sex);
                    SetLocalStorage("phone",phone);
                    SetLocalStorage("addr",addr);
                    $location.path("/myorder")
                }

                })

                function showMsg(msg) {
                    $scope.msg=msg;
                    $timeout(function () {
                        $scope.msg="";
                    },3000)
                }

        }

    })
    .controller("myorderCtrl",function ($scope,$http) {
        $scope.orders=[];
        $scope.hasorder=false;
        function GetLocalStorage(key){
            return   localStorage.getItem("kfl_"+key)
        }
        var phone= GetLocalStorage("phone");
        console.log(phone)
        if(phone !=null){
            $http({
                url:"getMyOrder",
                method:"get",
                params:{
                    phone:phone
                }
            }).success(function(data){
                $scope.hasorder=true;
                console.log(data);
                $scope.orders=data;
            })
        }else{
            $scope.hasorder=false;
        }
    })
    .controller("loginCtrl",function(){})
    .controller("registerCtrl",function(){})
    .config(function($routeProvider) {
        $routeProvider
        .when('/start', {
                templateUrl: 'template/start.html',
                controller: "startCtrl"
        })
        .when('/main',{
            templateUrl:"template/main.html",
            controller: "mainCtrl"
        })
        .when('/detail/:did',{
            templateUrl:"template/detail.html",
            controller: "detailCtrl"
        })
        .when('/order/:did',{
            templateUrl:"template/order1.html",
            controller: "orderCtrl"
        })
        .when('/myorder',{
            templateUrl:"template/myorder.html",
            controller: "myorderCtrl"
        })
        .when('/login',{
            templateUrl:"template/login.html",
            controller: "loginCtrl"
        })
        .when('/register',{
            templateUrl:"template/register.html",
            controller: "registerCtrl"
        })

        .when('/',{
            redirectTo:"/start"
        })
    })


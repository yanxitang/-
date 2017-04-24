/**
 * Created by zhangjunbo on 2017/4/6.
 */
angular.module("myApp",["ng","ngRoute"])
    .controller("startCtrl",function($timeout,$location){
        $timeout(function(){
            $location.path("/main");
        },2000);
    })
    .controller("mainCtrl",function($scope,$http){
        var num = 4;
        var index = 1;
        $scope.dishes = [];
        $scope.loadStatus = 1; //1:未加载，2:加载中 3.没有更多
        $scope.searchText = "";
        function getDishes(){
            $scope.loadStatus = 2;
            $http({
                url:"getDishes",
                method:"get",
                params:{
                    num:num,
                    index:index,
                    searchText:$scope.searchText
                }
            }).success(function(data){
                $scope.dishes = $scope.dishes.concat(data)
                index++;

                if(data.length==0){
                    $scope.loadStatus = 3;
                }else{
                    $scope.loadStatus = 1;
                }

                //console.log($scope.dishes);
            });
        }
        $scope.getMoreDishes = function(){
            getDishes();
        };
        $scope.searchDishes = function(event){
            if(event.keyCode == 13){
                //后端根据查询内容取得菜谱信息
                if($scope.searchText == ""){
                    $scope.dishes = [];
                    getDishes();
                }else
                {
                    $http({
                        url:"getDishes",
                        method:"get",
                        params:{
                            num:num,
                            index:index,
                            searchText:$scope.searchText
                        }
                    }).success(function(data){
                        $scope.dishes = data;
                        index = 1;

                        $scope.loadStatus = 3;
                    });
                }

            };
        }



        getDishes();

    })
    .controller("detailCtrl",function($routeParams,$http,$scope){
        var did = $routeParams.id;
        //根据菜id，向后端发送请求($http)
        $http({
            url:"getDish",
            method:"get",
            params:{
                did:did
            }
        }).success(function(data){
            $scope.dish = data[0];
            //$scope.dish = ...
        });
    })
    .controller("myOrderCtrl",function($scope,$http){
        $scope.orders = [];
        $scope.hasOrder = false;
        function GetLocalStorage(key){
            return localStorage.getItem("kfl_" + key);
        }
        var phone = GetLocalStorage("phone");
        //console.log(phone);
        if(phone != null){
            $http({
                url:"getMyOrders",
                method:"get",
                params:{
                    phone:phone
                }
            }).success(function(data){
                $scope.hasOrder = true;
                $scope.orders = data;
            });
        }else{
            $scope.hasOrder = false;
        }
    })
    .controller("orderCtrl",function($timeout,$routeParams,$scope,$http,$location){
        function SetLocalStorage(key,value){
            localStorage.setItem("kfl_" + key,value );
        }
        function GetLocalStorage(key){
            return localStorage.getItem("kfl_" + key);
        }

        var id = $routeParams.id;
        $scope.msg = "";
        $scope.userName = GetLocalStorage("userName");
        $scope.sex = GetLocalStorage("sex");
        $scope.phone = GetLocalStorage("phone");
        $scope.addr = GetLocalStorage("addr");
        $scope.orderDish = function(){
            var userName = $scope.userName;
            var sex  = $scope.sex;
            var phone = $scope.phone;
            var addr = $scope.addr;

            console.log(userName,sex,phone,addr);
            if(userName == ""){
                showMsg("联系人");
                return;
            }
            if(sex == ""){
                showMsg("性别");
                return;
            }
            if(phone == ""){
                showMsg("联系电话");
                return;
            }
            if(addr == ""){
                showMsg("送餐地址");
                return;
            }

            $http({
                url:"orderDish",
                method:"get",
                params:{
                    "userName":userName,
                    "sex":sex,
                    "phone":phone,
                    "addr":addr,
                    "did":id
                }
            }).success(function(data){
                console.log(data);
                //如果插入成功
                //保存用户输入信息到 localstorage
                if(data.result>0){
                    SetLocalStorage("userName",userName);
                    SetLocalStorage("sex",sex);
                    SetLocalStorage("phone",phone);
                    SetLocalStorage("addr",addr);

                    $location.path("/myOrder");
                }
                console.log(data);
                //1.给出成功提示，并且跳转页面到订购清单

            });



            function showMsg(msg){
                $scope.msg = msg;
                $timeout(function(){
                    $scope.msg = "";
                },3000);
            }
        }
    })
    .config(function($routeProvider){
        $routeProvider
            .when("/start",{
                templateUrl:"template/start.html",
                controller:"startCtrl"
            })
            .when("/main",{
                templateUrl:"template/main.html",
                controller:"mainCtrl"
            })
            .when("/detail/:id",{
                templateUrl:"template/detail.html",
                controller:"detailCtrl"
            })
            .when("/order/:id",{
                templateUrl:"template/order.html",
                controller:"orderCtrl"
            })
            .when("/myOrder",{
                templateUrl:"template/myOrder.html",
                controller:"myOrderCtrl"
            })
            .when("/",{
                redirectTo:"/start"
            })
    })
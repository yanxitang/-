/**
 * Created by Administrator on 2017/4/24.
 */
angular.module("myApp",["ng"])
    .controller("signCtrl",function ($scope) {
        $scope.userdata={};
        $scope.submitForm=function(){
            console.log($scope.userdata);
            if($scope.signForm.$invalid)
                alert ('请检查你的信息')
            else
                alert('提交成功')

        }

    })
    .directive('compare',function(){
        var o={};
        o.strict='AE';
        o.scope={
            orgText:'=compare'
        }
        o.require='ngModel';
        o.link=function (sco,ele,attr,con) {
            con.$validators.compare=function (v) {
                return v==sco.orgText;
            }
            sco.$watch('orgText',function () {
                con.$validate();
            })
        }
        return o;
    })
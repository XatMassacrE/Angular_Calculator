'use strict';

angular.module('myApp.view', [
    'ngRoute',
])
.controller('ViewCtrl', function($scope) {
      $scope.data={
        "1":["M","CE","C","DEL","/"],
        "2":["+/-","7","8","9","*"],
        "3":["sqrt","4","5","6","-"],
        "4":["%","1","2","3","+"],
        "5":["1/x","0",".","="]
      };
      $scope.showClass=function(a){
        if(a==0){
          return "zero";
        }
        if(a=="=")
        {
          return "equal";
        }
        return "normal";
      }
      //计算时用的数字的栈
      $scope.num=[];
      $scope.history=[];
      //接受输入用的运算符栈
      $scope.opt=[];
      //计算器计算结果
      $scope.result="0";
      //表示是否要重新开始显示,为true表示不重新显示，false表示要清空当前输出重新显示数字
      $scope.flag=true;
      //表示当前是否可以再输入运算符，如果可以为true，否则为false
      $scope.isOpt=true;

      //计算器界面数据

      $scope.init=function(){
        $scope.num=[];
        $scope.opt=[];
        $scope.history=[];
        $scope.flag = true;
        $scope.isOpt=true;

      } ;
      //显示计算器样式

      $scope.showResult=function(a){
        $scope.history.push(a);
        var reg=/\d/ig,regDot=/\./ig;
        //1/x
        if(a=="1/x"){
          $scope.result=$scope.format(Number(1/$scope.result));
        }
        //如果点击的是个数字
        else if(reg.test(a)) {
          //消除冻结
          if($scope.isOpt==false){
            $scope.isOpt=true;
          }

          if ($scope.result != "0" && $scope.flag && $scope.result != "error") {
            $scope.result += a;
          }
          else {
            $scope.result = a;
            $scope.flag = true;
          }

        }
        //Memory
        else if(a=="M"){
          $scope.memory = $scope.result;
          $scope.memoryClass = function(){
            return "memoryDiv";
          }
        }
        //如果点击的是CE
        else if(a=="CE"){
          $scope.result=0;
          $scope.init();
          $scope.memory = "";
          $scope.memoryClass = function(){
            return "";
          }
        }
        //如果点击的是C
        else if(a=="C"){
          $scope.result=0;
          $scope.init();
        }
        //如果点击的是个小数点
        else if(a=="."){
          if($scope.result!=""&&!regDot.test($scope.result)){
            $scope.result+=a;
          }
        }
        //如果点击的是个取反操作符
        else if(a=="+/-"){
          if($scope.result>0){
            $scope.result="-"+$scope.result;
          }
          else{
            $scope.result=Math.abs($scope.result);
          }
        }
        //sqrt
        else if(a=="sqrt"){
          $scope.result=$scope.format(Number(Math.sqrt($scope.result)));
        }
        //如果点击的是个百分号
        else if(a=="%"){
          $scope.result=$scope.format(Number($scope.result)/100);
        }
        //Del
        else if(a=="DEL"){
          $scope.result=$scope.result.replace(/.$/,'');
        }
        //如果点击的是个运算符且当前显示结果不为空和error
        else if($scope.checkOperator(a)&&$scope.result!=""&&$scope.result!="error"&&$scope.isOpt){
          $scope.flag=false;
          $scope.num.push($scope.result);
          $scope.operation(a);
          //点击一次运算符之后需要将再次点击运算符的情况忽略掉
          $scope.isOpt=false;
        }
        //如果点击的是等于号
        else if(a=="="&&$scope.result!=""&&$scope.result!="error"){
          $scope.flag=false;
          $scope.num.push($scope.result);
          while($scope.opt.length!=0){
            var operator=$scope.opt.pop();
            var right=$scope.num.pop();
            var left=$scope.num.pop();
            $scope.calculate(left,operator,right);
          }
        }
      };
      //比较当前输入的运算符和运算符栈栈顶运算符的优先级
      //如果栈顶运算符优先级小，则将当前运算符进栈，并且不计算，
      //否则栈顶运算符出栈，且数字栈连续出栈两个元素，进行计算
      //然后将当前运算符进栈。
      $scope.operation=function(current){
        //如果运算符栈为空，直接将当前运算符入栈
        if(!$scope.opt.length){
          $scope.opt.push(current);
          return;
        }
        var  operator,right,left;
        var  lastOpt=$scope.opt[$scope.opt.length-1];
        //如果当前运算符优先级大于last运算符，仅进栈
        if($scope.isPri(current,lastOpt)){
          $scope.opt.push(current);
        }
        else{
          operator=$scope.opt.pop();
          right=$scope.num.pop();
          left=$scope.num.pop();
          $scope.calculate(left,operator,right);
          $scope.operation(current);
        }
      };
      //判断当前运算符是否优先级高于last，如果是返回true
      //否则返回false
      $scope.isPri=function(current,last){
        if(current==last){
          return false;
        }
        else {
          if(current=="*"||current=="/"){
            if(last=="*"||last=="/"){
              return false;
            }
            else{
              return true;
            }
          }
          else{
            return false;
          }
        }
      };

      //负责计算结果函数
      $scope.calculate=function(left,operator,right) {
        switch (operator) {
          case "+":
            $scope.result = $scope.format(Number(left) + Number(right));
            $scope.num.push($scope.result);
            break;
          case "-":
            $scope.result = $scope.format(Number(left) - Number(right));
            $scope.num.push($scope.result);
            break;
          case "*":
            $scope.result = $scope.format(Number(left) * Number(right));
            $scope.num.push($scope.result);
            break;
          case "/":
            if(right==0){
              $scope.result="error";
              $scope.init();
            }
            else{
              $scope.result = $scope.format(Number(left) / Number(right));
              $scope.num.push($scope.result);
            }
            break;
          default:break;
        }
      };
      //格式化result输出
      $scope.format=function(num){
        var regNum=/.{15,}/ig;
        if(regNum.test(num)){
          if(/\./.test(num)){
            return num.toExponential(3);
          }
          else{
            return num.toExponential();
          }
        }
        else{
          return num;
        }
      }
      //判断当前符号是否是可运算符号
      $scope.checkOperator=function(opt){
        if(opt=="+"||opt=="-"||opt=="*"||opt=="/"){
          return true;
        }
        return false;
      }
    });
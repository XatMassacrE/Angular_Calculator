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
      //����ʱ�õ����ֵ�ջ
      $scope.num=[];
      $scope.history=[];
      //���������õ������ջ
      $scope.opt=[];
      //������������
      $scope.result="0";
      //��ʾ�Ƿ�Ҫ���¿�ʼ��ʾ,Ϊtrue��ʾ��������ʾ��false��ʾҪ��յ�ǰ���������ʾ����
      $scope.flag=true;
      //��ʾ��ǰ�Ƿ������������������������Ϊtrue������Ϊfalse
      $scope.isOpt=true;

      //��������������

      $scope.init=function(){
        $scope.num=[];
        $scope.opt=[];
        $scope.history=[];
        $scope.flag = true;
        $scope.isOpt=true;

      } ;
      //��ʾ��������ʽ

      $scope.showResult=function(a){
        $scope.history.push(a);
        var reg=/\d/ig,regDot=/\./ig;
        //1/x
        if(a=="1/x"){
          $scope.result=$scope.format(Number(1/$scope.result));
        }
        //���������Ǹ�����
        else if(reg.test(a)) {
          //��������
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
        //����������CE
        else if(a=="CE"){
          $scope.result=0;
          $scope.init();
          $scope.memory = "";
          $scope.memoryClass = function(){
            return "";
          }
        }
        //����������C
        else if(a=="C"){
          $scope.result=0;
          $scope.init();
        }
        //���������Ǹ�С����
        else if(a=="."){
          if($scope.result!=""&&!regDot.test($scope.result)){
            $scope.result+=a;
          }
        }
        //���������Ǹ�ȡ��������
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
        //���������Ǹ��ٷֺ�
        else if(a=="%"){
          $scope.result=$scope.format(Number($scope.result)/100);
        }
        //Del
        else if(a=="DEL"){
          $scope.result=$scope.result.replace(/.$/,'');
        }
        //���������Ǹ�������ҵ�ǰ��ʾ�����Ϊ�պ�error
        else if($scope.checkOperator(a)&&$scope.result!=""&&$scope.result!="error"&&$scope.isOpt){
          $scope.flag=false;
          $scope.num.push($scope.result);
          $scope.operation(a);
          //���һ�������֮����Ҫ���ٴε���������������Ե�
          $scope.isOpt=false;
        }
        //���������ǵ��ں�
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
      //�Ƚϵ�ǰ�����������������ջջ������������ȼ�
      //���ջ����������ȼ�С���򽫵�ǰ�������ջ�����Ҳ����㣬
      //����ջ���������ջ��������ջ������ջ����Ԫ�أ����м���
      //Ȼ�󽫵�ǰ�������ջ��
      $scope.operation=function(current){
        //��������ջΪ�գ�ֱ�ӽ���ǰ�������ջ
        if(!$scope.opt.length){
          $scope.opt.push(current);
          return;
        }
        var  operator,right,left;
        var  lastOpt=$scope.opt[$scope.opt.length-1];
        //�����ǰ��������ȼ�����last�����������ջ
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
      //�жϵ�ǰ������Ƿ����ȼ�����last������Ƿ���true
      //���򷵻�false
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

      //�������������
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
      //��ʽ��result���
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
      //�жϵ�ǰ�����Ƿ��ǿ��������
      $scope.checkOperator=function(opt){
        if(opt=="+"||opt=="-"||opt=="*"||opt=="/"){
          return true;
        }
        return false;
      }
    });
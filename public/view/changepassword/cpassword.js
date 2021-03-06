'use strict';
var userdetail;
angular.module('PGapp.changepassword', ['ngRoute','ngAnimate', 'ngCookies'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/change_password', {
    templateUrl: 'view/changepassword/changepassword.html',
    controller: 'ChangePasswordCtrl'
  });
}])

.controller('ChangePasswordCtrl', ["$scope","$cookies","$location",'API',function($scope,$cookies,$location,API) {
  $scope.ChangePassword = ChangePassword;
  if(!$cookies.get('userDetails')){
    $location.path('login');
  }
  userdetail = $cookies.getObject('userDetails');
  $scope.user = {
    id:userdetail._id,
    p_password:'',
    password:'',
    c_password:''
  };





  $scope.Logout = function () {
    $cookies.remove('userDetails')
    $location.path("/");
  }
  function ChangePassword(){
    $scope.user_id = API.ChangePassword($scope.user,function(res){
      if(res.Code == 200){
        $location.path("/users");
      }else {
        $scope.CreateUserForm.email.error = true;
      }
    },function (error) {
      alert(error);
    });
  }
}]);

PGapp.directive('passwordMatch', [function () {
  return {
    restrict: 'A',
    scope:true,
    require: 'ngModel',
    link: function (scope, elem , attrs,control) {
      var checker = function () {

        //get the value of the first password
        var e1 = scope.$eval(attrs.ngModel);

        //get the value of the other password
        var e2 = scope.$eval(attrs.passwordMatch);
        return e1 == e2;
      };
      scope.$watch(checker, function (n) {

        //set the form control to valid if both
        //passwords are the same, else invalid
        control.$setValidity("unique", n);
      });
    }
  };
}]);

PGapp.directive('equalPassword', [function () {
  return {
    require:'ngModel',
    restrict:'A',
    link:function (scope, el, attrs, ctrl) {

      //TODO: We need to check that the value is different to the original

      //using push() here to run it as the last parser, after we are sure that other validators were run
      ctrl.$parsers.push(function (viewValue) {
        /*if (viewValue == userdetail.user.password) {
          Users.query({email:viewValue}, function (users) {
            if (users.length === 0) {
              ctrl.$setValidity('equalPassword', true);
            } else {
              ctrl.$setValidity('equalPassword', false);
            }
          });
          return viewValue;
        }*/

        if (viewValue == userdetail.user.password) {
          Users.query({email:viewValue}, function (users) {
            if (users.length === 0) {
              ctrl.$setValidity('equalPassword', true);
            } else {
              ctrl.$setValidity('equalPassword', false);
            }
          });
          return viewValue;
        }
      });
    }
  };
}])
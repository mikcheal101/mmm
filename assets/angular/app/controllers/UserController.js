'use strict';
var UserController                      = app.controller('UserController', ['$scope','$window','SessionService','UserService','StorageService','$rootScope','$location','$interval','CustomerService',
    function($scope, $window, SessionService, UserService, StorageService, $rootScope, $location, $interval, CustomerService){

        $scope.admins                   = [];
        $scope.selected_admin           = {};
        $scope.error                    = "";
        $scope.timer                    = 0;
        $scope.session                  = $rootScope.session;
        $scope.today                    = new Date();

        $scope.setSelectedAdmin         = function(param){
            StorageService.set(param);
        };
        $scope.getSelectedAdmin         = function(){
            angular.copy(StorageService.get(), $scope.selected_admin);
        };
        $scope.clearSelectedAdmin       = function(){
            angular.copy(StorageService.clear(), $scope.selected_admin);
        };


        $scope.setTimer             = function(secsLeft){
            var then            = new Date(secsLeft).getTime(),
                now             = new Date().getTime(),
                diff_then_now   = then - now;

            if($scope.session.usertype === 'customer') {
                if(diff_then_now < 0) {
                    $scope.timer = 0;
                    CustomerService.suspendCustomer($scope.session).then(response => {
                        $location.path('/secure/profile/suspended');
                    }).catch(err => console.error('error: ', err));

                } else if(diff_then_now === 0){
                    $location.path('/secure/profile/dashboard');
                } else {
                    $scope.timer = diff_then_now;
                    $interval(function() {
                        $scope.timer        -= 1000;
                        now                 = new Date();
                        diff_then_now       = then - now;
                    }, 1000);
                }
            }
        };

        $scope.loadAdmins               = function(){
            UserService.getAdmins().then(function(response){
                $scope.clearSelectedAdmin();
                angular.copy(response, $scope.admins);
                console.log(response);
            }).catch(function(err){
                console.error(err);
            });
        };
        $scope.deleteAdmin              = function(admin){
            UserService.deleteAdmin(admin).then(function(response){
                var index               = $scope.admins.indexOf(admin);
                $scope.admins.splice(index, 1);
            }).catch(function(err){
                console.error(err);
            });
        };
        $scope.updateAdmin              = function(){
            UserService.updateAdmin($scope.selected_admin).then(function(response){
                $scope.clearSelectedAdmin();
                $scope.formUpdate.$setUntouched();
                $scope.formUpdate.$setPristine();
                $location.path('/admin/profile/admins');
            }).catch(function(err){
                console.error(err);
            });
        };
        $scope.createAdmin              = function(admin){
            UserService.createAdmin(admin).then(function(response){
                $scope.clearSelectedAdmin();
                $scope.formCreate.$setUntouched();
                $scope.formCreate.$setPristine();
                $scope.admins.unshift(response);
                $location.path('/admin/profile/admins');
            }).catch(function(err){
                console.error(err);
            });
        };

}]);

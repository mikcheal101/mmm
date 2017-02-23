'use strict';
var PackageController       = app.controller('PackageController', ['$scope','$location', '$window', 'PackageService', '$rootScope', '$routeParams', 'StorageService',
    function($scope, $location, $window, PackageService, $rootScope, $routeParams, StorageService){
    $scope.packages         = [];
    $scope.selected         = {};
    $scope.error            = "";
    $scope.session          = $rootScope.session;
    $scope.timer            = 0;

    $scope.loadPackages     = function(){
        PackageService.getPackages().then(function(response){
            $scope.clearSelected();
            angular.copy(response.data, $scope.packages);
        }, function(err){
            console.warn(err);
        });
    };

    $scope.setTimer             = function(){
        var secsLeft            = $scope.session.timing;
        var then                = new Date(secsLeft).getTime(),
            now                 = new Date().getTime(),
            diff_then_now       = then - now;

        if($scope.session.usertype === 'customer') {
            if(diff_then_now < 0 ) {
                $scope.timer = 0;
                CustomerService.suspendCustomer().then(response => {
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

    $scope.setSelected      = function(param){
        StorageService.set(param);
    };

    $scope.getSelected      = function(){
        angular.copy(StorageService.get(), $scope.selected);
    };

    $scope.clearSelected    = function(){
        angular.copy(StorageService.clear(), $scope.selected);
    };

    $scope.delete           = function(param){
        PackageService.deletePackage(param).then(function(response){
            // remove the item from the list
            var index       = $scope.packages.indexOf(param);
            $scope.packages.splice(index, 1);
        }).catch(function(err){
            console.warn(err);
        });
    }
    $scope.update           = function(){
        PackageService.updatePackage($scope.selected).then(function(response){
            $scope.clearSelected();
            $scope.formUpdate.$setPristine();
            $scope.formUpdate.$setUntouched();
            $location.path('/admin/profile/packages');
        }).catch(function(err){
            console.warn(err);
        });
    };
    $scope.save             = function(param){
        PackageService.savePackage(param).then(function(response){
            // add item to list
            $scope.formCreate.$setPristine();
            $scope.formCreate.$setUntouched();
            $scope.packages.unshift(response.data);
            $location.path('/admin/profile/packages');
        }).catch(function(err){
            console.warn(err);
        });
    };

}]);

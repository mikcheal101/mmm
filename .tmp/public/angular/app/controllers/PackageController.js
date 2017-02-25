'use strict';
var PackageController       = app.controller('PackageController', ['$scope','$location', '$window', 'PackageService', '$rootScope', '$routeParams', 'StorageService','$interval','CustomerService',
    function($scope, $location, $window, PackageService, $rootScope, $routeParams, StorageService, $interval, CustomerService){
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

    $scope.putPackage       = function(pack){
        angular.copy(pack, $scope.selected);
    };

    $scope.setTimer         = function(){
        var secsLeft            = $scope.session.timing;
        var then                = new Date(secsLeft).getTime(),
            now                 = new Date().getTime(),
            diff_then_now       = then - now;

        if($scope.session.usertype === 'customer') {
            if(diff_then_now < 0 ) {
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
    $scope.savePackage      = function(param){

        PackageService.savePackage(param).then(function(response){
            console.log('recieved: ', response);
            // add item to list
            $scope.formCreate.$setPristine();
            $scope.formCreate.$setUntouched();
            $scope.packages.unshift(response.data);
            $location.path('/admin/profile/packages');
        }).catch(function(err){
            console.warn(err);
        });
    };

    $scope.saveCustPackage  = function(){
        console.log('sending: ', $scope.selected);
        $scope.selected.user = $scope.session.id;
        PackageService.saveCustPackage($scope.selected).then(aData => {
            console.log(aData);
            // redirect to make-payment page
            $location.path('/secure/profile/make-payment');
        }).catch(aError => {
            console.warn(aError);
        });
    };
}]);

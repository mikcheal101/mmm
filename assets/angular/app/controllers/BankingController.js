'use strict';
var BankingController       = app.controller('BankingController', ['$scope','$location', '$routeParams','StorageService', 'BankingService',
    function($scope, $location, $routeParams, StorageService, BankingService){

    $scope.banks            = [];// list of the banks
    $scope.selected         = {};
    $scope.error            = "";

    $scope.setSelected      = function(item){
        StorageService.set(item);
    };
    $scope.getSelected      = function(){
        angular.copy(StorageService.get(), $scope.selected);
    };
    $scope.clearSelected    = function(){
        angular.copy(StorageService.clear(), $scope.selected);
    };
    $scope.loadBanks        = function(){
        BankingService.getBanks().then(function(response){
            $scope.clearSelected();
            angular.copy(response, $scope.banks);
        }).catch(function(err){
            console.error(err);
        });
    };
    $scope.delete           = function(bank){
        BankingService.deleteBank(bank).then(function(response){
            var index       = $scope.banks.indexOf(bank);
            $scope.banks.splice(index, 1);
        }).catch(function(err){
            console.error(err);
        });
    };
    $scope.update           = function(){
        BankingService.updateBank($scope.selected).then(function(response){
            $scope.formUpdate.$setPristine();
            $scope.formUpdate.$setUntouched();
            $scope.clearSelected();
            $location.path('/admin/profile/banks');
        }).catch(function(err){
            console.error(err);
        });
    };
    $scope.save             = function(bank){
        BankingService.saveBank(bank).then(function(response){
            $scope.formCreate.$setUntouched();
            $scope.formCreate.$setPristine();
            $scope.banks.unshift(response);
            $location.path('/admin/profile/banks');
        }).catch(function(err){
            console.error(err);
        });
    };

}]);

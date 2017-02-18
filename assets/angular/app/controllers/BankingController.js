'use strict';
var BankingController       = app.controller('BankingController', ['$scope','$location', '$routeParams', function($scope, $location, $routeParams){
    $scope.banks            = [];// list of the banks
    $scope.selected         = {};
    $scope.error            = "";

    $scope.loadBanks        = function(){};
    $scope.delete           = function(bank){};
    $scope.update           = function(){};
    $scope.save             = function(bank){};

}]);

'use strict';
var PackageController       = app.controller('PackageController', ['$scope','$location', '$window', function($scope, $location, $window){
    $scope.packages         = [];
    $scope.selected         = {};
    $scope.error            = "";

    $scope.loadPackages     = function(){};
    $scope.delete           = function(param){}
    $scope.update           = function(){};
    $scope.save             = function(param){};

}]);

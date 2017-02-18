'use strict';
var CustomerController      = app.controller('CustomerController', ['$scope','$location', '$routeParams', function($scope, $location, $routeParams){
    $scope.admin                = {};
    $scope.admin.customers      = [];
    $scope.admin.my_customers   = [];
    $scope.admin.selected       = {};
    $scope.admin.error          = "";

    $scope.admin.saveCustomer   = function(customer){};
    $scope.admin.deleteCustomer = function(customer){};
    $scope.admin.updateCustomer = function(){};

    $scope.admin.loadCustomers  = function(){};
    $scope.admin.loadMyCustomers= function(){};
}]);

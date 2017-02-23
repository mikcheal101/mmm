'use strict';
var CustomerController      = app.controller('CustomerController', ['$scope','StorageService','$rootScope','$location','$routeParams','CustomerService','BankingService',
    function($scope, StorageService, $rootScope, $location, $routeParams, CustomerService, BankingService){

    $scope.admin                = {};
    $scope.customer             = {};

    $scope.admin.customers      = [];
    $scope.admin.my_customers   = [];
    $scope.admin.selected       = {};
    $scope.admin.error          = "";
    $scope.banks                = [];
    $scope.account_types        = [];

    $scope.customer             = {};

    $scope.setSelected          = function(selected){
        StorageService.set(selected);
    };
    $scope.getSelected          = function(){
        angular.copy(StorageService.get(), $scope.admin.selected);
    };
    $scope.clearSelected        = function(){
        angular.copy(StorageService.clear(), $scope.admin.selected);
    };


    $scope.setBank              = function(customer){
        if(customer.account) {
            BankingService.getBank(customer.account.bank)
                .then(response  => {
                    customer.account.bank = response;
                    $scope.admin.selected = customer;
                }).catch(error => angular.copy({}, $scope.admin.selected));
        } else $scope.admin.selected = {};
    };
    $scope.clickCustomer        = function(clicked){
        $scope.admin.selected   = clicked;
    };
    $scope.admin.saveCustomer   = function(customer){
        CustomerService
            .saveCustomer(customer)
            .then(response => {
                $scope.admin.my_customers.unshift(response);
                $scope.formCreate.$setUntouched();
                $scope.formCreate.$setPristine();
                $location.path('/admin/profile/my/customers');
            }).catch(err => {
                $scope.admin.error = "Customer with this details already exist!";
            });
    };
    $scope.admin.deleteCustomer = function(customer){
        CustomerService
            .deleteCustomer(customer)
            .then(response => {
                var index = $scope.admin.my_customers.indexOf(customer);
                $scope.admin.my_customers.splice(index, 1);
            }).catch(err => {
                $scope.admin.error = "An Error Occured while trying to delete customer, contact admin!";
            });
    };
    $scope.admin.updateCustomer = function(customer){
        CustomerService
            .updateCustomer(customer)
            .then(response => {
                angular.copy(response, $scope.admin);
            }).catch(err => {

            });
    };

    $scope.admin.loadCustomers  = function(){
        CustomerService
            .loadCustomers()
            .then(response => {
                angular.copy(response, $scope.admin.customers);
            }).catch(err => {
                console.error('customers error: ', err);
            });
    };
    $scope.admin.loadMyCustomers= function(){
        CustomerService
            .loadMyCustomers()
            .then(response => {
                angular.copy(response, $scope.admin.my_customers);
            }).catch(err => {

            });
    };
    $scope.loadBanks            = function(){
        BankingService.getBanks()
        .then(response => angular.copy(response, $scope.banks))
        .catch(err => console.warn(err));
    };
    $scope.customerLoadBanks    = function(){
        console.log('in here');
        BankingService.customerGetBanks()
            .then(response => {
                console.log('response: ', response);
                angular.copy(response, $scope.banks);
            }).catch(aError => {
                console.error(aError);
            });
    };
    $scope.loadAccountTypes     = function(){
        BankingService.getAccountTypes()
        .then(response => angular.copy(response, $scope.account_types))
        .catch(err => console.warn(err));
    };
    $scope.suspendCustomer      = function(customer){
        CustomerService.suspendCustomer(customer)
        .then(response => { customer.userstatus = 'suspended'; })
        .catch(err => console.warn(err));
    };
    $scope.unsuspendCustomer    = function(customer){
        CustomerService.unsuspendCustomer(customer)
            .then(response => {
                customer.userstatus = "activated";
            })
            .catch(err => console.warn(err));
    };

}]);

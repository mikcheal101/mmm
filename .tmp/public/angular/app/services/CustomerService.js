'use strict';

var CustomerService                     = app.service('CustomerService', ['$q','$http',function($q, $http){
    var svc                             = this;
    svc.resetTiming                     = function(customer){
        var defer                       = $q.defer();
        var url                         = '/customers/reset/';
        $http
            .put(url + customer.id)
            .then(aData => defer.resolve(aData.data))
            .catch(aError => defer.reject(aError));
        return defer.promise;
    };
    svc.loadCustomers                   = function(){
        var defer                       = $q.defer();
        var url                         = "/customers";
        $http.get(url)
        .then(response => defer.resolve(response.data))
        .catch(err => defer.reject(err));
        return defer.promise;
    };
    svc.loadMyCustomers                 = function(){
        var defer                       = $q.defer();
        var url                         = "/customers/my";
        $http.get(url)
        .then(response => defer.resolve(response.data))
        .catch(err => defer.reject(err));
        return defer.promise;
    };

    svc.saveCustomer                    = function(customer){
        var defer                       = $q.defer();
        var url                         = "/customers/my";
        $http.post(url, customer)
        .then(response => defer.resolve(response.data))
        .catch(err => defer.reject(err));
        return defer.promise;
    };
    svc.updateCustomer                  = function(customer){
        var defer                       = $q.defer();
        var url                         = "/customers/my/";
        $http.put(url + customer.id, customer)
        .then(response => defer.resolve(response.data))
        .catch(err => defer.reject(err));
        return defer.promise;
    };
    svc.deleteCustomer                  = function(customer){
        var defer                       = $q.defer();
        var url                         = "/customers/my/";
        $http.delete(url + customer.id)
        .then(response => defer.resolve(response.data))
        .catch(err => defer.reject(err));
        return defer.promise;
    };
    svc.activateCustomer                = function(customer){
        var defer                       = $q.defer();
        var url                         = "/customers/";
        $http.put(url + customer.id, customer)
        .then(response => defer.resolve(response.data))
        .catch(err => defer.reject(err));
        return defer.promise;
    };
    svc.suspendCustomer                 = function(customer){
        var defer                       = $q.defer();
        $http.put('/customers/suspend/' + customer.id, customer).then(aData => {
            defer.resolve(aData);
        }).catch(aError => {
            defer.reject(aError);
        });
        return defer.promise;
    };
    svc.unsuspendCustomer               = function(customer){
        var defer                       = $q.defer();
        $http.put('/customers/unsuspend/' + customer.id, customer).then(aData => {
            defer.resolve(aData);
        }).catch(aError => {
            defer.reject(aError);
        });
        return defer.promise;
    };
    return svc;
}]);

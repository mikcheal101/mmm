'use strict';

var BankingService                  = app.service('BankingService', ['$q', '$http', function($q, $http){
    var svc                         = this;
    svc.getBanks                    = function(){
        var defer                   = $q.defer();
        $http.get('/banking/bank').then(function(response){
            defer.resolve(response.data);
        }).catch(function(err){
            defer.reject(err);
        });
        return defer.promise;
    };
    svc.customerGetBanks            = function(){
        var defer                   = $q.defer();
        $http.get('/profile/banking').then(response => {
            console.log('response: ', response);
            defer.resolve(response.data);
        }).catch(err => {
            console.error(err);
            defer.rejcet(err);
        });
        return defer.promise;
    };
    svc.saveBank                    = function(bank){
        var defer                   = $q.defer();
        $http.post('/banking/bank', bank).then(function(response){
            defer.resolve(response.data);
        }).catch(function(err){
            defer.reject(err);
        });
        return defer.promise;
    };
    svc.deleteBank                  = function(bank){
        var defer                   = $q.defer();
        $http.delete('/banking/bank/'+bank.id, bank).then(function(response){
            defer.resolve(response.data);
        }).catch(function(err){
            defer.reject(err);
        });
        return defer.promise;
    };
    svc.updateBank                  = function(bank){
        var defer                   = $q.defer();
        $http.put('/banking/bank/'+bank.id, bank).then(function(response){
            defer.resolve(response.data);
        }).catch(function(err){
            defer.reject(err);
        });
        return defer.promise;
    };
    svc.getBank                     = function(bank){
        var defer                   = $q.defer();
        var url                     = "/banking/bank/";
        $http.get(url + bank)
            .then(response => defer.resolve(response.data))
            .catch(err => defer.reject(err));
        return defer.promise;
    };
    svc.saveAccount                 = function(account){
        var defer                   = $q.defer();
        $http.post('/profile/banking', account)
            .then(response => defer.resolve(response.data))
            .catch(aError => defer.reject(aError));
        return defer.promise;
    };
    return svc;
}]);

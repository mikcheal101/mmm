'use strict';

var AuthService = app.service('AuthService', ['$http','$q', 'Upload', function($http, $q, Upload){
    var svc         = this;

    svc.Login       = function(data){
        var defer   = $q.defer();
        $http.post('/authentication/login', data).then(function(result){
            defer.resolve(result.data);
        }).catch(function(err){
            defer.reject(err);
        });
        return defer.promise;
    };

    svc.register    = function(data){
        var defer   = $q.defer();
        $http.post('/authentication/register', data).then(function(result){
            defer.resolve(result.data);
        }).catch(function(e){
            defer.reject(e);
        });
        return defer.promise;
    };

    return svc;
}]);

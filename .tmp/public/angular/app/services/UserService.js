'use strict';

var UserService                         = app.service('UserService', ['$q', '$http','Upload', function($q, $http, Upload){
    var svc                             = this;

    // admin part
    svc.createAdmin                     = function(admin){
        var defer                       = $q.defer();
        $http.post('/web-admin', admin).then(function(response){
            defer.resolve(response.data);
        }).catch(function(err){
            defer.reject(err);
        });
        return defer.promise;
    };
    svc.getAdmins                       = function(){
        var defer                       = $q.defer();
        $http.get('/web-admin').then(function(response){
            defer.resolve(response.data);
        }).catch(function(err){
            defer.reject(err);
        });
        return defer.promise;
    };
    svc.deleteAdmin                     = function(admin){
        var defer                       = $q.defer();
        $http.delete('/web-admin/'+admin.id).then(function(response){
            defer.resolve(response.data);
        }).catch(function(err){
            defer.reject(err);
        });
        return defer.promise;
    };
    svc.updateAdmin                     = function(admin){
        var defer                       = $q.defer();
        $http.put('/web-admin/'+admin.id, admin).then(function(response){
            defer.resolve(response.data);
        }).catch(function(err){
            defer.reject(err);
        });
        return defer.promise;
    };
    return svc;
}]);

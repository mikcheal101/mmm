'use strict';

var PackageService          = app.service('PackageService', ['$q', '$http', function($q, $http){
    var svc                 = this;

    svc.getPackages         = function(){
        var defer           = $q.defer();
        $http.get("/package").then(function(response){
            defer.resolve(response);
        }, function(err){
            defer.reject(err);
        });
        return defer.promise;
    };

    svc.getPackage          = function(id){
        var defer           = $q.defer();
        $http.get('/package/'+id).then(function(){
            defer.resolve(response.data);
        }).catch(function(err){
            defer.reject(err);
        });
        return defer.promise;
    };

    svc.savePackage         = function(param){
        var url             = "/package";
        var defer           = $q.defer();
        $http.post(url, param).then(function(response){
            defer.resolve(response);
        }).catch(function(err){
            defer.reject(err);
        });
        return defer.promise;
    };

    svc.updatePackage       = function(param){
        var url             = "/package/"+param.id;
        var defer           = $q.defer();
        $http.put(url, param).then(function(response){
            defer.resolve(response);
        }).catch(function(err){
            defer.reject(err);
        });
        return defer.promise;
    };

    svc.deletePackage       = function(param){
        var url             = "/package/"+param.id;
        var defer           = $q.defer();
        $http.delete(url).then(function(response){
            defer.resolve(response);
        }).catch(function(err){
            defer.reject(err);
        });
        return defer.promise;
    };

    return this;
}]);

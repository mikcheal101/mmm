'use strict';

var SessionService = app.service('SessionService', ['$http', '$q', 'Upload', function($http, $q, Upload){
    var svc         = this;
    svc.data        = {};
    svc.getSession  = function(){
        var defer = $q.defer();
        $http.get('/authentication/session').then(function(d){
            var data = d.data;
            if(data.user){
                if(data.user.hasOwnProperty('id')) {
                    defer.resolve(data);
                } else {
                    defer.reject(data);
                }
            } else{
                defer.reject(data);
            }
        }).catch(function(e){
            defer.reject(e);
        });
        return defer.promise;
    };
    svc.logout      = function(){
        var defer   = $q.defer();
        $http.get('/authentication/signout')
            .then(response => {
                console.log('response: ', response);
                defer.resolve(response.data);
            })
            .catch(err => {
                console.error(err);
                defer.reject(err);
            });
        return defer.promise;
    };
    return svc;
}]);

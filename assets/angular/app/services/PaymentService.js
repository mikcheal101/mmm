'use strict';

var PaymentService              = app.service('PaymentService', ['$q', '$http','Upload', function($q, $http, Upload){
    var svc                     = this;
    svc.loadMatch               = function(){
        var defer               = $q.defer();
        var url                 = '/profile/match';
        $http.get(url).then(aData => {
            defer.resolve(aData.data);
        }).catch(aError => {
            defer.reject(aError);
        });
        return defer.promise;
    };

    svc.matchMe                         = function(me, person){
        var defer                       = $q.defer();
        var url                         = '/profile/match';

        $http.post(url, {me:me, person:person})
            .then(aData => defer.resolve(aData.data))
            .catch(aError => { defer.reject(aError)});
        return defer.promise;
    };
    svc.loadToPay                       = function(param){
        var defer                       = $q.defer();
        var url                         = '/profile/gettopay';
        $http.post(url, param)
            .then(aData => defer.resolve(aData.data))
            .catch(aError => { defer.reject(aError)});
        return defer.promise;
    };
    svc.makePayment                     = function(person, file){
        var defer                       = $q.defer();
        var url                         = '/profile/commit';
        Upload.upload({
            url:url,
            data:{
                file:file,
                person:person
            }
        }).then(aData => {
            defer.resolve(aData.data);
        }).catch(aError => {
            defer.reject(aError);
        });
        return defer.promise;
    };

    return svc;
}]);

'use strict';

var Storage         = app.factory('StorageService', [function(){
    var svc         = this;
    svc.params      = {};
    svc.get         = function(){
        return svc.params;
    };
    svc.set         = function(data){
        svc.params  = data;
    };
    svc.clear       = function(){
        svc.params  = {};
        return svc.params;
    };
    return svc;
}]);

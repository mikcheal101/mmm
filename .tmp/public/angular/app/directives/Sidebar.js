'use strict';
var Sidebar             = app.directive('sidebar', function(){
    var directive       = {};

    // element directive E
    directive.restrict  = 'E';

    // directive template
    directive.template  = `<div class=''>sample directive</div>`;

    // directive scope
    directive.scope     = {
        user:   "=user"
    };

    // compile during app init
    directive.compile   = function(element, attributes){
        var linkFunction = function($scope, element, attributes ){
            //
        };
        return linkFunction;
    };

    return directive;
});

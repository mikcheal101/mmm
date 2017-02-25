'use strict';

var AdminHeader         = app.directive('adminHeader', [function(){
    var dir             = {};
    dir.restrict        = 'EA';
    dir.replace         = true;
    dir.scope           = {user: '='};
    dir.templateUrl     = '/templates/admin/header.admin.html';
    
    return dir;
}]);

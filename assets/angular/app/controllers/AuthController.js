
var AuthController  = app.controller('AuthController', ['$scope', '$window', 'AuthService', function($scope, $window, AuthService){
    $scope.login            = {};
    $scope.registration     = {};
    $scope.forgotPassword   = {};

    // login section;
    $scope.login.error          = "";
    $scope.login.news           = "";
    $scope.login.click          = function(data){
        AuthService.Login(data).then(function(result){

            if(result.data){
                /// TODO: display user session if user exists redirect to dashboard page
                /// TODO: redirect user to dashboard
                $window.location.href   = '/secure/profile/dashboard';
            } else {
                $scope.login.error      = result.message;
                $scope.login.news       = "";
            }

        }).catch(function(e){
            console.log('error: ', e);
            return e;
        });
    };

    $scope.registration.error   = "";
    $scope.registration.news    = "";
    $scope.registration.click   = function(data, form){
        AuthService.register(data).then(function(result){
            if(result.data === false){
                $scope.registration.error   = result.message;
                $scope.registration.news    = "";
            } else {
                $scope.registration.error   = "";
                $scope.registration.news    = result.message;
                // TODO: clear form
                $scope.form.$setPristine();
                form.$setPristine();
                $scope.data    = {};
                // TODO: Display success alert
                console.log('swapping paths');
                $window.location.href   = '/secure/profile/dashboard';
            }
        }).catch(function(e){
            //$scope.registration.error     = e;
            //console.log(e);
        });
    };
}]);

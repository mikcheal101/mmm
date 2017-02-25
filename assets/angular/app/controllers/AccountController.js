'use strict';
var AccountController           = app.controller('AccountController', ['$scope','$window', '$location','BankingService','$rootScope','$interval','moment',
    function($scope, $window, $location, BankingService, $rootScope,$interval,moment){

    $scope.banks                = [];
    $scope.session              = $rootScope.session;
    $scope.timer                = 0;

    $scope.customerLoadBanks    = function(){
        BankingService.customerGetBanks()
            .then(response => angular.copy(response, $scope.banks))
            .catch(aError => console.error(aError));
    };

    $scope.save                 = function(account){
        angular.copy($scope.session.id, account.user);
        account.user            = $scope.session.id;
        BankingService.saveAccount(account).then(response => {
            var newUser = response[0];
            angular.copy(newUser, $rootScope.session);
            angular.copy(newUser, $scope.session);
            $location.path('/secure/profile/packages');
        }).catch(aError => {
            console.warn(aError);
        });
    };

    $scope.setTimer             = function(){
        var secsLeft            = $scope.session.timing;
        var then                = new Date(secsLeft).getTime(),
            now                 = new Date().getTime(),
            diff_then_now       = then - now;

        if($scope.session.usertype === 'customer') {
            if(diff_then_now < 0) {
                $scope.timer = 0;
                CustomerService.suspendCustomer($scope.session).then(response => {
                    $location.path('/secure/profile/suspended');
                }).catch(err => console.error('error: ', err));

            } else if(diff_then_now === 0){
                $location.path('/secure/profile/dashboard');
            } else {
                $scope.timer = diff_then_now;
                $interval(function() {
                    $scope.timer        -= 1000;
                    now                 = new Date();
                    diff_then_now       = then - now;
                }, 1000);
            }
        }
    };

}]);

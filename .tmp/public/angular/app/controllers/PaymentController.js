'use strict';
var PaymentController       = app.controller('PaymentController', ['$scope','$location','$window','$rootScope','PaymentService','CustomerService','$interval',
    function($scope, $location, $window, $rootScope,PaymentService,CustomerService,$interval){

    /// listen for socket actions
    if(!io.socket.alreadyListeningForPayments){
        io.socket.alreadyListeningForPayments = true;
        io.socket.on('match-to-created', (event) => {
            console.log('match-to-created', event);
        });
    }

    $scope.match            = {};
    $scope.file             = null;
    $scope.session          = $rootScope.session;
    $scope.timer            = 0;
    $scope.error            = "";
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

    $scope.loadMatch        = function(){
        PaymentService.loadMatch().then(aData => {
            $scope.match    = aData;
            $scope.timing   = aData.timing;
            if($scope.session.matchedToPay !== null) {
                $scope.loadToPay();
            }
        }).catch(aError => {
            $scope.loadToPay();
            console.warn(aError);
        });
    };
    $scope.loadToPay        = function(){
        PaymentService.loadToPay($scope.session).then(aData => {
            $scope.match    = aData;
            $scope.timing   = aData.timing;
            console.log('my match to pay: ', aData);
        }).catch(aError => {
            console.warn(aError);
        });

    };
    $scope.upload = function (file) {
        console.log('uploading: ', file);
        console.log('match: ', $scope.match);
        PaymentService.makePayment($scope.match, file).then(aData => {
            $scope.session      = aData;
            $rootScope.session  = aData;
            $location.path('/secure/profile/dashboard');
        }).catch(aError => {
            $scope.error = "An Error Occured while Uploading Document!"
            console.error(aError);
        });
    };
    $scope.matchMe          = function(){
        PaymentService.matchMe($scope.session, $scope.match).then(aData => {
            $scope.session.timing       = aData.me.timing;
            $scope.session.matchedToPay = aData.me.matchedToPay;
            $rootScope.session          = $scope.session;

            console.log(aData);
        }).catch(aError => {
            console.error(aError);
        });
    };
}]);

'use strict';

var app = angular.module('app', ['ngRoute', 'ngRoute.middleware', 'ngFileUpload', 'angularUtils.directives.dirPagination', 'dyFlipClock', 'angularMoment']);

app.config(['$middlewareProvider', function($middlewareProvider){
    $middlewareProvider.map({

        //// nobody is allowed here
        'nobody':function nobodyMiddleware(){

        },

        //// everyone is allowed here
        'everyone':function everyoneMiddleware(){
            console.log('everyone called!');
            this.next();
        },

        //// customer allowed urls
        'customer-auth':['$http', function customerAuth($http){
            var request     = this;
            $http.get('/authentication/session').then(function(d){
                var user    = d.data.user;
                if(typeof user === 'undefined'){
                    request.redirectTo('/public/authentication/login');
                } else {
                    request.next();
                }
            }).catch(function(e){
                request.redirectTo('/');
            });
        }],
        //// admin allowed urls
        'admin-auth':['$http', function adminAuth($http){
            var request     = this;
            $http.get('/authentication/session').then(function(d){
                var user    = d.data.user;
                if(typeof user === 'undefined'){
                    request.redirectTo('/public/authentication/login');
                } else {
                    request.next();
                }
            }).catch(function(e){
                request.redirectTo('/');
            });
        }],
        //// super admin allowed urls
        'super-auth':['$http', function superAuth($http){
            var request     = this;

            $http.get('/authentication/session').then(function(d){
                var user    = d.data.user;
                if(typeof user === 'undefined'){
                    request.redirectTo('/public/authentication/login');
                } else {
                    // check if the user is a super admin
                    request.next();
                }
                //request.next();
            }).catch(function(e){
                request.redirectTo('/');
            });
        }]

    });
}]);

app.config(['$routeProvider','$locationProvider',  function($routeProvider, $locationProvider){
    $routeProvider
        .when('/', {
            templateUrl:'/templates/home.html',
            middleware:'everyone'
        })
        .when('/public/', {
            templateUrl:'/templates/home.html',
            middleware:'everyone'
        })
        .when('/public/about-us', {
            templateUrl:'/templates/about-us.html',
            middleware:'everyone'
        })
        .when('/public/contact-us', {
            templateUrl:'/templates/contact-us.html',
            middleware:'everyone'
        })
        .when('/public/how-it-works', {
            templateUrl:'/templates/how-it-works.html',
            middleware:'everyone'
        })
        .when('/public/authentication/login', {
            templateUrl:'/templates/login.html',
            controller:'AuthController',
            middleware:'everyone'
        })
        .when('/public/authentication/sign-up', {
            templateUrl:'/templates/registration.html',
            controller:'AuthController',
            middleware:'everyone'
        })
        .when('/public/authentication/forgot-password', {
            templateUrl:'/templates/forgot-password.html',
            controller:'AuthController',
            middleware:'everyone'
        })


        .when('/secure/profile/dashboard', {
            templateUrl:'/templates/dashboard.html',
            controller:'UserController',
            middleware:'customer-auth'
        })
        .when('/secure/profile/account', {
            templateUrl:'/templates/account.html',
            controller:'AccountController',
            middleware:'customer-auth'
        })
        .when('/secure/profile/payments', {
            templateUrl:'/templates/payments.html',
            controller:'PaymentController',
            middleware:'customer-auth'
        })
        .when('/secure/profile/packages', {
            templateUrl:'/templates/packages.html',
            controller:'PackageController',
            middleware:'customer-auth'
        })
        .when('/secure/profile/make-payment', {
            templateUrl:'/templates/make-payment.html',
            controller:'PaymentController',
            middleware:'customer-auth'
        })
        .when('/secure/profile/suspended', {
            templateUrl:'/templates/suspended.html',
            controller:'UserController',
            middleware:'everyone'
        })


        .when('/admin/profile/customers', {
            templateUrl:'/templates/admin/customers.html',
            controller:'CustomerController',
            middleware:['admin-auth', 'super-auth']
        })
        .when('/admin/profile/my/customers', {
            templateUrl:'/templates/admin/my-customers.html',
            controller:'CustomerController',
            middleware:['admin-auth', 'super-auth']
        })
        .when('/admin/profile/customer/:id', {
            templateUrl:'/templates/admin/my-customer.html',
            controller:'CustomerController',
            middleware:['admin-auth', 'super-auth']
        })
        .when('/admin/profile/my/customer', {
            templateUrl:'/templates/admin/my-customer.html',
            controller:'CustomerController',
            middleware:['admin-auth', 'super-auth']
        })
        .when('/admin/profile/banks', {
            templateUrl:'/templates/admin/banks.html',
            controller:'BankingController',
            middleware:['admin-auth', 'super-auth']
        })
        .when('/admin/profile/bank/:id', {
            templateUrl:'/templates/admin/bank.html',
            controller:'BankingController',
            middleware:['admin-auth', 'super-auth']
        })
        .when('/admin/profile/bank', {
            templateUrl:'/templates/admin/bank.html',
            controller:'BankingController',
            middleware:['admin-auth', 'super-auth']
        })
        .when('/admin/profile/packages', {
            templateUrl:'/templates/admin/packages.html',
            controller:'PackageController',
            middleware:['admin-auth', 'super-auth']
        })
        .when('/admin/profile/package/:id', {
            templateUrl:'/templates/admin/package.html',
            controller:'PackageController',
            middleware:['admin-auth', 'super-auth']
        })
        .when('/admin/profile/package', {
            templateUrl:'/templates/admin/package.html',
            controller:'PackageController',
            middleware:['admin-auth', 'super-auth']
        })
        .when('/admin/profile/payments', {
            templateUrl:'/templates/admin/payments.html',
            controller:'PaymentController',
            middleware:['admin-auth', 'super-auth']
        })
        .when('/admin/profile/my/payments', {
            templateUrl:'/templates/admin/my-payments.html',
            controller:'PaymentController',
            middleware:['admin-auth', 'super-auth']
        })
        .when('/admin/profile/admins', {
            templateUrl:'/templates/admin/admins.html',
            controller:'UserController',
            middleware:['super-auth']
        })
        .when('/admin/profile/admin/:id', {
            templateUrl:'/templates/admin/admin-page.html',
            controller:'UserController',
            middleware:['super-auth']
        })
        .when('/admin/profile/admin', {
            templateUrl:'/templates/admin/admin-page.html',
            controller:'UserController',
            middleware:['super-auth']
        })



        .otherwise({
            redirectTo:'/public/',
            caseInsensitiveMatch:true
        });

        $locationProvider.html5Mode(true);
}]);

app.run(['$rootScope', '$window', '$location', 'SessionService','CustomerService', function($rootScope, $window, $location, SessionService, CustomerService){
    // headers
    $rootScope.headers          = {};
    $rootScope.headers.admin    = "/templates/admin/header.admin.html";

    $rootScope.$on('$routeChangeStart', function(evt, next, current){
        var appTo       = $location.path().indexOf('/secure') !== -1;

        if ($location.path().indexOf('/secure/profile/suspended') !== -1 ) {
            console.log('/secure/profile/suspended -> called');
        } else {
            SessionService.getSession().then(function(d){
                var user            = d.user;
                $rootScope.session  = user;

                if(appTo && user.usertype === 'customer'){
                    //if the user still has time
                    if(user.timeLeft >= 0){

                        // check if the user has filled in accounting details
                        if(user.account) {

                            // check if user has selected package
                            if(user.hasOwnProperty('userpackage')){

                                // check for person user has been matched to
                                if(user.hasOwnProperty('matched')){

                                    // confirm if user has paid
                                    if(user.hasOwnProperty('id')){

                                    }
                                } else {
                                    // direct user to matching page
                                }
                            } else {
                                // redirect to package selection page
                                $location.path('/secure/profile/packages');
                            }
                        } else {
                            //$window.location.href   = '/secure/profile/account';
                            $location.path('/secure/profile/account');
                            // head to account page
                        }

                    } else {
                        // redirect to account suspended page
                        console.log('redirecting to suspended');
                        CustomerService.suspendCustomer(user).then(response => {
                            console.log('location change ', response);
                            $location.path('/secure/profile/suspended');
                        }).catch(err => console.error('error: ', err));
                    }
                } else if(user.usertype === 'customer') {
                    console.warn('redirecting to login page');
                    //$location.path('/public/authentication/login');
                }
            }).catch(function(e){
                //console.error('error: ', e);
            });
        }



        // check if the logged in user is a customer and direct to the appropriate page
    });
}]);

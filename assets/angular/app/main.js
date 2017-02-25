'use strict';

var app = angular.module('app', ['ngRoute', 'ngRoute.middleware', 'ngFileUpload', 'angularUtils.directives.dirPagination', 'dyFlipClock', 'angularMoment']);

app.config(['$middlewareProvider', function($middlewareProvider){
    $middlewareProvider.map({

        //// nobody is allowed here
        'nobody':function nobodyMiddleware(){

        },

        //// everyone is allowed here
        'everyone':function everyoneMiddleware(){
            this.next();
        },

        //// handle customer redirection
        'customer-redirect':['$http','$location', function customerRedirect($http, $location){
            var request     = this;
            $http.get('/authentication/session').then(response => {
                console.log('redirecting user');
                var session = response.data.user;
                if(typeof session === 'undefined') {
                    request.redirectTo('/public/authentication/login');
                } else if(session.usertype === 'customer') {
                    // main redirection happens here
                    if(session.userstatus === "suspended"){
                        // head to the suspended page
                        if($location.path() !== '/secure/profile/suspended')
                            request.redirectTo('/secure/profile/suspended');
                        else request.next();
                    } else if(!session.account) {
                        // head to accounting page
                        if($location.path() !== '/secure/profile/account')
                            request.redirectTo('/secure/profile/account');
                        else request.next();
                    } else if(!session.userpackage) {
                        //head to package selection page
                        if($location.path() !== '/secure/profile/packages')
                            request.redirectTo('/secure/profile/packages');
                        else request.next();
                    } else if(['awaiting-confirmation', 'pending-confirmation', 'awaiting-first', 'awaiting-second'].indexOf(session.payment_status) <= -1) {
                        console.log(session);
                        if(['/secure/profile/make-payment', '/secure/profile/account', '/secure/profile/packages'].indexOf($location.path()) <= -1){
                            request.redirectTo('/secure/profile/dashboard');
                        } else {
                            request.next();
                        }

                    } else if(!session.unmatched){
                        // head to the matching page
                        if($location.path() !== '/secure/profile/make-payment')
                            request.redirectTo('/secure/profile/make-payment');
                        else request.next();
                    } else request.next();
                } else request.next();
            }).catch(aError => {
                console.log('heading back to home page');
            });
        }],

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
            middleware:['customer-auth', 'customer-redirect']
        })
        .when('/secure/profile/account', {
            templateUrl:'/templates/account.html',
            controller:'AccountController',
            middleware:['customer-auth', 'customer-redirect']
        })
        .when('/secure/profile/payments', {
            templateUrl:'/templates/payments.html',
            controller:'PaymentController',
            middleware:['customer-auth', 'customer-redirect']
        })
        .when('/secure/profile/packages', {
            templateUrl:'/templates/packages.html',
            controller:'PackageController',
            middleware:['customer-auth', 'customer-redirect']
        })
        .when('/secure/profile/make-payment', {
            templateUrl:'/templates/make-payment.html',
            controller:'PaymentController',
            middleware:['customer-auth', 'customer-redirect']
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
        SessionService.getSession().then(function(d){
            var user            = d.user;
            $rootScope.session  = user;
        }).catch(aError => {});
    });
}]);

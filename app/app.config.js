angular
    .module('app')
    .config(['$locationProvider', '$routeProvider',
        function config($locationProvider, $routeProvider) {
            $locationProvider.hashPrefix('!');

            $routeProvider
                .when('/', {
                    template: '<home></home>'
                })
                .when('/home', {
                    template: '<home></home>'
                })
                .when('/demo', {
                    template: '<demo></demo>'
                })
                .when('/404', {
                    template: 'PAGE NOT FOUND'
                })
                .otherwise('/404');
        }
    ]);
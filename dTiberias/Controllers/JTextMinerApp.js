// JTextMinerApp.js

//https://github.com/cornflourblue/angu-fixed-header-table
//https://www.pointblankdevelopment.com.au/blog/angularjs-fixed-header-scrollable-table-directive


var jTextMinerApp = angular.module('JTextMinerApp', ['ui.router', 'ngResource', 'anguFixedHeaderTable', 'ui.bootstrap', 'ngDialog', 'ui.bootstrap.tabs', 'ui.indeterminate']);//, 'angularCharts']);
// Example of how to set default values for all dialogs
jTextMinerApp.config(['ngDialogProvider', function (ngDialogProvider) {
    ngDialogProvider.setDefaults({
        className: 'ngdialog-theme-default',
        plain: false,
        showClose: false,
        closeByDocument: true,
        closeByEscape: false,
        appendTo: false,
        preCloseCallback: function () {
            console.log('default pre-close callback');
        }
    });
}]);

jTextMinerApp.config(function ($stateProvider, $urlRouterProvider) {

    $urlRouterProvider.otherwise('/Login');

    $stateProvider
    .state('Login', {
        url: '/Login',
        controller: 'LoginController',
        templateUrl: 'partials/Pages/partial-Login.html'
    })
    .state('AfterLogin', {
        url: '/AfterLogin',
        controller: 'AfterLoginController',
        templateUrl: 'partials/Pages/partial-AfterLogin.html'
    })
    .state('Unmasking', {
        url: '/Unmasking',
        controller: 'UnmaskingController',
        templateUrl: 'partials/Pages/partial-Unmasking.html'
    })
    .state('Tabs', {
        url: '/Tabs',
        controller: 'TabsController',
        templateUrl: 'partials/Pages/partial-Tabs.html'
    })
    
});

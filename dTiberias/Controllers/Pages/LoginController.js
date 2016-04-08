
jTextMinerApp.controller('LoginController', function ($scope, ngDialog) {
    $scope.LoginDlg = function () {
        ngDialog.openConfirm({
            template: 'partials/Dialogs/partial-Login.html',
            controller: 'DlgLoginController',
            className: 'ngdialog-theme-default',
            scope: $scope
        }).then(function (value) {
            console.log('Modal promise resolved. Value: ', value);
        }, function (reason) {
            console.log('Modal promise rejected. Reason: ', reason);
        });
    }
    
});


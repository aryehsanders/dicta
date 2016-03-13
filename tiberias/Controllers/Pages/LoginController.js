
jTextMinerApp.controller('LoginController', function ($scope, ExperimentService, $location, APIService, focus, AlertsService, InProgressService) {

    AlertsService.determineAlert({ msg: 'Please make sure you are authorized or use "user" as a user name for demo' });

    $scope.showInProcess = InProgressService.isReady != 1;
    $scope.$on('isReady_Updated', function () {
        $scope.showInProcess = InProgressService.isReady != 1;
    });

    $scope.userLogin = '';
    $scope.Login = function () {

        if ($scope.userLogin.length == 0)
        {
            AlertsService.determineAlert({ msg: 'Please insert your user name', type: 'danger' });
            focus('focusMe');
        }
        else {
            ExperimentService.user = $scope.userLogin;

            $scope.data = {};
            $scope.data.userLogin = $scope.userLogin;
            APIService.apiRun({ crud: 'CheckUserLogin' }, $scope.data, function (response) {
                if (response.userLogin.length != 0) {

                    AlertsService.determineAlert({ msg: 'Login success! Hi ' + $scope.userLogin + ', please choose one of the experiments below and click on "Next"', type: 'success' });
                    $location.path('Experiment');
                }
                else {
                    AlertsService.determineAlert({ msg: 'You are not allowed to login!', type: 'danger' });
                    //$scope.data2 = response;
                }

            });

        }
    };

    focus('focusMe');
});



jTextMinerApp.controller('FirstTabController', function ($scope, $location) {
   
    if (ExperimentService.user == 'user')
        $location.path('Login');


    $scope.GoToSecondTab = function () {
        $location.path('SecondTab');
    }

    $scope.GoToThirdTab = function () {
        $location.path('ThirdTab');
    }
});



jTextMinerApp.controller('FirstTabController', function ($scope, $location) {
   
    $scope.GoToSecondTab = function () {
        $location.path('SecondTab');
    }
});


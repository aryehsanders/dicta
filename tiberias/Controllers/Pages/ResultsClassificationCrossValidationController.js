jTextMinerApp.controller('ResultsClassificationCrossValidationController', function ($scope, ExperimentService, APIService, $sce, $location, AlertsService, ClassificationService, ClassService) {

    AlertsService.determineAlert({ msg: 'Here are the results, you may start new experiment by clicking on "New experiment" button', type: 'success' });

    if (ExperimentService.isNewExperiment)
        $location.path('Experiment');

    $scope.NewExperiment = function () {
        ExperimentService.NewExperiment();
    }
    $scope.GoToClassification = function () {
        ExperimentService.updateResultData([]);
        $location.path('Classification');
    }
    
    $scope.showSummary = true;
    $scope.NewExperimentName = '';
    $scope.ExperimentTypeModel = ExperimentService.ExperimentTypeModel;
    $scope.selectedAlgorithmTypeName = ExperimentService.selectedAlgorithmTypeName;
    $scope.Classification_ExperimentType = ClassificationService.Classification_ExperimentType;
    $scope.Classification_TestSetExperimentType = ClassificationService.Classification_TestSetExperimentType;
    $scope.totalNumberOfFeatures = ExperimentService.totalNumberOfFeatures;
    $scope.Corpus_classes = ClassService.Corpus_classes;
    //$scope.KnownTestSet = ExperimentService.KnownTestSet;

  
    $scope.Feature_sets = ExperimentService.Feature_sets;
    $scope.featuresData = ExperimentService.featuresData;
    
   
    $scope.cv_predicate = 'className';
    $scope.cv_predicate = '-maxTTest';
    
    $scope.resultData = ExperimentService.resultData;
    $scope.$on('valuesUpdated', function () {
        $scope.resultData = ExperimentService.resultData;
        //$scope.htmlSegmentation = $sce.trustAsHtml($scope.resultData.htmlSegmentation);

    });
    
    $scope.ExperimentMode = ExperimentService.ExperimentMode;
    $scope.SaveExperiment = function () {
        if ($scope.ExperimentMode == 'NewExperiment' && $scope.NewExperimentName.length == 0)
            AlertsService.determineAlert({ msg: 'Please give a name for new experiment.', type: 'danger' });
        else if ($scope.ExperimentMode == 'NewExperiment' && $scope.NewExperimentName.length != 0) {
            ExperimentService.updateNewExperimentName($scope.NewExperimentName);
            ExperimentService.SaveExperiment();
        }
    };



});

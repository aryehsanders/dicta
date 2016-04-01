jTextMinerApp.controller('ResultsClassificationTestSetController', function ($scope, ExperimentService, APIService, $sce, $location, AlertsService, ClassificationService, InProgressService, ClassService) {

    $scope.tab = '1';

    AlertsService.determineAlert({ msg: 'Here are the results, you may start new experiment by clicking on "New experiment" button', type: 'success' });

    if (ExperimentService.isNewExperiment)
        $location.path('Experiment');
    
    $scope.NewExperiment = function () {
        ExperimentService.NewExperiment();
    }
    
    $scope.GoToClassification = function () {
        ExperimentService.updateResultData([]);
        $location.path('TestSet');
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

    $scope.textAlign = 'left';
    if (ClassService.isAllBible)
        $scope.textAlign = 'right';


    $scope.Feature_sets = ExperimentService.Feature_sets;
    $scope.featuresData = ExperimentService.featuresData;

    $scope.updateCurrentFeatureListToEmpty = function () {

        $scope.currentFeatureList = [];
    }
    $scope.updateCurrentFeatureList = function () {
        
        $scope.currentFeatureList = $scope.tempFeatureList;
/*
        $scope.data = {};
        $scope.data.userLogin = ExperimentService.user;
        $scope.data.index = $scope.currentIndex;
        APIService.apiRun({ crud: 'TestFileData' }, $scope.data, function (response) {
            var results = response;
            $scope.currentTestFileText = $sce.trustAsHtml(results.htmlText);
            $scope.legend = $sce.trustAsHtml(results.legend);
            $scope.currentFeatureList = results.features;
        });
 */       
    }


    $scope.numberOfAppearancesInDoc = function (item) {
        return (item.numberOfAppearancesInDoc > 0);
    };
   
    $scope.test_predicate = 'orderByClass';
    
    $scope.showInProcess = InProgressService.isReady != 1;
    $scope.$on('isReady_Updated', function () {
        $scope.showInProcess = InProgressService.isReady != 1;
    });

    $scope.resultData = ExperimentService.resultData;
    $scope.$on('valuesUpdated', function () {
        $scope.resultData = ExperimentService.resultData;
    });
    
    // select test file
    $scope.selectedTestFileIndex = -1;
    $scope.$watch('selectedTestFileIndex', function () {
        if (!angular.isUndefined($scope.selectedTestFileIndex)) {
            ExperimentService.updateSelectedTestFileIndex($scope.selectedTestFileIndex);
        }
    });

    $scope.selectedTestFile = null;
    $scope.selectedTestFileValue = '';

    $scope.isSelected = function (item) {
        if ($scope.selectedTestFile) {
            return $scope.selectedTestFile === item;
        }
        else {
            return false;
        }
    };

    $scope.currentTestFileText = $sce.trustAsHtml("<b><p style='color:red;'>Select a test file from left side in order to see the text</p></b>");
    
    $scope.setSelectedTestFile = function (item, index) {

        $scope.inited = false;

        $scope.selectedTestFileIndex = index;

        $scope.selectedTestFile = item;
        $scope.selectedTestFileValue = item.name;

        InProgressService.updateIsReady(0);

        $scope.data = {};
        $scope.data.userLogin = ExperimentService.user;
        $scope.data.index = item.index;
        $scope.currentIndex = item.index;
        APIService.apiRun({ crud: 'TestFileData' }, $scope.data, function (response) {
            InProgressService.updateIsReady(1);
            var results = response;
            $scope.currentTestFileText = $sce.trustAsHtml(results.htmlText);
            $scope.legend = $sce.trustAsHtml(results.legend);

            $scope.tempFeatureList = results.features;
            if ($scope.tab === '1')
                $scope.currentFeatureList = [];
            else
            {
                if ($scope.tab === '2')
                    $scope.currentFeatureList = $scope.tempFeatureList;
            }
        });

        $scope.inited = true;
    };

    if ($scope.resultData.showTestSetResults)
    {
        $scope.setSelectedTestFile($scope.resultData.testSetResults[0], 0);
    }

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

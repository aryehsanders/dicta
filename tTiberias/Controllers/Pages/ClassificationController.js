// create the controller and inject Angular's $scope
jTextMinerApp.controller('ClassificationController', function ($scope, ExperimentService, $location, ngDialog, focus, APIService, AlertsService, ClassificationService, FeatureService, ClassService, InProgressService, BrowseClassService, SelectClassService, SaveClassInterface) {

    $scope.showInProcess = InProgressService.isReady != 1;
    $scope.$on('isReady_Updated', function () {
        $scope.showInProcess = InProgressService.isReady != 1;
    });


    if (ExperimentService.user == 'none')
        $location.path('Login');
    
    $scope.ExperimentMode = ExperimentService.ExperimentMode;
    $scope.Classification_ExperimentType = ClassificationService.Classification_ExperimentType;
    $scope.$watch('Classification_ExperimentType', function () {
        ClassificationService.updateClassification_ExperimentTypeValue($scope.Classification_ExperimentType);
    });
    $scope.Classification_CrossValidationFolds = ClassificationService.Classification_CrossValidationFolds;
    $scope.$watch('Classification_CrossValidationFolds', function () {
        ClassificationService.updateClassification_CrossValidationFoldsValue($scope.Classification_CrossValidationFolds);
    });
    $scope.Classification_isKeepingChunksFromSameFileToghter = ClassificationService.Classification_isKeepingChunksFromSameFileToghter;
    $scope.$watch('Classification_isKeepingChunksFromSameFileToghter', function () {
        ClassificationService.updateClassification_isKeepingChunksFromSameFileToghterValue($scope.Classification_isKeepingChunksFromSameFileToghter);
    });


    $scope.Feature_sets = FeatureService.Feature_sets;
    $scope.TotalNumberOfFeatures = FeatureService.totalNumberOfFeatures;
    $scope.$on('totalNumberOfFeaturesUpdated', function () {
        $scope.TotalNumberOfFeatures = FeatureService.totalNumberOfFeatures;
    });

    $scope.Back = function () {
        $location.path('Experiment');
    }
    $scope.UpdateData = function () {
        $scope.data = {};
        $scope.data.userLogin = ExperimentService.user;
        $scope.data.expType = ExperimentService.ExperimentTypeModel;
        $scope.data.expName = ExperimentService.ExperimentName;
        $scope.data.selectedAlgorithmTypeId = ExperimentService.selectedAlgorithmTypeId;
        $scope.data.selectedAlgorithmTypeName = ExperimentService.selectedAlgorithmTypeName;
        $scope.data.selectedAlgorithmTypeAttributes = ExperimentService.selectedAlgorithmTypeAttributes;
        $scope.data.classificationExperimentMode = ClassificationService.Classification_ExperimentType;
        //$scope.data.classificationCrossValidationType = ExperimentService.Classification_CrossValidationType;
        $scope.data.classificationCrossValidationFolds = ClassificationService.Classification_CrossValidationFolds;
        //$scope.data.classificationSplitRatioCrossValidation = ExperimentService.Classification_Split_ratio_cross_validation;
        $scope.data.corpusMaxId = ClassService.Corpus_maxId;
        
        $scope.data.featureSets = FeatureService.Feature_sets;
        $scope.data.corpusClasses = ClassService.Corpus_classes;

        $scope.data.featuresData = FeatureService.featuresData;
    }
    $scope.resultData = ExperimentService.resultData;
    $scope.$watch('resultData', function () {
        if (!angular.isUndefined($scope.resultData)) {
            ExperimentService.updateResultData($scope.resultData);
            if ($scope.resultData.length != []) {
                //if (ExperimentService.ExperimentTypeModel == 'Unmasking')
                //    $location.path('Chart');
                //else //https://docs.angularjs.org/guide/$location
                {
                    //$scope.setSelectedTestFile($scope.resultData.testSetResults[0], 0);

                    $location.path('ResultsClassificationCrossValidation');
                }
            }
        }
    });
    $scope.KnownTestSet = ClassService.KnownTestSet;
    
    $scope.UpdateExtractFeaturesData = function () {
        $scope.data = {};
        $scope.data.userLogin = ExperimentService.user;
        $scope.data.expType = ExperimentService.ExperimentTypeModel;


        $scope.data.expName = ExperimentService.ExperimentName;

        $scope.data.featureSets = FeatureService.Feature_sets;
        $scope.data.corpusClasses = ClassService.Corpus_classes;

        $scope.data.featuresData = FeatureService.featuresData;

    }
    $scope.NextExp = function (expType) {
        $scope.Classification_ExperimentType = expType;
        if (!$scope.featuresData || !$scope.featuresData.features || $scope.featuresData.features.length == 0) {
            InProgressService.updateIsReady(0);
            $scope.UpdateExtractFeaturesData();

            APIService.apiRun({ crud: 'Extract' }, $scope.data, function (response) {
                var results = response;
                $scope.featuresData = results;
                FeatureService.updateFeaturesData($scope.featuresData);
                InProgressService.updateIsReady(1);
                $scope.Next();
            });
        }
        else {
            $scope.Next();
        }
    }
    
    $scope.Next = function () {
        ClassificationService.updateClassification_ExperimentTypeValue($scope.Classification_ExperimentType);
        if ($scope.Classification_ExperimentType == 'TestSet')
            $location.path('TestSet');
        else {
            AlertsService.determineAlert({ msg: 'Check validation', type: 'success' });
            InProgressService.updateIsReady(0);
            $scope.UpdateData();

            APIService.apiRun({ crud: 'RunClassification' }, $scope.data, function (response) {
                InProgressService.updateIsReady(1);
                var results = response;
                $scope.resultData = results;
            });
        }
    }

    // Bible
    $scope.cancelClass = function () 
    {
        $scope.showClassDialog = false;

    }

    $scope.saveClass = function () {
        $scope.showClassDialog = false;
        var classData = SaveClassInterface; // {};
  
        if (angular.equals(classData.actionMode, 'BrowseThisComputer')) {
            classData.totalNumberOfWords = BrowseClassService.LastClassTotalNumberOfWords;
            InProgressService.updateIsReady(0);
            APIService.apiRun({ crud: 'TrainClass' }, classData, function (response) {
                InProgressService.updateIsReady(1);
                var results = response;
                $scope.addClass(results.browse_ClassName, results.selectedText, results.browse_ChunkMode, results.browse_MinimumChunkSize, results.numberOfChunks, results.totalNumberOfWords, false);

            });
        }
        else if (angular.equals(classData.actionMode, 'SelectOnlineCorpus')) {
            InProgressService.updateIsReady(0);
            classData.select_RootKeys = SelectClassService.lastSelectedRootKeys;
            APIService.apiRun({ crud: 'TrainClass' }, classData, function (response) {
                InProgressService.updateIsReady(1);
                var results = response;
                $scope.addClass(results.select_ClassName, results.selectedText, 'By chapter', '', results.numberOfChunks, results.totalNumberOfWords, true);
                
            });    
        }
        else if (angular.equals(classData.actionMode, 'LoadStoredClass')) {
            InProgressService.updateIsReady(0);

            var selRootNodes = $("#classTree").dynatree("getTree").getActiveNode();
            // Get a list of ALL selected nodes
            // selRootNodes = $("#classTree").dynatree("getTree").getSelectedNodes(false);
            var selRootKeys = selRootNodes.data.key;
            classData.activeKey = selRootKeys;
            APIService.apiRun({ crud: 'TrainClass' }, classData, function (response) {
                InProgressService.updateIsReady(1);
                var results = response;
                $scope.addClass(results.select_ClassName, results.selectedText, 'unknown', '', results.numberOfChunks, results.totalNumberOfWords, true);

            });
        }
    }

    $scope.OpenAddClass = function () {
        $scope.showClassDialog = true;

        ClassService.updateClassName('class ' + ClassService.Corpus_maxId);

        var selRootNodes = $("#trainTree").dynatree("getTree").getSelectedNodes(true);
        // Get a list of ALL selected nodes
        selRootNodes = $("#trainTree").dynatree("getTree").getSelectedNodes(false);

        var selRootKeys = $.map(selRootNodes, function (node) {
            return node.data.key;
        });
        for (var i in selRootKeys) {
            $("#trainTree").dynatree("getTree").getNodeByKey(selRootKeys[i]).select(false);
        }
        /*
        ngDialog.openConfirm({
            template: 'partials/Dialogs/partial-Class.html',
            controller: 'ClassDialogController',
            className: 'ngdialog-theme-default',
            scope: $scope
        }).then(function (value) {
            value.userLogin = ExperimentService.user;
            value.expType = ExperimentService.ExperimentTypeModel;
            value.expName = ExperimentService.ExperimentName;
            ExperimentService.updateIsReady(0);

            APIService.apiRun({ crud: 'TrainClass' }, value, function (response) {
                ExperimentService.updateIsReady(1);
                var results = response;
                $scope.addClass(results.browse_ClassName, results.selectedText, results.browse_ChunkMode, results.browse_MinimumChunkSize, results.numberOfChunks);
           
            });
            console.log('Modal promise resolved. Value: ', value);
        }, function (reason) {
            console.log('Modal promise rejected. Reason: ', reason);
        });
        */
    };
    $scope.classes = ClassService.Corpus_classes;
    $scope.$on('Corpus_classesValueUpdated', function () {
        $scope.classes = ClassService.Corpus_classes;
    });
    $scope.addClass = function (newItemName, text, mode, size, number, total, is_Bible) {
        ClassService.updateIsAllBibleValue(ClassService.isAllBible && is_Bible);
        FeatureService.updateFeaturesData({});
        ClassService.Corpus_maxId = ClassService.Corpus_maxId + 1;
        //ExperimentService.Corpus_classes.push({
        ClassService.pushCorpus_classes({
            id: ClassService.Corpus_maxId,
            title: newItemName,
            selectedText: text,
            chunkMode: mode,
            chunkSize: size,
            numberOfChunks: number,
            totalNumberOfWords: total,
            bible: is_Bible
        });
        
    }
    // end bible


    $scope.featuresData = FeatureService.featuresData;
    
    $scope.$on('featuresDataUpdated', function () {
        $scope.featuresData = FeatureService.featuresData;
    });

    $scope.OpenSelectFeatureSet = function () {
        ngDialog.openConfirm({
            template: 'partials/Dialogs/partial-FeatureSet.html',
            controller: 'FeatureSetDialogController',
            className: 'ngdialog-theme-default',
            scope: $scope
        }).then(function (value) {
            console.log('Modal promise resolved. Value: ', value);
        }, function (reason) {
            console.log('Modal promise rejected. Reason: ', reason);
        });
    };
    
    $scope.OpenSelectAlgorithm = function () {
        ngDialog.openConfirm({
            template: 'partials/Dialogs/partial-Algorithm.html',
            controller: 'AlgorithmDialogController',
            className: 'ngdialog-theme-plain',
            scope: $scope
        }).then(function (value) {
            console.log('Modal promise resolved. Value: ', value);
        }, function (reason) {
            console.log('Modal promise rejected. Reason: ', reason);
        });
    };

    //ExperimentService.selectedAlgorithmTypeId = 0;
    $scope.algorithms = ExperimentService.algorithms;
    $scope.selectedAlgorithmType = ExperimentService.algorithms[ExperimentService.selectedAlgorithmTypeId];
    $scope.selectedAlgorithmTypeName = ExperimentService.selectedAlgorithmTypeName;
    $scope.$on('selectedAlgorithmTypebroadcast', function () {
        $scope.selectedAlgorithmType = ExperimentService.algorithms[ExperimentService.selectedAlgorithmTypeId];
        $scope.selectedAlgorithmTypeName = ExperimentService.selectedAlgorithmTypeName;

    });


    focus('focusMe');
    
    $scope.showClassDialog = false;

   
});
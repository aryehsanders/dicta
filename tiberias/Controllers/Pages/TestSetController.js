// create the controller and inject Angular's $scope
jTextMinerApp.controller('TestSetController', function ($scope, ExperimentService, $location, ngDialog, focus, APIService, AlertsService, ClassificationService, FeatureService, InProgressService, ClassService, SelectClassService, BrowseClassService, SaveClassInterface) {

    $scope.showInProcess = InProgressService.isReady != 1;
    $scope.$on('isReady_Updated', function () {
        $scope.showInProcess = InProgressService.isReady != 1;
    });

    if (ExperimentService.user == 'none')
        $location.path('Login');
    
    $scope.Back = function () {
        $location.path('Classification');
    }

    $scope.Classification_TestSetExperimentType = ClassificationService.Classification_TestSetExperimentType;
    $scope.$watch('Classification_TestSetExperimentType', function () {
        ClassificationService.updateClassification_TestSetExperimentTypeValue($scope.Classification_TestSetExperimentType);
    });

    $scope.UpdateData = function () {
        $scope.data = {};
        $scope.data.userLogin = ExperimentService.user;
        $scope.data.expType = ExperimentService.ExperimentTypeModel;
        $scope.data.expName = ExperimentService.ExperimentName;
        $scope.data.selectedAlgorithmTypeId = ExperimentService.selectedAlgorithmTypeId;
        $scope.data.selectedAlgorithmTypeName = ExperimentService.selectedAlgorithmTypeName;
        $scope.data.selectedAlgorithmTypeAttributes = ExperimentService.selectedAlgorithmTypeAttributes;
        $scope.data.classificationExperimentMode = ClassificationService.Classification_ExperimentType;
        //$scope.data.classificationCrossValidationType = ClassificationService.Classification_CrossValidationType;
        $scope.data.classificationCrossValidationFolds = ClassificationService.Classification_CrossValidationFolds;
        //$scope.data.classificationSplitRatioCrossValidation = ClassificationService.Classification_Split_ratio_cross_validation;
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
                $location.path('ResultsClassificationTestSet');
            }
        }
    });
    $scope.Next = function () {
        AlertsService.determineAlert({ msg: 'Check validation', type: 'success' });
        InProgressService.updateIsReady(0);
        $scope.UpdateData();

        APIService.apiRun({ crud: 'RunClassification' }, $scope.data, function (response) {
            InProgressService.updateIsReady(1);
            var results = response;
            $scope.resultData = results;
        });
    }
   
 
    $scope.unknownClasses = ClassService.TestSet_unknown_class;
    $scope.knownClasses = ClassService.Corpus_classes;

    $scope.KnownTestSet = ClassService.KnownTestSet;

    $scope.UpdateUnknownClass = function (index) {
        $scope.showClassDialog = true;
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

            APIService.apiRun({ crud: 'UnknownTestClass' }, value, function (response) {
                ExperimentService.updateIsReady(1);
                var results = response;
                //$scope.updateUnknownClass(index, results.browse_ClassName, results.selectedText, results.browse_ChunkMode, results.browse_MinimumChunkSize, results.numberOfChunks);

            });
            console.log('Modal promise resolved. Value: ', value);
        }, function (reason) {
            console.log('Modal promise rejected. Reason: ', reason);
        });
        */
    }
    $scope.UpdateKnownClass = function (index) {

    }



    // Bible
    $scope.cancelClass = function () {
        $scope.Back();
        $scope.showClassDialog = false;

    }
    $scope.saveClass = function () {
        $scope.showClassDialog = false;
        
        var classData = SaveClassInterface; // {};
       
        InProgressService.updateIsReady(0);

        if (angular.equals(classData.actionMode, 'SelectOnlineCorpus')) {
            classData.select_RootKeys = SelectClassService.lastSelectedRootKeys;
        }
        APIService.apiRun({ crud: 'UnknownTestClass' }, classData, function (response) {
            InProgressService.updateIsReady(1);
            var results = response;
            $scope.unknownClasses.splice(0, 1);
            $scope.addUnknownClass(1, results.browse_ClassName, results.selectedText, results.browse_ChunkMode, results.browse_MinimumChunkSize, results.numberOfChunks);
            $scope.Next();
        });

    }

    $scope.classes = ClassService.Corpus_classes;
    $scope.addUnknownClass = function (index, newItemName, text, mode, size, number) {
        $scope.unknownClasses.push({
            id: index,
            title: newItemName,
            selectedText: text,
            chunkMode: mode,
            chunkSize: size,
            numberOfChunks: number
        });
    }

    $scope.DeleteClass = function (index) {
        InProgressService.updateIsReady(0);
        var currentClass = ClassService.Corpus_classes[index];
        var data = {};
        data.title = currentClass.title;
        data.id = currentClass.id;
        data.userLogin = ExperimentService.user;
        data.expType = ExperimentService.ExperimentTypeModel;
        data.expName = ExperimentService.ExperimentName;

        APIService.apiRun({ crud: 'DeleteClass' }, data, function (response) {
            ClassService.Corpus_classes.splice(index, 1);
            InProgressService.updateIsReady(1);
            var results = response;
        });
    }
    $scope.UpdateClass = function (index) {

    }
    
    
    $scope.showClassDialog = true;

});
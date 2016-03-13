// create the controller and inject Angular's $scope
jTextMinerApp.controller('ExperimentController', function ($scope, ExperimentService, $location, focus, APIService, $filter, AlertsService, ClassificationService, FeatureService, InProgressService, ClassService) {
   
    if (ExperimentService.isNewExperiment)
        ExperimentService.isNewExperiment=false;

    if (ExperimentService.user == 'none')
        $location.path('Login');
    

    $scope.ExperimentTypeModel = ExperimentService.ExperimentTypeModel;
    $scope.$watch('ExperimentTypeModel', function () {
        ExperimentService.updateExperimentTypeModelValue($scope.ExperimentTypeModel);
    });
    
    $scope.$on('valuesUpdated', function () {
        $scope.ExperimentTypeModel = ExperimentService.ExperimentTypeModel;
    });


    
    $scope.ExperimentMode = ExperimentService.ExperimentMode;
    $scope.$watch('ExperimentMode', function () {
        ExperimentService.updateExperimentModeValue($scope.ExperimentMode);
    });


    $scope.Back = function () {
        $location.path('Login');
    }
    $scope.NewExperimentName = ExperimentService.NewExperimentName;
    $scope.StoredExperimentName = '';
    
    $scope.LoadExperiment = function () {
        $scope.ExperimentMode = 'UploadStoredExperiment';
        $scope.Next();
    }
    $scope.StartNewExperiment = function () {
        $scope.ExperimentMode = 'NewExperiment';
        $scope.Next();
    }

    $scope.Next = function () {
        if ($scope.ExperimentMode == 'NewExperiment' && $scope.NewExperimentName.length == 0)
            AlertsService.determineAlert({ msg: 'Please give a name for new experiment.', type: 'danger' });
        else {
            if (($scope.ExperimentMode == 'UploadStoredExperiment' && $scope.StoredExperimentName.length == 0)) {
                AlertsService.determineAlert({ msg: 'Please choose stored experiment', type: 'danger' });
            }
            else {
                InProgressService.updateIsReady(0);
                
                if ($scope.ExperimentMode == 'NewExperiment')
                {
                    ExperimentService.updateNewExperimentName($scope.NewExperimentName);

                    $scope.data = {};
                    $scope.data.userLogin = ExperimentService.user;
                    $scope.data.expType = ExperimentService.ExperimentTypeModel;

                    // http://www.aspsnippets.com/Articles/AngularJS-Get-and-display-Current-Date-and-Time.aspx
                    var date = new Date();
                    $scope.formatedDate = $filter('date')(new Date(), 'dd.MM.yyyy HH-mm-ss');

                    //ExperimentService.ExperimentName += ' ' + $scope.formatedDate;
                    $scope.data.expName = ExperimentService.ExperimentName;

                    APIService.apiRun({ crud: 'NewExperiment' }, $scope.data, function (response) {
                        InProgressService.updateIsReady(1);

                        if (response.userLogin.length != 0) {
                            AlertsService.determineAlert({ msg: 'NewExperiment', type: 'success' });
                            $location.path($scope.ExperimentTypeModel);
                        }
                        else
                            AlertsService.determineAlert({ msg: 'There is such exp name', type: 'success' });
                    });
                }
                else
                {
                    ExperimentService.updateStoredExperimentName($scope.StoredExperimentName);

                    $scope.data = {};
                    $scope.data.userLogin = ExperimentService.user;
                    $scope.data.expType = ExperimentService.ExperimentTypeModel;
                    $scope.data.expName = ExperimentService.ExperimentName;
                    
                    APIService.apiRun({ crud: 'DownloadStoredExperiment' }, $scope.data, function (response) {
                        InProgressService.updateIsReady(1);
                        AlertsService.determineAlert({ msg: 'DownloadStoredExperiment', type: 'success' });
                        $scope.UpdateData(response);
                        FeatureService.updateTotalNumberOfFeatures(null);
                        $scope.UpdateExtractFeaturesData();
                        APIService.apiRun({ crud: 'Extract' }, $scope.data, function (response) {
                            var results = response;
                            $location.path($scope.ExperimentTypeModel);
                        });
                        
                    });
                }
                
            }
        }
    }

    focus('focusMe');


    $scope.fileNameList = [];

    $scope.data = {};
    $scope.data.userLogin = ExperimentService.user;
    $scope.data.expType = ExperimentService.ExperimentTypeModel;
    APIService.apiGetArray({ crud: 'GetUploadStoredExperiments' }, $scope.data, function (response) {
        $scope.fileNameList = response;
        AlertsService.determineAlert({ msg: 'Getting file\'s names is successed', type: 'success' });
    });


    $scope.UpdateData = function (data) {
        //ExperimentService.updateExperimentModeValue();
        ExperimentService.updateExperimentTypeModelValue(data.expType);
        ExperimentService.updateExperimentName(data.expName);

        ExperimentService.updateselectedAlgorithmTypeValue(data.selectedAlgorithmTypeId, data.selectedAlgorithmTypeName, data.selectedAlgorithmTypeAttributes);
        
        ClassificationService.updateClassification_ExperimentTypeValue(data.classificationExperimentMode);
        ClassificationService.updateClassification_CrossValidationFoldsValue(data.classificationCrossValidationFolds);

        ClassService.Corpus_maxId = data.corpusMaxId;

        FeatureService.Feature_sets=data.featureSets;
        ClassService.Corpus_classes = data.corpusClasses;

        FeatureService.updateFeaturesData(data.featuresData);
    }
    $scope.UpdateExtractFeaturesData = function () {
        $scope.data = {};
        $scope.data.userLogin = ExperimentService.user;
        $scope.data.expType = ExperimentService.ExperimentTypeModel;


        $scope.data.expName = ExperimentService.ExperimentName;

        $scope.data.featureSets = FeatureService.Feature_sets;
        $scope.data.corpusClasses = ClassService.Corpus_classes;

        $scope.data.featuresData = FeatureService.featuresData;

    }

});
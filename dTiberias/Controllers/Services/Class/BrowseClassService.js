jTextMinerApp.factory('BrowseClassService', function ($rootScope, InProgressService) {
    var service = {};

    // class dialog parameters
    service.countWordsForUploadedZipFile = [];
    $rootScope.$watch('countWordsForUploadedZipFile', function () {
        $rootScope.$broadcast("countWordsForUploadedZipFileUpdated");
    });

    service.updateCountWordsForUploadedZipFile = function (value) {
        this.countWordsForUploadedZipFile = value;
        InProgressService.updateIsReady(1);
        $rootScope.$broadcast("countWordsForUploadedZipFileUpdated");
    }
    // end class dialog parameters
    // txt class dialog parameters
    service.countWordsForUploadedTxtFile = [];
    service.updateCountWordsForUploadedTxtFile = function (value) {
        this.countWordsForUploadedTxtFile = value;
        InProgressService.updateIsReady(1);
        $rootScope.$broadcast("countWordsForUploadedTxtFileUpdated");
    }
    // end txt class dialog parameters

    service.Browse_DoNotChunk_ChunkSize = 0;
    $rootScope.$watch('Browse_DoNotChunk_ChunkSize', function () {
        $rootScope.$broadcast("Browse_DoNotChunk_ChunkSizeUpdated");
    });

    service.Browse_AppendAndChunk_ChunkSize = 0;
    $rootScope.$watch('Browse_AppendAndChunk_ChunkSize', function () {
        $rootScope.$broadcast("Browse_AppendAndChunk_ChunkSizeUpdated");
    });
    service.Browse_ChunkBigFiles_ChunkSize = 0;
    $rootScope.$watch('Browse_ChunkBigFiles_ChunkSize', function () {
        $rootScope.$broadcast("Browse_ChunkBigFiles_ChunkSizeUpdated");
    });
    service.Browse_NumberOfFiles = service.countWordsForUploadedZipFile.length;
    $rootScope.$watch('Browse_NumberOfFiles', function () {
        $rootScope.$broadcast("Browse_NumberOfFilesUpdated");
    });
    service.Browse_NumberOfWords = 0;
    $rootScope.$watch('Browse_NumberOfWords', function () {
        $rootScope.$broadcast("Browse_NumberOfWordsUpdated");
    });
    service.Browse_ChunkMode = 'DoNotChunk';
    $rootScope.$watch('Browse_ChunkMode', function () {
        $rootScope.$broadcast("Browse_ChunkModeUpdated");
    });
    service.zipFile = '';
    
    service.Browse_FileName = ''; // $scope.zipFile.name
    $rootScope.$watch('Browse_FileName', function () {
        $rootScope.$broadcast("Browse_FileNameUpdated");
    });
    service.Browse_ChunkMode = 'DoNotChunk';
    $rootScope.$watch('Browse_ChunkMode', function () {
        $rootScope.$broadcast("Browse_ChunkModeUpdated");
    });
    service.Browse_MinimumChunkSize = 250;
    $rootScope.$watch('Browse_MinimumChunkSize', function () {
        $rootScope.$broadcast("Browse_MinimumChunkSizeUpdated");
    });

    service.LastClassTotalNumberOfWords = 0;
    service.updateLastClassTotalNumberOfWordsValue = function (value) {
        this.LastClassTotalNumberOfWords = value;
        $rootScope.$broadcast("LastClassTotalNumberOfWordsValueUpdated");
    }
    

    return service;
});
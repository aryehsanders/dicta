
jTextMinerApp.factory('TreeService', function ($http) {
    var treeObject = {};
    treeObject.ready = $http.get('corpusTree.json').then(function(response) {
        treeObject.corpusTree = response.data;
    });
    treeObject.keyToNode = {};
    return treeObject;
});
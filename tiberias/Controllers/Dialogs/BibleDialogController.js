// create the controller and inject Angular's $scope
jTextMinerApp.controller('BibleDialogController', function ($scope, ngDialog, ExperimentService) {
    //https://github.com/angular-ui-tree/angular-ui-tree
    

    //http://stackoverflow.com/questions/28318633/access-angularjs-service-from-a-service-inside-a-different-frame
    $scope.treeData = [{ "id": 1, "checkStatus": "unchecked", "title": "item1", "nodes": [{ "id": 11, "checkStatus": "unchecked", "title": "item 1.1", "nodes": [{ "id": 111, "checkStatus": "unchecked", "title": "item 1.1.1" }] }, { "id": 12, "checkStatus": "unchecked", "title": "item 1.2" }] }, { "id": 2, "checkStatus": "unchecked", "title": "item 2", "nodes": [{ "id": 21, "checkStatus": "unchecked", "title": "item 2.1" }, { "id": 22, "checkStatus": "unchecked", "title": "item 2.2" }] }, { "id": 3, "checkStatus": "unchecked", "title": "item 3", "nodes": [{ "id": 31, "checkStatus": "unchecked", "title": "item 3.1" }] }, { "id": 4, "checkStatus": "unchecked", "title": "item 4", "nodes": [{ "id": 41, "checkStatus": "unchecked", "title": "item 4.1" }] }];
    //$scope.treeData = treeData;
    
    $scope.remove = function (index) {
        $scope.treeData.splice(index, 1);
    };

    $scope.toggle = function (index) {
        scope.toggle();
    };

    $scope.moveLastToTheBegginig = function () {
        var a = $scope.treeData.pop();
        $scope.data.splice(0, 0, a);
    };

    var getRootNodesScope = function () {
        return angular.element(document.getElementById("tree-root-dialog")).scope();
    };

    $scope.CollapseAllFunction = function () {
        /*
        //http://stackoverflow.com/questions/23562900/how-to-call-collapseall-function-on-angular-ui-tree
        var elems = document.getElementsByClassName("ui-tree-handle");
        for (var i = 0; i < elems.length; i++) {
            angular.element(elems[i]).scope().collapse();
        }
        */
        
        var scope = getRootNodesScope();
        scope.collapseAll();
    };

    $scope.expandAll = function () {
        var scope = getRootNodesScope();
        scope.expandAll();
    };

    //changed this functin, now it only makes terminal nodes , aka "files"
    //hence it should be only called from a parent node, aka "folder"
    $scope.newSubItem = function (scope) {
        var nodeData = scope.$modelValue;
        nodeData.nodes.push({
            id: nodeData.id * 10 + nodeData.nodes.length,
            title: nodeData.title + '.' + (nodeData.nodes.length + 1),
            checkStatus: "unchecked",
        });
    };

    //New Methods start here
    //make a new folder
    var counter = 5;
    $scope.newParentItem = function () {

        $scope.treeData.push({
            id: counter,
            title: "node" + counter++,
            checkStatus: "unchecked",
            nodes: [],
        });
    };

    //This is what is called from the ng-click
    $scope.toggleCheck = function (node) {
        console.log(node);
        if (node.checkStatus === "checked") {
            node.checkStatus = "unchecked";
        } else {
            node.checkStatus = "checked";
        }
        if (node.nodes)
            $scope.propagateCheckFromParent(node.nodes, node.checkStatus);
        $scope.verifyAllParentsCheckStatus($scope.treeData);
    };

    //when a "folder" is click/unclicked, all it's children are click/unclicked
    $scope.propagateCheckFromParent = function (nodes, status) {
        for (var i = 0; i < nodes.length; ++i) {
            var node = nodes[i];
            node.checkStatus = status;
            if (node.nodes)
                $scope.propagateCheckFromParent(node.nodes, status)
        }
    };

    //starting from the root node, check all folders recursively to see
    //if their children are all click, all unclicked or mixed
    $scope.verifyAllParentsCheckStatus = function (nodes) {
        var retVal = "";
        for (var i = 0; i < nodes.length; ++i) {
            var node = nodes[i];
            console.log(node.title);
            if (node.nodes && node.nodes.length > 0)
                node.checkStatus = $scope.verifyAllParentsCheckStatus(node.nodes);
            if (retVal === "") {
                retVal = node.checkStatus;
                console.log("set ret");
            }
            if (retVal != node.checkStatus)
                return "partlyChecked";
        }
        return retVal;
    };

    //This *should* update the folder checkboxes after a node drag and drop
    //BROKEN AS OF v2.1.5, FIX EXPECTED IN 2.1.6?
    $scope.treeOptionsDialog = {
        dropped: function (event) {
            $scope.verifyAllParentsCheckStatus($scope.treeData);
        }
    };
    $scope.selectedNodes = '';
    $scope.alertSelected = function () {
        $scope.selectedNodes = '';
        $scope.alertSelected2($scope.treeData);
        alert($scope.selectedNodes);
    };

    $scope.alertSelected2 = function (nodes) {
        for (var i = 0; i < nodes.length; ++i) {
            var node = nodes[i];
            if (node.nodes && node.nodes.length > 0) {
                $scope.alertSelected2(node.nodes);
            }
            $scope.selectedNodes += ', ' + node.checkStatus;
        }
        
    };


   

});
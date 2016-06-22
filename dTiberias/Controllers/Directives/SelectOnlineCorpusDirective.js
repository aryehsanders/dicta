jTextMinerApp.directive('selectOnlineCorpus', function ($rootScope) {
    return {
        restrict: 'AE',
        templateUrl: 'partials/templates/SelectOnlineCorpusTemplate.html',
        controller: ['$scope', '$http', function ($scope, $http) {
            $scope.Select_OnlineCorpus = 'Bible';

            $scope.showBibleDialog = true;
            $scope.OpenSelectBible = function () {
                $scope.showBibleDialog = true;
                $scope.showTalmudDialog = false;
            };
            $scope.showTalmudDialog = false;
            $scope.OpenSelectTalmud = function () {
                $scope.showBibleDialog = false;
                $scope.showTalmudDialog = true;
            };

            $scope.breadCrumbs = ['All Collections'];

            $http.get('corpusTree.json').then(function(response) {
                $scope.corpusTree = response.data;
                $scope.treeNode = $scope.corpusTree;
            });

            $scope.expandNode = function (itemTitle) {
                var currentNode = $scope.treeNode;
                for (var i=0; i < currentNode.length; i++) {
                    if (currentNode[i]['title'] == itemTitle) {
                        $scope.treeNode = currentNode[i]['children'];
                        $scope.breadCrumbs.push(itemTitle);
                        break;
                    }
                }
            };

            // based on http://stackoverflow.com/questions/14514461/how-to-bind-to-list-of-checkbox-values-with-angularjs
            // list selected nodes by key
            $scope.selectedNodes = [];

            // toggle selection for a given node by key
            $scope.toggleSelection = function toggleSelection(itemKey) {
                var idx = $scope.selectedNodes.indexOf(itemKey);

                // is currently selected
                if (idx > -1) {
                    $scope.selectedNodes.splice(idx, 1);
                }

                // is newly selected
                else {
                    $scope.selectedNodes.push(itemKey);
                }
                $rootScope.$broadcast('lastSelectedRootKeys', $scope.selectedNodes);
            };

            $scope.selectCrumb = function (crumbNumber) {
                var oldCrumbs = $scope.breadCrumbs;
                $scope.breadCrumbs = ['All Collections'];
                $scope.treeNode = $scope.corpusTree;
                for (var i=1; i <= crumbNumber; i++) {
                    $scope.expandNode(oldCrumbs[i]);
                }

            };

            // http://wwwendt.de/tech/dynatree/doc/dynatree-doc.html 
            $("#trainTree").dynatree({
                checkbox: true,
                selectMode: 3,
                children: treeData,
                onSelect: function (select, node) {
                    // Get a list of all selected TOP nodes
                    var selRootNodes = node.tree.getSelectedNodes(true);
                    // Get a list of ALL selected nodes
                    selRootNodes = node.tree.getSelectedNodes(false);
                    // ... and convert to a key array:
                    var selRootKeys = $.map(selRootNodes, function (node) {
                        return node.data.key;
                    });
                    //http://stackoverflow.com/questions/12371159/how-to-get-evaluated-attributes-inside-a-custom-directive
                    //http://stackoverflow.com/questions/30332098/get-value-from-directive-into-controller
                    //http://plnkr.co/edit/8IkbWrOHHiq4HDBNVyCP?p=preview
                    $rootScope.$broadcast('lastSelectedRootKeys', selRootKeys);
                    if ($scope.selectedClassIndex >= 0 && $scope.inited) {
                        // call this after click next because if it will be here 
                        // then every time we update the tree it will arise the on_select event
                        // solved by inited
                        //ExperimentService.Corpus_selectedRootKeys[ExperimentService.Corpus_classes[$scope.selectedClassIndex].id] = selRootKeys;
                        //console.log("test ExperimentService.Corpus_selectedRootKeys[ExperimentService.Corpus_classes[$scope.selectedClassIndex].id]:: " + ExperimentService.Corpus_selectedRootKeys[ExperimentService.Corpus_classes[$scope.selectedClassIndex].id]);
                    }
                },
                onDblClick: function (node, event) {
                    node.toggleSelect();
                },
                onKeydown: function (node, event) {
                    if (event.which == 32) {
                        node.toggleSelect();
                        return false;
                    }
                },
                // The following options are only required, if we have more than one tree on one page:
                initId: "treeData",
                cookieId: "dynatree-Cb",
                idPrefix: "dynatree-Cb-"
            });

            $scope.getSelectedKeys = function () {
                var selRootNodes = $("#trainTree").dynatree("getTree").getSelectedNodes(true);
                // Get a list of ALL selected nodes
                selRootNodes = $("#trainTree").dynatree("getTree").getSelectedNodes(false);

                var selRootKeys = $.map(selRootNodes, function (node) {
                    return node.data.key;
                });
                return selRootKeys;
            };

            
        }]
    };
});
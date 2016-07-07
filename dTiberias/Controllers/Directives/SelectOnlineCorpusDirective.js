﻿jTextMinerApp.directive('selectOnlineCorpus', function ($rootScope) {
    return {
        restrict: 'AE',
        templateUrl: 'partials/templates/SelectOnlineCorpusTemplate.html',
        controller: ['$scope', '$http', function ($scope, $http) {
            $scope.Select_OnlineCorpus = 'Bible';

            $scope.showBibleDialog = false;
            $scope.OpenSelectBible = function () {
                $scope.showBibleDialog = true;
                $scope.showTalmudDialog = false;
            };
            $scope.showTalmudDialog = true;
            $scope.OpenSelectTalmud = function () {
                $scope.showBibleDialog = false;
                $scope.showTalmudDialog = true;
            };

            function initBreadCrumbs() {
                $scope.breadCrumbs = ['All Collections'];
            }
            initBreadCrumbs();

            $http.get('corpusTree.json').then(function(response) {
                $scope.corpusTree = response.data;
                $scope.treeNode = $scope.corpusTree;
                initCurrentLevel(null);
            });

            var keyToNode = {};

            // based on http://stackoverflow.com/questions/14514461/how-to-bind-to-list-of-checkbox-values-with-angularjs
            // list selected nodes by key
            $scope.selectedNodes = [];

            // to display an "indeterminate" checkbox if some key is partially selected
            $scope.partialNodes = [];


            function initCurrentLevel(parentNode) {
                for (var i = 0; i < $scope.treeNode.length; i++) {
                    // add links back to the parent, so we can update selections
                    $scope.treeNode[i]['parent'] = parentNode;
                    keyToNode[$scope.treeNode[i]['key']] = $scope.treeNode[i];
                }
            }

            // end of tree setup; helper functions come next

            $scope.expandNode = function (itemTitle) {
                var currentNode = $scope.treeNode;
                for (var i=0; i < currentNode.length; i++) {
                    if (currentNode[i]['title'] == itemTitle) {
                        $scope.treeNode = currentNode[i]['children'];
                        initCurrentLevel(currentNode[i]);
                        $scope.breadCrumbs.push(itemTitle);
                        break;
                    }
                }
            };

            // remove current item from array if 'ancestor' is an ancestor
            function removeIfAncestor(arr, idx, ancestor) {
                var current = keyToNode[arr[idx]];
                while(current['parent'] != null) {
                    if (current['parent'] === ancestor) {
                        arr.splice(idx, 1);
                        break;
                    }
                    current = current['parent'];
                }
            }

            function recalculatePartials() {
                $scope.partialNodes = [];
                for (var i=0;i< $scope.selectedNodes.length; i++) {
                    var parent = keyToNode[$scope.selectedNodes[i]]['parent'];
                    while (parent != null) {
                        if ($scope.partialNodes.indexOf(parent['key']) == -1)
                            $scope.partialNodes.push(parent['key']);
                        parent = parent['parent'];
                    }
                }
            }

            $scope.isNodeSelected = function isNodeSelected(node) {
                var parent = keyToNode[node]['parent'];
                return $scope.selectedNodes.indexOf(node) > -1 || (parent != null && isNodeSelected(parent['key']));
            };

            $scope.isNodePartial = function isNodePartial(node) {
                return $scope.partialNodes.indexOf(node) > -1;
            };

            // toggle selection for a given node by key
            $scope.toggleSelection = function toggleSelection(itemKey) {
                // is currently selected, so this deselects
                if ($scope.isNodeSelected(itemKey)) {
                    // currently selected itself?
                    var idx = $scope.selectedNodes.indexOf(itemKey);
                    if (idx > -1) {
                        // yes, so remove it.
                        $scope.selectedNodes.splice(idx, 1);
                    }
                    else {
                        // select siblings and deselect ancestor
                        var currentNode = keyToNode[itemKey];
                        while ((idx = $scope.selectedNodes.indexOf(currentNode['key'])) == -1) {
                            var children = currentNode['parent']['children'];
                            for (var i = 0; i < children.length; i++)
                                if (children[i] != currentNode)
                                    $scope.selectedNodes.push(children[i]['key']);
                            currentNode = currentNode['parent'];
                        }
                        $scope.selectedNodes.splice(idx, 1);
                    }
                }
                // is newly selected
                else {
                    // select this
                    $scope.selectedNodes.push(itemKey);
                    // check if all siblings are selected
                    var parent = keyToNode[itemKey]['parent'];
                    if (parent != null) {
                        var sibCount = 0;
                        var siblings = parent['children'];
                        for (var i = 0; i < siblings.length; i++)
                            if ($scope.selectedNodes.indexOf(siblings[i]['key']) > -1)
                                sibCount++;
                        // if so, select the parent
                        if (sibCount == siblings.length)
                            $scope.toggleSelection(parent['key']);

                    }
                }

                // remove any descendants already selected
                for (var i = $scope.selectedNodes.length - 1; i>=0; i--)
                    removeIfAncestor($scope.selectedNodes, i, keyToNode[itemKey]);

                recalculatePartials();

                $rootScope.$broadcast('lastSelectedRootKeys', $scope.selectedNodes);
            };

            $scope.selectCrumb = function (crumbNumber) {
                var oldCrumbs = $scope.breadCrumbs;
                initBreadCrumbs();
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
core.createController('FormFlowController', function ($scope, GlobalConfig, GlobalVar, Message, Util, FlowFactory, CurrentFormMeta) {
    jQuery(".small_view").height(window.innerHeight * 0.72).css("overflow-y", "auto").css("overflow-x", "hidden");
    jQuery(".small_viewx").height(window.innerHeight * 0.72).css("overflow-x", "auto");
    jQuery(".large_view").height(window.innerHeight * 0.79).css("overflow", "hidden");
    jQuery("#historyContainerId").height(window.innerHeight * 0.25).css("overflow", "auto");


    window.onbeforeunload = function () {
        if ($scope.durty > 1) {
            return "Save your changes before close or reload window.";
        }
    };

    $scope.durty = 0;
    $scope.flowDataSave = null;
    $scope.FlowFactory = null;
    $scope.flowMeta = CurrentFormMeta.getFormMeta();
    $scope.flowData = $scope.flowMeta.flow;
    $scope.flowDataBack = angular.copy($scope.flowMeta.flow);

    $scope._gv = {};
    $scope.oChartHelper = new FunctionalDraw("formFlowDrawPane");

    $scope._resetAll = function () {
        $scope.flowDataSave = null;
        $scope.FlowFactory = null;
        $scope.flowData = null;
        $scope._gv = {};
        $scope.oChartHelper.clear();
    };

    $scope.fnAfterDrop = function (event, node) {
        $scope.AddNextAction(node);
    };

    $scope.onCloseDesigner = function () {
        if ($scope.durty > 1) {
            Message.confirm("Changes are not saved. Are you sure want to close?", function (v) {
                if (v) {
                    $scope.flowMeta.flow = $scope.flowDataBack;
                    $scope.$parent.stageChange('TILE', $scope.flowMeta);
                }
            });
        } else {
            $scope.$parent.stageChange('TILE', $scope.flowMeta);
        }
    };

    $scope.saveChanges = function () {
        if(!$scope.stageValidation()){
            Message.alert("Some stage action created without reference or without name. Save not possible.");            
            return;
        }
        
        if(!$scope.nodeLinkValidation()){
            Message.alert("Some stage created but not linked to any action. Save not possible.");            
            return;
        }
        
        $scope.durty = 1;
        $scope.$parent.onUpdateForm("Form model updated.", true);
        
        Message.alert("Saved successfully!");
    };


    $scope.deleteNode = function () {
        Message.confirm("Are sure want delete this stage?", function (v) {
            if (v) {
                var newList = {};

                var sIndex = "";

                for (var m in $scope.flowData) {
                    if ($scope.flowData[m] == $scope.SelectedNode) {
                        sIndex = m;
                    }
                }

                //Removeing references
                for (var m in $scope.flowData) {
                    var node = $scope.flowData[m];
                    var reff = [];
                    for (var i in node._a) {
                        if (node._a[i].r == sIndex) {
                            reff.push(i);
                        }
                    }
                    for (var n in reff) {
                        node._a.splice(parseInt(reff[n]), 1);
                    }
                }
                $scope.SelectedNode = null;
                delete($scope.flowData[sIndex]);

                var mlist = {}, im = 1;
                for (var m in $scope.flowData) {
                    mlist[im++] = $scope.flowData[m];
                }
                $scope.flowData = mlist;
            }
        });
    };


    $scope._loadFlowFactory = function () {
        FlowFactory.getAll({}, function (oBase) {
            $scope.FlowFactory = oBase;
        });
    };
    $scope._loadFlowFactory();

    $scope.loadGlobalVar = function (sVar) {
        if (!$scope._gv[sVar]) {
            GlobalVar.get({context: sVar, account: core.Profile.account}, function (res) {
                $scope._gv[sVar] = res;
            });
        }
    };

    $scope.isArray = Util.isArray;
    $scope.formatText = Util.formatText;

    $scope._renderGraph = function () {
        $scope.oChartHelper.clear();
        if (!$scope.SelectedNode) {
            $scope.oChartHelper.clearSelection();
        }
        $scope.oChartHelper.draw($scope.flowData);
    };

    $scope.$watchCollection('flowData', function () {
        $scope._renderGraph();
        $scope.durty += 1;
    });


    window.addEventListener('nodeClick', function (event) {
        $scope.SelectedNode = event.detail;
        $scope.$apply();
    }, false);


    $scope.checkVisibleProp = function (item) {
        if (item.visible) {
            return $scope.$eval("SelectedNode._f." + item.visible);
        }
        return true;
    };

    $scope.$watch('SelectedNode', function () {
        if ($scope.SelectedNode) {
            delete($scope.SelectedNode.edit);
        }
    });

    $scope.AddNextAction = function (oItem) {
        var aKeys = Object.keys($scope.flowData);
        var i = aKeys[aKeys.length - 1];
        var m = parseInt(i) + 1;
        $scope.flowData[m] = angular.copy(oItem);
        $scope.flowData[m].uid=Math.round(Math.random()*9999999);
        $scope._renderGraph();

    };

    var findParentNode = function (oBase, iId) {
        for (var i = 0; i < oBase.next.length; i++) {
            if (oBase.next[i].id === iId) {
                return {p: oBase, i: i};
            }
            if (oBase.next[i].next.length) {
                return findParentNode(oBase.next[i], iId);
            }
        }
        return {p: null, i: -1};
    };

    $scope.addAction = function (node) {
        node._a = node._a || [];

        node._a.push({
            r: "",
            n: ""
        });
        $scope._renderGraph();
    };

    $scope.removeAction = function (node, index) {
        Message.confirm("Are you sure want to remove this action?", function (v) {
            if (v) {
                node._a.splice(index, 1);
                $scope._renderGraph();
            }
        });
    };
    
    $scope.nodeLinkValidation=function(){
        
        var uvals={};
        
        for(var m in $scope.flowData){
            var node=$scope.flowData[m];
            for(var i in node._a){
                var nm=node._a[i];
                if(jQuery.trim(nm.r)){
                    uvals[nm.r]=0;
                }
            }
        }        
        
        
        return Object.keys($scope.flowData).length-1<=Object.keys(uvals).length;
    };
    
    
    $scope.stageValidation=function(){
        var isValid=true;
        for(var m in $scope.flowData){
            var node=$scope.flowData[m];
            for(var i in node._a){
                var nm=node._a[i];
                if(jQuery.trim(nm.n) && jQuery.trim(nm.r)){
                    
                }else{
                    isValid=false;
                    break;
                }
            }
            if(!isValid){
                break;
            }
        }        
        
        return isValid;
    };

    $scope.deleteFlowAction = function () {
        if ($scope.SelectedNode) {
            Message.confirm("Are you sure want to delete flow action?", function (v) {
                if (v) {
                    var res = findParentNode($scope.flowData, $scope.SelectedNode.id);
                    if (res && res.p) {
                        res.p.next.splice(res.i, 1);
                        $scope.SelectedNode = null;
                        $scope._renderGraph();
                    }
                }
            });
        }
    };

//    jQuery("#grapContainer").height(window.innerHeight * 0.65);
    jQuery("#flowDetailsHolder").height(window.innerHeight * 0.63).css("overflow-y", "auto");
});

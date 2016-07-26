core.createController('FormFlowController', function ($scope, GlobalConfig, GlobalVar, Message, Util) {
    $scope.flowDataSave = null;
    $scope.FlowFactory = null;
    $scope.flowData = null;
    $scope._gv = {};
    $scope.oChartHelper = new ChartHelper({
        canvas: Snap("#formFlowDrawPane"),
        cardHeight: 100,
        cardWidth: 150,
        cardVGap: 20,
        cardHGap: 50
    });

    $scope._resetAll = function () {
        $scope.flowDataSave = null;
        $scope.FlowFactory = null;
        $scope.flowData = null;
        $scope._gv = {};
        $scope.oChartHelper.clear();
    };

    if ($scope.$parent.SelectedFormMeta) {
        $scope._resetAll();
        $scope.flowData = $scope.$parent.SelectedFormMeta.flow;
    }

    $scope.$on('FormItemSelected', function (event, data) {
        $scope._resetAll();
        $scope.flowData = data.flow;
    });



    $scope._loadFlowFactory = function () {
        GlobalConfig.load({context: 'flow_factory'}, function (aData) {
            if (aData && aData[0]) {
                var oBase = {};
                aData[0].value.map(function (v) {
                    oBase[v.type] = v;
                });
                $scope.FlowFactory = oBase;
            }
        });
    };

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
        $scope.oChartHelper.drawFlow(40, 50, $scope.flowData);
    };

    $scope.$watchCollection('flowData', function () {
        $scope._renderGraph();
    });


    window.addEventListener('nodeClick', function (event) {
        $scope.SelectedNode = event.detail;
        $scope.$apply();
    }, false);


    $scope.checkVisibleProp = function (item) {
        if (item.visible) {
            return $scope.$eval("SelectedNode.model.fields." + item.visible);
        }
        return true;
    };

    $scope.$watch('SelectedNode', function () {
        if ($scope.SelectedNode) {
            delete($scope.SelectedNode.edit);
        }
    });

    $scope.AddNextAction = function (oItem) {
        if ($scope.SelectedNode) {
            var item = angular.copy(oItem);
            item.id = Math.floor(Math.random() * 9999999);
            $scope.SelectedNode.next.push(item);
            $scope._renderGraph();
        }
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

    jQuery("#grapContainer").height(window.innerHeight * 0.65);
    jQuery("#flowDetailsHolder").height(window.innerHeight * 0.55).css("overflow", "auto");
});

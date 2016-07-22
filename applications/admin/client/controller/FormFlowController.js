core.createController('FormFlowController', function ($scope) {
    $scope.actions = [];

    var fnDataToNode = function (oData) {
        var oRoot = null;
        for (var m in oData) {
            var item = oData[m];
            item.id = m;
            oRoot = oRoot || item;
            item.next = item.next.map(function (v) {
                var ch = oData[v];
                if (ch)
                    ch.id = v;
                return ch;
            });
        }
        return oRoot;
    };
    $scope.flowDataSave=null;
    
    $scope.$on('FormItemSelected', function (event, data) {
        $scope.flowData = data.flow;
    });

    var oChartHelper = new ChartHelper({
        canvas: Snap("#formFlowDrawPane"),
        cardHeight: 100,
        cardWidth: 150,
        cardVGap: 20,
        cardHGap: 50
    });

    $scope._renderGraph = function () {
        oChartHelper.clear();
        oChartHelper.drawFlow(40, 50, $scope.flowData);
    };

    $scope.$watchCollection('flowData', function () {
        $scope._renderGraph();
    });


    window.addEventListener('nodeClick', function (event) {
        $scope.SelectedNode = event.detail;
        $scope.$apply();
    }, false);



    $scope.trailAdd = function () {
        if ($scope.SelectedNode) {
            $scope.SelectedNode.next.push({
                id: Math.round(Math.random() * 999999),
                action: "TEST",
                target: "USER_GROUP",
                system: "admin",
                next: [],
                config: {}
            });
            $scope._renderGraph();
        }
    };

    jQuery("#grapContainer").height(window.innerHeight * 0.65);
    jQuery("#flowDetailsHolder").height(window.innerHeight * 0.7).css("overflow", "auto");
});

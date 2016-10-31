core.createController('DashboardController', function ($scope, CloudMessage, $http, uiGmapIsReady) {
    $scope.BaseData = {};

    $scope.map = {
        center: {
            latitude: 12.9375312,
            longitude: 77.7006514
        },
        zoom: 14,
        control: {},
        markers: []
    };
    
    uiGmapIsReady.promise().then(function (inastance) {
        var map = inastance[0].map;
        $scope._map=map;
        google.maps.event.addListener(map, "idle", function () {
            google.maps.event.trigger(map, 'resize');
        });

        google.maps.event.trigger(map, 'resize');
        map.setZoom(map.getZoom());
    });
    
    $http.get("/service/dashboard/data").then(function (resp) {
        $scope.BaseData = resp.data;
  
        for (var m in $scope.BaseData.form_data.markers) {
            var mm = $scope.BaseData.form_data.markers[m];
            $scope.map.markers.push({
                id: mm.i,
                latitude: mm.lg,
                longitude: mm.lt
            });
        }
    });

    $scope.formatText = function (text) {
        return text.split("_").join(" ").toUpperCase();
    };

    $scope.fu = null;
    $scope.graph_usage = {labels: [], data: []};
    $scope.onSelectUsage = function (fu) {
        $scope.fu = fu;
        var data = [];
        var ug = $scope.BaseData.form_data.usage[fu].daily;
        for (var m in ug) {
            $scope.graph_usage.labels.push(m);
            data.push(ug[m]);
        }
        $scope.graph_usage.data = data;//.push(data);
    };




    $scope.loaded = true;

    $scope.marker = [
        {
            id: 1,
            latitude: 12.9375312,
            longitude: 77.7006514
        }
    ];


    
});
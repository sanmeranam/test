core.createController('FormMapRecordsController', function ($scope, uiGmapIsReady) {

    $scope.map = {
        center: {
            latitude: 12.9375312,
            longitude: 77.7006514
        },
        zoom: 14,
        control: {}
    };

    $scope.loaded = true;




    uiGmapIsReady.promise().then(function (inastance) {
        var map = inastance[0].map;

        google.maps.event.addListener(map, "idle", function () {
            google.maps.event.trigger(map, 'resize');
        });

        google.maps.event.trigger(map, 'resize');
        map.setZoom(map.getZoom());
    });
});

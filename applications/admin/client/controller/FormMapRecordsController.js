core.createController('FormMapRecordsController', function ($scope, uiGmapIsReady) {

    $scope.map = {
        center: {
            latitude: 12.9375312,
            longitude: 77.7006514
        },
        zoom: 14,
        control: {},
        markers: [],
        events: {
            click: function (map, eventName, originalEventArgs) {
                var e = originalEventArgs[0];
                var lat = e.latLng.lat(), lon = e.latLng.lng();
                var marker = {
                    id: Date.now(),
                    coords: {
                        latitude: lat,
                        longitude: lon
                    }
                };
                $scope.map.markers.push(marker);
                console.log($scope.map.markers);
                $scope.$apply();
            }
        }
    };

    $scope.loaded = true;

    $scope.marker = [
        {
            idKey: 1,
            latitude: 12.9375312,
            longitude: 77.7006514
        }
    ];


    uiGmapIsReady.promise().then(function (inastance) {
        var map = inastance[0].map;

        google.maps.event.addListener(map, "idle", function () {
            google.maps.event.trigger(map, 'resize');
        });

        google.maps.event.trigger(map, 'resize');
        map.setZoom(map.getZoom());
    });
});

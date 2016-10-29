core.createController('FormDataController', function ($scope, FormMeta, Message, uiGmapIsReady, UserList, $http, FormData, GlobalVar) {

    jQuery(".small_view").height(window.innerHeight * 0.79).css("overflow-y", "auto").css("overflow-x", "hidden");
    jQuery(".scroll_view").height(window.innerHeight * 0.70).css("overflow-y", "auto").css("overflow-x", "hidden");

    $scope.UserMap = {};
    UserList.load(function (res) {
        for (var m in res) {
            $scope.UserMap[res[m].value] = res[m];
        }

    });

    $scope.FormData = {
        list: [],
        init: function () {
            $scope.$parent.PageConfig._title = "Form [" + $scope.oCurrenctFormMeta.name + "]";
            FormData.getAll({meta_id: $scope.oCurrenctFormMeta.value}, function (oData) {
                $scope.FormData.list = oData;
            });
        }
    };

    $scope.FormFields = {
        map: {},
        init: function () {
            GlobalVar.get({context: "$forms", fid: $scope.oCurrenctFormMeta.value}, function (res) {
                for (var i in res) {
                    $scope.FormFields.map[res[i].value] = res[i].fields;
                }
            });
        }
    };



    $scope.FormChart = {
        newChart: null,
        list: [],
        init: function () {
            $http.get("/service/forms/analytics?id=" + $scope.oCurrenctFormMeta.value).then(function (resp) {
                $scope.FormChart.list = resp.data;
            });
        },
        createNewChart: function () {
            this.newChart = {
                created:Date.now(),
                name: "",
                field: "",
                type: "",
                conditions: []
            };

            jQuery("#modalNewAnalytics").modal("show");
        },
        addCondition: function () {
            this.newChart.conditions.push({
                type: "",
                value: ""
            });
        },
        removeCondition: function (index) {
            this.newChart.conditions.splice(index, 1);
        },
        cancelCreate: function () {
            jQuery("#modalNewAnalytics").modal("hide");
            this.newChart = null;
        },
        saveNewAnalytics: function () {
            if (!this.newChart.name ||
                    !this.newChart.type ||
                    !this.newChart.field) {
                this.error = true;
                return;
            }
            jQuery("#modalNewAnalytics").modal("hide");

            $http({
                method: 'POST',
                url: "/service/forms/analytics",
                data: {id: $scope.oCurrenctFormMeta.value, data: this.newChart},
                headers: {'Content-Type': 'application/json'}
            }).then(function (resp) {
                this.newChart = null;
                $scope.FormChart.init();
            });
        }
    };


    $scope.MapViewConfig = {
        config: {
            center: {
                latitude: 12.9375312,
                longitude: 77.7006514
            },
            zoom: 12,
            control: {},
            markers: [],
            events: {
                click: function (map, eventName, originalEventArgs) {
                }
            }
        },
        init: function () {
            for (var m in $scope.FormData.list) {
                var d = $scope.FormData.list[m];

                if (d && d.stage_history && d.stage_history.length) {
                    this.config.markers.push({
                        id: d.internal_id,
                        coords: {
                            latitude: d.stage_history[0].lat,
                            longitude: d.stage_history[0].lng
                        }
                    });

                }

            }

        },
        selected: function (item) {
            this.selectedfrm = item;
            if (item && item.stage_history && item.stage_history.length) {
                this.moveToLocation(item.stage_history[0].lat, item.stage_history[0].lng);
            }
        },
        moveToLocation: function (lat, lng) {
            var center = new google.maps.LatLng(lat, lng);
            $scope._map.panTo(center);
        }
    };







    var ps = core.getHashParams();
    if (ps[0]) {
        FormMeta.get({id: ps[0]}, function (res) {
            $scope.oCurrenctFormMeta = res;
            $scope.oCurrenctFormMeta.name = res.form_name;
            $scope.oCurrenctFormMeta.value = res._id;
            $scope.FormData.init();
            $scope.FormChart.init();
            $scope.FormFields.init();
        });
    }


    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {
            $scope.MapViewConfig.config.center.latitude = position.coords.latitude;
            $scope.MapViewConfig.config.center.longitude = position.coords.longitude;
        });
    }

    uiGmapIsReady.promise().then(function (inastance) {
        var map = inastance[0].map;
        $scope._map = map;

        google.maps.event.addListener(map, "idle", function () {
            google.maps.event.trigger(map, 'resize');
        });

        google.maps.event.trigger(map, 'resize');
        map.setZoom(map.getZoom());
    });
});

var FormView = function (item) {
    this.model = null;
    this.pages = [];
    this.data = null;
    this.currentPage = 0;
    this.selected = item;
    this.model = item.model;
    this.data = {};
    for (var m in item.data) {
        this.data[item.data[m]._i] = item.data[m]._v;
    }

    this.pages = Object.keys(item.model);

    for (var iPage in this.model) {
        this._setData(this.model[iPage]);
    }
};
FormView.prototype = {
    _setData: function (ins) {
        if (ins._n && ins._a.value && this.data[ins._d]) {
            var val = this.data[ins._d];
            if (val && (val.indexOf("[") > -1 && val.indexOf("]") > -1) || (val.indexOf("{") > -1 && val.indexOf(":") > -1)) {
                val = JSON.parse(val);
            }
            ins._a.value.value = val;
        }
        if (ins._c && ins._c.length) {
            for (var m in ins._c) {
                this._setData(ins._c[m]);
            }
        }
    },
    nextPage: function () {

    },
    prevPage: function () {

    },
    getPageModel: function () {
        if (this.model && this.pages)
            return this.model[this.pages[this.currentPage]];
        return null;
    },
    getStage: function () {
        if(this.stage){
            return this.stage;
        }
        this.stage = {};
        for (var m in this.selected.flow) {
            var f = this.selected.flow[m];
            this.stage[f.uid] = {
                type: f._t,
                id: f.uid,
                done: false
            };
        }
        for (var i in this.selected.stage_history) {
            var st = this.selected.stage_history[i];
            if (this.stage[st.uid]) {
                this.stage[st.uid].done = true;
                this.stage[st.uid].data = this.stage[st.uid];
            }
        }
        return this.stage;
    }
};

core.createController('FormDataController', function ($scope, FormMeta, Message, uiGmapIsReady, UserList, $http, FormData, GlobalVar, NgTableParams) {

    jQuery(".small_view").height(window.innerHeight * 0.79).css("overflow-y", "auto").css("overflow-x", "hidden");
    jQuery(".scroll_view").height(window.innerHeight * 0.70).css("overflow-y", "auto").css("overflow-x", "hidden");
//    jQuery(".page_view").height(window.innerHeight * 0.53).css("overflow-y", "auto").css("overflow-x", "hidden");


    $scope.UserMap = {};
    UserList.load(function (res) {
        for (var m in res) {
            $scope.UserMap[res[m].value] = res[m];
        }

    });




    $scope.tabSelect = 0;
    $scope.FormDataView = {};

    $scope.TabNav = {
        cdata: null,
        live: "0",
        select: function (idx, data) {
            this.live = "" + idx;
            this.cdata = data;
        },
        remove: function (idx) {
            this.cdata = null;
            this.live = '1';
            delete($scope.FormDataView[idx]);
        }
    };

    $scope.FormData = {
        selected: null,
        list: [],
        table: new NgTableParams({count: Math.floor(jQuery(".small_view").height() / 35)}),
        init: function () {
            $scope.$parent.PageConfig._title = "Form [" + $scope.oCurrenctFormMeta.name + "]";
            FormData.getAll({meta_id: $scope.oCurrenctFormMeta.value}, function (oData) {
                $scope.FormData.list = oData;
                $scope.FormData.table.settings({
                    dataset: oData
                });
            });
        },
        search: function () {
            $scope.FormData.table.filter({$: $scope.formDataFilterText});
        },
        select: function (item) {
            this.selected = item;


            if (!$scope.FormDataView[item._id]) {
                $scope.FormDataView[item._id] = new FormView(item);
            }
            $scope.TabNav.select(item._id, $scope.FormDataView[item._id]);
        }
    };

    $scope.$watch("formDataFilterText", function () {
        $scope.FormData.table.filter({$: $scope.formDataFilterText});
    });

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
        flow: [],
        init: function () {
            $http.get("/service/forms/analytics?id=" + $scope.oCurrenctFormMeta.value).then(function (resp) {
                $scope.FormChart.list = resp.data;
            });


        },
        options: {
            legend: {
                display: true,
                labels: {
                    fontColor: 'rgb(255, 99, 132)'
                }
            }
        },
        removeChart: function (item) {
            Message.confirm("Are you sure want to delete this chart?", function (v) {
                if (v) {
                    $http.get("/service/forms/analytics?delete=" + item.created + "&id=" + $scope.oCurrenctFormMeta.value).then(function (resp) {
                        Message.alert("Deleted Successfully.");
                        $scope.FormChart.init();
                    });
                }
            });

        },
        download: function (sId) {
            var tmp_canvas = document.getElementById(sId);
            var dataURL = tmp_canvas.toDataURL("image/png");
            var dlink = document.createElement('a');
            dlink.download = name;
            dlink.href = dataURL;
            dlink.onclick = function (e) {
                // revokeObjectURL needs a delay to work properly
                var that = this;
                setTimeout(function () {
                    window.URL.revokeObjectURL(that.href);
                }, 1500);
            };

            dlink.click();

        },
        createNewChart: function () {
            this.newChart = {
                created: Date.now(),
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

    $scope.$watch('MapViewConfig.curStage', function () {
        $scope.MapViewConfig.init();
    });
    $scope.MapViewConfig = {
        flow: [],
        curStage: "1",
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
        init: function (bInit) {
            this.config.markers = [];
            for (var m in $scope.FormData.list) {
                var d = $scope.FormData.list[m];

                if (d && d.stage_history && d.stage_history.length) {
                    try {
                        this.config.markers.push({
                            id: d.internal_id,
                            coords: {
                                latitude: d.stage_history[this.curStage - 1].lat,
                                longitude: d.stage_history[this.curStage - 1].lng
                            }
                        });
                    } catch (e) {

                    }

                }

            }

            if (bInit) {
                this.flow = [];
                for (var i in $scope.oCurrenctFormMeta.flow) {
                    var f = $scope.oCurrenctFormMeta.flow[i];
                    this.flow.push({
                        key: i,
                        value: f._t
                    })
                }
            }
        },
        selected: function (item, bOpen) {
            this.selectedfrm = item;
            if (item && item.stage_history && item.stage_history.length) {
                this.moveToLocation(item.stage_history[this.curStage - 1].lat, item.stage_history[this.curStage - 1].lng);
            }

            if (bOpen) {
                if (!$scope.FormDataView[item._id]) {
                    $scope.FormDataView[item._id] = new FormView(item);
                }
                $scope.TabNav.select(item._id, $scope.FormDataView[item._id]);
            }
        },
        moveToLocation: function (lat, lng) {
            var center = new google.maps.LatLng(lat, lng);
            if ($scope._map) {
                $scope._map.panTo(center);
            }
        }
    };

    uiGmapIsReady.promise().then(function (inastance) {
        var map = inastance[0].map;
        $scope._map = map;

        google.maps.event.addListener(map, "idle", function () {
            google.maps.event.trigger(map, 'resize');
        });

        google.maps.event.trigger(map, 'resize');
        map.setZoom(map.getZoom());
    });





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


});

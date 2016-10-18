core.createController('FormRecordsController', function ($scope, uiGmapIsReady, Message, FormData, CurrentFormMeta, UserList) {
    jQuery("#recordsViewContainer").height(window.innerHeight * 0.68).css("overflow", "auto");
    jQuery(".small_view").height(window.innerHeight * 0.8).css("overflow", "hidden");

    jQuery(".small_view2").height(window.innerHeight * 0.65).css("overflow", "auto");

    $scope.DivTimeLineStyle = {
        height: (window.innerHeight * 0.6) + "px",
        overflow: "auto"
    };
    $scope.currentPage = "";
    $scope._fields = [];
    $scope.map = null;
    $scope._chartitems = {};
    $scope.CurrentForm = CurrentFormMeta.getFormMeta();
    $scope.charts = $scope.CurrentForm.charts;
    $scope.BaseData = [];
    $scope.UserMap = {};

    uiGmapIsReady.promise().then(function (inastance) {
        var map = inastance[0].map;
        $scope.map = map;
        google.maps.event.addListener(map, "idle", function () {
            google.maps.event.trigger(map, 'resize');
        });

        google.maps.event.trigger(map, 'resize');
        map.setZoom(map.getZoom());
    });
    
    UserList.load(function(list){
        for(var i=0;i<list.length;i++){
            var data=list[i];
            $scope.UserMap[data._id] = data;
        }
    });

    var fnFilterAcceptFields = function (type) {
        return (type == "text_input" 
                || type == "date_picker" 
                || type == "time_picker"
                || type == "switch"
                || type == "single_option"
                || type == "multi_options"
                || type == "barcode_scan"                
                || type == "rating");
    };

    FormData.getAll({meta_id: $scope.CurrentForm._id}, function (oData) {
        $scope.BaseData = oData;

        var oneRecord = $scope.BaseData[0];

        var arr = [];
        for (var n in oneRecord.data) {
            var d = oneRecord.data[n];
            if (fnFilterAcceptFields(d._t)) {
                arr.push({
                    key: d._i,
                    value: d._l
                });
            }
        }
        $scope._fields = arr;
    });


    $scope.TableViewConfig = {
        page: "/_self/templates/forms/records_table_view.html",
        init: function () {
            setTimeout(this.renderTable, 100);
        },
        renderTable: function () {
            if (!$scope.table) {

            }
            $("#datatable-buttons").width("100%");
        },
        parseCol: function (data) {
            if (jQuery.trim(data._v).length == 0) {
                return "-";
            }
            var html = data._v;
            switch (data._t) {
                case "audio_record":
                    html = "<a href='/service/file/audio?id=" + data._v + "' target='_blank' ><i class='fa fa-music'></i></a>";
                    break;
                case "video_record":
                    html = "<a  href='/service/file/video?id=" + data._v + "' target='_blank'><i class='fa fa-play-circle'></i></a>";
                    break;
                case "sign_input":
                    html = "<a  href='/service/file/image?id=" + data._v + "' target='_blank'><i class='fa fa-pencil-square-o'></i></a>";
                    break;
                case "file_attach":
                    html = "<a  href='/service/file/pdf?id=" + data._v + "' target='_blank'><i class='fa fa-file-pdf-o'></i></a>";
                    break;
                case "photo_attach":
                    html = "<a  href='/service/file/image?id=" + data._v + "' target='_blank'><i class='fa fa-picture-o'></i></a>";
                    break;
                case "location":
                    var val = JSON.parse(data._v);
                    html = "<a  href='http://maps.google.com/?q=" + val.lat + "," + val.lng + "' target='_blank'><i class='fa fa-map-marker'></i></a>";
                    break;
                case "date_picker":
                    html = data._v.split("T")[0];
                    break;
            }
            return html;
        }
    };

    $scope.MapViewConfig = {
        page: "/_self/templates/forms/records_map_view.html",
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
//                    var e = originalEventArgs[0];
//                    var lat = e.latLng.lat(), lon = e.latLng.lng();
//                    var marker = {
//                        id: Date.now(),
//                        coords: {
//                            latitude: lat,
//                            longitude: lon
//                        }
//                    };
//                    $scope.MapViewConfig.config.markers.push(marker);
//
//                    $scope.$apply();
                }
            }
        },
        init: function () {
            for (var m in $scope.BaseData) {
                var d = $scope.BaseData[m];

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
            $scope.map.panTo(center);
        }
    };

    $scope.TimeViewConfig = {
        page: "/_self/templates/forms/records_time_view.html",
        init: function () {

        },
        getFilterParam: function () {
            var flterText = jQuery("#formSearchText").val();
//            if (flterText.indexOf(":") > -1) {
//                flterText = flterText.split(":");
//                var m = {};
//                m[flterText[0]] = flterText[1];
//                return m;
//            }
            return flterText;
        }
    };



    $scope.ChartViewConfig = {
        page: "/_self/templates/forms/records_chart_view.html",
        init: function () {
            Chart.defaults.global.legend.display = false;

        },
        saveField: function (item) {
            if (item) {
                delete(item.edit);
                $scope.$parent.onUpdateForm("Data analytics configuration changed.", false);
            } else {
                $scope.charts.push(this._newField);
                this._newField = null;
                $scope.$parent.onUpdateForm("Data analytics field addes.", false);
            }
        },
        removeField: function (index) {
            Message.confirm("Are you sure want to remove?", function (res) {
                if (res) {
                    $scope.charts.splice(index, 1);
                }
            });
        },
        createNew: function () {
            this._newField = {
                type: "",
                field: "",
                limit: -1
            };
        },
        getFields: function () {

        },
        _filterDataForChart: function (oNode) {
            var baseData = $scope.BaseData;
            var map = {}, label = "";
            
            var total=0,avg=0,showing=0;

            baseData.map(function (row) {
                var cell = row.data.filter(function (v) {
                    label = v._i == oNode.field ? v._l : label;
                    return v._i == oNode.field;
                });
                var value = cell[0]._v;

                map[value] = map[value] ? map[value] + 1 : 1;

                return row;
            });
            
            
            var data = Object.keys(map).map(function (v) {
                
                return map[v];
            });
            var headers = Object.keys(map);

            
            if (oNode.limit > 0 && headers.length > oNode.limit) {
                headers.length = oNode.limit;
                data.length = oNode.limit;
            }
            var sum=0;
            
            data=data.map(function(v){
                sum+=v;
                return v; 
            });
            
            total=data.length;
            avg=sum/total;
            
            return {header: headers, data: data, label: label,sum:sum,total:total,avg:avg};
        },
        _drawDelayNode: function () {
            var context = this;

            if (document.getElementById(context.id)) {
                var ele = document.getElementById(context.id);
                var options = {};
                switch (context.node.type) {
                    case "BAR":
                        options = {
                            type: 'bar',
                            data: {
                                labels: context.data.header,
                                datasets: [{
                                        label: context.data.label,
                                        backgroundColor: "#26B99A",
                                        data: context.data.data
                                    }]
                            },
                            options: {
                                scales: {
                                    yAxes: [{
                                            ticks: {
                                                beginAtZero: true
                                            }
                                        }]
                                }
                            }
                        };
                        break;
                    case "PIE":
                        options = {
                            type: 'doughnut',
                            tooltipFillColor: "rgba(51, 51, 51, 0.55)",
                            data: {
                                labels: context.data.header,
                                datasets: [{
                                        data: context.data.data,
                                        backgroundColor: [
                                            "aqua",
                                            "black",
                                            "blue",
                                            "brown",
                                            "crimson",
                                            "fuchsia",
                                            "fuschia",
                                            "gray",
                                            "green",
                                            "lemon",
                                            "lime",
                                            "magenta",
                                            "olive",
                                            "orange",
                                            "peach",
                                            "pink",
                                            "purple",
                                            "red",
                                            "salmon",
                                            "tan",
                                            "teal",
                                            "violet",
                                            "white",
                                            "yellow"
                                        ],
                                        hoverBackgroundColor: [
                                            "aqua",
                                            "black",
                                            "blue",
                                            "brown",
                                            "crimson",
                                            "fuchsia",
                                            "fuschia",
                                            "gray",
                                            "green",
                                            "lemon",
                                            "lime",
                                            "magenta",
                                            "olive",
                                            "orange",
                                            "peach",
                                            "pink",
                                            "purple",
                                            "red",
                                            "salmon",
                                            "tan",
                                            "teal",
                                            "violet",
                                            "white",
                                            "yellow"
                                        ]

                                    }]
                            }
                        };
                        break;
                    case "RADAR":
                        options = {
                            type: 'radar',
                            data: {
                                labels: context.data.header,
                                datasets: [{
                                        label: context.data.label,
                                        backgroundColor: "rgba(38, 185, 154, 0.2)",
                                        borderColor: "rgba(38, 185, 154, 0.85)",
                                        pointColor: "rgba(38, 185, 154, 0.85)",
                                        pointStrokeColor: "#fff",
                                        pointHighlightFill: "#fff",
                                        pointHighlightStroke: "rgba(151,187,205,1)",
                                        data: context.data.data
                                    }]
                            },
                        };
                        break;
                    case "PIE_AREA":
                        options = {
                            data: {
                                datasets: [{
                                        data: context.data.data,
                                        backgroundColor: [
                                            "#455C73",
                                            "#9B59B6",
                                            "#BDC3C7",
                                            "#26B99A",
                                            "#3498DB"
                                        ],
                                        label: context.data.label
                                    }],
                                labels: context.data.header
                            },
                            type: 'polarArea',
                            options: {
                                scale: {
                                    ticks: {
                                        beginAtZero: true
                                    }
                                }
                            }
                        };
                        break;
                }
                new Chart(ele, options);
            }
        },
        drawCustomData: function (oNode, sId) {
            jQuery("#chartViewContaintId").height(window.innerHeight * 0.69).css("overflow", "auto");
            var result = this._filterDataForChart(oNode);

            setTimeout(jQuery.proxy(this._drawDelayNode, {node: oNode, id: sId, data: result}), 500);

            return result;
        }
    };

    $scope._selectedView = "TABLE";
    $scope.switchView = function (view) {
        $scope._selectedView = view;
        switch (view) {
            case "TABLE":
                $scope.currentPage = $scope.TableViewConfig.page;
                $scope.TableViewConfig.init();
                break;
            case "MAP":
                $scope.currentPage = $scope.MapViewConfig.page;
                $scope.MapViewConfig.init();
                break;
            case "TIME":
                $scope.currentPage = $scope.TimeViewConfig.page;
                $scope.TimeViewConfig.init();
                break;
            case "CHART":
                $scope.currentPage = $scope.ChartViewConfig.page;
                $scope.ChartViewConfig.init();
                break;
        }
    };
    $scope.switchView("TABLE");
    $scope.loaded = true;

    $('#reservation').daterangepicker({
        startDate: moment().subtract(29, 'days'),
        endDate: moment(),
        dateLimit: {
            days: 60
        },
        showDropdowns: true,
        showWeekNumbers: true,
        timePicker: false,
        timePickerIncrement: 1,
        timePicker12Hour: true,
        ranges: {
            'Today': [moment(), moment()],
            'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
            'Last 7 Days': [moment().subtract(6, 'days'), moment()],
            'Last 30 Days': [moment().subtract(29, 'days'), moment()],
            'This Month': [moment().startOf('month'), moment().endOf('month')],
            'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
        },
        opens: 'left',
        buttonClasses: ['btn btn-default'],
        applyClass: 'btn-small btn-primary',
        cancelClass: 'btn-small',
        format: 'DD/MM/YYYY',
        separator: ' to ',
        locale: {
            applyLabel: 'Apply',
            cancelLabel: 'Clear',
            fromLabel: 'From',
            toLabel: 'To',
            customRangeLabel: 'Custom',
            daysOfWeek: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'],
            monthNames: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
            firstDay: 1
        }
    });
});

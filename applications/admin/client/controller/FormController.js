core.createController('FormController', function ($scope, FormMeta) {
    jQuery(".small_view").height(window.innerHeight * 0.8).css("overflow", "auto");
    jQuery(".large_view").height(window.innerHeight * 0.8).css("overflow", "hidden");
    jQuery("#historyContainerId").height(window.innerHeight * 0.3).css("overflow", "auto");

    $scope.sPages = {
        data: "/_self/templates/forms/records.html",
        design: "/_self/templates/forms/desgin.html",
        flow: "/_self/templates/forms/flow_config.html"
    };

    $scope.FormMetaList = [];
    $scope.SelectedFormMeta = null;
    $scope.SelectedFormView = 0;
    $scope.NewFormMeta = null;

    $scope.hashManager = {
        init: function () {
            var ps = core.getHashParams();
            for (var i = 0; i < ps.length; i++) {
                this["p" + i] = ps[i];
            }
        },
        setParams: function () {
            if (arguments && arguments.length) {
                var mh = "Forms:";
                for (var i = 0; i < arguments.length; i++) {
                    mh = mh + ":" + arguments[i];
                }
                window.location.hash = mh;
            } else {
                window.location.hash = "Forms";
            }
        }
    };
    $scope.hashManager.init();

    $scope.inlineTrend = function () {
        Chart.defaults.global.legend.display = false;
        var ctx = document.getElementById("mybarChart");
        var mybarChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ["10", "11", "12", "13", "14", "15", "16"],
                datasets: [{
                        label: '# Created',
                        backgroundColor: "#03586A",
                        data: [41, 56, 25, 48, 72, 34, 12]
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
        });
    };
    $scope.inlineTrend();



    $scope.loadFormMeta = function () {
        FormMeta.getAll({}, function (data) {
            $scope.FormMetaList = data;

            $scope.hashManager.init();
            if ($scope.hashManager.p0) {
                var oExist = $scope.FormMetaList.filter(function (v) {
                    return v._id === $scope.hashManager.p0;
                });
                if (oExist && oExist.length) {
                    if ($scope.hashManager.p1) {
                        $scope.SelectedFormView = $scope.hashManager.p1;
                    }

                    $scope.onSelectForm(oExist[0]);
                    $scope.hashManager.setParams();
                }

            }
        });
    };
    $scope.loadFormMeta();


    $scope.$watch("SelectedFormMeta", function () {
        if ($scope.SelectedFormMeta) {
            $scope.hashManager.setParams($scope.SelectedFormMeta._id);
        } else {
            $scope.hashManager.setParams();
        }
    });
    $scope.$watch("SelectedFormView", function () {
        if ($scope.SelectedFormView && $scope.SelectedFormMeta) {
            $scope.hashManager.setParams($scope.SelectedFormMeta._id, $scope.SelectedFormView);
        } else if ($scope.SelectedFormMeta) {
            $scope.hashManager.setParams($scope.SelectedFormMeta._id);
        }
    });

    $scope.onSelectForm = function (item) {
        $scope.SelectedFormMeta = item;
        $scope.$broadcast('FormItemSelected', item);
    };
    $scope.onCreateForm = function () {
        $scope.SelectedFormMeta = null;
        $scope.SelectedFormView = 0;

        var intiFlow = {
            "type": "create",
            "id": Math.floor(Math.random() * 9999999),
            "next": [],
            "model": {
                "name": "Create Form",
                "fields": {
                    "by": {
                        "type": "options",
                        "value": "Any",
                        "list": ["Any", "User", "Group"]
                    },
                    "user": {
                        "visible": "by.value=='User'",
                        "type": "options",
                        "value": "",
                        "list": "$users"
                    },
                    "user_group": {
                        "visible": "by.value=='Group'",
                        "type": "options",
                        "value": "",
                        "list": "$user_group"
                    }
                }
            }
        };


        $scope.NewFormMeta = {
            "form_name": "",
            "account_id": core.Profile.account,
            "flow": intiFlow,
            "model_view": {
                "1": {
                    "_l": false,
                    "_c": []
                }
            },
            "table_view": {},
            "charts": [],
            "config": {
                "logo": ""
            },
            "history": {
                "created": {
                    "date": Date.now(),
                    "user": core.Profile.user.first_name
                },
                "modified": []
            },
            "state": 0
        };
    };
    $scope.onSaveNewForm = function () {
        if (!jQuery.trim($scope.NewFormMeta.form_name)) {
            return;
        }
        FormMeta.create(angular.copy($scope.NewFormMeta), function () {
            $scope.NewFormMeta = null;
            $scope.loadFormMeta();
        });

    };
    $scope.onUpdateForm = function (changeTitle) {
        if (changeTitle) {
            $scope.SelectedFormMeta.history.modified.push({
                date: Date.now(),
                user: core.Profile.user.first_name,
                action: changeTitle
            });
        }

        FormMeta.save({id: $scope.SelectedFormMeta._id}, $scope.SelectedFormMeta, function () {
            $scope.loadFormMeta();
        });

    };
});

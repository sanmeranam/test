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


    $scope.loadFormMeta = function () {
        FormMeta.getAll({}, function (data) {
            $scope.FormMetaList = data;

            $scope.hashManager.init();
            if ($scope.hashManager.p0) {
                var notFound = true;
                $scope.FormMetaList.filter(function (v) {
                    if (v._id === $scope.hashManager.p0) {
                        notFound = false;
                        $scope.onSelectForm(v);
                    }
                    return true;
                });
                if (notFound) {
                    $scope.hashManager.setParams();
                }
            }

            if ($scope.hashManager.p1) {
                $scope.SelectedFormView = $scope.hashManager.p1;
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
        $scope.NewFormMeta = {
            "form_name": "",
            "account_id": core.Profile.account,
            "flow": {
                action: "CREATE",
                target: "",
                system: "",
                next: [],
                config: {}
            },
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

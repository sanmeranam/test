core.createController('FormController', function ($scope, FormMeta, Message, GlobalConfig, CurrentFormMeta, $http) {
    jQuery(".small_view").height(window.innerHeight * 0.78).css("overflow-y", "auto").css("overflow-x", "hidden");
    jQuery(".large_view").height(window.innerHeight * 0.8).css("overflow", "hidden");
    jQuery("#historyContainerId").height(window.innerHeight * 0.25).css("overflow", "auto");


    $scope.sPages = [
        "/_self/templates/form_views/form_tile_view.html",
        "/_self/templates/form_views/form_data_view.html",
        "/_self/templates/form_views/form_design_view.html",
        "/_self/templates/form_views/form_flow_view.html"
    ];

    $scope.CurrentFormView = $scope.sPages[0];

    $scope.stageChange = function (stage, frm) {
        $scope.onSelectForm(frm);
        switch (stage) {
            case "DATA":
                $scope.CurrentFormView = $scope.sPages[1];
                break;
            case "FLOW":
                $scope.CurrentFormView = $scope.sPages[3];
                break;
            case "DEG":
                $scope.CurrentFormView = $scope.sPages[2];
                break;
            case "TILE":
            default:
                $scope.CurrentFormView = $scope.sPages[0];
        }
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

    $(".sparkline").each(function () {
        var $this = $(this);
        $this.sparkline('html', $this.data());
    });

    GlobalConfig.load({context: 'db_new_form'}, function (data) {
        $scope._newFormMetaStruct = data[0].value;
    });

//    $scope.sCurrentStage = null;



    $scope.changeStatus = function (frm, stat) {
        var last = frm.state;
        frm.state = stat;
        $scope.saveChanges(frm, false, last != 0);
    };


    $scope.loadFormMeta = function () {
        $scope._loadingForms = true;
        $scope.hashManager.init();

        FormMeta.getAll({}, function (data) {
            $scope.FormMetaList = data;

            $scope.hashManager.init();
            if ($scope.hashManager.p0) {
                var oExist = $scope.FormMetaList.filter(function (v) {
                    return v._id === $scope.hashManager.p0;
                });
                if (oExist && oExist.length) {
                    $scope.onSelectForm(oExist[0]);

                    if ($scope.hashManager.p1) {
                        $scope.SelectedFormView = $scope.hashManager.p1;
                    }
                }

            }
            $scope._loadingForms = false;
        });
    };
    $scope.loadFormMeta();

    $scope.form_usage = {};


    $scope.onSelectForm = function (item) {
        $scope.SelectedFormMeta = item;
        CurrentFormMeta.setFormMeta(item);
        if(!item)
            return;

        if (!$scope.form_usage[item._id]) {
            $http.get("/service/forms/usage?id=" + item._id).then(function (resp) {
                $scope.form_usage[item._id] = resp.data;
                $scope.getFormaterData(resp.data);
            });
        }else{
            $scope.getFormaterData($scope.form_usage[item._id]);
        }
    };

    $scope.form_usage_data = {};

    $scope.getFormaterData = function (data) {
        
        var lbl = [];
        var d = [];
        if (data && data.daily) {
            for (var i in data.daily) {
                lbl.push(i);
                d.push(data.daily[i]);
            }
        }

        $scope.form_usage_data.labels = lbl;
        $scope.form_usage_data.data = [d];
        $scope.form_usage_data.series = ["Created Forms"];
        $scope.form_usage_data.options = {
            scales: {
                yAxes: [
                    {
                        id: 'y-axis-1',
                        type: 'linear',
                        display: true,
                        position: 'left'
                    },
                    {
                        id: 'y-axis-2',
                        type: 'linear',
                        display: true,
                        position: 'right'
                    }
                ]
            }
        };

    };




    $scope.onCloneForm = function () {
        if ($scope.SelectedFormMeta) {
            var oCloned = angular.copy($scope.SelectedFormMeta);
            delete(oCloned._id);
            oCloned.form_name += "_copy";
            oCloned.state = 0;
            oCloned.history.modified.length = 0;
            oCloned.history.created.user = core.Profile.user.first_name;
            oCloned.history.created.date = Date.now();

            FormMeta.create(oCloned, function () {
                $scope.loadFormMeta();
            });

            Message.alert("Form cloned and saved.");
        }
    };
    $scope.onDeleteForm = function () {
        Message.confirm("By deleting this form, data will not be deleted, only the form will suspend. Later you can delete permanently. Are you sure want to suspend this form?", function (result) {
            if (result) {
                $scope.SelectedFormMeta.state = 3;
                $scope.onUpdateForm("Form suspended permanently.", true);
            }
        });
    };

    $scope.onInlineAction = function (type) {
        if ($scope.SelectedFormMeta) {
            if (type === -1) {
                $scope._loadingForms = true;
                FormMeta.delete({id: $scope.SelectedFormMeta._id}, function () {
                    $scope.SelectedFormMeta = null;
                    $scope.loadFormMeta();
                });
            } else {
                Message.confirm("Are you sure want to change?", function (v) {
                    if (v) {
                        $scope.SelectedFormMeta.state = type;
                        $scope.onUpdateForm("Form activation mode changed.", true);
                    }
                });
            }
        }
    };


    $scope.onCreateForm = function () {
        $scope.SelectedFormMeta = null;
        $scope.SelectedFormView = 0;

        $scope.sCurrentStage = "NEW";

        var newForm = JSON.stringify($scope._newFormMetaStruct);

        newForm = newForm.replace("{{flow_id}}", Math.floor(Math.random() * 9999999));
        newForm = newForm.replace("{{date}}", Date.now());
        newForm = newForm.replace("{{u_id}}", core.Profile._id);
        newForm = newForm.replace("{{u_name}}", core.Profile.first_name + " " + core.Profile.last_name);

        $scope.NewFormMeta = JSON.parse(newForm);
    };
    $scope.onSaveNewForm = function (oNewForm) {
        if (oNewForm) {
            FormMeta.create(oNewForm, function () {
                $scope.loadFormMeta();
            });
        } else if ($scope.NewFormMeta && jQuery.trim($scope.NewFormMeta.form_name)) {
            FormMeta.create(angular.copy($scope.NewFormMeta), function () {
                $scope.NewFormMeta = null;
                $scope.loadFormMeta();
            });
        }
        $scope.stageChange("");
    };

    $scope.saveChanges = function (frm, bRefresh) {

        FormMeta.save({id: frm._id}, frm, function (result) {
            if (bRefresh) {
                $scope.loadFormMeta();
            }
        });
    };

    $scope.onUpdateForm = function (changeTitle, bRefresh, bChangeV) {
        if (changeTitle) {
            $scope.SelectedFormMeta.history.modified.push({
                date: Date.now(),
                user: (core && core.Profile && core.Profile.user ? core.Profile.user.first_name : ""),
                action: changeTitle
            });
        }
        bRefresh = bRefresh || true;
        if (bChangeV)
            $scope.SelectedFormMeta.version++;

        FormMeta.save({id: $scope.SelectedFormMeta._id}, $scope.SelectedFormMeta, function (result) {
            if (bRefresh) {
                $scope.loadFormMeta();
            }
        });
    };
});

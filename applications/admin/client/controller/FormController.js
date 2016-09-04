core.createController('FormController', function ($scope, FormMeta, Message, GlobalConfig) {
    jQuery(".small_view").height(window.innerHeight * 0.78).css("overflow-y", "auto").css("overflow-x", "hidden");
    jQuery(".large_view").height(window.innerHeight * 0.8).css("overflow", "hidden");
    jQuery("#historyContainerId").height(window.innerHeight * 0.25).css("overflow", "auto");

    $scope.sPages = [
        "/_self/templates/forms/records.html",
        "/_self/templates/forms/flow_config.html",
        "/_self/templates/forms/desgin.html"
    ];

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
    };
    $scope.onUpdateForm = function (changeTitle, bRefresh) {
        if (changeTitle) {
            $scope.SelectedFormMeta.history.modified.push({
                date: Date.now(),
                user: core.Profile.user.first_name,
                action: changeTitle
            });
        }
        bRefresh = bRefresh || true;

        FormMeta.save({id: $scope.SelectedFormMeta._id}, $scope.SelectedFormMeta, function (result) {
            if (bRefresh) {
                $scope.loadFormMeta();
            }
        });
    };
});

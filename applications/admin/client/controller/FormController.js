core.createController('FormController', function ($scope, FormMeta, Message, GlobalConfig, UserList, $http, FormData, CurrentFormMeta) {
    $scope.FORM_VIEW = "/_self/templates/form_views/form_tile_view.html";
    $scope.FORM_DESIGN = "/_self/templates/form_views/form_design_view.html";
    $scope.FORM_FLOW = "/_self/templates/form_views/form_flow_view.html";

    $scope.CURR_PAGE = $scope.FORM_VIEW;

    $scope.stageChange = function (val, frm) {
        CurrentFormMeta.setFormMeta(frm);
        switch (val) {
            case 0:
                $scope.CURR_PAGE = $scope.FORM_VIEW;
                break;
            case 1:
                $scope.CURR_PAGE = $scope.FORM_DESIGN;
                break;
            case 2:
                $scope.CURR_PAGE = $scope.FORM_FLOW;
                break;
        }
    };



    $scope.FormMap = {};

    $scope.UserMap = {};
    UserList.load(function (res) {
        for (var m in res) {
            $scope.UserMap[res[m].value] = res[m];
        }

    });

    $scope.FormMetaConfig = {
        busy: false,
        list: [],
        selected: null,
        newform: null,
        _newFormMetaStruct: {},
        init: function () {
            this.reload();
            this.busy = true;
            GlobalConfig.load({context: 'db_new_form'}, function (data) {
                $scope.FormMetaConfig._newFormMetaStruct = data[0].value;
                $scope.FormMetaConfig.busy = false;
            });
        },
        select: function (item) {
            this.selected = item;


            $scope.FormDataConfig.init(item);
            $scope.FormDasbordConfig.showusage(item._id);
            $scope.FormChart.init(item._id);
        },
        save: function (frm, bRefresh) {
            this.busy = true;
            frm = frm || this.selected;


            FormMeta.save({id: frm._id}, frm, function (result) {
                if (bRefresh) {
                    $scope.FormMetaConfig.reload();
                } else {
                    $scope.FormMetaConfig.busy = false;
                }
            });
        },
        reload: function () {
            this.selected = null;
            this.busy = true;
            FormMeta.getAll({}, function (aResult) {
                $scope.FormMetaConfig.list = aResult;
                $scope.FormMetaConfig.busy = false;
            });
        },
        remove: function (fId) {
            Message.confirm("Deleteing form may cause huge data destory. Are you sure wand to delete?", function (v) {
                if (v) {
                    FormMeta.delete({id: fId}, function () {
                        $scope.FormMetaConfig.selected=null;
                        $scope.FormMetaConfig.reload();
                        Message.alert("Form deleted successfully.");
                    });
                }
            });
        },
        createForm: function () {

            var newForm = JSON.stringify(this._newFormMetaStruct);

            newForm = newForm.replace("{{flow_id}}", Math.floor(Math.random() * 9999999));
            newForm = newForm.replace("{{date}}", Date.now());
            newForm = newForm.replace("{{u_id}}", core.Profile._id);
            newForm = newForm.replace("{{u_name}}", core.Profile.first_name + " " + core.Profile.last_name);

            this.newform = JSON.parse(newForm);
        },
        saveCreated: function () {
            if (this.newform) {
                if (this.newform && jQuery.trim(this.newform.form_name)) {
                    this.busy = true;
                    FormMeta.create(angular.copy(this.newform), function () {
                        $scope.FormMetaConfig.newform = null;
                        $scope.FormMetaConfig.reload();
                        $scope.FormMetaConfig.busy = false;
                        Message.alert("Form has been created successfully.");
                    });
                }
            }
        },
        statusChange: function (frm, stat) {
            if (frm.state === 2 && stat == 1) {
                frm.version += 1;
            }
            frm.state = stat;

            $scope.FormMetaConfig.save(frm, true);
        }
    };

    $scope.FormChart = {
        list: {},
        init: function (sId, bForce) {
            if (bForce || !$scope.FormChart.list[sId]) {
                $http.get("/service/forms/analytics?id=" + sId).then(function (resp) {
                    if (!$scope.FormChart.list[sId]) {
                        $scope.FormChart.list[sId] = [];
                        $scope.FormChart.list[sId] = resp.data;
                    }

                });
            }
        }
    };


    $scope.FormDataConfig = {
        busy: false,
        me: null,
        init: function (frm) {
            this.me = frm;
            if (!$scope.FormMap[frm._id] || !$scope.FormMap[frm._id].data) {
                this.load();
            }
        },
        load: function () {
            this.busy = true;
            FormData.getAll({meta_id: this.me._id}, function (oData) {
                $scope.FormDataConfig.busy = true;
                $scope.FormMap[$scope.FormDataConfig.me._id] = $scope.FormMap[$scope.FormDataConfig.me._id] || {data: []};
                $scope.FormMap[$scope.FormDataConfig.me._id].data = oData;
            });
        }
    };

    $scope.FormDasbordConfig = {
        busy: false,
        me: null,
        init: function (frm) {
            this.me = frm;
            if (!$scope.FormMap[frm._id] || !$scope.FormMap[frm._id].usage) {
                this.load();
            }
        },
        load: function () {
            this.busy = true;
            $http.get("/service/forms/usage?id=" + this.me._id).then(function (resp) {
                var oData = resp.data;
                $scope.FormDasbordConfig.busy = false;
                $scope.FormMap[oData.id] = $scope.FormMap[oData.id] || {usage: {}};
                $scope.FormMap[oData.id].usage = resp.data;
            });
        },
        showusage: function (sId) {
            var data = $scope.FormMap[sId].usage;
            var lbl = [];
            var d = [];
            if (data && data.daily) {
                for (var i in data.daily) {
                    lbl.push(i);
                    d.push(data.daily[i]);
                }
            }

            this.labels = lbl;
            this.data = [d];
            this.series = ["Created Forms"];
            this.colors = ['#FD1F5E', '#1EF9A1', '#7FFD1F', '#68F000'];
            this.options = {
                scales: {
                    yAxes: [
                        {
                            id: 'y-axis-1',
                            type: 'linear',
                            display: true,
                            position: 'left'
                        }
                    ]
                }
            };
        }
    };


    $scope.FormMetaConfig.init();
});

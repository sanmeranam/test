core.createController('RootController', function ($scope, Session, Message, CloudMessage, CurrentFormMeta, GlobalVar) {
    $scope.Profile = {};

    $scope.forms = [];


    GlobalVar.get({context: "$forms"}, function (res) {
        $scope.forms = res;
    });

    Session.getData({}, function (data) {
        if (data.status === "OK") {
            $scope.Profile = data.message;
            core.Profile = JSON.parse(JSON.stringify(data.message));
        }
    });



    $scope._alerts = null;
    $scope._confirm = {
        callback: null,
        text: "",
        yes: function () {
            this.text = "";
            if (this.callback)
                this.callback(true);
        },
        no: function () {
            this.text = "";
            if (this.callback)
                this.callback(false);
        }
    };

    $scope.clearAlert = function () {
        setTimeout(function () {
            $scope._alerts = null;
            $scope.$apply();
        }, 5000);
    };

    Message.alertcb = function (text) {
        $scope._alerts = text;
        $scope.clearAlert();
    };

    Message.confirmcb = function (text, callback) {
        $scope._alerts = null;
        $scope._confirm.callback = callback;
        $scope._confirm.text = text;
    };
    Message.loadingcb = function (b) {
        $scope.loading = b;
    };

    Message.loading(false);

    $scope.checkPageSwitch = function () {
        return true;
    };

    $scope.toPagehash = function (hash) {
        window.location.hash = hash;
        window.location.reload();
    };

    $scope.PageConfig = {
        _title: "",
        _page: "",
        _checkHash: function () {
            var hash = window.location.hash.replace("#/", "");
            if (hash) {
                var contxt = hash.split("_").join(" ");
                var bcontxt = contxt;
                if (contxt.indexOf("::") > -1)
                    contxt = contxt.substr(0, contxt.indexOf("::"));
                this._switch(contxt, bcontxt);
            } else {
                this._switch("Dashboard", "Dashboard");
            }
        },
        _switch: function (toPage, org, formData) {
            if (formData) {
                CurrentFormMeta.setFormMeta(formData);
            }

            if ($scope.checkPageSwitch()) {
                if (toPage.indexOf("::") > -1)
                    toPage = toPage.substr(0, toPage.indexOf("::"));

                if (this[toPage]) {
                    org = org || toPage;
                    window.location.hash = org.split(" ").join("_");
                    this._page = this[toPage].path;
                    this._title = toPage;



                    jQuery(".menu_section").find(".active").removeClass("active");
                    jQuery("[menu='" + toPage + "']").addClass("active");
                } else {
                    this._switch("Dashboard", "Dashboard");
                }
            }
        },
        "Dashboard": {
            path: "/_self/templates/dashboard.html"
        },
        "Forms": {
            path: "/_self/templates/forms.html"
        },
        "Doc Output": {
            path: "/_self/templates/docoutput.html"
        },
        "Products": {
            path: "/_self/templates/products.html"
        },
        "Users": {
            path: "/_self/templates/users.html"
        },
        "Settings": {
            path: "/_self/templates/settings.html"
        },
        "Form": {
            path: "/_self/templates/form_data.html"
        }
    };
    $scope.PageConfig._checkHash();

//    $scope.onHashChange = function (event) {
//        $scope.PageConfig._checkHash();
//    };

//    window.addEventListener("hashchange", $scope.onHashChange.bind(this), false);

    jQuery("#GlobalAlertInit").show();

    jQuery(function () {
        $scope.loadedEverything = true;
        $scope.$apply();
    });
    
    $scope.reload=function(){
      window.location.reload();  
    };
});
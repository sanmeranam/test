core.createController('RootController', function ($scope, Session, Message) {
    $scope.Profile = {};


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


    $scope.checkPageSwitch = function () {
        return true;
    };
    
    $scope.toPagehash=function(hash){
        window.location.hash=hash;
        $scope.PageConfig._checkHash();
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
        _switch: function (toPage, org) {
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
        "Billing": {
            path: "/_self/templates/billing.html"
        },
        "Data Factory": {
            path: "/_self/templates/dataprocess.html"
        },
        "Users": {
            path: "/_self/templates/users.html"
        },
        "Settings": {
            path: "/_self/templates/settings.html"
        }
    };
    $scope.PageConfig._checkHash();

    jQuery("#GlobalAlertInit").show();
});
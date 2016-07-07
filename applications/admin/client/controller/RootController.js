core.createController('RootController', function ($scope, Session) {
    $scope.Profile = {};
    

    Session.getData({}, function (data) {
        if (data.status == "OK") {
            $scope.Profile = data.message;
            core.Profile=JSON.parse(JSON.stringify(data.message));
        }
    });


    $scope.checkPageSwitch = function () {
        return true;
    };

    $scope.PageConfig = {
        _title: "",
        _page: "",
        _checkHash: function () {
            var hash = window.location.hash.replace("#/", "");
            if (hash) {
                var contxt = hash.split("_").join(" ");
                this._switch(contxt);
            } else {
                this._switch("Dashboard");
            }
        },
        _switch: function (toPage) {
            if ($scope.checkPageSwitch()) {
                if (this[toPage]) {
                    window.location.hash = toPage.split(" ").join("_");
                    this._page = this[toPage].path;
                    this._title = toPage;
                    jQuery(".menu_section").find(".active").removeClass("active");
                    jQuery("[menu='" + toPage + "']").addClass("active");
                } else {
                    this._switch("Dashboard");
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
        "Data Manager": {
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

});
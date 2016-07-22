core.createController('UserGroupController', function ($scope) {
    jQuery(".small_view").height(window.innerHeight * 0.8).css("overflow", "auto");
    jQuery(".large_view").height(window.innerHeight * 0.8).css("overflow", "hidden");
    jQuery("#profileScrillView").height(window.innerHeight * 0.67).css("overflow", "auto");
    

    $scope.UserGroup = [
        {
            "group_name": "admin",
            "access_admin": true,
            "access_user": true,
            "access_setting": true,
            "access_meta": true,
            "access_billing": true,
            "users": [
                {
                    "first_name": "Santanu",
                    "last_name": "Sahu",
                    "email": "sanmeranam@gmail.com",
                    "secret": "1234",
                    "contact": "+91-7676074975",
                    "inbox": []
                },
                {
                    "first_name": "Jyosna",
                    "last_name": "Rani",
                    "email": "jyosna.sahoo2009@gmail.com",
                    "secret": "1234",
                    "contact": "+91-8951576391",
                    "inbox": []
                }
            ]
        }
    ];

    $scope.onSelectUserGroup = function (userGroup) {
        $scope.CurrentUserGroup = userGroup;
    };

    $scope.currentPage = "/_self/templates/users/group_users.html";
    $scope.profileSelected = function (view) {
        $scope.currentPage = view;
    };
});
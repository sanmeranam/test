core.createController('UserGroupController', function ($scope, Users, GlobalConfig, Message, GCUpdate) {
    jQuery(".small_view").height(window.innerHeight * 0.8).css("overflow-y", "auto");
    jQuery(".small_view2").height(window.innerHeight * 0.75).css("overflow-x", "hidden").css("overflow-y", "auto");
    jQuery(".small_view3").height(window.innerHeight * 0.735).css("overflow-x", "hidden").css("overflow-y", "auto");
    jQuery(".large_view").height(window.innerHeight * 0.8).css("overflow", "hidden");
    jQuery("#profileScrillView").height(window.innerHeight * 0.67).css("overflow", "auto");

    $scope.hashManager = {
        getCurrentUser: function () {
            var ps = core.getHashParams();
            if (ps.length) {
                return ps[0];
            }
            return null;
        },
        init: function () {
            var ps = core.getHashParams();
            if (ps.length) {

            }
        },
        setParams: function (sId) {
            if (sId) {
                window.location.hash = "Users::" + sId;
            } else {
                window.location.hash = "Users";
            }
        }
    };
    $scope.hashManager.init();

    $scope.UserGroup = {};
    $scope.SelectedGroup = null;
    $scope.onSelectGroup = function (gp) {
        $scope.SelectedGroup = gp;
    };
    $scope.onCreateGroup = function () {
        $scope.NewGroup = {key: "user_group", value: ""};
    };

    $scope.onSaveNewGroup = function () {
        if ($scope.NewGroup) {
            GCUpdate.create({}, $scope.NewGroup, function () {
                $scope.NewGroup = null;
                $scope.loadUserGroups();
            });
        }
    };

    $scope.loadUserGroups = function () {
        GlobalConfig.load({context: "user_group"}, function (aData) {
            var od = {};
            aData.map(function (v) {
                od[v._id] = v;
            });
            $scope.UserGroup = od;
        });
    };
    $scope.loadUserGroups();

    $scope.Users = [];
    $scope.SelectedUser = null;
    $scope.onSelectUser = function (user) {
        user.secret2 = user.secret;
        $scope.SelectedUser = user;
        $scope.SelectedUserCopy = angular.copy(user);

        $scope.hashManager.setParams(user._id);
    };
    $scope.onCreateUser = function () {
        $scope.NewUser = {
            first_name: "<first name>",
            last_name: "<last name>",
            profile: core.defaultImage(),
            email: "example@gmail.com",
            secret: "",
            secret2: "",
            admin: false
        };
    };

    $scope._checkDuplicate = function (email) {
        var res = $scope.Users.filter(function (v) {
            return v.email === email;
        });
        return res.length > 0;
    };


    $scope.onSaveUser = function () {
        if ($scope.NewUser) {
            if ($scope._checkDuplicate($scope.NewUser.email)) {
                $scope.NewUser.error = "This email is already used for an existing user.";
                return;
            }

            if ($scope.NewUser.first_name
                    && $scope.NewUser.first_name
                    && $scope.NewUser.email
                    && /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/.test($scope.NewUser.email)
                    && $scope.NewUser.secret
                    && $scope.NewUser.secret === $scope.NewUser.secret2) {
                delete($scope.NewUser.error);
                delete($scope.NewUser.secret2);

                Users.create({}, $scope.NewUser, function () {
                    $scope.loadUsers();
                    $scope.NewUser = null;
                });
            } else {
                $scope.NewUser.error = "Invalid details. Please check & confirm.";
            }
        }
    };

    $scope.onDeleteUser = function () {
        if ($scope.SelectedUser) {
            Users.delete({id: $scope.SelectedUser._id}, function () {
                $scope.SelectedUser = null;
                $scope.loadUsers();
            });
        }
    };

    $scope.onUpdateUserDetails = function () {
        if ($scope.SelectedUser) {
            if ($scope.SelectedUser.first_name
                    && $scope.SelectedUser.first_name
                    && $scope.SelectedUser.email
                    && /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/.test($scope.SelectedUser.email)
                    && $scope.SelectedUser.secret
                    && $scope.SelectedUser.secret === $scope.SelectedUser.secret2) {
                delete($scope.SelectedUser.edit);
                delete($scope.SelectedUser.error);
                delete($scope.SelectedUser.delete);
                delete($scope.SelectedUser.secret2);
                Users.save({id: $scope.SelectedUser._id}, $scope.SelectedUser, function () {
                    $scope.SelectedUserCopy = angular.copy($scope.SelectedUser);
                    $scope.SelectedUserCopy.saved = true;
                });
            } else {
                $scope.SelectedUser.error = "Invalid details. Please check & confirm.";
            }
        }
    };

    $scope.onCancelSelectUser = function () {
        if ($scope.SelectedUser && $scope.SelectedUserCopy) {
            if (!$scope.SelectedUserCopy.saved) {
                for (var m in $scope.SelectedUser) {
                    $scope.SelectedUser[m] = $scope.SelectedUserCopy[m];
                }
            }
            $scope.SelectedUserCopy = null;

        }
        $scope.hashManager.setParams();
        $scope.SelectedUser = null;
    };

    $scope.loadUsers = function () {
        $scope._loadingUsers = true;
        Users.getAll({}, function (aData) {
            $scope.Users = aData;
            $scope._loadingUsers = false;

            var sel = $scope.hashManager.getCurrentUser();
            if (sel) {
                for (var i = 0; i < aData.length; i++) {
                    if (aData[i]._id == sel) {
                        $scope.onSelectUser(aData[i]);
                        break;
                    }
                }
            }

        });
    };
    $scope.loadUsers();

    $scope.filterUser = function (text) {
        var filter = {first_name: text};
        if ($scope.SelectedGroup) {
            filter["group"] = $scope.SelectedGroup._id;
        }
        return filter;
    };


    $scope.clearProfileImage = function () {
        if ($scope.SelectedUser) {
            $scope.SelectedUser.profile = core.defaultImage();
        }
    };

    $scope.clearProfileImageNew = function () {
        if ($scope.NewUser) {
            $scope.NewUser.profile = core.defaultImage();
        }
    };


    $scope.onFileImageChange = function (file) {
        if (file.files && file.files[0]) {
            var FR = new FileReader();
            FR.onload = function (e) {
                var image = new Image();
                var canvas = document.createElement('canvas');
                var ctx = canvas.getContext('2d');

                image.onload = function () {
                    var min = Math.min(image.width, image.height);
                    canvas.height = min;
                    canvas.width = min;
                    ctx.drawImage(image, 0, 0, min, min, 0, 0, min, min);
                    $scope.SelectedUser.profile = canvas.toDataURL();
                    $scope.$apply();
                };
                image.src = e.target.result;
            };
            FR.readAsDataURL(file.files[0]);
        }
    };

    $scope.onFileImageChangeNew = function (file) {
        if (file.files && file.files[0]) {
            var FR = new FileReader();
            FR.onload = function (e) {
                var image = new Image();
                var canvas = document.createElement('canvas');
                var ctx = canvas.getContext('2d');

                image.onload = function () {
                    var min = Math.min(image.width, image.height);
                    canvas.height = min;
                    canvas.width = min;
                    ctx.drawImage(image, 0, 0, min, min, 0, 0, min, min);
                    $scope.NewUser.profile = canvas.toDataURL();
                    $scope.$apply();
                };
                image.src = e.target.result;
            };
            FR.readAsDataURL(file.files[0]);
        }
    };
});
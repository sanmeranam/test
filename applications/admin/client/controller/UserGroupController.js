core.createController('UserGroupController', function ($scope, Users, GlobalConfig, Message, GCUpdate) {
    jQuery(".small_view").height(window.innerHeight * 0.8).css("overflow-y", "auto");
    jQuery(".small_view2").height(window.innerHeight * 0.75).css("overflow-x", "hidden").css("overflow-y", "auto");
    jQuery(".small_view3").height(window.innerHeight * 0.735).css("overflow-x", "hidden").css("overflow-y", "auto");
    jQuery(".large_view").height(window.innerHeight * 0.8).css("overflow", "hidden");
    jQuery("#profileScrillView").height(window.innerHeight * 0.67).css("overflow", "auto");

    $scope.hashManager = {
        init: function () {
            var ps = core.getHashParams();
            for (var i = 0; i < ps.length; i++) {
                this["p" + i] = ps[i];
            }
        },
        setParams: function () {
            if (arguments && arguments.length) {
                var mh = "Users:";
                for (var i = 0; i < arguments.length; i++) {
                    mh = mh + ":" + arguments[i];
                }
                window.location.hash = mh;
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
            return v.email == email;
        });
        return res.length > 0;
    };


    $scope.onSaveUser = function () {
        if ($scope.NewUser) {
            if($scope._checkDuplicate($scope.NewUser.email)){
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
        if($scope.SelectedUser){
            Users.delete({id:$scope.SelectedUser._id},function(){
               $scope.SelectedUser=null; 
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
        $scope.SelectedUser = null;
    };

    $scope.loadUsers = function () {
        $scope._loadingUsers=true;
        Users.getAll({}, function (aData) {
            $scope.Users = aData;
            $scope._loadingUsers=false;
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




//    $scope.CurrentUserProfile = null;
//    $scope.CurrentUserGroup = null;
//    $scope.CurrentUserProfileTrack = {
//        center: {
//            latitude: 12.9375312,
//            longitude: 77.7006514
//        },
//        zoom: 8,
//        control: {}
//    };
//
//    $scope.onSelectUserGroup = function (userGroup) {
//        $scope.newGroup = null;
//        $scope.CurrentUserGroup = userGroup;
//    };
//
//    $scope.onEditUserGroup = function () {
//        if ($scope.CurrentUserGroup) {
//            $scope.CurrentUserGroup_back = angular.copy($scope.CurrentUserGroup);
//            $scope.CurrentUserGroup_Edit = $scope.CurrentUserGroup;
//        }
//    };
//
//    $scope.onEditGroupCancel = function () {
//
//        $scope.CurrentUserGroup.group_name = $scope.CurrentUserGroup_back.group_name;
//        $scope.CurrentUserGroup.access_admin = $scope.CurrentUserGroup_back.access_admin;
//        $scope.CurrentUserGroup.access_meta = $scope.CurrentUserGroup_back.access_meta;
//        $scope.CurrentUserGroup.access_setting = $scope.CurrentUserGroup_back.access_setting;
//        $scope.CurrentUserGroup.access_billing = $scope.CurrentUserGroup_back.access_billing;
//        $scope.CurrentUserGroup.access_user = $scope.CurrentUserGroup_back.access_user;
//        $scope.CurrentUserGroup_Edit = null;
//        $scope.CurrentUserGroup_back = null;
//    };
//
//    $scope.onSelectUserProfile = function (user) {
//        $scope.newUser = null;
//        $scope.CurrentUserProfile = user;
//    };
//    $scope.onDeleteGroup = function () {
//        if ($scope.CurrentUserGroup) {
//            var index = -1;
//            for (var i = 0; i < $scope.UserGroup.length; i++) {
//                if ($scope.UserGroup[i].id === $scope.CurrentUserGroup.id) {
//                    index = i;
//                    break;
//                }
//            }
//            Message.confirm("Are your sure want to delete this user group?", function (v) {
//                if (v) {
//                    $scope.UserGroup.splice(index, 1);
//                    $scope.CurrentUserGroup = null;
//                    UserGroup.save({}, $scope.UserGroup);
//                }
//            });
//        }
//    };
//    $scope.onCreateGroup = function () {
//        $scope.CurrentUserGroup = null;
//        $scope.CurrentUserProfile = null;
//        $scope.newUser = null;
//
//        $scope.newGroup = {
//            "id": Math.floor(Math.random() * 9999999999),
//            "group_name": "",
//            "access_admin": false,
//            "access_user": false,
//            "access_setting": false,
//            "access_meta": false,
//            "access_billing": false,
//            "users": []
//        };
//    };
//    $scope.onSaveGroup = function (isOld) {
//        if ($scope.newGroup && jQuery.trim($scope.newGroup.group_name)) {
//            $scope.UserGroup.push($scope.newGroup);
//            $scope.newGroup = null;
//            $scope._loadingGroups = true;
//            UserGroup.save({}, $scope.UserGroup, function () {
//                $scope._loadingGroups = false;
//            });
//        }
//        if (isOld && jQuery.trim($scope.CurrentUserGroup_Edit.group_name)) {
//            $scope._loadingGroups = true;
//            UserGroup.save({}, $scope.UserGroup, function () {
//                $scope._loadingGroups = false;
//            });
//            $scope.CurrentUserGroup_Edit = null;
//            $scope.CurrentUserGroup_back = null;
//        }
//    };
//    $scope.onDeleteProfile = function () {
//        if ($scope.CurrentUserProfile) {
//            var index = -1;
//            for (var i = 0; i < $scope.CurrentUserGroup.users.length; i++) {
//                if ($scope.CurrentUserGroup.users[i].id === $scope.CurrentUserProfile.id) {
//                    index = i;
//                    break;
//                }
//            }
//            Message.confirm("Are your sure want to delete this user profile?", function (v) {
//                if (v) {
//                    $scope.CurrentUserGroup.users.splice(index, 1);
//                    $scope.CurrentUserProfile = null;
//                    UserGroup.save({}, $scope.UserGroup);
//                }
//            });
//        }
//    };
//    $scope.onCreateProfile = function () {
//        $scope.CurrentUserProfile = null;
//        $scope.newGroup = null;
//
//        $scope.newUser = {
//            "id": Math.floor(Math.random() * 9999999999),
//            "first_name": "",
//            "last_name": "",
//            "email": "",
//            "secret": "",
//            "contact": "",
//            "inbox": []
//        };
//    };
//    $scope.onSaveProfile = function () {
//        $scope.newUser.error = "";
//
//        if (!/^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/.test($scope.newUser.email)) {
//            $scope.newUser.error = "Enter valid email.";
//            return;
//        }
//        if (jQuery.trim($scope.newUser.secret) !== jQuery.trim($scope.newUser.secret2)) {
//            $scope.newUser.error = "Enter valid password and re-password.";
//            return;
//        }
//        if (jQuery.trim($scope.newUser.first_name)
//                && jQuery.trim($scope.newUser.last_name)
//                && jQuery.trim($scope.newUser.email)
//                && jQuery.trim($scope.newUser.secret)
//                && jQuery.trim($scope.newUser.secret2)
//                && jQuery.trim($scope.newUser.contact)) {
//            delete($scope.newUser.secret2);
//            delete($scope.newUser.error);
//            $scope.CurrentUserGroup.users.push($scope.newUser);
//            $scope.newUser = null;
//            UserGroup.save({}, $scope.UserGroup);
//        } else {
//            $scope.newUser.error = "Enter correct data and press create.";
//        }
//    };
//
//
//    $scope.drawActiityReport = function () {
//        Morris.Bar({
//            element: 'graph_bar',
//            data: [
//                {"period": "Jan", "Hours worked": 80},
//                {"period": "Feb", "Hours worked": 125},
//                {"period": "Mar", "Hours worked": 176},
//                {"period": "Apr", "Hours worked": 224},
//                {"period": "May", "Hours worked": 265},
//                {"period": "Jun", "Hours worked": 314},
//                {"period": "Jul", "Hours worked": 347},
//                {"period": "Aug", "Hours worked": 287},
//                {"period": "Sep", "Hours worked": 240},
//                {"period": "Oct", "Hours worked": 211}
//            ],
//            xkey: 'period',
//            hideHover: 'auto',
//            barColors: ['#26B99A', '#34495E', '#ACADAC', '#3498DB'],
//            ykeys: ['Hours worked', 'sorned'],
//            labels: ['Hours worked', 'SORN'],
//            xLabelAngle: 60,
//            resize: true
//        });
//    };
//    $scope.drawActiityReport();
//
//    $scope.$watch('CurrentUserProfile', function () {
//        if ($scope.CurrentUserProfile && $scope.CurrentUserGroup) {
//            $scope.hashManager.setParams($scope.CurrentUserGroup.id, $scope.CurrentUserProfile.id);
//        } else if ($scope.CurrentUserGroup) {
//            $scope.hashManager.setParams($scope.CurrentUserGroup.id);
//        } else {
//            $scope.hashManager.setParams();
//        }
//    });
//
//    $scope.$watch('CurrentUserGroup', function () {
//        if ($scope.CurrentUserGroup) {
//            $scope.hashManager.setParams($scope.CurrentUserGroup.id);
//        }
//        if ($scope.CurrentUserProfile && $scope.CurrentUserGroup) {
//            $scope.hashManager.setParams($scope.CurrentUserGroup.id, $scope.CurrentUserProfile.id);
//        }
//    });
//
//    var cb = function (start, end, label) {
//        console.log(start.toISOString(), end.toISOString(), label);
//        $('#reportrange span').html(start.format('MMMM D, YYYY') + ' - ' + end.format('MMMM D, YYYY'));
//        //alert("Callback has fired: [" + start.format('MMMM D, YYYY') + " to " + end.format('MMMM D, YYYY') + ", label = " + label + "]");
//    };
//
//    var optionSet1 = {
//        startDate: moment().subtract(29, 'days'),
//        endDate: moment(),
//        minDate: '01/01/2012',
//        maxDate: '12/31/2018',
//        dateLimit: {
//            days: 60
//        },
//        showDropdowns: true,
//        showWeekNumbers: true,
//        timePicker: false,
//        timePickerIncrement: 1,
//        timePicker12Hour: true,
//        ranges: {
//            'Today': [moment(), moment()],
//            'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
//            'Last 7 Days': [moment().subtract(6, 'days'), moment()],
//            'Last 30 Days': [moment().subtract(29, 'days'), moment()],
//            'This Month': [moment().startOf('month'), moment().endOf('month')],
//            'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
//        },
//        opens: 'left',
//        buttonClasses: ['btn btn-default'],
//        applyClass: 'btn-small btn-primary',
//        cancelClass: 'btn-small',
//        format: 'MM/DD/YYYY',
//        separator: ' to ',
//        locale: {
//            applyLabel: 'Submit',
//            cancelLabel: 'Clear',
//            fromLabel: 'From',
//            toLabel: 'To',
//            customRangeLabel: 'Custom',
//            daysOfWeek: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'],
//            monthNames: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
//            firstDay: 1
//        }
//    };
//    $('#reportrange span').html(moment().subtract(29, 'days').format('MMMM D, YYYY') + ' - ' + moment().format('MMMM D, YYYY'));
//    $('#reportrange').daterangepicker(optionSet1, cb);

});
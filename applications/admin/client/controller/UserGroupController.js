core.createController('UserGroupController', function ($scope, UserGroup, Message) {
    jQuery(".small_view").height(window.innerHeight * 0.8).css("overflow", "auto");
    jQuery(".small_view2").height(window.innerHeight * 0.75).css("overflow", "auto");
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


    $scope.UserGroup = [];

    UserGroup.get({}, function (data) {
        $scope.UserGroup = data;
        $scope.hashManager.init();
        if ($scope.hashManager.p0) {
            var selUG = $scope.UserGroup.filter(function (v) {
                return v.id == $scope.hashManager.p0;
            });
            if (selUG.length) {
                $scope.CurrentUserGroup = selUG[0];
                if ($scope.hashManager.p1) {
                    var usr = selUG[0].users.filter(function (v) {
                        return v.id == $scope.hashManager.p1;
                    });
                    if (usr.length) {
                        $scope.CurrentUserProfile = usr[0];
                    } else {
                        $scope.hashManager.setParams($scope.hashManager.p0);
                    }
                }
            } else {
                $scope.hashManager.setParams();
            }
        }
    });

    $scope.CurrentUserProfile = null;
    $scope.CurrentUserGroup = null;
    $scope.CurrentUserProfileTrack = {
        center: {
            latitude: 12.9375312,
            longitude: 77.7006514
        },
        zoom: 8,
        control: {}
    };

    $scope.onSelectUserGroup = function (userGroup) {
        $scope.newGroup = null;
        $scope.CurrentUserGroup = userGroup;
    };
    $scope.onSelectUserProfile = function (user) {
        $scope.newUser = null;
        $scope.CurrentUserProfile = user;
    };
    $scope.onDeleteGroup = function () {
        if ($scope.CurrentUserGroup) {
            var index = -1;
            for (var i = 0; i < $scope.UserGroup.length; i++) {
                if ($scope.UserGroup[i].id === $scope.CurrentUserGroup.id) {
                    index = i;
                    break;
                }
            }
            Message.confirm("Are your sure want to delete this user group?", function (v) {
                if (v) {
                    $scope.UserGroup.splice(index, 1);
                    $scope.CurrentUserGroup = null;
                    UserGroup.save({}, $scope.UserGroup);
                }
            });
        }
    };
    $scope.onCreateGroup = function () {
        $scope.CurrentUserGroup = null;
        $scope.CurrentUserProfile = null;
        $scope.newUser = null;

        $scope.newGroup = {
            "id": Math.floor(Math.random() * 9999999999),
            "group_name": "",
            "access_admin": false,
            "access_user": false,
            "access_setting": false,
            "access_meta": false,
            "access_billing": false,
            "users": []
        };
    };
    $scope.onSaveGroup = function () {
        if (jQuery.trim($scope.newGroup.group_name)) {
            $scope.UserGroup.push($scope.newGroup);
            $scope.newGroup = null;
            UserGroup.save({}, $scope.UserGroup);
        }
    };
    $scope.onDeleteProfile = function () {
        if ($scope.CurrentUserProfile) {
            var index = -1;
            for (var i = 0; i < $scope.CurrentUserGroup.users.length; i++) {
                if ($scope.CurrentUserGroup.users[i].id === $scope.CurrentUserProfile.id) {
                    index = i;
                    break;
                }
            }
            Message.confirm("Are your sure want to delete this user profile?", function (v) {
                if (v) {
                    $scope.CurrentUserGroup.users.splice(index, 1);
                    $scope.CurrentUserProfile = null;
                    UserGroup.save({}, $scope.UserGroup);
                }
            });
        }
    };
    $scope.onCreateProfile = function () {
        $scope.CurrentUserProfile = null;
        $scope.newGroup = null;

        $scope.newUser = {
            "id": Math.floor(Math.random() * 9999999999),
            "first_name": "",
            "last_name": "",
            "email": "",
            "secret": "",
            "contact": "",
            "inbox": []
        };
    };
    $scope.onSaveProfile = function () {
        $scope.newUser.error = "";

        if (!/^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/.test($scope.newUser.email)) {
            $scope.newUser.error = "Enter valid email.";
            return;
        }
        if (jQuery.trim($scope.newUser.secret) !== jQuery.trim($scope.newUser.secret2)) {
            $scope.newUser.error = "Enter valid password and re-password.";
            return;
        }
        if (jQuery.trim($scope.newUser.first_name)
                && jQuery.trim($scope.newUser.last_name)
                && jQuery.trim($scope.newUser.email)
                && jQuery.trim($scope.newUser.secret)
                && jQuery.trim($scope.newUser.secret2)
                && jQuery.trim($scope.newUser.contact)) {
            delete($scope.newUser.secret2);
            delete($scope.newUser.error);
            $scope.CurrentUserGroup.users.push($scope.newUser);
            $scope.newUser = null;
            UserGroup.save({}, $scope.UserGroup);
        } else {
            $scope.newUser.error = "Enter correct data and press create.";
        }
    };


    $scope.drawActiityReport = function () {
        Morris.Bar({
            element: 'graph_bar',
            data: [
                {"period": "Jan", "Hours worked": 80},
                {"period": "Feb", "Hours worked": 125},
                {"period": "Mar", "Hours worked": 176},
                {"period": "Apr", "Hours worked": 224},
                {"period": "May", "Hours worked": 265},
                {"period": "Jun", "Hours worked": 314},
                {"period": "Jul", "Hours worked": 347},
                {"period": "Aug", "Hours worked": 287},
                {"period": "Sep", "Hours worked": 240},
                {"period": "Oct", "Hours worked": 211}
            ],
            xkey: 'period',
            hideHover: 'auto',
            barColors: ['#26B99A', '#34495E', '#ACADAC', '#3498DB'],
            ykeys: ['Hours worked', 'sorned'],
            labels: ['Hours worked', 'SORN'],
            xLabelAngle: 60,
            resize: true
        });
    };
    $scope.drawActiityReport();

    $scope.$watch('CurrentUserProfile', function () {
        if ($scope.CurrentUserProfile && $scope.CurrentUserGroup) {
            $scope.hashManager.setParams($scope.CurrentUserGroup.id, $scope.CurrentUserProfile.id);
        }
    });

    $scope.$watch('CurrentUserGroup', function () {
        if ($scope.CurrentUserGroup) {
            $scope.hashManager.setParams($scope.CurrentUserGroup.id);
        }
        if ($scope.CurrentUserProfile && $scope.CurrentUserGroup) {
            $scope.hashManager.setParams($scope.CurrentUserGroup.id, $scope.CurrentUserProfile.id);
        }
    });

    var cb = function (start, end, label) {
        console.log(start.toISOString(), end.toISOString(), label);
        $('#reportrange span').html(start.format('MMMM D, YYYY') + ' - ' + end.format('MMMM D, YYYY'));
        //alert("Callback has fired: [" + start.format('MMMM D, YYYY') + " to " + end.format('MMMM D, YYYY') + ", label = " + label + "]");
    };

    var optionSet1 = {
        startDate: moment().subtract(29, 'days'),
        endDate: moment(),
        minDate: '01/01/2012',
        maxDate: '12/31/2018',
        dateLimit: {
            days: 60
        },
        showDropdowns: true,
        showWeekNumbers: true,
        timePicker: false,
        timePickerIncrement: 1,
        timePicker12Hour: true,
        ranges: {
            'Today': [moment(), moment()],
            'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
            'Last 7 Days': [moment().subtract(6, 'days'), moment()],
            'Last 30 Days': [moment().subtract(29, 'days'), moment()],
            'This Month': [moment().startOf('month'), moment().endOf('month')],
            'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
        },
        opens: 'left',
        buttonClasses: ['btn btn-default'],
        applyClass: 'btn-small btn-primary',
        cancelClass: 'btn-small',
        format: 'MM/DD/YYYY',
        separator: ' to ',
        locale: {
            applyLabel: 'Submit',
            cancelLabel: 'Clear',
            fromLabel: 'From',
            toLabel: 'To',
            customRangeLabel: 'Custom',
            daysOfWeek: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'],
            monthNames: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
            firstDay: 1
        }
    };
    $('#reportrange span').html(moment().subtract(29, 'days').format('MMMM D, YYYY') + ' - ' + moment().format('MMMM D, YYYY'));
    $('#reportrange').daterangepicker(optionSet1, cb);
});
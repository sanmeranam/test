core.createController('MessageingController', function ($scope, CloudMessage, GlobalVar,UserList) {
    $scope.UserList = {};


    $scope.updateId = function () {
        $scope.meId = core && core.Profile && core.Profile._id ? core.Profile._id : '';
    };
    $scope.updateId();

    $scope.ActiveSessions = {};
    
    UserList.load(function(result){
        for (var i = 0; i < result.length; i++) {
            var u = result[i];
            $scope.UserList[u.value] = u;

            $scope.ActiveSessions[u.value] = {
                name: u.name,
                message: []
            };
        }
        GlobalVar.get({context: '$message'}, function (res) {
            for (var i = 0; i < res.length; i++) {
                var ur = res[i];

                if ($scope.ActiveSessions[ur.from]) {
                    $scope.ActiveSessions[ur.from].message.push({
                        type: "IN",
                        text: ur.message,
                        time: ur.time
                    });
                    $scope.meId=$scope.meId||ur.to;
                }

                if ($scope.ActiveSessions[ur.to]) {
                    $scope.ActiveSessions[ur.to].message.push({
                        type: "OUT",
                        text: ur.message,
                        time: ur.time
                    });
                    $scope.meId=$scope.meId||ur.from;
                }
            }
        });
    });

//    GlobalVar.get({context: '$users'}, function (result) {
//        for (var i = 0; i < result.length; i++) {
//            var u = result[i];
//            $scope.UserList[u.value] = u;
//
//            $scope.ActiveSessions[u.value] = {
//                name: u.name,
//                message: []
//            };
//        }
//        GlobalVar.get({context: '$message'}, function (res) {
//            for (var i = 0; i < res.length; i++) {
//                var ur = res[i];
//
//                if ($scope.ActiveSessions[ur.from]) {
//                    $scope.ActiveSessions[ur.from].message.push({
//                        type: "IN",
//                        text: ur.message,
//                        time: ur.time
//                    });
//                    $scope.meId=$scope.meId||ur.to;
//                }
//
//                if ($scope.ActiveSessions[ur.to]) {
//                    $scope.ActiveSessions[ur.to].message.push({
//                        type: "OUT",
//                        text: ur.message,
//                        time: ur.time
//                    });
//                    $scope.meId=$scope.meId||ur.from;
//                }
//            }
//        });
//    });






    $scope.onChatClose = function (id) {
        $scope.ActiveSessions[id].show = false;
    };

    $scope.startChart = function (id) {
        if (!$scope.ActiveSessions[id]) {
            $scope.ActiveSessions[id] = {
                show: true,
                name: $scope.UserList[id].name,
                message: []
            };
        } else {
            $scope.ActiveSessions[id].show = true;
        }
    };

    $scope.onTextKeyPress = function (event, from) {
        if (event.which === 13) {
            $scope.sendMessage(from);
        }
    };

    $scope.sendMessage = function (from) {
        $scope.updateId();
        var text = jQuery("#" + from + "_text").val();
        jQuery("#" + from + "_text").val('');

        $scope.ActiveSessions[from].message.push({
            type: "OUT",
            text: text,
            time: Date.now()
        });

        setTimeout(function () {
            var objDiv = document.getElementById(from + "_content");
            objDiv.scrollTop = objDiv.scrollHeight;
        }, 100);

        var toServer = {
            FROM: core.Profile._id,
            TO: from,
            TYPE: "SINGLE_MESSAGE",
            MESSAGE: text
        };

        jQuery.post("/service/message/single", toServer, function () {

        });

    };

    $scope.playAlert = function () {
        var a = new Audio("/_static/alert.mp3");
        a.volume = 0.5;
        a.play();
    };

    CloudMessage.onmessage(function (data) {
        var from = data.from;
        $scope.updateId();

        if (!$scope.ActiveSessions[from]) {

            var user = $scope.UserList[from];

            $scope.ActiveSessions[from] = {
                show: true,
                name: user.name,
                message: []
            };
            $scope.playAlert();
        }
        $scope.ActiveSessions[from].message.push({
            type: "IN",
            text: data.message,
            time: Date.now()
        });
        
        setTimeout(function () {
            var objDiv = document.getElementById(from + "_content");
            objDiv.scrollTop = objDiv.scrollHeight;
        }, 100);
        
        $scope.$apply();
    });

});
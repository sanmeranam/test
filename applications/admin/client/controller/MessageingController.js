core.createController('MessageingController', function ($scope, CloudMessage, GlobalVar) {
    $scope.UserList = {};
    $scope.me = core.Profile;
    
    
    GlobalVar.get({context: '$users'}, function (result) {
        for (var i = 0; i < result.length; i++) {
            var u = result[i];
            $scope.UserList[u.value] = u;
        }
    });


    $scope.ActiveSessions = {};
    
    $scope.onChatClose=function(id){
        delete($scope.ActiveSessions[id]);
    };

    $scope.onTextKeyPress = function (event, from) {
        if (event.which == 13) {
            $scope.sendMessage(from);
        }
    };

    $scope.sendMessage = function (from) {
        var text = jQuery("#" + from + "_text").val();
        jQuery("#" + from + "_text").val('');

        $scope.ActiveSessions[from].message.push({
            type: "OUT",
            text: text,
            time: Date.now()
        });


        var toServer = {
            FROM: core.Profile._id,
            TO: from,
            TYPE: "SINGLE_MESSAGE",
            MESSAGE: text
        };

        jQuery.post("/service/message/single", toServer, function () {
            
        });

    };

    CloudMessage.onmessage(function (data) {
        var from = data.from;

        if (!$scope.ActiveSessions[from]) {

            var user = $scope.UserList[from];

            $scope.ActiveSessions[from] = {
                name: user.name,
                message: []
            };
        }
        $scope.ActiveSessions[from].message.push({
            type: "IN",
            text: data.message,
            time: Date.now()
        });
        
        $scope.$apply();
    });

});
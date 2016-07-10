core.createController('FormRecordsController', function ($scope, uiGmapIsReady) {
    jQuery("#recordsViewContainer").height(window.innerHeight * 0.68).css("overflow", "auto");
    $scope.DivTimeLineStyle = {
        height: (window.innerHeight * 0.6) + "px",
        overflow: "auto"
    };

//    $scope.map = {
//        center: {
//            latitude: 37.7749295,
//            longitude: -122.4194155
//        },
//        zoom: 14,
//        control: {}
//    };
//
//    uiGmapIsReady.promise().then(function (map_instances) {
//
//    });

    $scope.currentPage = "/_self/templates/forms/records_table_view.html";
    $scope.switchView = function (view) {
        $scope.currentPage = view;
    };
});

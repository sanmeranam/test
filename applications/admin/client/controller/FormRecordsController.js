core.createController('FormRecordsController', function ($scope, uiGmapIsReady) {
    jQuery("#recordsViewContainer").height(window.innerHeight * 0.68).css("overflow", "auto");
    $scope.DivTimeLineStyle = {
        height: (window.innerHeight * 0.6) + "px",
        overflow: "auto"
    };

    $scope.map = {center: {latitude: 45, longitude: -73}, zoom: 8};
    $scope.control = {};
    $scope.loaded=true;

    $scope.currentPage = "/_self/templates/forms/records_table_view.html";
    $scope.switchView = function (view) {
        $scope.currentPage = view;        
    };
});

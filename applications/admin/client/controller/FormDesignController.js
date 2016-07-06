core.createController('FormDesignController', function ($scope, FormMeta) {
    jQuery("#designerPane").height(window.innerHeight * 0.78).css("overflow", "auto");
    jQuery(".accorContent").height(window.innerHeight * 0.58).css("overflow", "auto");
    jQuery(".accorContent2").height(window.innerHeight * 0.7).css("overflow", "auto");


    $scope.Palette = [];
    $scope.oModelDesigned = [
        {
            "_i": "fa-crop",
            "_n": "TextInput",
            "_a": {
                "id": "1",
                "value": "",
                "label": "",
                "type": ["Text", "Number", "Email", "Telephone"]
            },
            "_c": []
        }
    ];
    


    jQuery.getJSON("/service/control_schema", function (oSchemaData) {
        $scope.Palette = oSchemaData;
    });



    $scope.models = {
        selected: null
    };

    $scope.$watch('models.dropzones', function (model) {
        $scope.modelAsJson = angular.toJson(model, true);
    }, true);
});

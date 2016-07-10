core.createController('FormDesignController', function ($scope, FormMeta) {
    jQuery("#designerPane").height(window.innerHeight * 0.78).css("overflow", "auto");
    jQuery(".accorContent").height(window.innerHeight * 0.58).css("overflow", "auto");
    jQuery(".accorContent2").height(window.innerHeight * 0.7).css("overflow", "auto");

    $scope.models = {
        selected: null
    };
    $scope.Palette = [];
    $scope.oModelDesigned = [
        
    ];
    
    jQuery.getJSON("/service/control_schema", function (oSchemaData) {
        $scope.Palette = oSchemaData;
    });

    $scope.dragoverCallback = function () {
        debugger
    };
    $scope.generateId = function (item) {
//        item._d = item._d.replace("{1}", Math.round(Math.random() * 9999));
    };

    $scope.formatText = function (sText) {
        sText = sText.replace(/_/g, ' ');
        var aText = sText.split(" ");
        aText = aText.map(function (v) {
            return v.replace(/(?:^\w|[A-Z]|\b\w)/g, function (letter, index) {
                return letter.toUpperCase();
            }).replace(/\s+/g, ' ').replace(/_/g, ' ');
        });
        return aText.join(" ");
    };



    $scope.$watch('oModelDesigned', function (model) {
//        $scope.modelAsJson = angular.toJson(model, true);
//        console.log(model);
    }, true);




    $scope.$watch('models.selected', function (model) {
        setTimeout(function () {
            $(".js-switch").bootstrapSwitch({
                size: "small"
            });
        }, 100);
    }, true);
});

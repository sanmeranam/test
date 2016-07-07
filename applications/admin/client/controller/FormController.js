core.createController('FormController', function ($scope, FormMeta) {
    $scope.currentPage = "/_self/templates/forms/form_details.html";
    $scope.switchTabs = function (sPage) {
        $scope.currentPage = sPage;
    };

    $scope.FormMetaList = [];

    FormMeta.getAll({}, function (data) {
        $scope.FormMetaList = data;
        $scope.SelectedFormMeta=data && data.length?data[0]:null;
    });

    
    $scope.onSelectForm=function(item){        
        jQuery("#form_tabs").find(".active").removeClass("active");
        jQuery("#form_tabs li:first").addClass("active");
        $scope.currentPage = "/_self/templates/forms/form_details.html";
        $scope.SelectedFormMeta=item;
    };
    
    jQuery('.toggle-checkbox').bootstrapSwitch({
        size: "small"
    });
});

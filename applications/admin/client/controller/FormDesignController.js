core.createController('FormDesignController', function ($scope, FormMeta) {
        jQuery("#designerPane").height(window.innerHeight*0.78).css("overflow","auto");
        jQuery(".accorContent").height(window.innerHeight*0.58).css("overflow","auto");
        jQuery(".accorContent2").height(window.innerHeight*0.7).css("overflow","auto");
});

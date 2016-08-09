core.createController('DataManageController', function ($scope, DataFactory, DataFactoryMeta) {
    DataFactoryMeta.get({}, function (meta) {
        DataFactory.getField({field:'_ref',val:meta[0]._id},function(data){
           debugger 
        });
    });
});
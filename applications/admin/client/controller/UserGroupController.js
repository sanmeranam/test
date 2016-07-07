core.createController('UserGroupController', function ($scope) {
    $scope.UserGroup=[
        {
          title:"AAAAA"  
        },
        {
          title:"BBBBB"  
        },
        {
            title:"CCCCC"
        }
    ];
    
    $scope.currentPage = "/_self/templates/users/group_users.html";
    $scope.profileSelected = function (view) {
        $scope.currentPage = view;        
    };
});
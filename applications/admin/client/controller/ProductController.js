core.createController('ProductController', function ($scope, Products, Message) {
    jQuery(".small_view").height(window.innerHeight * 0.78).css("overflow-y", "auto").css("overflow-x", "hidden");

    $scope.ProductList = [];
    $scope.NewProduct = null;
    $scope.ProductTempEdit = "/_self/templates/prod_temp/edit_product.html";
    $scope.ProductTempView = "/_self/templates/prod_temp/display_product.html";
    $scope.DefaultImage = "/_self/img/box.png";
    
    $scope.TabNav = {
        isShow:function(){
            return Object.keys(this.tabs).length>0;
        },
        tabs: {},
        selected: null,
        addTab: function (item) {
            this.tabs[item._id] = item;
            this.selected = item;
        },
        remove: function (sId) {
            if (typeof (sId) === "string") {
                delete(this.tabs[sId]);
            } else {
                $scope.NewProduct = null;
            }
            var kk=Object.keys(this.tabs);
            if(kk.length)
            this.selected = this.tabs[kk[0]];
        }
    };

    $scope.loadProducts = function (item) {
        Products.getAll({}, function (list) {
            $scope.ProductList = list;
            if (item) {
                $scope.TabNav.addTab(item);
            }
        });
    };

    $scope.loadProducts();

    $scope.deleteProduct = function () {
        if ($scope.TabNav.selected) {
            Message.confirm("Are you sure want delete product \"" + $scope.TabNav.selected.name + "\" ?", function (v) {

            });
        }

    };

    $scope.cloneProduct = function () {
        if ($scope.TabNav.selected) {
            var oSoruce = angular.copy($scope.TabNav.selected);
            oSoruce._id = "_temp_id";
            $scope.createNewProduct(oSoruce);
            Message.alert("Create cloned product.");
        }
    };

    $scope.createNewProduct = function (newProd) {
        if ($scope.NewProduct) {
            return;
        }
        $scope.NewProduct = newProd || {
            "_id": "_temp_id",
            "name": "Sample Product",
            "code": "",
            "images": [],
            "description": "",
            "stock": 1,
            "price": 0.0,
            "discount": 0
        };
        $scope.TabNav.addTab($scope.NewProduct);
    };

    $scope.saveNewProduct = function () {
        var bValid = true;
        for (var i in $scope.NewProduct) {
            var itm = $scope.NewProduct[i];
            if (typeof (itm) === "string" && !itm) {
                bValid = false;
                break;
            }
        }
        var temId = $scope.NewProduct._id;
        delete($scope.NewProduct._id);
        if (bValid) {
            Products.create($scope.NewProduct, function (result) {
                $scope.TabNav.remove(temId);
                $scope.loadProducts(result);
            });
        } else {
            Message.alert("All fields need to be filled.");
        }
    };

    $scope._fileUploading = false;
    $scope.onFileImageChange = function (file) {
        if (file.files && file.files[0]) {
            $scope._fileUploading = true;
            var url = "/service/file/upload";

            var formData = new FormData();
            formData.append('image', file.files[0]);


            $.ajax(url, {
                method: 'post',
                processData: false,
                contentType: false,
                data: formData
            }).done(function (data) {
                $scope.NewProduct.images.push(data[0]);
                $scope._fileUploading = false;
                $scope.$apply();
                file.files.length = 0;
            }).fail(function (data) {
                Message.alert("Image upload failed.");
                file.files.length = 0;
                $scope._fileUploading = false;
                $scope.$apply();
            });
        }
    };
});
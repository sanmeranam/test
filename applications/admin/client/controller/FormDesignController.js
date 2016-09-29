core.createController('FormDesignController', function ($scope, FormMeta, Message) {
    jQuery("#designerPane").height(window.innerHeight * 0.78).css("overflow", "auto");
    jQuery(".accorContent").height(window.innerHeight * 0.5).css("overflow", "auto");
    jQuery(".accorContent2").height(window.innerHeight * 0.7).css("overflow", "auto");

    $scope.EditDisabled = true;

    $scope.checkVisibleProp = function (item) {
        if (item.visible) {
            return $scope.$eval("DesignerConfig.selected._a." + item.visible);
        }
        return true;
    };

    $scope.keyPressed = function (e) {
        switch (e.which) {
            case 46://delete
                $scope.DesignerConfig.evtRemove();
                break;
        }
    };



    $scope.DesignerConfig = {
        selected: null,
        model: null,
        CurrentPage: null,
        pallets: [],
        parent_map: {},
        init: function () {
            jQuery.getJSON("/service/control_schema", function (oSchemaData) {
                $scope.DesignerConfig.pallets = oSchemaData;
            });
        },
        _getRandomNumber: function (num) {
            return Math.round(Math.random() * num);
        },
        addPage: function () {
            var keys = this.getPageIndies();
            var newKey = 1;
            if (keys.length)
                newKey = parseInt(keys[keys.length - 1]) + 1;

            this.model[newKey] = {_l: false, _c: [], _s: 0};
        },
        getPageIndies: function () {
            return Object.keys(this.model);
        },
        removePage: function (index) {
            delete(this.model[index]);
            var keys = this.getPageIndies();
            this.CurrentPage = this.model[keys[0]];
        },
        showPageManager: function () {
            jQuery("#modalPageManager").modal("show");
        },
        getSectionClass: function (base) {
            if (base.theme) {
                switch (base.theme.value) {
                    case "GRAY":
                        return "box-default";
                    case "GRAY-SOLID":
                        return "box-default box-solid";
                    case "GREEN":
                        return "box-success";
                    case "GREEN-SOLID":
                        return "box-solid box-success";
                    case "BLUE":
                        return "box-info";
                    case "BLUE-SOLID":
                        return "box-solid box-info";
                    case "ORANGE":
                        return "box-warning";
                    case "ORANGE-SOLID":
                        return "box-solid box-warning";
                    case "RED":
                        return "box-danger";
                    case "RED-SOLID":
                        return "box-solid box-danger";
                    default:
                        return "";
                }
            }
        },
        getRateCal: function (max, val) {
            var m = [];
            m.length = max;
            m.fill(1);
            var u = Math.floor(val);
            m.fill(0, u);
            if ((Math.round(val) > Math.floor(val))) {
                m.fill(2, u);
                m.fill(0, u + 1);
            }
            return m;
        },
        itemSelected: function (item, parent) {
            if (parent && parent._l) {
                this.selected = null;
            } else {
                this.selected = item;
            }
            this.evtSelectionChange();
        },
        evtDropCallback: function (event, index, item, external, type) {
            item._d = item._d.replace("{1}", this._getRandomNumber(99999));
            return item;
        },
        imageSelect: function (file) {
            var inz = jQuery(file).attr("mind");

            if (file.files && file.files[0]) {
                var FR = new FileReader();
                FR.onload = function (e) {
                    var image = new Image();
                    var canvas = document.createElement('canvas');
                    var ctx = canvas.getContext('2d');

                    image.onload = function () {
                        var min = Math.min(image.width, image.height);
                        canvas.height = min;
                        canvas.width = min;
                        ctx.drawImage(image, 0, 0, min, min, 0, 0, min, min);
                        
                        $scope.DesignerConfig.selected._a[inz].value=canvas.toDataURL();
                        $scope.$apply();
                    };
                    image.src = e.target.result;
                };
                FR.readAsDataURL(file.files[0]);
            }
        },
        evtClone: function () {
            var oClone = angular.copy(this.selected);
            var oParent = null;
            var iIndex = -1;

            this.visitModel(this.model, function (item, parent, index) {
                if (item._d == oClone._d) {
                    oParent = parent;
                    iIndex = index;
                    return false;
                }
                return true;
            });

            oClone._d = oClone._d + this._getRandomNumber(9);

            if (oClone._n === "section")
                this.visitModel(oClone, function (item, parent, index) {
                    item._d = item._d + $scope.DesignerConfig._getRandomNumber(9);
                    return true;
                });

            oParent._c.splice(iIndex + 1, 0, oClone);
        },
        evtLock: function () {
            if (this.selected && this.selected._l) {
                delete(this.selected._l);
            } else {
                this.selected._l = true;
            }
        },
        evtRemove: function () {
            if (!this.selected)
                return;

            var selItem = this.selected;

            var oParent, iIndex;

            this.visitModel(this.model, function (item, parent, index) {
                if (item._d === selItem._d) {
                    oParent = parent;
                    iIndex = index;
                    return false;
                }
                return true;
            });
            oParent._c.splice(iIndex, 1);
            this.selected = null;
        },
        evtSelectionChange: function () {

        },
        evtModelChange: function () {

        },
        visitModel: function (oBase, callback) {
            if (oBase && !oBase._c) {
                var aKeys = Object.keys(oBase);
                for (var i = 0; i < aKeys.length; i++) {
                    var v = aKeys[i];
                    this.visitModel(oBase[v], callback);
                }
                return;
            }
            var len = oBase._c.length;
            for (var i = 0; i < len; i++) {
                var item = oBase._c[i];
                var res = callback(item, oBase, i);
                if (!res) {
                    break;
                }
                if (item._c && item._c.length) {
                    this.visitModel(item, callback);
                }
            }
        },
        clsSelection: function (item) {
            if (item == this.selected) {
                return (item._l ? 'selected_red' : 'selected');
            }
            return '';
        },
        clsSectionLayout: function (oBase, oItem) {
            if (oItem && oItem._a.space && oItem._a.space.value === "Full") {
                return "col-sm-12";
            }
            return "col-sm-" + (12 / oBase._a.columns.value);
        },
        formatText: function (sText) {
            sText = sText.replace(/_/g, ' ');
            var aText = sText.split(" ");
            aText = aText.map(function (v) {
                return v.replace(/(?:^\w|[A-Z]|\b\w)/g, function (letter, index) {
                    return letter.toUpperCase();
                }).replace(/\s+/g, ' ').replace(/_/g, ' ');
            });
            return aText.join(" ");
        }
    };

    $scope.DesignerConfig.init();

    if ($scope.$parent.SelectedFormMeta) {
        var data = $scope.$parent.SelectedFormMeta;
        if (data.model_view) {
            $scope.DesignerConfig.CurrentPage = (data.model_view[Object.keys(data.model_view)[0]]);
            $scope.DesignerConfig.model = data.model_view;
        }
    }
    $scope.$on('FormItemSelected', function (event, data) {
        if (data.model_view) {
            $scope.DesignerConfig.CurrentPage = (data.model_view[Object.keys(data.model_view)[0]]);
            $scope.DesignerConfig.model = data.model_view;
        }
    });




    $scope.$watch('DesignerConfig.model', function (model) {
        $scope.DesignerConfig.evtModelChange(model);
    }, true);

    $scope.oOptionsEditor = {
        backup: [],
        target: null,
        eleModal: $("#modalOptionsEditor"),
        insertItem: function (index, value) {
            if (index === -1) {
                this.target.value.push("");
            } else {
                this.target.value.splice(index + 1, 0, value);
            }
        },
        removeItem: function (index) {
            this.target.value.splice(index, 1);
        },
        showEditor: function (trg) {
            this.target = trg;
            this.backup = angular.copy(trg.value);
            this.eleModal.modal("show");
        },
        dialoag_ok: function () {
            this.eleModal.modal("hide");
        },
        dialoag_cancel: function () {
            this.target.value = this.backup;
            this.eleModal.modal("hide");
        }
    };

    $scope.oRichEditorConfig = {
        target: null,
        backup: "",
        eleEditor: $("#editor"),
        eleModal: $('#modalHTMLContentEditor'),
        setTarget: function (trg) {
            this.target = trg;
            this.backup = trg.value;
            this.eleEditor.html(trg.value);
        },
        reset: function () {
            this.backup = "";
            this.target = null;
        },
        dialoag_ok: function () {
            this.target.value = this.eleEditor.html();
            this.eleModal.modal('hide');
        },
        dialoag_cancel: function () {
            this.target.value = this.backup;
            this.eleModal.modal('hide');
        },
        showEditor: function (oItem) {
            this.reset();
            this.setTarget(oItem);
            this.eleModal.modal('show');
            this.init();
        },
        init: function () {
            var fonts = ['Serif', 'Sans', 'Arial', 'Arial Black', 'Courier',
                'Courier New', 'Comic Sans MS', 'Helvetica', 'Impact', 'Lucida Grande', 'Lucida Sans', 'Tahoma', 'Times',
                'Times New Roman', 'Verdana'
            ];
            var fontTarget = $('[title=Font]').siblings('.dropdown-menu');
            $.each(fonts, function (idx, fontName) {
                fontTarget.append($('<li><a data-edit="fontName ' + fontName + '" style="font-family:\'' + fontName + '\'">' + fontName + '</a></li>'));
            });
            $('a[title]').tooltip({
                container: 'body'
            });
            $('.dropdown-menu input').click(function () {
                return false;
            }).change(function () {
                $(this).parent('.dropdown-menu').siblings('.dropdown-toggle').dropdown('toggle');
            }).keydown('esc', function () {
                this.value = '';
                $(this).change();
            });

            $('[data-role=magic-overlay]').each(function () {
                var overlay = $(this);
                var target = $(overlay.data('target'));
                overlay.css('opacity', 0).css('position', 'absolute').offset(target.offset()).width(target.outerWidth()).height(target.outerHeight());
            });

            if ("onwebkitspeechchange" in document.createElement("input")) {
                var editorOffset = $('#editor').offset();

                $('.voiceBtn').css('position', 'absolute').offset({
                    top: editorOffset.top,
                    left: editorOffset.left + $('#' + editorId).innerWidth() - 35
                });
            } else {
                $('.voiceBtn').hide();
            }

            this.eleEditor.wysiwyg({
                fileUploadError: function (reason, detail) {
                    var msg = '';
                    if (reason === 'unsupported-file-type') {
                        msg = "Unsupported format " + detail;
                    } else {
                        console.log("error uploading file", reason, detail);
                    }
                    $('<div class="alert"> <button type="button" class="close" data-dismiss="alert">&times;</button>' +
                            '<strong>File upload error</strong> ' + msg + ' </div>').prependTo('#alerts');
                }
            });
        }

    };
});

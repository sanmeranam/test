core.createController('TemplateController', function ($scope, GlobalVar, TemplateFactory, Message,$q, $timeout) {
    $scope.templates = {
        "sms": "/_self/templates/outemp/sms_template.html",
        "excel": "/_self/templates/outemp/excel_template.html",
        "notify": "/_self/templates/outemp/notif_template.html",
        "pdf": "/_self/templates/outemp/pdf_template.html",
        "email": "/_self/templates/outemp/email_template.html"
    };

    $scope.openPage = "";
    $scope.createObject = null;

    $scope.open = function (page) {
        $scope.openPage = $scope.templates[page];
        switch (page) {
            case 'sms':
                $scope.createObject = $scope.createSMSModel();
                break;
            case 'excel':
                $scope.createObject = $scope.createEXCELModel();
                break;
            case 'notify':
                $scope.createObject = $scope.createNOTIFModel();
                break;
            case 'pdf':
                $scope.createObject = $scope.createPDFModel();
                break;
            case 'email':
                $scope.createObject = $scope.createEmailModel();
                break;

        }
    };

    $scope.createSMSModel = function () {
        return {
            name: "",
            type: "SMS",
            form_id: "",
            to: "",
            body: ""
        };
    };
    $scope.createEmailModel = function () {
        return {
            name: "",
            type: "EMAIL",
            form_id: "",
            to: "",
            subject: "",
            body: ""
        };
    };
    $scope.createNOTIFModel = function () {
        return {
            name: "",
            type: "NOTIFY",
            form_id: "",            
            body: ""
        };
    };
    $scope.createPDFModel = function () {
        return {
            name: "",
            type: "PDF",
            form_id: "",
            body: {}
        };
    };
    $scope.createEXCELModel = function () {
        return {
            name: "",
            type: "EXCEL",
            form_id: "",
            body: {}
        };
    };


    $scope.closeWindow = function () {
        $scope.openPage = null;
        $scope.createObject = null;
    };

    $scope.editTempalte = function (object) {
        for (var m in $scope.formMeta) {
            if ($scope.formMeta[m].value === object.form_id) {
                $scope.currentForm = $scope.formMeta[m];
                break;
            }
        }

        $scope.openPage = $scope.templates[object.type.toLowerCase()];
        $scope.createObject = object;

    };


    $scope.formMeta = [];
    GlobalVar.get({context: "$forms"}, function (res) {
        $scope.formMeta = res;
    });

    $scope.validateObject = function () {
        if ($scope.createObject) {
            var isValid = true;

            $scope.createObject.form_id = jQuery("#currentFormId").val();
            for (var m in $scope.createObject) {
                if (!$scope.createObject[m]) {
                    isValid = false;
                    break;
                }
            }

            if (!isValid) {
                return false;
            }
        }
        return true;
    };


    $scope.updateObject = function () {
        $scope.error_message = "";
        if ($scope.validateObject()) {
            TemplateFactory.save({id: $scope.createObject._id}, $scope.createObject, function () {
                $scope.loadTemplates();
                Message.alert("Template updated successfully.");
            });

            $scope.openPage = "";
            $scope.createObject = null;
        } else {
            $scope.error_message = "Some field are blank or target form not selected.";
        }
    };

    $scope.saveObject = function () {
        $scope.error_message = "";
        if ($scope.validateObject()) {
            TemplateFactory.create($scope.createObject, function () {
                $scope.loadTemplates();
                Message.alert("Template created successfully.");
            });

            $scope.openPage = "";
            $scope.createObject = null;
        } else {
            $scope.error_message = "Some field are blank or target form not selected.";
        }
    };


    $scope.onDropMove = function (event) {
        event.preventDefault();
    };
    $scope.onElementDrop = function (ev, source) {
        ev.preventDefault();
        var data = ev.dataTransfer.getData("text");
        jQuery(source).val(jQuery(source).val() + " " + data);
        angular.element($(source)).triggerHandler('input');
    };


    $scope.onElementDrag = function (ev, source) {
        var id = jQuery(source).attr("sid");
        var label = jQuery(source).attr("sname");
        
        label=label.toLowerCase().replace(/\s+/,'_');
        
        ev.dataTransfer.setData("text", "["+ label + "]");
    };

    $scope.currentForm = null;
    $scope.selectForm = function (frm) {
        $scope.currentForm = frm;
    };


    $scope.aTemplateList = [];
    $scope.loadTemplates = function () {
        TemplateFactory.getAll({}, function (data) {
            $scope.aTemplateList = data;
        });
    };

    $scope.removeTemplate = function (sId) {
        Message.confirm("Arr you sure want delete this template?", function (v) {
            if (v) {
                TemplateFactory.delete({id: sId}, function () {
                    $scope.loadTemplates();
                    Message.alert("Templete deleted successfully.");
                });
            }
        });
    };


    $scope.loadTemplates();

    $scope.api = {
        scope: $scope,
        editorConfig: {
            sanitize: false,
            toolbar: [
                {name: 'basicStyling', items: ['bold', 'italic', 'underline', 'strikethrough', 'subscript', 'superscript', '-', 'leftAlign', 'centerAlign', 'rightAlign', 'blockJustify', '-']},
                {name: 'paragraph', items: ['orderedList', 'unorderedList', 'outdent', 'indent', '-']},
                {name: 'doers', items: ['removeFormatting', 'undo', 'redo', '-']},
                {name: 'colors', items: ['fontColor', 'backgroundColor', '-']},
                {name: 'links', items: ['image', 'hr', 'symbols', 'link', 'unlink', '-']},
                {name: 'tools', items: ['print', '-']},
                {name: 'styling', items: ['font', 'size', 'format']}
            ]
        },
        insertImage: function() {
            var deferred = $q.defer();
            $timeout(function() {
                var val = prompt('Enter image url', 'http://');
                if(val) {
                    deferred.resolve('<img src="' + val + '" style="width: 30%;">');
                }
                else {
                    deferred.reject(null);
                }
            }, 1000);
            return deferred.promise;
        }
    };
});
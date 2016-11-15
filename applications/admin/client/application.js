window.core = {
    Profile: null,
    init: function () {
        this.ngApp = angular.module('ngAdmin', ['ngResource', 'uiGmapgoogle-maps', "dndLists", "ngSanitize", "ngWYSIWYG", 'chart.js', 'ngTable', 'ui_render_preview']);
        this.ngApp.config(
                ['uiGmapGoogleMapApiProvider', function (GoogleMapApiProviders) {
                        GoogleMapApiProviders.configure({
                            v: '3.17',
                            key: "AIzaSyDYSJ8fbbC-_NcpUKAUlp_bF9qdCWZjk8Y",
                            china: true
                        });
                    }]);

        this.ngApp.config(
                ['ChartJsProvider', function (ChartJsProvider) {
                        ChartJsProvider.setOptions({colors: ['#803690', '#00ADF9', '#DCDCDC', '#46BFBD', '#FDB45C', '#949FB1', '#4D5360']});
                    }]);
        this._initRestful();
        this._defineDirective();

        window.paceOptions = {
            document: true, // disabled
            eventLag: true,
            restartOnPushState: true,
            restartOnRequestAfter: true,
            ajax: {
                trackMethods: ['POST', 'GET', 'PUT']
            }

        };
        $(document).ajaxStart(function () {
            Pace.restart();
        });



    },
    setHash: function (base, p1, p2) {
        var hash = window.location.hash = base + "::" + p1 + (p2 ? ":" + p2 : "");

    },
    getHashParams: function () {
        var hash = window.location.hash.replace("#/", "");
        if (hash.indexOf("::") > -1) {
            hash = hash.substr(hash.indexOf("::") + 2, hash.length);
            return hash.split(":");
        }
        return [];
    },
    _initRestful: function () {

        this.ngApp.service('CloudMessage', function () {
            var res = {
                es: new EventSource("/heartbeat"),
                onmessagecb: function () {},
                onmessage: function (cb) {
                    this.onmessagecb = cb;
                },
                incoming: function (event) {
                    var data = JSON.parse(event.data);

                    if (data.event === "SYS_EVENT") {
                        switch (data.action) {
                            case "CONNECTED":
                                break;
                            case "FORM_META_UPDATE":
                                break;
                            case "BASE_SETTING_UPDATE":
                                break;
                            case "FORM_DATA_UPDATE":
                                break;
                        }

                    } else if (data.event === "USER_EVENT") {
                        switch (data.action) {
                            case "USER_MESSAGE":
                                res.onmessagecb(data);
                                break;
                            case "USER_LIST":
                                break;
                        }
                    } else if (data.event === "FEEDS_TOPIC") {

                    }
                }
            };
            res.es.onmessage = res.incoming;
            return res;
        });

        this.ngApp.service('CurrentFormMeta', function () {
            var currentForm = null;

            var setFormMeta = function (newObj) {
                currentForm = newObj;
            };

            var getFormMeta = function () {
                return currentForm;
            };

            return {
                setFormMeta: setFormMeta,
                getFormMeta: getFormMeta
            };

        });

        this.ngApp.factory('Message', function () {
            var obj = {
                alertcb: null,
                confirmcb: null,
                loadingcb: null,
                alert: function (text) {
                    if (this.alertcb) {
                        this.alertcb(text);
                    }
                },
                confirm: function (text, fnResult) {
                    if (this.confirmcb) {
                        this.confirmcb(text, fnResult);
                    }
                },
                loading: function (b) {
                    if (this.loadingcb) {
                        this.loadingcb(b);
                    }
                }
            };
            return obj;
        });

        this.ngApp.factory('Util', function () {
            return {
                formatText: function (sText) {
                    sText = sText.replace(/_/g, ' ');
                    var aText = sText.split(" ");
                    aText = aText.map(function (v) {
                        return v.replace(/(?:^\w|[A-Z]|\b\w)/g, function (letter, index) {
                            return letter.toUpperCase();
                        }).replace(/\s+/g, ' ').replace(/_/g, ' ');
                    });
                    return aText.join(" ");
                },
                isArray: function (item) {
                    return jQuery.isArray(item);
                }
            };
        });


        this.ngApp.factory('Session', function ($resource) {
            var data = $resource('/session/data', {service: '@service'}, {
                getData: {
                    method: 'GET'
                }
            });
            return data;
        });

        this.ngApp.factory('FormMeta', function ($resource) {
            var data = $resource('/rest/FormMeta/:id', {id: '@id'}, {
                'get': {method: 'GET', id: '@id'},
                'save': {method: 'POST', id: '@id'},
                'delete': {method: 'DELETE', id: '@id'},
                'getAll': {method: 'GET', isArray: true},
                'create': {method: 'PUT'}
            });
            return data;
        });
        this.ngApp.factory('FormData', function ($resource) {
            var data = $resource('/rest/FormData/:id', {id: '@id'}, {
                'get': {method: 'GET', id: '@id'},
                'save': {method: 'POST', id: '@id'},
                'getAll': {method: 'GET', isArray: true},
                'create': {method: 'PUT'}
            });
            return data;
        });

        this.ngApp.factory('DataFactory', function ($resource) {
            var data = $resource('/rest/DataFactory/:id/:field/:val', {id: '@id'}, {
                'get': {method: 'GET', id: '@id'},
                'getField': {method: 'GET', field: '@field', val: '@val', isArray: true},
                'save': {method: 'POST', id: '@id'},
                'getAll': {method: 'GET', isArray: true},
                'create': {method: 'PUT'}
            });
            return data;
        });

        this.ngApp.factory('Products', function ($resource) {
            var data = $resource('/rest/Products/:id', {}, {
                'get': {method: 'GET', id: '@id', isArray: true},
                'save': {method: 'POST', id: '@id'},
                'getAll': {method: 'GET', isArray: true},
                'create': {method: 'PUT'},
                'delete': {method: 'DELETE', id: '@id'},
            });
            return data;
        });

        this.ngApp.factory('Users', function ($resource) {
            var data = $resource('/rest/Accounts/:id', {}, {
                'get': {method: 'GET', id: '@id'},
                'save': {method: 'POST', id: '@id'},
                'getAll': {method: 'GET', isArray: true},
                'create': {method: 'PUT'},
                'delete': {method: 'DELETE', id: '@id'}
            });
            return data;
        });

        this.ngApp.factory('FlowFactory', function ($resource) {
            var data = $resource('/rest/FlowFactory/:id', {}, {
                'get': {method: 'GET', id: '@id'},
                'save': {method: 'POST', id: '@id'},
                'getAll': {method: 'GET', isArray: true},
                'create': {method: 'PUT'},
                'delete': {method: 'DELETE', id: '@id'}
            });
            return data;
        });

        this.ngApp.factory('TemplateFactory', function ($resource) {
            var data = $resource('/rest/TemplateFactory/:id', {}, {
                'get': {method: 'GET', id: '@id'},
                'save': {method: 'POST', id: '@id'},
                'getAll': {method: 'GET', isArray: true},
                'create': {method: 'PUT'},
                'delete': {method: 'DELETE', id: '@id'}
            });
            return data;
        });

        this.ngApp.factory('GCUpdate', function ($resource) {
            var data = $resource('/rest/GlobalConfig/:id', {}, {
                'get': {method: 'GET', id: '@id'},
                'save': {method: 'POST', id: '@id'},
                'getAll': {method: 'GET', isArray: true},
                'create': {method: 'PUT'},
                'delete': {method: 'DELETE', id: '@id'},
            });
            return data;
        });


        this.ngApp.factory('GlobalConfig', function ($resource) {
            var data = $resource('/service/global/:context', {context: '@context'}, {
                'load': {method: 'GET', context: '@context', isArray: true}
            });
            return data;
        });

        this.ngApp.factory('GlobalVar', function ($resource) {
            var data = $resource('/service/var/:account/:context', {context: '@context', account: '@account'}, {
                'get': {method: 'GET', context: '@context', isArray: true}
            });
            return data;
        });

        this.ngApp.service('UserList', function (GlobalVar) {
            var resource = {
                cb: [],
                init: function () {
                    if (!this._list)
                        GlobalVar.get({context: "$users"}, function (list) {

                            resource._list = list;
                            for (var i in resource.cb) {
                                resource.cb[i](list);
                            }
                            resource.cb.length = 0;
                        });
                },
                load: function (ncb) {
                    if (this._list) {
                        ncb(this._list);
                    } else {
                        resource.cb.push(ncb);
                        resource.init();
                    }
                }
            };

            return resource;
        });
    },
    mapInit: function () {

    },
    jqInit: function () {
        jQuery('.toggle-checkbox').bootstrapSwitch({
            size: "small"
        });
    },
    createController: function (sName, fnMethod) {
        this.ngApp.controller(sName, fnMethod);
    },
    _defineDirective: function () {
        this.ngApp.directive('shortcut', function () {
            return {
                restrict: 'E',
                replace: true,
                scope: true,
                link: function postLink(scope, iElement, iAttrs) {
                    jQuery(document).on('keyup', function (e) {
                        scope.$apply(scope.keyPressed(e));
                    });
                }
            };
        });

        this.ngApp.directive("knob", function () {
            return {
                restrict: "C",
                scope: {
                    val: '='
                },
                link: function (scope, element, attrs) {
                    $(element[0]).val(scope.val).knob();
                }
            };
        });

        this.ngApp.directive("contenteditable", function () {
            return {
                restrict: "A",
                require: "ngModel",
                link: function (scope, element, attrs, ngModel) {

                    function read() {
                        ngModel.$setViewValue(element.html());
                    }

                    ngModel.$render = function () {
                        element.html(ngModel.$viewValue || "");
                    };

                    element.bind("blur keyup change", function () {
                        scope.$apply(read);
                    });
                }
            };
        });

        this.ngApp.directive('flowpallet', function () {
            return {
                restrict: 'E',
                replace: true,
                scope: {
                    node: '='
                },
                template: "<svg height='150' width='200' style='background:rgba(255, 0, 0, 0);'></svg>",
                link: function postLink(scope, iElement, iAttrs) {
                    var paper = Snap(iElement[0]);
                    var b = new Block(10, 10, paper, scope.node);
                }
            };
        });

        this.ngApp.directive('barcode', function () {
            return {
                restrict: 'E',
                replace: true,
                scope: {
                    format: '=',
                    color: '=',
                    width: '=',
                    height: '=',
                    display: '=',
                    value: '='
                },
                template: "<canvas></canvas>",
                link: function postLink(scope, iElement, iAttrs) {
                    var sId='ids_'+Math.round(Math.random()*9999);
                    iElement[0].id=sId;
                    JsBarcode(iElement[0], scope.value+"", {
                        format: scope.format,
                        lineColor: scope.color,
                        width: scope.width || 2,
                        height: scope.height || 50,
                        displayValue: scope.display
                    });
                }
            };
        });


    },
    defaultImage: function () {
        return "data:image/png;base64,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";
    }
};
window.core.init();
jQuery.ready(window.core.jqInit);
window.appMapLoaded = core.mapInit;
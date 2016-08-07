window.core = {
    Profile: null,
    init: function () {
        this.ngApp = angular.module('ngAdmin', ['ngResource', 'uiGmapgoogle-maps', "dndLists", "ngSanitize"]);
        this.ngApp.config(
                ['uiGmapGoogleMapApiProvider', function (GoogleMapApiProviders) {
                        GoogleMapApiProviders.configure({
                            v: '3.17',
                            key: "AIzaSyDYSJ8fbbC-_NcpUKAUlp_bF9qdCWZjk8Y",
                            china: true
                        });
                    }]);
        this._initRestful();
        this._defineDirective();

        window.paceOptions = {
            document: true, // disabled
            eventLag: true,
            restartOnPushState: true,
            restartOnRequestAfter: true,
            ajax: {
                trackMethods: ['POST', 'GET','PUT']
            }

        };
        $(document).ajaxStart(function() { Pace.restart(); }); 
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
        this.ngApp.factory('Message', function () {
            var obj = {
                alertcb: null,
                confirmcb: null,
                alert: function (text) {
                    if (this.alertcb) {
                        this.alertcb(text);
                    }
                },
                confirm: function (text, fnResult) {
                    if (this.confirmcb) {
                        this.confirmcb(text, fnResult);
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
            var data = $resource('/service/formmeta/:id', {id: '@id'}, {
                'get': {method: 'GET', id: '@id'},
                'save': {method: 'POST', id: '@id'},
                'delete': {method: 'DELETE', id: '@id'},
                'getAll': {method: 'GET', isArray: true},
                'create': {method: 'PUT'}
            });
            return data;
        });
        this.ngApp.factory('FormData', function ($resource) {
            var data = $resource('/service/formdata/:id', {id: '@id'}, {
                'get': {method: 'GET', id: '@id'},
                'save': {method: 'POST', id: '@id'},
                'getAll': {method: 'GET', isArray: true},
                'create': {method: 'PUT'}
            });
            return data;
        });

        this.ngApp.factory('UserGroup', function ($resource) {
            var data = $resource('/service/usergroup', {}, {
                'get': {method: 'GET', isArray: true},
                'save': {method: 'POST'}
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

    }
};
window.core.init();
jQuery.ready(window.core.jqInit);
window.appMapLoaded = core.mapInit;
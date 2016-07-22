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
    },
    getHashParams: function () {
        var hash = window.location.hash.replace("#/", "");
        if (hash.indexOf("::") > -1) {
            hash = hash.substr(hash.indexOf("::")+2, hash.length);
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
                'getAll': {method: 'GET', isArray: true},
                'create': {method: 'PUT'}
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
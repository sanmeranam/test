window.core = {
    Profile: null,
    init: function () {
        this.ngApp = angular.module('ngAdmin', ['ngResource', 'uiGmapgoogle-maps']);
        this.ngApp.config(
                ['uiGmapGoogleMapApiProvider', function (GoogleMapApiProviders) {
                        GoogleMapApiProviders.configure({
                            v: '3.17',
                            china: true
                        });
                    }]);
        this._initRestful();
    },
    _initRestful: function () {
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
                'save': {method: 'POST'},
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
    }
};
window.core.init();
jQuery.ready(window.core.jqInit);
window.appMapLoaded = core.mapInit;
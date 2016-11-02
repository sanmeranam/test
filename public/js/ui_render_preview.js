var appUi = angular.module('ui_render_preview', []);

appUi.directive('prePage', function () {
    return {
        restrict: "E",
        replace: true,
        scope: {
            node: '='
        },
        template: "<div class='col-sm-12' ng-repeat='p in node._c' ng-switch='p._n'>" +
                "<pre:section ng-switch-when='section'  node='p'/>" +
                "<pre:heading ng-switch-when='heading'  node='p'/>" +
                "<pre:text ng-switch-when='text'  node='p'/>" +
                "<pre:image ng-switch-when='image'  node='p'/>" +
                +"</div>",
        link: function (scope, element, attrs) {

        }
    };
});

appUi.directive('preSection', function ($compile) {
    return {
        restrict: "E",
        replace: true,
        scope: {
            node: '='
        },
        template: '<div class="box" id="{{node._d}}">' +
                '   <div class="box-body">' +
                '           <p ng-if="node._a.title.value" class="card-heading" ng-bind="node._a.title.value"></p>' +
                '           <div class="row inner-pane-cont" >' +
                '           </div>' +
                '   </div>' +
                '</div>',
        link: function (scope, element, attrs) {


            if (angular.isArray(scope.node._c)) {
                for (var i in scope.node._c) {
                    var nd = scope.node._c[i];
                    var sParentClass = "col-sm-" + (12 / scope.node._a.columns.value);
                    if (nd && nd._a.space && nd._a.space.value === "Full") {
                        sParentClass = "col-sm-12";
                    }
                    jQuery(element).find(".inner-pane-cont").append("<div class='" + sParentClass + "'><pre:" + nd._n + " node='node._c[" + i + "]'></div>");
                }
                $compile(element.contents())(scope);
            }
        }
    };
});

appUi.directive('preTextInput', function () {
    return {
        restrict: "E",
        replace: true,
        scope: {
            node: '='
        },
        template: "<div class='textView'>" +
                "	<label class='label'>{{node._a.label.value}}</label>" +
                "	<span>{{node._a.value.value}}</span>" +
                "</div>"
    };
});

appUi.directive('preDatePicker', function () {
    return {
        restrict: "E",
        replace: true,
        scope: {
            node: '='
        },
        template: "<div class='textView'>" +
                "	<label class='label'>{{node._a.label.value}}</label>" +
                "	<span>{{node._a.value.value}}</span>" +
                "</div>"
    };
});

appUi.directive('preTimePicker', function () {
    return {
        restrict: "E",
        replace: true,
        scope: {
            node: '='
        },
        template: "<div class='textView'>" +
                "	<label class='label'>{{node._a.label.value}}</label>" +
                "	<span>{{node._a.value.value}}</span>" +
                "</div>"
    };
});

appUi.directive('preSwitch', function () {
    return {
        restrict: "E",
        replace: true,
        scope: {
            node: '='
        },
        template: "<div class='textView'>" +
                "	<label class='label'>{{node._a.label.value}}</label>" +
                "	<span>{{node._a.value.value==true?'YES':'NO'}}</span>" +
                "</div>"
    };
});

appUi.directive('preSingleOption', function () {
    return {
        restrict: "E",
        replace: true,
        scope: {
            node: '='
        },
        template: "<div class='textView'>" +
                "	<label class='label'>{{node._a.label.value}}</label>" +
                "	<span>{{node._a.value.value}}</span>" +
                "</div>"
    };
});

appUi.directive('preMultiOptions', function () {
    return {
        restrict: "E",
        replace: true,
        scope: {
            node: '='
        },
        template: "<div class='textView'>" +
                "	<label class='label'>{{node._a.label.value}}</label>" +
                "	<span ng-repeat='v in vals'>{{v}}</span>" +
                "</div>",
        controller: function ($scope) {
            $scope.vals = [];
            for (var i in $scope.node._a.options.value) {
                if ($scope.node._a.value.value[i]) {
                    $scope.vals.push($scope.node._a.options.value[i]);
                }
            }
        }
    };
});

appUi.directive('preDropdown', function () {
    return {
        restrict: "E",
        replace: true,
        scope: {
            node: '='
        },
        template: "<div class='textView'>" +
                "	<label class='label'>{{node._a.label.value}}</label>" +
                "	<span>{{node._a.value.value}}</span>" +
                "</div>"
    };
});

appUi.directive('preFileAttach', function () {
    return {
        restrict: "E",
        replace: true,
        scope: {
            node: '='
        },
        template: "<div class='textView'>" +
                "	<label class='label'>{{node._a.label.value}}</label>" +
                "	<span><a href='/service/file/pdf?id={{node._a.value.value}}' target='_blank'>Download</a></span>" +
                "</div>"
    };
});

appUi.directive('prePhotoAttach', function () {
    return {
        restrict: "E",
        replace: true,
        scope: {
            node: '='
        },
        template: "<div class='box box-widget'>" +
                "<div class='box-body'>" +
                "  <img class='img-responsive pad' src='/service/file/image?id={{node._a.value.value}}' alt='Photo'>" +
                "  <p>{{node._a.label.value}}</p>" +
                "</div>" +
                "</div>",
        link: function (scope, element, attrs) {

        }
    };
});

appUi.directive('preRating', function () {
    return {
        restrict: "E",
        replace: true,
        scope: {
            node: '='
        },
        template: '<div class="row" id="{{node._d}}">' +
                '	<div class="col-sm-12" style="margin-bottom: 0px">' +
                '		<label for="{{node._d}}">{{node._a.label.value}}</label>' +
                '	</div>' +
                '	<div class="col-sm-12" style="margin-bottom: 15px;font-size:30px">' +
                '		<a ng-repeat="s in stars track by $index" ><i class="fa" ng-class="(s==0?\'fa-star-o\':\'fa-star\')"></i></a>' +
                '	</div>' +
                '</div>',
        link: function (scope, element, attrs) {
        },
        controller: function ($scope) {

            $scope.stars = [];

            for (var i = 0; i < $scope.node._a.stars.value; i++) {
                $scope.stars[i] = ((i + 1) <= $scope.node._a.value.value ? 1 : 0);
            }
        }
    };
});

appUi.directive('preHeading', function () {
    return {
        restrict: "E",
        replace: true,
        scope: {
            node: '='
        },
        template: '<section><h1 class="content-sub-heading" id="{{node._d}}" ng-if="node._a.type.value==\'Style 1\'" style="text-align:{{node._a.align.value}}">{{node._a.title.value}} <small>{{node._a.sub_title.value}}</small></h1>' +
                '<h2 class="content-sub-heading" id="{{node._d}}" ng-if="node._a.type.value==\'Style 2\'" style="text-align:{{node._a.align.value}}">{{node._a.title.value}} <small>{{node._a.sub_title.value}}</small></h2>' +
                '<h3 class="content-sub-heading" id="{{node._d}}" ng-if="node._a.type.value==\'Style 3\'" style="text-align:{{node._a.align.value}}">{{node._a.title.value}} <small>{{node._a.sub_title.value}}</small></h3>' +
                '<h4 class="content-sub-heading" id="{{node._d}}" ng-if="node._a.type.value==\'Style 4\'" style="text-align:{{node._a.align.value}}">{{node._a.title.value}} <small>{{node._a.sub_title.value}}</small></h4></section>'

    };
});

appUi.directive('preLink', function () {
    return {
        restrict: "E",
        replace: true,
        scope: {
            node: '='
        },
        template: "<a href='{{node._a.link.value}}' ng-bind='node._a.label.value' ></a>",
        link: function (scope, element, attrs) {

        }
    };
});

appUi.directive('preText', function () {
    return {
        restrict: "E",
        replace: true,
        scope: {
            node: '='
        },
        template: '<div id="{{node._d}}" ng-bind-html="node._a.content.value"></div>',
        link: function (scope, element, attrs) {

        }
    };
});

appUi.directive('preImage', function () {
    return {
        restrict: "E",
        replace: true,
        scope: {
            node: '='
        },
        template: '<div class="row"><div class="col-xs-12" style="text-align:{{node._a.align.value}}"><img style="height:{{node._a.size.value}}px;width:{{node._a.size.value}}px" ng-src="{{node._a.source.value}}" ></div></div>',
        link: function (scope, element, attrs) {

        }
    };
});

appUi.directive('preRanking', function () {
    return {
        restrict: "E",
        replace: true,
        scope: {
            node: '='
        },
        template: "<div></div>",
        link: function (scope, element, attrs) {

        }
    };
});

appUi.directive('preMatrixSelection', function () {
    return {
        restrict: "E",
        replace: true,
        scope: {
            node: '='
        },
        template: "<div></div>",
        link: function (scope, element, attrs) {

        }
    };
});

appUi.directive('preAudioRecord', function () {
    return {
        restrict: "E",
        replace: true,
        scope: {
            node: '='
        },
        template: "<div class='box box-widget'>" +
                "<div class='box-body'>" +
                "  <p>{{node._a.label.value}}</p>" +
                "<audio controls='controls' ng-if='node._a.value.value'>" +
                "       <source ng-src='{{getSourceURL()}}' type='video/3gpp; codecs=\"mp4v.20.8, samr\"'/>" +
                "	Unable to play,Download <a href='{{getSourceURL()}}' target='_blank'>here</a>" +
                "</audio>" +
                "</div>" +
                "</div>",
        link: function (scope, element, attrs) {

        },
        controller: function ($scope) {
            $scope.getSourceURL = function () {
                return "/service/file/audio?id=" + $scope.node._a.value.value;
            };
        }
    };
});

appUi.directive('preVideoRecord', function () {
    return {
        restrict: "E",
        replace: true,
        scope: {
            node: '='
        },
        template: "<div class='box box-widget'>" +
                "<div class='box-body'>" +
                "  <p>{{node._a.label.value}}</p>" +
                "<video controls='controls' ng-if='node._a.value.value'>" +
                "       <source ng-src='{{getSourceURL()}}' type='audio/mp4'/>" +
                "	Unable to play,Download <a href='{{getSourceURL()}}' target='_blank'>here</a>" +
                "</video>" +
                "</div>" +
                "</div>",
        link: function (scope, element, attrs) {

        },
        controller: function ($scope) {
            $scope.getSourceURL = function () {
                return "/service/file/video?id=" + $scope.node._a.value.value;
            };
        }
    };
});

appUi.directive('preSignInput', function () {
    return {
        restrict: "E",
        replace: true,
        scope: {
            node: '='
        },
        template: "<div class='box box-widget'>" +
                "<div class='box-body'>" +
                "  <img class='img-responsive pad' src='/service/file/image?id={{node._a.value.value}}' alt='Photo'>" +
                "  <p>{{node._a.label.value}}</p>" +
                "</div>" +
                "</div>",
        link: function (scope, element, attrs) {

        }
    };
});

appUi.directive('preLocation', function () {
    return {
        restrict: "E",
        replace: true,
        scope: {
            node: '='
        },
        template: "<div class='box box-widget'>" +
                "<div class='box-body'><a href='{{getMapNavURL()}}' target='_blank'>" +
                "  <p>{{node._a.label.value}}</p>" +
                "  <img class='img-responsive pad' src='{{getMapImageURL()}}' alt='Photo'>" +
                "  <p>{{address}}</p>" +
                "</a></div>" +
                "</div>",
        link: function (scope, element, attrs) {

        },
        controller: function ($scope,$http) {

            $scope.getMapImageURL = function () {
                var addr = $scope.node._a.value.value.lat + "," + $scope.node._a.value.value.lng;
                return "https://maps.googleapis.com/maps/api/staticmap?center=" + addr + "&zoom=13&size=400x300&markers=color:red|label:C|" + addr+"&key=AIzaSyDYSJ8fbbC-_NcpUKAUlp_bF9qdCWZjk8Y"
            };

            $scope.getMapNavURL = function () {
                var addr = $scope.node._a.value.value.lat + "," + $scope.node._a.value.value.lng;
                return "http://maps.google.com/?q=" + addr;
            };
            
            if(!$scope.address){
                var addr = $scope.node._a.value.value.lat + "," + $scope.node._a.value.value.lng;
                $http.get("https://maps.googleapis.com/maps/api/geocode/json?key=AIzaSyDYSJ8fbbC-_NcpUKAUlp_bF9qdCWZjk8Y&latlng="+addr,function(res){
                    var data=res.data;
                    
                    if(data.result && data.result.length){
                        $scope.address=data.result[0].formatted_address;
                    }
                });
            }
        }
    };
});

appUi.directive('preCompass', function () {
    return {
        restrict: "E",
        replace: true,
        scope: {
            node: '='
        },
        template: "<div></div>",
        link: function (scope, element, attrs) {

        }
    };
});

appUi.directive('preBarcodeScan', function () {
    return {
        restrict: "E",
        replace: true,
        scope: {
            node: '='
        },
        template: "<div class='textView'>" +
                "	<label class='label'>{{node._a.label.value}}</label>" +
                "	<span>{{node._a.value.value}}</span>" +
                "</div>"
    };
});
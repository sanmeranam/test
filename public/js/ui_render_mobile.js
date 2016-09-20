var appUi = angular.module('ui_render_mobile', []);
appUi.directive('cPage', function () {
    return {
        restrict: "E",
        replace: true,
        scope: {
            node: '='
        },
        template: "<div class='col-sm-12'><c:section ng-repeat='p in node._c' node='p'/></div>",
        link: function (scope, element, attrs) {

        }
    };
});
appUi.directive('cSection', function ($compile) {
    return {
        restrict: "E",
        replace: true,
        scope: {
            node: '='
        },
        template: '<div class="card" id="{{node._d}}">' +
                '   <div class="card-main" id="test_id">' +
                '       <div class="card-inner">' +
                '           <p ng-if="node._a.title.value" class="card-heading" ng-bind="node._a.title.value"></p>' +
                '           <div class="row" id="{{node._d}}-body">' +
                '           </div>' +
                '       </div>' +
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
                    element.children("#" + scope.node._d + "-body")
                            .append("<div class='" + sParentClass + "'><c:" + nd._n + " node='node._c[" + i + "]'></div>");
                }
                $compile(element.contents())(scope);
            }
        }
    };
});
appUi.directive('cTextInput', function ($compile) {
    return {
        restrict: "E",
        replace: true,
        scope: {
            node: '='
        },
        template: '<div class="form-group form-group-label" id="{{node._d}}">' +
                '       <label class="floating-label" for="{{node._d}}">{{node._a.label.value}}</label>' +
                '       <input class="form-control" ng-model="node._a.value.value" id="{{node._d}}-type" ng-if="!node._a.multi_line.value" type="{{node._a.input_type.value}}">' +
                '       <textarea class="form-control textarea-autosize"  ng-model="node._a.value.value" ng-if="node._a.multi_line.value" rows="1"></textarea>' +
                '</div>',
        link: function (scope, element, attrs) {
        },
        controller: function ($scope) {
            $("[data-mask]").inputmask();
        }
    };
});
appUi.directive('cDatePicker', function () {
    return {
        restrict: "E",
        replace: true,
        scope: {
            node: '='
        },
        template: '<div class="form-group form-group-label" id="{{node._d}}">' +
                '       <label class="floating-label" for="{{node._d}}">{{node._a.label.value}}</label>' +
                '       <input class="form-control" ng-model="node._a.value.value"  type="date">' +
                '</div>',
        link: function (scope, element, attrs) {

        }
    };
});
appUi.directive('cTimePicker', function () {
    return {
        restrict: "E",
        replace: true,
        scope: {
            node: '='
        },
        template: '<div class="form-group form-group-label" id="{{node._d}}">' +
                '       <label class="floating-label" for="{{node._d}}">{{node._a.label.value}}</label>' +
                '       <input class="form-control" ng-model="node._a.value.value"  type="time">' +
                '</div>',
        link: function (scope, element, attrs) {

        }
    };
});
appUi.directive('cSwitch', function () {
    return {
        restrict: "E",
        replace: true,
        scope: {
            node: '='
        },
        template: '<div class="form-group">' +
                '       <div class="checkbox switch">' +
                '           <label for="{{node._d}}">' +
                '               <input checked="" ng-model="node._a.value.value" class="access-hide" id="{{node._d}}" name="{{node._d}}" type="checkbox"><span class="switch-toggle"></span>{{node._a.label.value}}' +
                '           </label>' +
                '       </div>' +
                '</div>',
        link: function (scope, element, attrs) {

        }
    };
});
appUi.directive('cSingleOption', function () {
    return {
        restrict: "E",
        replace: true,
        scope: {
            node: '='
        },
        template: '<div class="form-group" id="{{node._d}}">' +
                '   <div class="col-sm-12" style="margin-bottom: 0px">' +
                '       <label for="{{node._d}}">{{node._a.label.value}}</label>' +
                '   </div>' +
                '   <div class="col-sm-10" style="margin-bottom: 0px" ng-repeat="op in node._a.options.value">' +
                '       <div class="radiobtn  radiobtn-adv radiobtn-inline">' +
                '           <label for="{{node._d+\'_option\'+$index}}">' +
                '           <input class="access-hide" ng-model="node._a.value.value" name="{{node._d+\'_option\'}}" value="{{op}}" id="{{node._d+\'_option\'+$index}}" type="radio">{{op}}' +
                '           <span class="radiobtn-circle"></span><span class="radiobtn-circle-check"></span>' +
                '           </label>' +
                '       z</div>' +
                '   </div>' +
                '</div>',
        link: function (scope, element, attrs) {

        }
    };
});
appUi.directive('cMultiOptions', function () {
    return {
        restrict: "E",
        replace: true,
        scope: {
            node: '='
        },
        template: '<div class="form-group" id="{{node._d}}">' +
                '<div class="col-sm-12" style="margin-bottom: 0px">' +
                '<label for="{{node._d}}">{{node._a.label.value}}</label>' +
                '</div>' +
                '<div class="col-sm-10" style="margin-bottom: 0px" ng-repeat="op in node._a.options.value">' +
                '<div class="checkbox   checkbox-adv checkbox-inline">' +
                '<label for="{{node._d+\'_option\'+$index}}">' +
                '<input class="access-hide" name="{{node._d+\'_option\'}}" value="{{op}}" ng-model="node._a.value.value[$index]" id="{{node._d+\'_option\'+$index}}" type="checkbox">{{op}}' +
                '<span class="checkbox-circle"></span><span class="checkbox-circle-check"></span><span class="checkbox-circle-icon icon">done</span>' +
                '</label>' +
                '</div>' +
                '</div>' +
                '</div>',
        link: function (scope, element, attrs) {

        }
    };
});
appUi.directive('cDropdown', function () {
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
appUi.directive('cFileAttach', function () {
    return {
        restrict: "E",
        replace: true,
        scope: {
            node: '='
        },
        template: '<div class="card">' +
                '	<aside class="card-side pull-left" style="font-size: 20px">' +
                '		<span class="card-heading"><i class="fa fa-file-pdf-o"></i></span>' +
                '	</aside>' +
                '	<div class="card-main">' +
                '           <div class="card-heading">' +
                '               <div class="card-title" style="font-size: 80%;padding-left: 10px;">{{node._a.label.value}}</div>' +
                '           </div>' +
                '		<div class="card-inner">' +
                '			<div class="tile-wrap">' +
                '				<div class="tile" ng-click="showFile(f.file)" ng-repeat="f in node._a.value.value">' +
                '					<div class="tile-side pull-left">' +
                '						<div class="avatar avatar-sm avatar-brand">' +
                '							<span class="icon">insert_drive_file</span>' +
                '						</div>' +
                '					</div>' +
                '					<div class="tile-action tile-action-show">' +
                '						<ul class="nav nav-list margin-no pull-right">' +
                '							<li>' +
                '								<a class="text-black-sec waves-attach waves-effect" href="javascript:void(0)"><span class="icon">delete</span></a>' +
                '							</li>' +
                '						</ul>' +
                '					</div>' +
                '					<div class="tile-inner">' +
                '						<span class="text-overflow">{{getName(f.file)}}</span>' +
                '					</div>' +
                '				</div>' +
                '			</div>' +
                '		</div>' +
                '		<div class="card-action">' +
                '			<div class="card-action-btn pull-left">' +
                '				<a ng-click="clearAll()" class="btn btn-flat ng-show="node._a.value.value.length" waves-attach waves-effect" href="javascript:void(0)"><span class="icon">delete</span>&nbsp;Clear All</a>' +
                '				<ul class="nav nav-list margin-no pull-right">' +
                '					<li class="dropdown">' +
                '						<a class="dropdown-toggle btn btn-flat text-black waves-attach waves-effect" data-toggle="dropdown" aria-expanded="true"><span class="icon">keyboard_arrow_down</span>&nbsp;Add File</a><div class="dropdown-backdrop"></div>' +
                '						<ul class="dropdown-menu">' +
                '							<li>' +
                '								<a class="waves-attach waves-effect" ng-click="fnScanFile()" href="javascript:void(0)">Scan</a>' +
                '							</li>' +
                '							<li>' +
                '								<a class="waves-attach waves-effect" ng-click="fnSelectFile()" href="javascript:void(0)">Select File</a>' +
                '							</li>' +
                '						</ul>' +
                '					</li>' +
                '				</ul>' +
                '			</div>' +
                '		</div>' +
                '	</div>' +
                '</div>',
        link: function (scope, element, attrs) {

        },
        controller: function ($scope) {
            $scope.node._a.value.value = $scope.node._a.value.value || [];

            $scope.getName = function (path) {
                var arr = path.split("/");
                return arr[arr.length - 1].toUpperCase();
            };

            $scope.clearAll = function () {
                $scope.node._a.value.value = [];
            };
            
            $scope.showFile = function (file) {
                window.Device.openFile(file,"P");
            };

            $scope.fnScanFile = function () {
                window.Device.captureFile(function (data) {
                    $scope.node._a.value.value.push({file: data});
                    $scope.$apply();
                });
            };
            $scope.fnSelectFile = function () {

            };
        }
    };
});
appUi.directive('cPhotoAttach', function () {
    return {
        restrict: "E",
        replace: true,
        scope: {
            node: '='
        },
        template: '<div class="card">' +
                '	<aside class="card-side pull-left" style="font-size: 20px">' +
                '		<span class="card-heading"><i class="fa fa-camera"></i></span>' +
                '	</aside>' +
                '	<div class="card-main">' +
                '           <div class="card-heading">' +
                '               <div class="card-title" style="font-size: 80%;padding-left: 10px;">{{node._a.label.value}}</div>' +
                '           </div>' +
                '		<div class="card-inner">' +
                '                       <div class="text-brand" ng-if="!node._a.value.value.length">No data</div>' +
                '			<div class="tile-wrap">' +
                '				<div class="tile" ng-click="showFile(v)" ng-repeat="f in node._a.value.value">' +
                '					<div class="tile-side pull-left">' +
                '						<div class="avatar avatar-sm avatar-brand">' +
                '							<span class="icon">insert_drive_file</span>' +
                '						</div>' +
                '					</div>' +
                '					<div class="tile-action tile-action-show">' +
                '						<ul class="nav nav-list margin-no pull-right">' +
                '							<li>' +
                '								<a class="text-black-sec waves-attach waves-effect" href="javascript:void(0)"><span class="icon">delete</span></a>' +
                '							</li>' +
                '						</ul>' +
                '					</div>' +
                '					<div class="tile-inner">' +
                '						<span class="text-overflow" ng-bind="getName(f.image)"></span>' +
                '					</div>' +
                '				</div>' +
                '			</div>' +
                '		</div>' +
                '		<div class="card-action">' +
                '			<div class="card-action-btn pull-left">' +
                '				<a ng-click="clearAll()" class="btn btn-flat ng-show="node._a.value.value.length" waves-attach waves-effect" href="javascript:void(0)"><span class="icon">delete</span>&nbsp;Clear All</a>' +
                '				<a ng-click="scanPhoto()" class="btn btn-flat ng-show="node._a.value.value.length" waves-attach waves-effect" href="javascript:void(0)"><span class="icon">monochrome_photos</span>&nbsp;Capture</a>' +
                '			</div>' +
                '		</div>' +
                '	</div>' +
                '</div>',
        link: function (scope, element, attrs) {

        },
        controller: function ($scope) {
            $scope.node._a.value.value = $scope.node._a.value.value || [];
            $scope.clearAll = function () {
                $scope.node._a.value.value = [];
            };
            $scope.getName = function (path) {
                var arr = path.split("/");
                return arr[arr.length - 1].toUpperCase();
            };
            $scope.showFile = function (file) {
                window.Device.openFile(file, "I");
            };
            $scope.scanPhoto = function () {
                window.Device.capturePhoto(function (data) {
                    $scope.node._a.value.value.push({image: data});
                    $scope.$apply();
                });
            };
        }
    };
});
appUi.directive('cRating', function () {
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
//                '	<div class="col-sm-12" style="margin-bottom: 15px">' +
//                '		<div id="starrr-{{node._d}}"></div>' +
//                '	</div>' +
                '</div>',
        link: function (scope, element, attrs) {

            $(element.children("#starrr-" + scope.node.d)).starrr({
                rating: scope.node._a.value.value,
                max: scope.node._a.stars.value,
                change: function (e, value) {
                    scope.node._a.value.value = value;
                    scope.$apply();
                }
            });

        },
        controller: function ($scope) {
        }
    };
});
appUi.directive('cHeading', function () {
    return {
        restrict: "E",
        replace: true,
        scope: {
            node: '='
        },
        template: '<section><h1 class="content-sub-heading" id="{{node._d}}" ng-if="node._a.type.value==\'Style 1\'" style="text-align:{{node._a.align.value}}">{{node._a.title.value}} <small>{{node._a.sub_title.value}}</small></h1>' +
                '<h2 class="content-sub-heading" id="{{node._d}}" ng-if="node._a.type.value==\'Style 2\'" style="text-align:{{node._a.align.value}}">{{node._a.title.value}} <small>{{node._a.sub_title.value}}</small></h2>' +
                '<h3 class="content-sub-heading" id="{{node._d}}" ng-if="node._a.type.value==\'Style 3\'" style="text-align:{{node._a.align.value}}">{{node._a.title.value}} <small>{{node._a.sub_title.value}}</small></h3>' +
                '<h4 class="content-sub-heading" id="{{node._d}}" ng-if="node._a.type.value==\'Style 4\'" style="text-align:{{node._a.align.value}}">{{node._a.title.value}} <small>{{node._a.sub_title.value}}</small></h4></section>',
        link: function (scope, element, attrs) {

        }
    };
});
appUi.directive('cLink', function () {
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
appUi.directive('cText', function () {
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
appUi.directive('cImage', function () {
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
appUi.directive('cRanking', function () {
    return {
        restrict: "E",
        replace: true,
        scope: {
            node: '='
        },
        template: '<div class="col-sm-12">' +
                '	<div class="tile-wrap">' +
                '		<div class="tile" txt="{{itm}}" ng-repeat="itm in node._a.items.value">' +
                '			<div class="tile-side pull-left">' +
                '				<div class="avatar avatar-sm avatar-brand">' +
                '					<b id="num-{{node._d}}">{{$index+1}}</b>' +
                '				</div>' +
                '			</div>' +
                '			<div class="tile-inner">' +
                '				<span class="text-overflow">{{itm}}</span>' +
                '			</div>' +
                '		</div>' +
                '	</div>' +
                '</div>',
        link: function (scope, element, attrs) {
            scope.node._a.value.value = angular.copy(scope.node._a.items.value);

            $(element).find(".tile-wrap").sortable({
                update: function () {
                    scope.node._a.value.value = [];
                    $.each($(this).find(".tile"), function (i, ui) {
                        $(this).find("#num-" + scope.node._d).text(i + 1);
                        scope.node._a.value.value.push($(this).attr("txt"));
                    });
                    scope.$apply();
                }
            });
        }
    };
});
appUi.directive('cMatrixSelection', function () {
    return {
        restrict: "E",
        replace: true,
        scope: {
            node: '='
        },
        template: '<div class="col-sm-12" style="padding:0;overflow: auto;">' +
                '		<label for="{{node._d}}">{{node._a.label.value}}</label>' +
                '		<table class="table">' +
                '			<thead>' +
                '				<tr>' +
                '					<th></th>' +
                '					<th ng-repeat="col in node._a.columns.value" class="text-center">{{col}}</th>' +
                '				</tr>' +
                '			</thead>' +
                '			<tbody>' +
                '				<tr ng-repeat="row in node._a.rows.value" >' +
                '					<td style="vertical-align: middle">{{row}}</td>' +
                '					<td ng-repeat="col in node._a.columns.value" style="vertical-align: middle;text-align: center" ng-switch="node._a.type.value">' +
                '						<div class="radiobtn  radiobtn-adv radiobtn-inline" ng-switch-when="Single Option">' +
                '							<label for="{{row + \'_option\' + $index}}">' +
                '								<input class="access-hide" name="{{row + \'_option\'}}" id="{{row + \'_option\' + $index}}" type="radio">' +
                '								<span class="radiobtn-circle"></span><span class="radiobtn-circle-check"></span>' +
                '							</label>' +
                '						</div>' +
                '						<div class="checkbox checkbox-adv checkbox-inline" ng-switch-when="Mutli Options">' +
                '							<label for="{{row + \'_option\' + $index}}">' +
                '								<input class="access-hide" name="{{row + \'_option\'}}" id="{{row + \'_option\' + $index}}" type="checkbox">' +
                '								<span class="checkbox-circle"></span><span class="checkbox-circle-check"></span><span class="checkbox-circle-icon icon">done</span>' +
                '							</label>' +
                '						</div>' +
                '						<div class="text no-padding no-margin" ng-switch-when="Text">' +
                '							<input type="text" value="{{op}}" class="form-control" name="{{row + \'_option\'}}">' +
                '						</div>' +
                '					</td>' +
                '				</tr>' +
                '			</tbody>' +
                '		</table>' +
                '</div>',
        link: function (scope, element, attrs) {

        }
    };
});
appUi.directive('cAudioRecord', function () {
    return {
        restrict: "E",
        replace: true,
        scope: {
            node: '='
        },
        template: '<div class="card">' +
                '	<aside class="card-side pull-left" style="font-size: 20px">' +
                '		<span class="card-heading"><i class="fa fa-microphone"></i></span>' +
                '	</aside>' +
                '	<div class="card-main">' +
                '           <div class="card-heading">' +
                '               <div class="card-title" style="font-size: 80%;padding-left: 10px;">{{node._a.label.value}}</div>' +
                '           </div>' +
                '		<div class="card-inner">' +
                '                       <div class="text-brand" ng-if="!node._a.value.value">No data</div>' +
                '			<div class="tile-wrap" ng-if="node._a.value.value">' +
                '				<div class="tile">' +
                '					<div class="tile-side pull-left">' +
                '						<div class="avatar avatar-sm avatar-brand">' +
                '							<span class="icon">insert_drive_file</span>' +
                '						</div>' +
                '					</div>' +
                '					<div class="tile-action tile-action-show">' +
                '						<ul class="nav nav-list margin-no pull-right">' +
                '							<li>' +
                '								<a ng-click="play()" class="text-black-sec waves-attach waves-effect" href="javascript:void(0)"><span class="icon">play_arrow</span></a>' +
                '							</li>' +
                '						</ul>' +
                '					</div>' +
                '					<div class="tile-inner">' +
                '						<span class="text-overflow">{{node._a.durations.value}} sec</span>' +
                '					</div>' +
                '				</div>' +
                '			</div>' +
                '		</div>' +
                '		<div class="card-action">' +
                '			<div class="card-action-btn pull-left">' +
                '				<a ng-click="clear()" class="btn btn-flat ng-show="node._a.value.value.length" waves-attach waves-effect" href="javascript:void(0)"><span class="icon">delete</span>&nbsp;Clear</a>' +
                '				<a ng-click="recordAudio()" class="btn btn-flat ng-show="node._a.value.value.length" waves-attach waves-effect" href="javascript:void(0)"><span class="icon">monochrome_photos</span>&nbsp;Capture</a>' +
                '			</div>' +
                '		</div>' +
                '	</div>' +
                '</div>',
        link: function (scope, element, attrs) {

        },
        controller: function ($scope) {
            $scope.clear = function () {
                $scope.node._a.value.value = "";
            };
            $scope.play = function () {
                if ($scope.node._a.value.value) {
                    window.Device.openFile($scope.node._a.value.value.audio, "A");
                }
            };
            $scope.recordAudio = function () {
                window.Device.captureAudio($scope.node._a.durations.value, function (data) {
                    $scope.node._a.value.value = {audio: data};
                    $scope.$apply();
                });
            };
        }
    };
});
appUi.directive('cVideoRecord', function () {
    return {
        restrict: "E",
        replace: true,
        scope: {
            node: '='
        },
        template: '<div class="card">' +
                '	<aside class="card-side pull-left" style="font-size: 20px">' +
                '		<span class="card-heading"><i class="fa fa-video-camera"></i></span>' +
                '	</aside>' +
                '	<div class="card-main">' +
                '		<div class="card-heading">' +
                '			<div class="card-title" style="font-size: 80%;padding-left: 10px;">Video record</div>' +
                '		</div>' +
                '		<div class="card-inner">' +
                '                       <div class="text-brand" ng-if="!node._a.value.value">No data</div>' +
                '			<div class="tile-wrap" ng-if="node._a.value.value">' +
                '				<div class="tile">' +
                '					<div class="tile-side pull-left">' +
                '						<div class="avatar avatar-sm avatar-brand">' +
                '							<span class="icon">movie</span>' +
                '						</div>' +
                '					</div>' +
                '					<div class="tile-action tile-action-show">' +
                '						<ul class="nav nav-list margin-no pull-right">' +
                '							<li>' +
                '								<a  ng-click="play()" class="text-black-sec waves-attach waves-effect" href="javascript:void(0)"><span class="icon">play_arrow</span></a>' +
                '							</li>' +
                '						</ul>' +
                '					</div>' +
                '					<div class="tile-inner">' +
                '						<span class="text-overflow">{{node._a.durations.value}} sec</span>' +
                '					</div>' +
                '				</div>' +
                '			</div>' +
                '		</div>' +
                '		<div class="card-action">' +
                '			<div class="card-action-btn pull-left">' +
                '				<a ng-click="clear()" class="btn btn-flat waves-attach waves-effect" href="javascript:void(0)"><span class="icon">delete</span>&nbsp;Clear</a>' +
                '				<a ng-click="captureVideo()" class="btn btn-flat waves-attach waves-effect" href="javascript:void(0)"><span class="icon">video_call</span>&nbsp;Record</a>' +
                '			</div>' +
                '		</div>' +
                '	</div>' +
                '</div>',
        link: function (scope, element, attrs) {

        },
        controller: function ($scope) {
            $scope.clear = function () {
                $scope.node._a.value.value = "";
            };
            $scope.captureVideo = function () {
                window.Device.captureVideo($scope.node._a.durations.value, function (data) {
                    $scope.node._a.value.value = {video: data};
                    $scope.$apply();
                });
            };
            $scope.play = function () {
                if ($scope.node._a.value.value) {
                    window.Device.openFile($scope.node._a.value.value.video, "V");
                }
            };

        }
    };
});
appUi.directive('cSignInput', function () {
    return {
        restrict: "E",
        replace: true,
        scope: {
            node: '='
        },
        template: '<div class="card">' +
                '	<aside class="card-side pull-left" style="font-size: 20px">' +
                '		<span class="card-heading"><span class="icon">gesture</span></span>' +
                '	</aside>' +
                '	<div class="card-main">' +
                '		<div class="card-heading" ng-if="node._a.label.value">' +
                '			<div class="card-title" style="font-size: 80%;padding-left: 10px;">{{node._a.label.value}}</div>' +
                '		</div>' +
                '		<div class="card-inner">' +
                '                       <div class="text-brand" ng-if="!node._a.value.value">No data</div>' +
                '			<div class="tile-wrap" ng-if="node._a.value.value">' +
                '				<div class="tile">' +
                '					<div class="tile-side pull-left">' +
                '						<div class="avatar avatar-sm avatar-brand">' +
                '							<span class="icon">gesture</span>' +
                '						</div>' +
                '					</div>' +
                '					<div class="tile-action tile-action-show">' +
                '						<ul class="nav nav-list margin-no pull-right">' +
                '							<li>' +
                '								<a class="text-black-sec waves-attach waves-effect" href="javascript:void(0)"><span class="icon">remove_red_eye</span></a>' +
                '							</li>' +
                '						</ul>' +
                '					</div>' +
                '					<div class="tile-inner">' +
                '						<span class="text-overflow">Signed</span>' +
                '					</div>' +
                '				</div>' +
                '			</div>' +
                '		</div>' +
                '		<div class="card-action">' +
                '			<div class="card-action-btn pull-left">' +
                '				<a ng-click="fnClear()" class="btn btn-flat waves-attach waves-effect" href="javascript:void(0)"><span class="icon">delete</span>&nbsp;Clear</a>' +
                '				<a ng-click="fnCapture()" class="btn btn-flat waves-attach waves-effect" href="javascript:void(0)"><span class="icon">mode_edit</span>&nbsp;Sign</a>' +
                '			</div>' +
                '		</div>' +
                '	</div>' +
                '</div>',
        link: function (scope, element, attrs) {

        },
        controller: function ($scope) {
            $scope.fnClear = function () {
                $scope.node._a.value.value = "";
            };
            $scope.fnCapture = function () {
                window.Device.captureSign(function (data) {
                    $scope.node._a.value.value= {image: data};
                    $scope.$apply();
                });
            };
        }
    };
});
appUi.directive('cLocation', function () {
    return {
        restrict: "E",
        replace: true,
        scope: {
            node: '='
        },
        template: '<div class="card">' +
                '	<aside class="card-side pull-left" style="font-size: 20px">' +
                '		<span class="card-heading"><i class="fa fa-map-marker"></i></span>' +
                '	</aside>' +
                '	<div class="card-main">' +
                '		<div class="card-heading">' +
                '			<div class="card-title" style="font-size: 80%;padding-left: 10px;">{{node._a.label.value}}</div>' +
                '		</div>' +
                '		<div class="card-inner">' +
                '                       <div class="text-brand" ng-if="!node._a.value.value">No data</div>' +
                '			<div class="tile-wrap" ng-if="node._a.value.value">' +
                '				<div class="tile">' +
                '					<div class="tile-side pull-left">' +
                '						<div class="avatar avatar-sm avatar-brand">' +
                '							<span class="icon">map</span>' +
                '						</div>' +
                '					</div>' +
                '					<div class="tile-action tile-action-show">' +
                '						<ul class="nav nav-list margin-no pull-right">' +
                '							<li>' +
                '								<a ng-click="fnNavigate()" class="text-black-sec waves-attach waves-effect" href="javascript:void(0)"><span class="icon">navigation</span></a>' +
                '							</li>' +
                '						</ul>' +
                '					</div>' +
                '					<div class="tile-inner">' +
                '						<span class="text-overflow" ng-bind="node._a.value.value|json"></span>' +
                '					</div>' +
                '				</div>' +
                '			</div>' +
                '		</div>' +
                '		<div class="card-action">' +
                '			<div class="card-action-btn pull-left">' +
                '				<a ng-click="fnClear()" class="btn btn-flat waves-attach waves-effect" href="javascript:void(0)"><span class="icon">delete</span>&nbsp;Clear</a>' +
                '' +
                '				<a ng-click="fnUpdate()" class="btn btn-flat waves-attach waves-effect" href="javascript:void(0)"><span class="icon">place</span>&nbsp;Update</a>' +
                '			</div>' +
                '		</div>' +
                '	</div>' +
                '</div>',
        link: function (scope, element, attrs) {

        },
        controller: function ($scope) {
            $scope.fnClear = function () {
                $scope.node._a.value.value = "";
            };

            $scope.fnNavigate = function () {
                if ($scope.node._a.value.value) {
                    window.Device.openMap($scope.node._a.value.value.lat, $scope.node._a.value.value.lng);
                }

            };

            $scope.fnUpdate = function () {
                window.Device.getGeoLocation(function (lat, lng) {
                    $scope.node._a.value.value = {
                        lat: lat,
                        lng: lng
                    };
                    $scope.$apply();
                });
            };
        }
    };
});
appUi.directive('cCompass', function () {
    return {
        restrict: "E",
        replace: true,
        scope: {
            node: '='
        },
        template: "<div>Compass</div>",
        link: function (scope, element, attrs) {

        }
    };
});
appUi.directive('cBarcodeScan', function () {
    return {
        restrict: "E",
        replace: true,
        scope: {
            node: '='
        },
        template: '<div class="form-group form-group-label">' +
                '	<label class="floating-label" for="{{node._d}}">{{node._a.label.value}}</label>' +
                '	<input class="form-control width90" id="{{node._d}}" ng-model="node._a.value.value" type="text">' +
                '	<a ng-click="fnScanBarcode()" class="btn waves-attach"><i class="fa fa-qrcode"></i></a>' +
                '</div>',
        link: function (scope, element, attrs) {

        },
        controller: function ($scope) {
            $scope.fnScanBarcode = function () {
                window.Device.scanBarcode(function (data) {
                    $scope.node._a.value.value = data;
                    $scope.$apply();
                });
            };
        }
    };
});
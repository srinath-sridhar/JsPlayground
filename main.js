'use strict';
var demoApp = angular.module('demoApp', []);

demoApp.factory("TestData", function() {
    var data =  [{"name" : "first", "detail" : {"name": "NODE1", "included":true, "children":[{ "name": "CHILD_NODE_1", "included":true, "children" :[ {"name" : "AAA", "included":true}, {"name" : "BBB", "included":true}] }] }},
                 {"name" : "second", "detail" : {"name": "NODE2", "included":true, "children":[{ "name": "CHILD_NODE_2", "included":true }] } },
                 {"name" : "third", "detail" : { "name": "NODE3", "included":true, "children":[{ "name": "CHILD_NODE_3", "included":true }] } },
                 {"name" : "fourth", "detail" : { "name": "NODE4", "included":true, "root":true, "children":[{ "name": "CHILD_NODE_4", "included":true }] } }];
    return data;
});

demoApp.controller('ListCtrl', function ListCtrl ($scope, TestData){
    $scope.items = TestData;
    $scope.itemSelected = function(index) {
        $scope.curitem = null;
        $scope.curitem = $scope.items[index].detail;
        draw($scope.curitem);
    };
});

demoApp.directive('treelist', function treelist ($compile) {

    return {
        restrict: "E",
        replace: true,
        scope: { 
            curitemval:'=',
            parent: '='
        },
        link: function(scope, element) {
            var elemWithoutChildren = '<span ng-click="toggle()" ng-class="{notincluded: curitemval.included==false}">{{curitemval.name}}</span>';
            var elemWithChildren = '<span ng-click="toggle(curitemval)" ng-class="{notincluded: curitemval.included==false}">{{curitemval.name}}</span><ul><li ng-repeat="item in curitemval.children"><treelist parent ="curitemval"'
                                   +'curitemval="item"></treelist></li></ul>';
            scope.toggle = function() {
                var toggleItem = function(item, toggleValue) {
                    if(item.children !== undefined) {
                        item.children.forEach(function(item) {
                            toggleItem(item, toggleValue);
                        });
                    }
                    item.included = toggleValue;
                    //console.log("toggled " + item.name + " to "+ toggleValue);
                };
                toggleItem(scope.curitemval, !scope.curitemval.included);
                var toggleitem = scope.curitemval;
                while(toggleitem.parent != toggleitem.curitemval) {
                    toggleitem = toggleitem.parent;
                }
                draw(toggleitem);
            };
            scope.$watch('curitemval', function(value){
                var name = "undefined";
                if(value!==undefined) {
                    name = value.name;
                }
                console.log(scope);
                console.log("value of curitemval changed " + name);
                if(undefined !== value) {
                    var newElem = "";
                    if(value.children !== undefined) {
                        newElem = angular.element(elemWithChildren);
                    }
                    else {
                        newElem = angular.element(elemWithoutChildren);
                    }
                    $compile(newElem)(scope);
                    console.log(element);
                    element.replaceWith(newElem);
                }
            });
        }

    }
});

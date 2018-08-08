var app = angular.module('demoApp', []);


app.controller('demoCtrl', function($scope) {
    $scope.drpDwnObject = ["Honda", "Mercedes", "VolksWagon", "Ford", "BMW", "Hyundai", "Kia", "Meceratti"];

});



app.directive('autosuggest', function() {
    return {
        restrict: 'A',
        template: '<div class="suggestor-container"><input class="input-suggestor" type="text" name="suggestor" ng-model="suggestor"/><ul class="list-ul"><li class="list-li" val="{{x}}" ng-click="selectLi(x)" ng-repeat="x in localObject track by $index">{{x}}</li></ul></div>',
        link: function(scope, elem, attr) {


            scope.selectLi = function(val) {
                scope.suggestor = val;
                removeList();
            }


            var inputElem = elem.find('input'),
                listElem = elem.find('ul'),
                activeNode = false;


            inputElem.on('keyup', function(e) {

                if (e.keyCode == 38 || e.keyCode == 40 || e.keyCode == 13)
                    return;
                else
                    createList(inputElem.val());
            }).on('focus', function() {
                createList(inputElem.val());

            }).on('keydown', function(e) {



                if (e.keyCode == '40') { // down arrow key navigation
                    if (!activeNode) {
                        activeNode = listElem.find('li').eq(0);
                        activeNode.addClass('active');
                    } else {
                        if (!activeNode.next().length)
                            return;
                        listElem.find('li').removeClass('active');
                        activeNode = activeNode.next();
                        activeNode.addClass('active');
                    }
                    scrollList(e.keyCode, activeNode)
                } else if (e.keyCode == '38') { // up arrow key navigation

                    if (!activeNode || !activeNode[0].previousElementSibling)
                        return;
                    listElem.find('li').removeClass('active');
                    activeNode = angular.element(activeNode[0].previousElementSibling);
                    activeNode.addClass('active');
                    scrollList(e.keyCode, activeNode)
                } else if (e.keyCode == 13) { // enter arrow key navigation
                    if (!activeNode) return;
                    scope.suggestor = activeNode.attr('val');
                    scope.$apply();
                    removeList();
                }
            })






            function removeList() {
                listElem.find('li').removeClass('active');
                listElem[0].style.display = "none";
                activeNode = false;
            }


            function createList(val) {
                activeNode = false;
                listElem.find('li').removeClass('active');
                if (val) {
                    searchList(val)
                } else {
                    scope.localObject = scope.autosuggestObj.slice(0);

                }
                listElem[0].style.display = "block";
                scope.$apply()
            }

            function searchList(searchText) {
                if (!searchText) {
                    return;
                }
                scope.localObject = [];
                for (var i = 0; i < scope.autosuggestObj.length; i++) {
                    if (scope.autosuggestObj[i].toLowerCase().indexOf(searchText.toLowerCase()) > -1) {
                        scope.localObject.push(scope.autosuggestObj[i])
                    }
                }
            }



            function scrollList(keyCode, activeElem) {
                if (keyCode == '40') {
                    if (activeElem[0].offsetTop + activeElem[0].offsetHeight > listElem[0].offsetHeight) {
                        listElem[0].scrollTop = listElem[0].scrollTop + activeElem[0].offsetHeight
                    }
                }else {
                    if (activeElem[0].offsetTop - listElem[0].scrollTop < activeElem[0].offsetHeight) {
                        listElem[0].scrollTop = listElem[0].scrollTop - activeElem[0].offsetHeight
                    }
                }

            }


        },
        scope: {
            autosuggestObj: "=autosuggest"
        }
    }
})
var app = angular.module('demoApp', []);


app.controller('demoCtrl', function($scope) {
    $scope.drpDwnObject = ["Honda", "Mercedes", "VolksWagon", "Ford", "BMW", "Hyundai", "Kia", "Meceratti"];

});



app.directive('autosuggest', function() {
    return {
        restrict: 'A',
        template: '<div class="suggestor-container"><input class="input-suggestor" type="text" name="suggestor" ng-model="suggestor"/><ul class="list-ul"><li class="list-li" val="{{x}}" ng-click="selectLi(x)" ng-repeat="x in localObject track by $index">{{x}}</li></ul></div>',
        link: function(scope, elem, attr) {


            scope.selectLi = function(val){
                 scope.suggestor = val;
                 removeList();
            }

            
            var inputElem = elem.find('input'),
                listElem = elem.find('ul'),
                activeNode = false;


            inputElem.on('keyup', function(e) {

                if(e.keyCode == '40'){
                    if(!activeNode){
                        activeNode = listElem.find('li').eq(0);
                        activeNode.addClass('active');
                    }else{
                        if(!activeNode.next().length)
                            return;
                        listElem.find('li').removeClass('active');
                        activeNode = activeNode.next();
                        activeNode.addClass('active');
                    }
                }else if(e.keyCode == '38'){
                        if(!activeNode || !activeNode[0].previousElementSibling)
                            return;
                        listElem.find('li').removeClass('active');
                        activeNode = angular.element(activeNode[0].previousElementSibling);
                        activeNode.addClass('active');
                }else if(e.keyCode == 13){
                    if(!activeNode)return;
                    scope.suggestor = activeNode.attr('val');
                    scope.$apply();
                    removeList();
                }else{
                    createList(inputElem.val());
                }
                
            }).on('focus', function() {
                createList(inputElem.val());
                
            })






            function removeList(){
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


        },
        scope: {
            autosuggestObj: "=autosuggest"
        }
    }
})
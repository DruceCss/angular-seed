'use strict';

angular.module('svgDemonstration')
    .component('svgDemonstration', {
        templateUrl: 'components/svg-demonstration/svg-demonstration.template.html',
        controller: ['$scope', 'svg', function ($scope, svg) {
            $scope.list = svg.getAll();

            $scope.tiles = buildGridModel({
                icon : "avatar:svg-",
                title: "Svg-",
                background: ""
            });

            function buildGridModel(tileTmpl){
                var it, results = [ ];

                for (var j=0; j<11; j++) {

                    it = angular.extend({},tileTmpl);
                    it.icon  = $scope.list[j+1];
                    it.title = it.title + (j+1);
                    it.span  = { row : 1, col : 1 };

                    switch(j+1) {
                        case 1:
                            it.background = "red";
                            it.span.row = it.span.col = 2;
                            break;

                        case 2: it.background = "green";         break;
                        case 3: it.background = "darkBlue";      break;
                        case 4:
                            it.background = "blue";
                            it.span.col = 2;
                            break;

                        case 5:
                            it.background = "yellow";
                            it.span.row = it.span.col = 2;
                            break;

                        case 6: it.background = "pink";          break;
                        case 7: it.background = "darkBlue";      break;
                        case 8: it.background = "purple";        break;
                        case 9: it.background = "deepBlue";      break;
                        case 10: it.background = "lightPurple";  break;
                        case 11: it.background = "yellow";       break;
                    }

                    results.push(it);
                }
                return results;
            }
        }]
    });
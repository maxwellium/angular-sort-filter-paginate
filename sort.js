(function(){
'use strict';


angular.module('SortFilterPaginate.directives')
.directive('sort', function() {return {

  templateUrl: '/Public/components/angular-sort-filter-paginate/sort.html',
  restrict: 'E',
  transclude: true,
  replace: true,

  scope: {
    model     : '=',
    predicate : '@',
    onSort    : '=',
    type      : '@'
  },
  link: function($scope, elem, attrs) {

    $scope.direction = 0;
    $scope.sortClass = '';

    var sorting = function(direction){

      switch(direction) {
        case -1:
          $scope.direction = -1;
          break;
        case 1:
          $scope.direction = 1;
          break;
        default:
          $scope.direction = 0;
          break;
      }

      updateClass();
    };

    var updateClass = function(){
      if (!$scope.type) {
        $scope.type = 'alphabet';
      }

      $scope.sortClass = ($scope.direction === 0) ? '' : ($scope.type + ($scope.direction === -1 ? '-alt' : ''));
    };

    $scope.sort = function(){

      switch($scope.direction) {
        case 1:
          $scope.model.options.sort[attrs.predicate] = -1;
          break;
        case -1:
          $scope.model.options.sort[attrs.predicate] = 0;
          break;
        default:
          $scope.model.options.sort[attrs.predicate] = 1;
          break;
      }

      if (typeof $scope.onSort === 'function') {
        $scope.onSort();
      } else {
        $scope.model.query();
      }

    };

    $scope.$watch('model.options.sort[\''+
                  attrs.predicate.replace(/[\\"']/g, '\\$&').replace(/\u0000/g, '\\0') +
                  '\']', sorting);
  }

};});


})();

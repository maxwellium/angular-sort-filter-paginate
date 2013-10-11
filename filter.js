(function(){
'use strict';


angular.module('SortFilterPaginate.directives')
.directive('filter', function() {return {

  restrict: 'E',

  scope: {
    model    : '=',
    onFilter  : '=',
    predicate : '@'
  },

  link: function($scope, elem, attrs) {

    var filter = function(by, old){
      if ( by !== old ) {
        if (typeof $scope.onFilter === 'function') {
          $scope.onFilter();
        } else {
          $scope.model.throttle();
        }
      }
    };

    $scope.$watch('model.options.filter[\''+ attrs.predicate +'\']', filter);
  }

};});


})();

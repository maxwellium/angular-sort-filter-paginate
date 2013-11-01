(function(){
'use strict';


angular.module('SortFilterPaginate.directives')
.directive('sfpPaginate', function() {return {

  restrict  : 'E',
  replace   : true,

  scope     : {
    model: '=',
    onPaginate: '='
  },

  link: function($scope, elem, attrs) {

    $scope.paginate = function(page){
      $scope.page = page;
      if ($scope.model.options.skip !== page * $scope.model.options.limit) {

        $scope.model.options.skip = page * $scope.model.options.limit;

        if (typeof $scope.onPaginate === 'function') {
          $scope.onPaginate();
        } else {
          $scope.model.query();
        }
      }
    };

    var pagination = function(){
      $scope.pageCount = Math.ceil( $scope.model.count / $scope.model.options.limit );
      $scope.pageResults = Math.min( $scope.model.options.limit, $scope.model.count);
    };

    $scope.$watch('model.count', pagination);
    $scope.$watch('model.options.skip', pagination);
    $scope.$watch('model.options.limit', pagination);

  }

};});


})();

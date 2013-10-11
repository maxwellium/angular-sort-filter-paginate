(function(){
'use strict';


angular.module('SortFilterPaginate.directives')
.directive('paginate', function() {return {

  templateUrl: '/Public/components/angular-sort-filter-paginate/paginate.html',
  restrict: 'E',
  replace: true,

  scope: {
    onPaginate: '=',
    model     : '='
  },

  controller: [ '$scope', function($scope) {

    $scope.pages    = [];
    $scope.page     = 0;
    $scope.pageCount= 0;

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

      if ($scope.model.count > 0) {
        $scope.pageCount = Math.floor( $scope.model.count / $scope.model.options.limit );
        var
          page    = Math.floor( $scope.model.options.skip / $scope.model.options.limit ),
          powers  = Math.ceil( Math.log($scope.pageCount) / Math.LN10 ),
          l       = [],
          r       = [],
          power   = 0;

        for (var i = 1; i < powers; i++) {
          power = Math.pow( 10, i );

          if (page < $scope.pageCount - power) {
            r.push({ p:page + power, t: $scope.model.options.limit * (page + power), l: page + power });
          }

          if (page > power) {
            l.unshift({ p:page - power, t: $scope.model.options.limit * (page - power), l: page - power });
          }
        }

        if (page < $scope.pageCount -1) {
          r.push({ p: page +1, l: '›' });
        }
        if (page > 1) {
          l.unshift({ p: page -1, l: '‹' });
        }

        if (page !== $scope.pageCount) {
          r.push({ p:$scope.pageCount, l: '»', t:$scope.pageCount });
        } else {
          r.push({ p:$scope.pageCount, l: '»', c: 'disabled' });
        }
        if (page !== 0) {
          l.unshift({ p:0, l:'«', t: 0 });
        } else {
          l.unshift({ p:0, l:'«', c: 'disabled' });
        }

        $scope.pages = l.concat([{ p:page, l: page, t: $scope.model.options.skip, c:'active' }], r);

      } else {
        $scope.pages = [];
      }
    };

    $scope.$watch('model.count', pagination);
    $scope.$watch('model.options.skip', pagination);

  }]

};});


})();

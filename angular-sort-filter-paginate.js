(function(){
'use strict';


angular.module('SortFilterPaginate', [
  'SortFilterPaginate.directives',
  'SortFilterPaginate.service'
]);


angular.module('SortFilterPaginate.service', [])
.factory('SFP', [ '$timeout', function($timeout){

  var SFPService = function(Model) {
    this.Model = Model;
    this.count = 0;
    this.options = {
      skip  : 0,
      limit : 20,
      sort  : {},
      filter: {}
    };
    this.defaultOptions = {};
    this.throttleDelay  = 500;
    this.throttling     = false;
    this.loading        = false;
    this.results        = [];
  };


  SFPService.prototype.parameters = function(){
    var
      sort = '',
      parameters = angular.copy(this.defaultOptions);

    angular.extend(parameters, this.options);


    angular.forEach(this.options.sort, function(direction, by){
      if (direction) {
        sort = (sort +' '+ (direction === -1 ? '-' : '') + by ).trim();
      }
    });

    delete parameters.filter;

    angular.forEach(this.options.filter, function(filter, predicate){
      if (filter) {
        parameters['filter['+ predicate +']'] = filter;
        //TODO: deep object, so filter for gt, in etc become possible
      }
    });

    console.log(parameters);

    if (sort.length) {
      parameters.sort = sort;
    } else {
      delete parameters.sort;
    }

    return parameters;
  };


  SFPService.prototype.throttle = function() {
    var that = this;
    if (this.throttling) {
      $timeout.cancel(this.throttling);
    }

    this.throttling = $timeout( function(){
      that.query();
      that.throttling = false;
    }, this.throttleDelay );
  };

  SFPService.prototype.query = function(callback) {
    var that = this;
    this.loading = true;
    if (this.throttling) {
      $timeout.cancel(this.throttling);
    }
    return this.results = this.Model.query(this.parameters(), function(result, headers){
      that.count = headers('x-count');
      if (typeof callback === 'function') {
        callback.apply(this, arguments);
      }
      that.loading = false;
    });
  };

  return SFPService;
}]);


angular.module('SortFilterPaginate.directives', [])

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

      console.log($scope.direction);

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

};})


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

};})

.directive('filter', function() {return {

  restrict: 'E',

  scope: {
    model    : '=',
    onFilter  : '=',
    predicate : '@'
  },

  link: function($scope, elem, attrs) {

    var filter = function(by, old){
      if ( (typeof by !== 'undefined') && (by !== '') && (by !== null) ) {
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

(function(){
'use strict';


angular.module('SortFilterPaginate.directives')
.directive('sfpFilter', function() {return {

  restrict: 'E',

  scope: {
    model     : '=',
    onFilter  : '='
  },

  link: function($scope, elem, attrs) {
    var
      predicate           = attrs.predicate.split(':'),
      queryStringParameter= predicate.join('][');

    predicate.pop();

    if ( 'regexi' === attrs.type ) {
      $scope.merge = { $options: 'i' };
    }

    var filter = function(by, old){
      if ( by != old ) {

        angular.forEach($scope.merge, function(value, key){
          var mergeQueryStringParameter = predicate.concat([ key ]);

          if ( ('undefined' !== typeof by) && ('' !== by) ) {
            $scope.model.options['filter['+ mergeQueryStringParameter.join('][') +']'] = value;
          } else {
            delete $scope.model.options['filter['+ mergeQueryStringParameter.join('][') +']'];
          }
        });

        if ( ('undefined' !== typeof by) && ('' !== by) ) {
          $scope.model.options['filter['+ queryStringParameter +']'] = by;
        } else {
          delete $scope.model.options['filter['+ queryStringParameter +']'];
        }

        if ( 'function' === typeof $scope.onFilter ) {
          $scope.onFilter();
        } else {
          $scope.model.options.skip = 0;
          $scope.model.throttle();
        }
      }
    };

    var adopt = function(filter){
      if (filter !== $scope.filter) {
        $scope.filter = filter;
      }
    };

    $scope.$watch('filter', filter);
    $scope.$watch('model.options[\'filter['+ queryStringParameter +']\']', adopt);
  }

};});


})();

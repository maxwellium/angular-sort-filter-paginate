(function(){
'use strict';


angular.module('SortFilterPaginate.service')
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


})();

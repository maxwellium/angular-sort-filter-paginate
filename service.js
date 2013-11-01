(function(){
'use strict';


angular.module('SortFilterPaginate.service')
.factory('SFP', [ '$timeout', function($timeout){

  var SFPService = function(Model) {
    this.Model  = Model;
    this.count  = 0;
    this.options= {
      skip  : 0,
      limit : 20,
      sort  : {}
    };

    this.defaultParameters= {};
    this.throttleDelay    = 500;
    this.throttling       = false;
    this.loading          = false;
    this.results          = [];
  };


  SFPService.prototype.parameters = function(){
    var
      that = this,
      sort = '',
      parameters = angular.copy(this.defaultParameters);

    angular.extend(parameters, this.options);


    angular.forEach(this.options.sort, function(direction, by){
      if (direction) {
        sort = (sort +' '+ (direction === -1 ? '-' : '') + by ).trim();
      }
    });

    angular.forEach(parameters, function(by, filter){
      if ( (0 === filter.indexOf('filter[')) && ( ('undefined' === typeof by) || ('' === by) ) ){
        delete parameters[filter];
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
    }, this.throttleDelay );
  };


  SFPService.prototype.query = function(callback) {
    var
      that      = this,
      parameters= this.parameters();

    this.loading = true;
    if (this.throttling) {
      $timeout.cancel(this.throttling);
      this.throttling = false;
    }

    this.results = this.Model.query(parameters, function(result, headers){
      that.count = headers('x-count');
      if (typeof callback === 'function') {
        callback.apply(this, arguments);
      }
      that.loading = false;
    }, function(){
      that.loading = false;
    });

    return this.results;
  };

  return SFPService;
}]);


})();

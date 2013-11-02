(function(){
'use strict';


angular.module('SFPExample.service', ['ngResource'])

.factory('User', [ '$resource', function($resource){

  return $resource('/api/user/rest/:userId', {userId: '@_id'});

}]);


})();
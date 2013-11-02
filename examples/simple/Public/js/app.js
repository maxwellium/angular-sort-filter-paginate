(function(){
'use strict';


angular.module('SFPExample', [ 'SFPExample.service', 'SortFilterPaginate' ])

.controller('MainCtrl', ['$scope', 'User', 'SFP', function( $scope, User, SFP ) {

  $scope.UserSFP = new SFP(User);
  $scope.UserSFP.query();

}]);


})();
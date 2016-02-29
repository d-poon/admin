angular.module('adminService',[])
	.factory('Site', ['$http', function($http){
		return {
			get : function() {
				return $http.get('/api/sites/view')
			}
		}
	}]);
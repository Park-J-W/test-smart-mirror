(function () {
	'use strict';

	function NaverTranslate($q, $rootScope, $window, $http) {

		var NaverTranslator = require('naver-translator');
		var clientId = 'oxeMsxVVvk4IE4VajfR9';
		var clientSecret = 'ijpAjvDoHP';

		var credentials = {
			client_id : clientId,
			client_secret : clientSecret
		};
		
		
		var translator = new NaverTranslator(credentials);

		var params = {
			text : '안녕하세요',
			source : 'ko',
			target : 'en'
		};
		var callback = function (result) {
			console.log(result);
		};
		translator.translate(params, callback);
	}

	angular.module('SmartMirror')
        .factory('NaverTranslate', NaverTranslate);
} ());

function NaverTrend($scope, $http, $q, $interval) {

	$scope.NT_currentIndex = 0;
	var trends = {};
	var trendsRes = {};
	trends.feed = [];

	trends.get = function () {
		var tr = require('naver-trends');

		trends.updated = new moment().format('MMM DD, h:mm a');

		tr.load(['real'], function (err, result) {			
			  console.log(err, JSON.stringify(result))
			  return trendsRes.result = result;
		})
	};

	var refreshTrends = function () {
		$scope.howWord = null;
		trends.get().then(function (response) {
			console.log(trendsRes.result.real.length);
            //For each feed
			for (var i = 0; i < trendsRes.result.real.length - 10; i++) {
					var feedEntry = {
						title: trendsRes.result.real[1].title,
                        //content: response[i].data.query.results.rss.channel.item[j].description[0],
					};
					trends.feed.push(feedEntry);
			}
			$scope.NT_currentIndex = 0;
			$scope.trends  = trends;
		});
	};

	var cycleTrends = function(){
		$scope.NT_currentIndex = ($scope.NT_currentIndex >= $scope.trends.feed.length)? 0: $scope.NT_currentIndex + 1;
	}

	if (typeof config.naver_trend !== 'undefined' && typeof config.naver_trend.refreshInterval != 'undefined') {
		refreshTrends();
		$interval(refreshTrends, config.naver_trend.refreshInterval * 60000 || 1800000)
		$interval(cycleTrends, 8000)
	}
}


angular.module('SmartMirror')
    .controller('NaverTrend', NaverTrend);

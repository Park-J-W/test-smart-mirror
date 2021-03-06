function NaverTrend($scope, $http, $q, $interval) {

	$scope.NT_currentIndex = 0;
	var trends = {};
	trends.feed = [];
	trends.title = '실시간 검색어 순위';
	$scope.lineCount = config.naver_trend.lineCount;

	var refreshTrends = function () {
		var tr = require('naver-trends');
		$scope.howWord = null;
		trends.feed = [];

		trends.updated = new moment().format('MMM DD, h:mm a');

		tr.load(['real'], function (err, result) {			
			//console.log(err, JSON.stringify(result));

			console.log(result.real.length);
			//For each feed
			for (var i = 0; i < result.real.length - 10; i++) {
					var feedEntry = {
						title: i+1 + ". "+result.real[i].title,
                        //content: response[i].data.query.results.rss.channel.item[j].description[0],
					};
					trends.feed.push(feedEntry);
			}
			$scope.NT_currentIndex = 0;
			$scope.trends  = trends;
		})
	};

	var cycleTrends = function(){
		$scope.NT_currentIndex = (($scope.NT_currentIndex + config.naver_trend.lineCount) >= $scope.trends.feed.length)? 0: $scope.NT_currentIndex + config.naver_trend.lineCount;
	}

	if (typeof config.naver_trend !== 'undefined' && typeof config.naver_trend.refreshInterval != 'undefined') {
		refreshTrends();
		$interval(refreshTrends, config.naver_trend.refreshInterval * 60000 || 1800000)
		$interval(cycleTrends, 6000)
	}
}


angular.module('SmartMirror')
    .controller('NaverTrend', NaverTrend);

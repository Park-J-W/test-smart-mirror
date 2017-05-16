function Rss($scope, $http, $q, $interval) {
	var iGoogleNewsRSSScraper = require('googlenews-rss-scraper');

	$scope.currentIndex = 0;
	var rss = {};
	rss.feed = [];

	var refreshNews = function () {
		rss.feed = [];
		rss.updated = new moment().format('MMM DD, h:mm a');
		rss.title = '[ GooGle News Rss ]';
		$scope.news = null;

		iGoogleNewsRSSScraper.getGoogleNewsRSSScraperData( { newsType: config.rss.newsType, newsTypeTerms: config.rss.newsTypeTerms}, function(data) {
			if (!data.error) {
//				console.log(JSON.stringify(data, null, 2));    
				//For each feed
				var response = data.newsArray;

				console.log('response.length : ' + response.length);
				console.log('data.length.newsArray : ' + data.newsArray.length);

	            for (var i = 0; i < response.length; i++) {
				console.log('response[i]..cleanDescription : ' + response[i].cleanDescription);
					var feedEntry = { 
							title: response[i].title,
							source: response[i].source,
							pubDate : response[i].pubDate,
							cleanDescription : response[i].cleanDescription,
							//content: response[i].data.query.results.rss.channel.item[j].description[0],
					};  
					rss.srouce = response[i].source;
					rss.feed.push(feedEntry);
				}
				$scope.currentIndex = 0;
				$scope.rss = rss;
			}
			else {
				console.log('Some error occured.');
			}
		}); 
	};

	var cycleNews = function(){
		$scope.currentIndex = ($scope.currentIndex >= $scope.rss.feed.length - 1)? 0: $scope.currentIndex + 1;
	}

	if (typeof config.rss !== 'undefined' && typeof config.rss.feeds != 'undefined') {
		refreshNews();
		$interval(refreshNews, config.rss.refreshInterval * 60000 || 1800000)
		$interval(cycleNews, 8000)
	}
}


angular.module('SmartMirror')
    .controller('Rss', Rss);
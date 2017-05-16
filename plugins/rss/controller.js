function Rss($scope, $http, $q, $interval, SpeechService, Focus) {
	var iGoogleNewsRSSScraper = require('googlenews-rss-scraper');

	$scope.currentIndex = 0;
	var rss = {};
	rss.feed = [];

	var refreshNews = function () {
		rss.feed = [];
		rss.updated = new moment().format('MMM DD, h:mm a');
		rss.title = '[ GooGle News Rss ]';
		$scope.news = null;
		rss.briefing = [];

		iGoogleNewsRSSScraper.getGoogleNewsRSSScraperData( { newsType: config.rss.newsType, newsTypeTerms: config.rss.newsTypeTerms}, function(data) {
			if (!data.error) {
				//console.log(JSON.stringify(data, null, 2));    
				//For each feed
				var response = data.newsArray;

				//console.log('response.length : ' + response.length);
				console.log('data.length.newsArray : ' + data.newsArray.length);

	            for (var i = 0; i < response.length; i++) {
				//console.log('response[i]..cleanDescription : ' + response[i].cleanDescription);
					response[i].cleanDescription = response[i].cleanDescription.replace(/&middot;/gi,'·');
					response[i].cleanDescription = response[i].cleanDescription.replace(/&nbsp;/gi,'');
					response[i].cleanDescription = response[i].cleanDescription.replace(/&quot;/gi,'"');
					response[i].cleanDescription = response[i].cleanDescription.replace(/&#39;/gi,"'");
					response[i].cleanDescription = response[i].cleanDescription.replace(/&lt;/gi,"<");
					response[i].cleanDescription = response[i].cleanDescription.replace(/&gt;/gi,">");

					//for News Briefing
					rss.briefing = rss.briefing + response[i].source + ". " + response[i].title + ".\n - ";


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
				rss.briefing = rss.briefing + "이상 입니다.";
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

	var NewsBriefing = function() {
		setTimeout(function () {
			console.log('rss.feed[i].title : ' + rss.briefing);
			if(responsiveVoice.voiceSupport()) {
				responsiveVoice.speak(rss.briefing,"Korean Female");
				//responsiveVoice.speak("다음 뉴스 입니다.","Korean Female");
			}
		}, 2000);
	}

	SpeechService.addCommand('read_news', function () {
		Focus.change("default");
		NewsBriefing();	
	});

}


angular.module('SmartMirror')
    .controller('Rss', Rss);
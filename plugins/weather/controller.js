function Weather($scope, $interval, $http, GeolocationService) {

//	var language = (typeof config.general.language !== 'undefined') ? config.general.language.substr(0, 2) : "en"
	var geoposition = {}
	var weather = {}
	var gSummary = '';

	weather.get = function () {
		return $http.jsonp('https://api.forecast.io/forecast/' + config.forecast.key + '/' +
            geoposition.coords.latitude + ',' + geoposition.coords.longitude + '?units=' +
            config.forecast.units + "&callback=JSON_CALLBACK")
//            config.forecast.units + "&lang=" + language + "&callback=JSON_CALLBACK")
            .then(function (response) {
		//NaverTrans(weather.forecast.data.daily.summary);
//		response.data.daily.summary = NaverTrans(response.data.daily.summary);
//					weather.forecast.data.hourly.summary
	return weather.forecast = response;
});
	};

	/*jwpark S*/
	function NaverTrans1(summary) {
		var express = require('express');
		var app = express();
		var client_id = '';
		var client_secret = '';
		var query = summary;

		app.get('/translate', function (req, res) {
			var api_url = 'https://openapi.naver.com/v1/language/translate';
			var request = require('request');
			var options = {
				url: api_url,
				form: {'source':'ko', 'target':'en', 'text':query},
				headers: {'X-Naver-Client-Id':client_id, 'X-Naver-Client-Secret': client_secret}
			};
			request.post(options, function (error, response, body) {
				if (!error && response.statusCode == 200) {
					res.writeHead(200, {'Content-Type': 'text/json;charset=utf-8'});
					res.end(body);
				} else {
					res.status(response.statusCode).end();
					console.log('error = ' + response.statusCode);
				}
			});
		});
	
		app.listen(3000, function () {
			console.log('http://127.0.0.1:3000/translate app listening on port 3000!');
		});
	}

	function NaverTrans(summary) {
		var NaverTranslator = require('naver-translator');
		var clientId = config.naver_transe.id;
		var clientSecret = config.naver_transe.key;
		var credentials = {
			client_id : clientId,
			client_secret : clientSecret
		};
		var translator = new NaverTranslator(credentials);

		var params = {
			text : summary,
			source : 'en',
			target : 'ko'
		};

		var callback = function (result) {
			console.log(result);
			gSummary = result;
			//gSummary = result;
			//weather.forecast.data.daily.summary = result;
			//console.log('1111111 : ' + weather.forecast.data.daily.summary);
		};
	
		translator.translate(params, callback);
/*
		let kmaWeather = require('kma-js').Weather;
		kmaWeather.townWeather('37.49543016888596', '127.03781811461468')
			.then(data => console.log(data));
*/
	}
	/*jwpark E*/

	weather.minutelyForecast = function () {
		if (weather.forecast === null) {
			return null;
		}
		return weather.forecast.data.minutely;
	}

    //Returns the current forecast along with high and low tempratures for the current day
	weather.currentForecast = function () {
		if (weather.forecast === null) {
			return null;
		}

		weather.forecast.data.currently.day = moment.unix(weather.forecast.data.currently.time).format('ddd');
		weather.forecast.data.currently.temperature = parseFloat(weather.forecast.data.currently.temperature).toFixed(0);
		weather.forecast.data.currently.wi = "wi-forecast-io-" + weather.forecast.data.currently.icon;
		weather.forecast.data.currently.iconAnimation = weather.forecast.data.currently.icon;
		return weather.forecast.data.currently;
	}

	weather.weeklyForecast = function () {
		if (weather.forecast === null) {
			return null;
		}

        // Add human readable info to info
		for (var i = 0; i < weather.forecast.data.daily.data.length; i++) {
			weather.forecast.data.daily.data[i].day = moment.unix(weather.forecast.data.daily.data[i].time).format('ddd');
			weather.forecast.data.daily.data[i].temperatureMin = parseFloat(weather.forecast.data.daily.data[i].temperatureMin).toFixed(0);
			weather.forecast.data.daily.data[i].temperatureMax = parseFloat(weather.forecast.data.daily.data[i].temperatureMax).toFixed(0);
			weather.forecast.data.daily.data[i].wi = "wi-forecast-io-" + weather.forecast.data.daily.data[i].icon;
			weather.forecast.data.daily.data[i].counter = String.fromCharCode(97 + i);
			weather.forecast.data.daily.data[i].iconAnimation = weather.forecast.data.daily.data[i].icon;
		}
		console.log('weather.forecast.data.daily.summary : ' + weather.forecast.data.daily.summary);
		
		return weather.forecast.data.daily;
	}

	weather.hourlyForecast = function () {
		if (weather.forecast === null) {
			return null;
		}

		console.error('weather.forecast.data.hourly.summary : ' + weather.forecast.data.hourly.summary);
		weather.forecast.data.hourly.day = moment.unix(weather.forecast.data.hourly.time).format('ddd')
		return weather.forecast.data.hourly;
	}

	GeolocationService.getLocation({ enableHighAccuracy: true }).then(function (geopo) {
		geoposition = geopo;
		refreshWeatherData(geoposition);
		$interval(refreshWeatherData, config.forecast.refreshInterval * 60000 || 7200000)
	});

	function refreshWeatherData() {
		weather.get().then(function () {
			$scope.currentForecast = weather.currentForecast();
			$scope.weeklyForecast = weather.weeklyForecast();
			$scope.hourlyForecast = weather.hourlyForecast();
			$scope.minutelyForecast = weather.minutelyForecast();
		}, function (err) {
			console.error(err)
		});
	}
}

angular.module('SmartMirror')
    .controller('Weather', Weather);

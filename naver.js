#https://github.com/Hana-Lee/naver-translator
$ npm install --save naver-translator

https://developers.naver.com/apps/#/myapps/oxeMsxVVvk4IE4VajfR9/overview



// 네이버 기계번역 API 예제
var express = require('express');
var app = express();
var client_id = '';
var client_secret = '';
var query = "what can I say?";
app.get('/translate', function (req, res) {
   var api_url = 'https://openapi.naver.com/v1/language/translate';
   var request = require('request');
   var options = {
       url: api_url,
       form: {'source':'en', 'target':'ko', 'text':query},
       headers: {'X-Naver-Client-Id':client_id, 'X-Naver-Client-Secret': client_secret}
    };
console.log('http://127.0.0.1:3000/translate app listening on port 3001!');
   request.post(options, function (error, response, body) {
console.log('http://127.0.0.1:3000/translate app listening on port 3002!');
     if (!error && response.statusCode == 200) {
console.log('http://127.0.0.1:3000/translate app listening on port 3003!');
       res.writeHead(200, {'Content-Type': 'text/json;charset=utf-8'});
       res.end(body);
     } else {
console.log('http://127.0.0.1:3000/translate app listening on port 3004!');
       res.status(response.statusCode).end();
       console.log('error = ' + response.statusCode);
     }
   });
 });
 app.listen(3000, function () {
   console.log('http://127.0.0.1:3000/translate app listening on port 3000!');
 });

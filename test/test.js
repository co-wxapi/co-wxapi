'use strict';
var test = require('ava');
var config = require('./config');
var wxapi = require('../')(config);

class TokenProvider {
  constructor(api){
    this.api = api;
  }

  *refreshTokens(){
    var result = yield this.api.token.getAccessToken();
    this.accessToken = result.access_token;
    result = yield this.api.jsapi.getTicket(this.accessToken);
    this.jsapiTicket = result.ticket;
  }

  *getAccessToken(){
    return this.accessToken;
  }

  *getJSAPITicket(){
    return this.jsapiTicket;
  }
}

test.before(function*(t){
  console.log('test.before');
  var provider = new TokenProvider(wxapi);
  yield provider.refreshTokens();
  wxapi.setTokenProvider(provider);
});

test('auth', function*(t){
  var url = yield wxapi.auth.getAuthUrl('http://www.baidu.com/?param1=a&param2=b');
  console.log('wxapi.auth.getAuthUrl',url);
  t.pass();
});

test('jsapi', function*(t){
  var config = yield wxapi.jsapi.wxConfig('http://www.baidu.com/');
  console.log('wxapi.jsapi.wxConfig',config);
  t.pass();
});

test('qrcode', function*(t){
  var result = yield wxapi.qrcode.getTicket(123, 3600*24*20);
  console.log(result);
  var image = yield wxapi.qrcode.getQRCode(result.ticket);
  console.log(image);
  t.pass();
});

test('message', function*(t){
  var result;
  //var result = yield wxapi.msg.setIndustry(1,4);
  //console.log('wxapi.msg.setIndustry', result);
  result = yield wxapi.msg.getTemplateId('TM00015');
  console.log('wxapi.msg.getTemplateId', result);
  result = yield wxapi.msg.sendTemplateMessage(config.tester, result.template_id, {}, 'http://www.baidu.com');
  console.log('wxapi.msg.getTemplateId', result);
  t.pass();
});

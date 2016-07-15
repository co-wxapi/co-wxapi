'use strict';
var WxBase = require('co-wxbase');
var MODULES = {
  auth: 'co-wxauth',
  pay : 'co-wxpay',
  jsapi: 'co-wxjsapi',
  token: 'co-wxtoken',
  msg : 'co-wxmsg',
  qrcode: 'co-wxqrcode',
  asset: 'co-wxasset'
}

class WxAPI extends WxBase{
  constructor(config){
    super(config);
    // Initial access token
    var modules = config.modules || ['auth', 'token', 'jsapi', 'pay', 'qrcode', 'msg', 'asset'];
    modules.forEach((mod)=>{
      var modFile = MODULES[mod];
      this[mod] = require(modFile)(config);
    });
    this.modules = modules;
  }

  setTokenProvider(provider){
    this.modules.forEach((mod)=>{
      this[mod].setTokenProvider(provider);
    });
  }
}

module.exports = function(config){
  var wxapi = new WxAPI(config);
  return wxapi;
}

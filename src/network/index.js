var config = require('../config');
var cors = require('./cors');

function fetchGet(url) {
  var direct = function () { return fetch(url).then(function (r) { return r.text(); }); };
  var proxy  = function () { return fetch(config.PROXY + encodeURIComponent(url)).then(function (r) { return r.text(); }); };
  if (!cors.isCorsOk()) return proxy();
  return direct().catch(function () { cors.setCorsFail(); return proxy(); });
}

function fetchPost(url, params) {
  var body = Object.keys(params).map(function (k) {
    return encodeURIComponent(k) + '=' + encodeURIComponent(params[k]);
  }).join('&');

  var doPost = function () {
    return fetch(url, {
      method : 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded', 'X-Requested-With': 'XMLHttpRequest' },
      body   : body
    }).then(function (r) { return r.json(); });
  };
  var doGet = function () {
    return fetch(config.PROXY + encodeURIComponent(url + '?' + body)).then(function (r) { return r.json(); });
  };

  if (!cors.isCorsOk()) return doGet();
  return doPost().catch(function () { cors.setCorsFail(); return doGet(); });
}

module.exports = {
  fetchGet: fetchGet,
  fetchPost: fetchPost,
};

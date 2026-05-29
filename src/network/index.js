var config = require('../config');

function fetchGet(url) {
  return new Promise(function (resolve, reject) {
    var network = new Lampa.Reguest();
    network.native(url, function (data) {
      resolve(data);
    }, function (a, c) {
      reject(new Error(network.errorDecode(a, c)));
    }, false, {
      dataType: 'text',
      timeout: 15000
    });
  });
}

function fetchPost(url, params) {
  return new Promise(function (resolve, reject) {
    var network = new Lampa.Reguest();
    var body = Object.keys(params).map(function (k) {
      return encodeURIComponent(k) + '=' + encodeURIComponent(params[k]);
    }).join('&');

    network.native(url, function (data) {
      resolve(data);
    }, function (a, c) {
      reject(new Error(network.errorDecode(a, c)));
    }, body, {
      type: 'POST',
      dataType: 'json',
      timeout: 15000,
      headers: {
        'X-Requested-With': 'XMLHttpRequest'
      }
    });
  });
}

module.exports = {
  fetchGet: fetchGet,
  fetchPost: fetchPost,
};

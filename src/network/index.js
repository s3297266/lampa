var config = require('../config');

function fetchGet(url) {
  console.log('[HDRezka] fetchGet:', url);
  return new Promise(function (resolve, reject) {
    var network = new Lampa.Reguest();
    network.native(url, function (data) {
      console.log('[HDRezka] fetchGet success, length:', data ? data.length : 0);
      resolve(data);
    }, function (a, c) {
      console.log('[HDRezka] fetchGet error:', a, c);
      reject(new Error(network.errorDecode(a, c)));
    }, false, {
      dataType: 'text',
      timeout: 15000
    });
  });
}

function fetchPost(url, params) {
  console.log('[HDRezka] fetchPost:', url, params);
  return new Promise(function (resolve, reject) {
    var network = new Lampa.Reguest();
    var body = Object.keys(params).map(function (k) {
      return encodeURIComponent(k) + '=' + encodeURIComponent(params[k]);
    }).join('&');

    network.native(url, function (data) {
      console.log('[HDRezka] fetchPost success:', data);
      resolve(data);
    }, function (a, c) {
      console.log('[HDRezka] fetchPost error:', a, c);
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

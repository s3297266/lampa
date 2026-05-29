var config = require('../config');
var network = require('../network');

function searchRezka(query) {
  var url = config.SITE + '/search/?do=search&subaction=search&q=' + encodeURIComponent(query);
  return network.fetchGet(url).then(function (html) {
    var d = new DOMParser().parseFromString(html, 'text/html');
    var items = [];
    d.querySelectorAll('.b-content__inline_item').forEach(function (el) {
      var a   = el.querySelector('a.b-content__inline_item-link');
      var img = el.querySelector('img');
      if (!a) return;
      var hm = (a.href || '').match(/\/(\d+)-/);
      var tv = a.querySelector('div');
      items.push({
        id    : hm ? hm[1] : '',
        title : tv ? tv.textContent.trim() : a.textContent.trim(),
        poster: img ? img.src : '',
        url   : a.href
      });
    });
    return items;
  });
}

module.exports = searchRezka;

var config = require('../config');
var network = require('../network');

function getEpisodes(titleId, translatorId, season) {
  return network.fetchPost(config.SITE + '/ajax/get_cdn_series/', {
    id: titleId, translator_id: translatorId,
    season: season, episode: 1, action: 'get_episodes'
  }).then(function (data) {
    if (!data.episodes) return [];
    var d = new DOMParser().parseFromString(data.episodes, 'text/html');
    var eps = [];
    d.querySelectorAll('.b-simple_episode__item').forEach(function (el) {
      eps.push({ id: el.dataset.episode, name: el.textContent.trim() });
    });
    return eps;
  });
}

module.exports = getEpisodes;

var config = require('../config');
var network = require('../network');
var parseStreams = require('../parser/streams');

function getStream(titleId, translatorId, season, episode, isSeries) {
  var p = { id: titleId, translator_id: translatorId };
  var endpoint;
  if (isSeries) {
    p.season  = season;
    p.episode = episode;
    p.action  = 'get_stream';
    endpoint  = '/ajax/get_cdn_series/';
  } else {
    p.action = 'get_movie';
    endpoint = '/ajax/get_cdn_movie/';
  }
  return network.fetchPost(config.SITE + endpoint, p).then(function (data) {
    if (!data.success) throw new Error(data.message || 'API error');
    return parseStreams(data.url);
  });
}

module.exports = getStream;

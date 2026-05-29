var api = require('../api');

function startPlay(streams, card) {
  var quality = {};
  streams.forEach(function (s) { quality[s.label] = s.url; });

  Lampa.Player.play({
    url      : streams[0].url,
    title    : card.title || card.original_title || '',
    quality  : quality,
    subtitles: []
  });

  Lampa.Player.playlist([{
    url      : streams[0].url,
    title    : card.title || card.original_title || '',
    quality  : quality,
    subtitles: []
  }]);
}

function playMovie(state, html, showError, card) {
  var r   = state.rezka;
  var tid = state.curTranslator.id;

  html.empty();
  html.append('<div class="broadcast__scan"><div></div></div>');

  api.getStream(r.titleId, tid, 1, 1, false).then(function (streams) {
    if (!streams.length) { showError('Потоки не знайдено'); return; }
    startPlay(streams, card);
  }).catch(function (e) {
    showError('Помилка отримання потоку: ' + e.message);
  });
}

function playEpisode(state, html, showError, ep, card) {
  var r   = state.rezka;
  var tid = state.curTranslator.id;
  var sid = state.curSeason ? state.curSeason.id : 1;

  html.empty();
  html.append('<div class="broadcast__scan"><div></div></div>');

  api.getStream(r.titleId, tid, sid, ep.id, true).then(function (streams) {
    if (!streams.length) { showError('Потоки не знайдено'); return; }
    startPlay(streams, card);
  }).catch(function (e) {
    showError('Помилка отримання потоку: ' + e.message);
  });
}

module.exports = {
  startPlay: startPlay,
  playMovie: playMovie,
  playEpisode: playEpisode,
};

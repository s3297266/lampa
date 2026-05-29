var api = require('../api');
var parser = require('../parser');
var createRenderers = require('./renderers');
var player = require('./player');

function RezkaComponent(object) {
  console.log('[HDRezka] Component created, object:', object);
  
  var movie = object.movie || {};
  var html = $('<div class="rezka-wrap"></div>');
  var search_query = (object.search_one || object.search || movie.title || movie.original_title || '').toLowerCase();
  
  console.log('[HDRezka] Search query:', search_query);

  var loader = $('<div class="broadcast__scan"><div></div></div>');
  html.append(loader);

  var state = {
    results: [],
    selected: null,
    rezka: null,
    translators: [],
    seasons: [],
    episodes: [],
    curTranslator: null,
    curSeason: null,
  };

  function showError(msg) {
    console.log('[HDRezka] Error:', msg);
    html.empty();
    html.append('<div class="empty"><div class="empty__img"></div><div class="empty__title">' + msg + '</div></div>');
  }

  function loadTitle(item) {
    console.log('[HDRezka] Loading title:', item);
    html.empty();
    html.append('<div class="broadcast__scan"><div></div></div>');

    api.fetchGet(item.url).then(function (pageHtml) {
      console.log('[HDRezka] Page loaded, length:', pageHtml.length);
      state.selected = item;
      state.rezka = parser.parsePage(pageHtml);
      console.log('[HDRezka] Parsed page:', state.rezka);
      state.translators = state.rezka.translators;
      state.seasons = state.rezka.seasons;
      state.curTranslator = state.translators[0] || { id: '0', name: 'Авто' };

      if (state.rezka.isSeries) {
        loadSeason(state.seasons[0] || { id: '1', name: 'Сезон 1' });
      } else {
        playMovie();
      }
    }).catch(function (e) {
      console.log('[HDRezka] Load error:', e);
      showError('Помилка завантаження: ' + e.message);
    });
  }

  function loadSeason(season) {
    console.log('[HDRezka] Loading season:', season);
    state.curSeason = season;
    html.empty();
    html.append('<div class="broadcast__scan"><div></div></div>');

    var r = state.rezka;
    var tid = state.curTranslator.id;

    api.getEpisodes(r.titleId, tid, season.id).then(function (eps) {
      console.log('[HDRezka] Episodes loaded:', eps.length);
      state.episodes = eps;
      renderers.renderEpisodes(season);
    }).catch(function (e) {
      console.log('[HDRezka] Episodes error:', e);
      showError('Помилка отримання епізодів: ' + e.message);
    });
  }

  function playMovie() {
    console.log('[HDRezka] Playing movie');
    player.playMovie(state, html, showError, movie);
  }

  function playEpisode(ep) {
    console.log('[HDRezka] Playing episode:', ep);
    player.playEpisode(state, html, showError, ep, movie);
  }

  var renderers = createRenderers(html, state, movie, loadTitle, loadSeason, playEpisode, showError);

  console.log('[HDRezka] Starting search...');
  api.searchRezka(search_query).then(function (items) {
    console.log('[HDRezka] Search results:', items.length, items);
    state.results = items;

    var exact = items.find(function (i) {
      return i.title.toLowerCase() === search_query;
    });

    if (exact) {
      console.log('[HDRezka] Exact match found:', exact);
      loadTitle(exact);
    } else {
      console.log('[HDRezka] No exact match, showing results');
      renderers.renderResults(items);
    }
  }).catch(function (e) {
    console.log('[HDRezka] Search error:', e);
    showError('Помилка пошуку: ' + e.message);
  });

  this.render = function () { return html; };
  this.start = function () { Lampa.Controller.enable('content'); };
  this.pause = function () {};
  this.stop = function () {};
  this.destroy = function () { html.remove(); };
}

module.exports = RezkaComponent;

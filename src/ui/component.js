var api = require('../api');
var parser = require('../parser');
var createRenderers = require('./renderers');
var player = require('./player');

function RezkaComponent(object) {
  var card   = object.card;
  var html   = $('<div class="rezka-wrap"></div>');
  var search_query = (card.original_title || card.title || '').toLowerCase();

  var loader = $('<div class="broadcast__scan"><div></div></div>');
  html.append(loader);

  var state = {
    results   : [],
    selected  : null,
    rezka     : null,
    translators: [],
    seasons   : [],
    episodes  : [],
    curTranslator: null,
    curSeason : null,
  };

  function showError(msg) {
    html.empty();
    html.append('<div class="empty"><div class="empty__img"></div><div class="empty__title">' + msg + '</div></div>');
  }

  function loadTitle(item) {
    html.empty();
    html.append('<div class="broadcast__scan"><div></div></div>');

    api.fetchGet(item.url).then(function (pageHtml) {
      state.selected = item;
      state.rezka    = parser.parsePage(pageHtml);
      state.translators = state.rezka.translators;
      state.seasons     = state.rezka.seasons;
      state.curTranslator = state.translators[0] || { id: '0', name: 'Авто' };

      if (state.rezka.isSeries) {
        loadSeason(state.seasons[0] || { id: '1', name: 'Сезон 1' });
      } else {
        playMovie();
      }
    }).catch(function (e) {
      showError('Помилка завантаження: ' + e.message);
    });
  }

  function loadSeason(season) {
    state.curSeason = season;
    html.empty();
    html.append('<div class="broadcast__scan"><div></div></div>');

    var r  = state.rezka;
    var tid = state.curTranslator.id;

    api.getEpisodes(r.titleId, tid, season.id).then(function (eps) {
      state.episodes = eps;
      renderers.renderEpisodes(season);
    }).catch(function (e) {
      showError('Помилка отримання епізодів: ' + e.message);
    });
  }

  function playMovie() {
    player.playMovie(state, html, showError, card);
  }

  function playEpisode(ep) {
    player.playEpisode(state, html, showError, ep, card);
  }

  var renderers = createRenderers(html, state, card, loadTitle, loadSeason, playEpisode, showError);

  api.searchRezka(search_query).then(function (items) {
    state.results = items;

    var exact = items.find(function (i) {
      return i.title.toLowerCase() === search_query;
    });

    if (exact) {
      loadTitle(exact);
    } else {
      renderers.renderResults(items);
    }
  }).catch(function (e) {
    showError('Помилка пошуку: ' + e.message);
  });

  this.render = function () { return html; };
  this.start  = function () { Lampa.Controller.enable('content'); };
  this.pause  = function () {};
  this.stop   = function () {};
  this.destroy= function () { html.remove(); };
}

module.exports = RezkaComponent;

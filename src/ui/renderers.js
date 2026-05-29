function createRenderers(html, state, card, loadTitle, loadSeason, playEpisode, showError) {
  function renderResults(items) {
    html.empty();
    if (!items.length) { showError('Нічого не знайдено на HDRezka'); return; }

    var title = $('<div class="rezka-section-title" style="color:var(--color-second);margin-bottom:1em;font-size:1.2em;">Результати пошуку на HDRezka</div>');
    html.append(title);

    var list = $('<div class="rezka-list" style="display:flex;flex-wrap:wrap;gap:1em;"></div>');
    items.forEach(function (item) {
      var el = $('<div class="card selector" style="width:120px;cursor:pointer;text-align:center;"></div>');
      var img = $('<img style="width:120px;height:170px;object-fit:cover;border-radius:4px;" />');
      img.attr('src', item.poster || '');
      var name = $('<div style="font-size:0.8em;margin-top:0.3em;overflow:hidden;white-space:nowrap;text-overflow:ellipsis;">' + item.title + '</div>');
      el.append(img).append(name);
      el.on('click', function () { loadTitle(item); });
      list.append(el);
    });
    html.append(list);

    Lampa.Controller.enable('content');
  }

  function renderEpisodes(season) {
    html.empty();

    if (state.translators.length > 1) {
      var tWrap = $('<div style="margin-bottom:0.8em;"></div>');
      tWrap.append('<span style="color:var(--color-second);margin-right:0.5em;">Переклад:</span>');
      state.translators.forEach(function (t) {
        var btn = $('<span class="selector" style="margin-right:0.5em;padding:0.2em 0.6em;border-radius:4px;cursor:pointer;">' + t.name + '</span>');
        if (t.id === state.curTranslator.id) btn.css('background', 'var(--color-second)');
        btn.on('click', function () { loadSeason(state.curSeason); });
        tWrap.append(btn);
      });
      html.append(tWrap);
    }

    if (state.seasons.length > 1) {
      var sWrap = $('<div style="margin-bottom:0.8em;"></div>');
      sWrap.append('<span style="color:var(--color-second);margin-right:0.5em;">Сезон:</span>');
      state.seasons.forEach(function (s) {
        var btn = $('<span class="selector" style="margin-right:0.5em;padding:0.2em 0.6em;border-radius:4px;cursor:pointer;">' + s.name + '</span>');
        if (s.id === season.id) btn.css('background', 'var(--color-second)');
        btn.on('click', function () { loadSeason(s); });
        sWrap.append(btn);
      });
      html.append(sWrap);
    }

    var epTitle = $('<div style="color:var(--color-second);margin-bottom:0.5em;">' + season.name + '</div>');
    html.append(epTitle);

    if (!state.episodes.length) {
      html.append('<div style="opacity:0.6;">Епізоди не знайдено</div>');
      return;
    }

    var epList = $('<div style="display:flex;flex-wrap:wrap;gap:0.5em;"></div>');
    state.episodes.forEach(function (ep) {
      var btn = $('<span class="selector" style="padding:0.4em 0.8em;border-radius:4px;cursor:pointer;border:1px solid var(--color-second);">' + ep.name + '</span>');
      btn.on('click', function () { playEpisode(ep); });
      epList.append(btn);
    });
    html.append(epList);

    Lampa.Controller.enable('content');
  }

  return {
    renderResults: renderResults,
    renderEpisodes: renderEpisodes,
  };
}

module.exports = createRenderers;

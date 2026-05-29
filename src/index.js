var config = require('./config');
var RezkaComponent = require('./ui/component');

function startPlugin() {
  if (window.plugin_hdrezka_ready) return;
  window.plugin_hdrezka_ready = true;

  Lampa.Component.add('rezka', RezkaComponent);

  var button = '<div class="full-start__button selector view--rezka">'
    + '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="28" height="28">'
    + '<path d="M8 5v14l11-7z"/>'
    + '</svg>'
    + '<span>' + config.PLUGIN + '</span>'
    + '</div>';

  Lampa.Listener.follow('full', function (e) {
    if (e.type !== 'complite') return;

    var btn = $(button);

    btn.on('hover:enter', function () {
      Lampa.Activity.push({
        url: '',
        title: config.PLUGIN,
        component: 'rezka',
        search: e.data.movie.title,
        search_one: e.data.movie.title,
        search_two: e.data.movie.original_title,
        movie: e.data.movie,
        page: 1
      });
    });

    e.object.activity.render().find('.view--torrent').after(btn);
  });

  console.log('[' + config.PLUGIN + '] Плагін завантажено ✓');
}

if (typeof Lampa !== 'undefined') {
  if (window.appready) {
    startPlugin();
  } else {
    Lampa.Listener.follow('app', function (e) {
      if (e.type === 'ready') startPlugin();
    });
  }
}

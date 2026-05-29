var config = require('./config');
var RezkaComponent = require('./ui/component');

function startPlugin() {
  if (window.plugin_hdrezka_ready) return;
  window.plugin_hdrezka_ready = true;

  console.log('[HDRezka] Start plugin');

  Lampa.Component.add('rezka', RezkaComponent);

  var button = '<div class="full-start__button selector view--rezka">'
    + '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="28" height="28">'
    + '<path d="M8 5v14l11-7z"/>'
    + '</svg>'
    + '<span>' + config.PLUGIN + '</span>'
    + '</div>';

  Lampa.Listener.follow('full', function (e) {
    console.log('[HDRezka] Full listener event:', e.type);
    if (e.type !== 'complite') return;

    var btn = $(button);

    btn.on('hover:enter', function () {
      console.log('[HDRezka] Button clicked, movie:', e.data.movie);
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

    var torrentBtn = e.object.activity.render().find('.view--torrent');
    console.log('[HDRezka] Torrent button found:', torrentBtn.length);
    
    if (torrentBtn.length) {
      torrentBtn.after(btn);
      console.log('[HDRezka] Button added after torrent');
    } else {
      e.object.activity.render().find('.full-start').last().after(btn);
      console.log('[HDRezka] Button added after last full-start');
    }
  });

  console.log('[HDRezka] Plugin loaded ✓');
}

if (typeof Lampa !== 'undefined') {
  console.log('[HDRezka] Lampa found, appready:', window.appready);
  if (window.appready) {
    startPlugin();
  } else {
    Lampa.Listener.follow('app', function (e) {
      console.log('[HDRezka] App event:', e.type);
      if (e.type === 'ready') startPlugin();
    });
  }
} else {
  console.log('[HDRezka] Lampa not found yet');
}

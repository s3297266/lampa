var config = require('./config');
var RezkaComponent = require('./ui/component');

function addButton() {
  Lampa.Listener.follow('full', function (e) {
    if (e.type !== 'complite') return;

    var button = $('<div class="full-start selector" style="margin-left:0.5em;">'
      + '<svg height="28" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>'
      + '<span style="margin-left:0.3em;">' + config.PLUGIN + '</span>'
      + '</div>');

    button.on('click', function () {
      Lampa.Activity.push({
        url      : '',
        title    : config.PLUGIN,
        component: 'rezka',
        card     : e.object.card,
        page     : 1
      });
    });

    var watchBtn = e.object.activity.render().find('.full-start').first();
    if (watchBtn.length) {
      watchBtn.after(button);
    } else {
      e.object.activity.render().find('.full-details').append(button);
    }
  });
}

function startPlugin() {
  if (window[config.PLUGIN + '_ready']) return;
  window[config.PLUGIN + '_ready'] = true;

  Lampa.Component.add('rezka', RezkaComponent);
  addButton();

  console.log('[' + config.PLUGIN + '] Плагін завантажено ✓');
}

function init() {
  if (typeof Lampa === 'undefined') {
    return setTimeout(init, 100);
  }

  if (window.appready) {
    startPlugin();
  } else {
    Lampa.Listener.follow('app', function (e) {
      if (e.type === 'ready') startPlugin();
    });
  }
}

init();

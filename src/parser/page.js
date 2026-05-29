function parsePage(html) {
  var d = new DOMParser().parseFromString(html, 'text/html');

  var idM = html.match(/initCDN(?:Series|Movie)Events\((\d+)[,\s]/) ||
            html.match(/"id_post"[:\s"]+(\d+)/);
  var titleId = idM ? idM[1] : '';

  var isSeries = !!d.querySelector('.b-simple_season__item');

  var translators = [];
  d.querySelectorAll('.b-translators__item, .b-translator__item').forEach(function (el) {
    var tid = el.dataset.translatorId || el.dataset.translator_id;
    if (tid) translators.push({ id: tid, name: el.textContent.trim() });
  });
  if (!translators.length) {
    var tm = html.match(/translator_id['":\s]+(\d+)/);
    if (tm) translators.push({ id: tm[1], name: 'Оригінал' });
  }

  var seasons = [];
  d.querySelectorAll('.b-simple_season__item').forEach(function (el) {
    seasons.push({ id: el.dataset.tab, name: el.textContent.trim() });
  });

  return { titleId: titleId, isSeries: isSeries, translators: translators, seasons: seasons };
}

module.exports = parsePage;

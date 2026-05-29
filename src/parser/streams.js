function parseStreams(raw) {
  if (!raw) return [];

  var decoded = raw;
  try {
    decoded = raw
      .replace(/\/\//g, '/')
      .replace(/\#h/g, '')
      .split('/').filter(Boolean).join('/');
    if (!decoded.startsWith('http')) decoded = raw;
  } catch(e) { decoded = raw; }

  var streams = [];
  var re = /\[([^\]]+)\](https?:\/\/[^\s,\[]+)/g;
  var m;
  while ((m = re.exec(decoded)) !== null) {
    streams.push({ label: m[1], url: m[2].split(' or ')[0] });
  }
  if (!streams.length && /https?:\/\//.test(decoded)) {
    streams.push({ label: 'Auto', url: decoded.trim().split(' or ')[0] });
  }
  var order = ['2160p', '1080p Ultra', '1080p', '720p', '480p', '360p', 'Auto'];
  streams.sort(function (a, b) {
    var ai = order.indexOf(a.label);
    var bi = order.indexOf(b.label);
    return (ai < 0 ? 99 : ai) - (bi < 0 ? 99 : bi);
  });
  return streams;
}

module.exports = parseStreams;

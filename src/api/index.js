var network = require('../network');

module.exports = {
  searchRezka: require('./search'),
  getEpisodes: require('./episodes'),
  getStream: require('./stream'),
  fetchGet: network.fetchGet,
};

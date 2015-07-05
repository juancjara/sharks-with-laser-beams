var digitalOceanAPI = require('../digital-ocean-api');
var logTable = require('../helpers/log-table');
var dropletStorage = require('../storage/droplet');

var list = function() {
  digitalOceanAPI.list().then(function(droplestInfo) {
    droplestStorage.save(list);
    logTable(droplestInfo);
  });
}

module.exports = list;
list.list = list;
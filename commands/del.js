var digitalOceanAPI = require('../digital-ocean-api');
var dropletStorage = require('../storage/droplet');

var del = function() {
  digitalOceanAPI.delete()
    .then(function() {
      dropletStorage.clean();
      console.log('all deleted');
    });
};

module.exports = del;
del.del = del;
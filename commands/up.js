var digitalOceanAPI = require('../digital-ocean-api');
var dropletStorage = require('../storage/droplet');
var _ = require('lodash');
var logTable = require('../helpers/log-table');

var up = function(instances) {
  instances 
  digitalOceanAPI
    .create({instances: instances})
    .then(handleNewInstaces);
};

var waitInstancesActive = function() {

  digitalOceanAPI.list()
    .then(function(list) {
      
      var numActives = list.reduce(function(acc, item) {
        return acc + (item.status === 'active'? 1: 0)
      }, 0);

      process.stdout.write(".");
      if (numActives !== list.length) {
        setTimeout(waitInstancesActive, 3000);
      } else {
        logTable(list);
        dropletStorage.save(list);
        console.log('\nsharks ready');
      }
    })
}

var handleNewInstaces = function(newDroplets) {
  var ids = newDroplets.map(function(e) {return {id: e.droplet.id}});
  dropletStorage.save(ids);

  waitInstancesActive();
}


module.exports = up;
up.up = up;

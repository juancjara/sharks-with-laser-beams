var _ = require('lodash');

var commonStorage = require('./common-storage');

var droplet = {
  mainField: 'droplets',
  path: __dirname + '/../droplets.json',

  save: function(data) {
    droplet.set(droplet.mainField, data);
  },

  getDroplets: function() {
    return droplet.get(droplet.mainField);
  },

  ids: function() {
    return droplet.getDroplets().map(function(d) {return d.id});
  },

  ips: function() {
    return droplet.getDroplets().map(function(d) {return d.ip});
  },

  clean: function() {
    droplet.save([]);
  }
}

_.assign(droplet, commonStorage);

module.exports = droplet;
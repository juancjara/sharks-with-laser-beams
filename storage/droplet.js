var fs = require('fs');

var path = '../droplets.json';

var droplet = {
  save: function(data) {
    data = JSON.stringify({droplets: data});
    fs.writeFileSync(path, data);
  },

  all: function() {
    return JSON.parse(fs.readFileSync(path, 'utf8')).droplets;
  },

  ids: function() {
    return droplet.all().map(function(d) {return d.id});
  },

  ips: function() {
    return droplet.all().map(function(d) {return d.ip});
  },

  clean: function() {
    droplet.save([]);
  }

}

module.exports = droplet;
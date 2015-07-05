var fs = require('fs');

var path = '../config.json';

var config = {
  save: function(data) {
    fs.writeFileSync(path, JSON.stringify(data));
  },

  set: function(field, data) {
    var obj= {} 
    obj[field] = data;
    config.save(obj);
  },

  all: function() {
    return JSON.parse(fs.readFileSync(path, 'utf8'));
  },

  get: function(field) {
    return config.all().field;
  }
};

module.exports = config;
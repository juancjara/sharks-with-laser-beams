var fs = require('fs');
var _ = require('lodash');

var commonStorage = require('./common-storage');

var config = {

  path: __dirname + '/../config.json',

  setToken: function() {
    config.set('token');
  },

  getToken: function() {
    //or just should call config.get('token'), 
    //cause if misspelled error is hard to debug
    return config.get('token');
  }
};

_.assign(config, commonStorage);

module.exports = config;
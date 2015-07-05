var sys = require('sys');
var exec = require('child_process').exec;

var request = require('superagent');
var _ = require('lodash');
var Q = require('q');

var dropletStorage = require('./storage/droplet.js');
var configStorage = require('./storage/config.js');

var token = configStorage.getToken();
var endPoint = 'https://api.digitalocean.com/v2';

var defaults = {
  instances: 1,
  pathKey: '~/.ssh/test.pub'
};

var urlActions = {
  droplets : '/droplets',
  createKey: '/account/keys'
};

var methods = {
  GET: 'get',
  POST: 'post',
  DELETE: 'delete'
};

var getToken = function() {
  if (token) return token;
  return token = configStorage.getToken();
}

var getFingerPrint = function(path) {
  var deferred = Q.defer();

  function puts(error, stdout, stderr) { 
    if (error) return deferred.reject(error);
    deferred.resolve(stdout.split(' ')[1]);
  }
  exec("ssh-keygen -lf " + path, puts);

  return deferred.promise;
}

var consume = function(url, data, method) {
  var req = request(method, url)
    .set('Content-Type', 'application/json')
    .set('Authorization', 'Bearer ' + getToken());

  return Q.promise(function(resolve, reject) {
    req.send(data).end(function(err, data) {
      if (err) console.log(err);
      if (err) return reject(err);
      resolve(data.body);
    });
  }); 
}

var extractData = function(droplet) {
  return {
    id: droplet.id,
    name: droplet.name,
    status: droplet.status,
    ip: droplet.networks.v4[0] && droplet.networks.v4[0].ip_address,
    region: droplet.region.name,
    priceHourly: droplet.size.price_hourly
  }
};

var create = function(params) {

  //default should be here???
  params = params || {};

  var instances = params.instances || defaults.instances;

  return getFingerPrint(params.pathKey || defaults.pathKey)
    .then(function(fingerPrint) {

      var data = {
        name: 'sharks',
        region: 'nyc3',
        size: '512mb',
        image: "ubuntu-14-04-x64",
        ssh_keys: [fingerPrint]
      };
      var tasks = []

      while (instances--) {
        tasks.push(consume(endPoint + '/droplets', data, methods.POST));
      }
      
      return Q.all(tasks);
    });
  
  
  
};

var list =function() {
  
  return Q.promise(function(resolve, reject) {
    var ids = dropletStorage.ids();
    
    consume(endPoint + '/droplets', {}, methods.GET)
      .then(function(data) {
    
        var filtered = data.droplets
          .filter(function(droplet) {
            return _.includes(ids, droplet.id);
          })
          .map(extractData);
    
        resolve(filtered);
      });
  })
};

var del = function() {
  var ids = dropletStorage.ids();

  var tasks = ids.map(function(id) {
    return consume(endPoint + '/droplets/'+ id, {}, methods.DELETE);
  });

  return Q.all(tasks);
};

var addKey = function() {

}

var api = function() {};
module.exports = api;
api.create = create;
api.list = list;
api.delete = del;

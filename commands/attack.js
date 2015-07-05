var dropletStorage = require('../storage/droplet.js');
var exec = require('child_process').exec;
var format = require('string-format');

var commandTemplate = 'printf "{0}" | xargs -P {1} -n1 -I % ssh -oStrictHostKeyChecking=no root@% ' +
  '"sudo apt-get install apache2-utils -y > /dev/null; ab -n {2} -c {3} {4}"'

function puts(error, stdout, stderr) { 
  if (error) return console.log(error);
  console.log(stdout);
  console.log('sharks done');
}

var attack = function(requests, current, url) {
  requests = requests || 100;
  current = current || 25;
  var ips = dropletStorage.ips();
  var command = format(commandTemplate, ips.join(' \\n '), ips.length, requests, current, url);
  exec(command, puts);
  console.log('pew pew !');
}

module.exports = attack;
attack.attack = attack;

var Table = require('cli-table');
var _ = require('lodash');

var logTable = function(data) {
  var headers = _.keys(data[0]);

  var table = new Table({head: headers});
  
  data
    .map(_.values)
    .forEach(function(d) {
      table.push(d);
    }); 

  console.log(table.toString());
}

module.exports = logTable;
logTable.logTable = logTable;

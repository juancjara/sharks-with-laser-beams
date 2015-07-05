var fs = require('fs');

var commonStorage = {

  _save: function(data) {
    fs.writeFileSync(this.path, JSON.stringify(data));
  },

  all: function() {
    return JSON.parse(fs.readFileSync(this.path, 'utf8'));
  },

  get: function(field) {
    return this.all()[field];
  },

  set: function(field, data) {
    var initialObj = this.all();
    initialObj[field] = data;
    this._save(initialObj);
  },

  removeField: function(field) {
    var initialObj = this.all();
    if (field in initialObj) {
      delete initialObj[field];
      this._save(initialObj);
    }
  }
}

module.exports = commonStorage;
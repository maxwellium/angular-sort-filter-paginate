var
  db      = require('mongoose'),
  options = {
    'connect': 'mongodb://localhost/sort-filter-paginate-examples',
    'user': '',
    'password': ''
  };

db.connect(options.connect);

var userSchema = new db.Schema({

  name  : String,
  nested: { field1: String },
  cs    : String,
  exact : String

});

userSchema.statics.sfp = function(options, callback){
  var
    that = this,
    params = {},
    query;

  if (options.filter) {
    for (var i in options.filter) {
      params[i] = options.filter[i];
    }
  }

  query = this.find(params);

  if (options.sort) {
    query.sort(options.sort);
  }
  if (options.limit) {
    query.limit(options.limit);
  }
  if (options.skip) {
    query.skip(options.skip);
  }

  query.exec(function(error, results){
    if (error) {
      return callback(error);
    }
    that.count(params, function(error, count){
      if (error) {
        return callback(error);
      }
      return callback(null, results, count);
    });
  });
};

module.exports = db.model('User', userSchema);

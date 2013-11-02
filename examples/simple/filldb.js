var User = require('./model');

var
  groups = [ 'abc', 'acb', 'bac', 'bca', 'cab', 'cba' ],
  user;

var randomStringCS = function(length){
  var
    text = '',
    possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for( var i=0; i < length; i++ ){
    text += possible.charAt( Math.floor(Math.random() * possible.length) );
  }

  return text;
};

var randomGroup = function(){
  return groups[ Math.floor(Math.random() * groups.length) ];
};

for (var i = 0; i < 200; i++) {
  user = {
    name  : 'name '+ i,
    nested: { field1: 'nestedfield '+ i },
    cs    : randomStringCS(10),
    exact : randomGroup()
  };
  (new User(user)).save();
}
var
  express = require('express'),
  app     = express(),
  path    = require('path');

var User = require('./model');


app.use(express.logger('dev'));
app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));


app.use( '/Public/app'                                    , express.static(__dirname +'/Public'             ) );
app.use( '/Public/components'                             , express.static(__dirname +'/../bower_components') );
app.use( '/Public/components/angular-sort-filter-paginate', express.static(__dirname +'/../..'              ) );


app.get( '/api/user/rest', function(req, res, next){

  User.sfp(req.query, function(error, users, count){
    res.header( 'x-count', count );
    res.send( users );
  });

} );


app.get('*', function(req, res) {
  if (!req.xhr) {
    res.sendfile( __dirname +'/Public/index.html' );
  }
});

app.listen(3000);

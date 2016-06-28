var express         = require( 'express' ),
    app             = express(),
    debug           = require( 'debug' )( 'app' ),
    error           = require( './lib/error' ),
    session         = require( './lib/session' ),
    start           = require( './lib/start' );

// Set the PORT and ENV variables and start the server
app.set( 'port', process.env.PORT || 3000 );
app.set( 'env', process.env.ENV || 'development' );

start.launch( app );

var applications    = require( './routers/applications' ),
    courses         = require( './routers/courses' ),
    groups          = require( './routers/groups' ),
    periods         = require( './routers/periods' ),
    schools         = require( './routers/schools' ),
    sessions        = require( './routers/sessions' ),
    users           = require( './routers/users' );

app.use( '/applications', applications );
app.use( '/sessions', sessions );

app.use( session.validate );

app.use( '/courses', courses );
app.use( '/groups', groups );
app.use( '/periods', periods );
app.use( '/schools', schools );
app.use( '/users', users );

app.use( error.notFound );
app.use( error.handler );

var server          = app.listen( app.get('port'), function() {
    debug( 'Express server listening on port ' + server.address().port );
});

module.exports      = app;
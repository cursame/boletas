var express         = require( 'express' ),
    bodyParser      = require( 'body-parser' ),
    logger          = require( 'morgan' ),
    Utils           = require( './utils' );

exports.launch      = function ( app ) {
    Utils.connectDB();

    app.use( logger( 'dev' ) );
    app.use( bodyParser.json() );
    app.use( bodyParser.urlencoded({ extended : false }) );
};
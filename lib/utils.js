var mongoose        = require( 'mongoose' ),
    db              = require( '../config/db' );

exports.connectDB   = function () {
    var conn_str    = 'mongodb://';

    if ( db.user ) {
        conn_str    += db.user;
        if ( db.pass ) {
            conn_str    += ':' + db.pass;
        }

        conn_str    += '@';
    }
    conn_str        += db.host + ':' + db.port + '/' + db.database;

    mongoose.connect( conn_str );
};

exports.cors        = function ( req, res, next ) {
    res.header( 'Access-Control-Allow-Origin', '*' );
    res.header( 'Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE, OPTIONS' );
    res.header( 'Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Lenght, X-Requested-With' );

    if ( req.method == 'OPTIONS' ) {
        res.sendStatus( 200 );
    } else {
        next();
    }
};
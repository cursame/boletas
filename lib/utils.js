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
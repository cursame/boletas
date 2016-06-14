exports.notFound    = function ( req, res, next ) {
    var err     = new Error( 'Invalid resource specified' );
    err.status  = 404;
    next( err );
};

exports.handler     = function ( err, req, res, next ) {
    res.status( err.status );

    var response    = {
        error       : err.message,
        status      : err.status
    };

    res.json( response );
};
var express         = require( 'express' ),
    router          = express.Router(),
    Encrypt         = require( '../lib/encrypt' ),
    SessionHandler  = require( '../lib/session' );

router.post( '/', function ( req, res, next ) {
    SessionHandler.login( req, function ( session ) {
        if ( session ) {
            res.json({
                token           : Encrypt.encode( session.id ),
                access_level    : session.access_level,
                school          : session.school,
                user            : session.user_id
            });
        } else {
            var err     = new Error( 'Invalid credentials' );
            err.status  = 403;
            next( err );
        }
    });
});

router.delete( '/:session', SessionHandler.validate, function ( req, res, next ) {
    req.session.remove( function ( err ) {
        res.json({
            message : "Session terminated"
        });
    });
});

module.exports  = router;
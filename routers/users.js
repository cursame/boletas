var express     = require( 'express' ),
    User        = require( '../models/user' ),
    router      = express.Router();

router.post( '/', function ( req, res, next ) {
    if ( req.session.access_level > 1 ) {
        var err     = new Error( 'Permission denied' );
        err.status  = 401;

        next( err );
    } else {
        User.create({
            email   : req.body.email,
            name    : req.body.name,
            pass    : req.body.pass,
            school  : req.body.school,
            type    : req.body.type
        }, function ( err, user ) {
            if ( err || !user ) {
                err         = new Error( 'Invalid user data' );
                err.status  = 400;

                next( err );
            } else {
                res.json( user );
            }
        });
    }
});

router.delete( '/:id', function ( req, res, next ) {
    User.findById( req.params.id, function ( err, user ) {
        if ( err || !user ) {
            err         = new Error( 'Invalid user id' );
            err.status  = 404;

            next( err );
        } else if ( req.session.access_level > 1 && req.session.user != user.id ) {
            err         = new Error( 'Permission denied' );
            err.status  = 401;

            next( err );
        } else {
            user.remove( function ( err ) {
                res.json( user );
            });
        }
    });
});

module.exports  = router;
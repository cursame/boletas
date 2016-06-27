var express     = require( 'express' ),
    School      = require( '../models/school' ),
    router      = express.Router();

router.post( '/', function ( req, res, next ) {
    if ( req.session.access_level != 0 ) {
        var err     = new Error( 'Permission denied' );
        err.status  = 401;

        next( err );
    } else {
        School.create({
            features    : req.body.features,
            name        : req.body.name,
            settings    : req.body.settings
        }, function ( err, school ) {
            if ( err || !school ) {
                err         = new Error( 'Invalid school data' );
                err.status  = 400;

                next( err );
            } else {
                res.json( school );
            }
        });
    }
});

router.delete( '/:id', function ( req, res, next ) {
    School.findById( req.params.id, function ( err, school ) {
        if ( err || !school ) {
            err         = new Error( 'Invalid school id' );
            err.status  = 404;

            next( err );
        } else if ( req.session.access_level != 0 && ( req.session.access_level != 1 && req.session.school != school.id ) ) {
            err         = new Error( 'Permission denied' );
            err.status  = 401;

            next( err );
        } else {
            school.remove( function ( err ) {
                res.json( school );
            });
        }
    });
});

module.exports  = router;
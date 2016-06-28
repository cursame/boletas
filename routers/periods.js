var express     = require( 'express' ),
    Period      = require( '../models/period' ),
    router      = express.Router();

router.post( '/', function ( req, res, next ) {
    if ( req.session.access_level > 1 ) {
        var err     = new Error( 'Permission denied' );
        err.status  = 401;

        next( err );
    } else {
        Period.create({
            due_date    : req.body.due_date,
            group       : req.body.group,
            name        : req.body.name,
            school      : req.body.school
        }, function ( err, period ) {
            if ( err || !period ) {
                err         = new Error( 'Invalid period data' );
                err.status  = 400;

                next( err );
            } else {
                res.json( period );
            }
        });
    }
});

router.delete( '/:id', function ( req, res, next ) {
    Period.findById( req.params.id, function ( err, period ) {
        if ( err || !period ) {
            err         = new Error( 'Invalid period id' );
            err.status  = 404;

            next( err );
        } else if ( req.session.access_level != 0 && ( req.session.access_level != 1 && req.session.school != period.school ) ) {
            err         = new Error( 'Permission denied' );
            err.status  = 401;

            next( err );
        } else {
            period.remove( function ( err ) {
                res.json( period );
            });
        }
    });
});

module.exports  = router;
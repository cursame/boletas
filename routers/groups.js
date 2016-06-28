var express     = require( 'express' ),
    Group       = require( '../models/group' ),
    router      = express.Router();

router.post( '/', function ( req, res, next ) {
    if ( req.session.access_level > 1 ) {
        var err     = new Error( 'Permission denied' );
        err.status  = 401;

        next( err );
    } else {
        Group.create({
            administrator   : req.body.administrator,
            name            : req.body.name,
            school          : req.body.school
        }, function ( err, group ) {
            if ( err || !group ) {
                err         = new Error( 'Invalid group data' );
                err.status  = 400;

                next( err );
            } else {
                res.json( group );
            }
        });
    }
});

router.delete( '/:id', function ( req, res, next ) {
    Group.findById( req.params.id, function ( err, group ) {
        if ( err || !group ) {
            err         = new Error( 'Invalid group id' );
            err.status  = 404;

            next( err );
        } else if ( req.session.access_level != 0 && ( req.session.access_level != 1 && req.session.school != group.school ) ) {
            err         = new Error( 'Permission denied' );
            err.status  = 401;

            next( err );
        } else {
            group.remove( function ( err ) {
                res.json( group );
            });
        }
    });
});

module.exports  = router;
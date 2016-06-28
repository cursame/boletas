var express     = require( 'express' ),
    Grade       = require( '../models/grade' ),
    router      = express.Router();

router.post( '/', function ( req, res, next ) {
    if ( req.session.access_level != 0 && req.session.access_level != 1 && req.session.access_level != 3 ) {
        var err     = new Error( 'Permission denied' );
        err.status  = 401;

        next( err );
    } else {
        Grade.create({
            course      : req.body.course,
            features    : req.body.features,
            grade       : req.body.grade,
            period      : req.body.period,
            student     : req.body.student,
            teacher     : req.body.teacher
        }, function ( err, grade ) {
            if ( err || !grade ) {
                err         = new Error( 'Invalid grade data' );
                err.status  = 400;

                next( err );
            } else {
                res.json( grade );
            }
        });
    }
});

router.delete( '/:id', function ( req, res, next ) {
    Grade.findById( req.params.id, function ( err, grade ) {
        if ( err || !grade ) {
            err         = new Error( 'Invalid grade id' );
            err.status  = 404;

            next( err );
        } else if ( req.session.access_level > 1 ) {
            err         = new Error( 'Permission denied' );
            err.status  = 401;

            next( err );
        } else {
            grade.remove( function ( err ) {
                res.json( grade );
            });
        }
    });
});

module.exports  = router;
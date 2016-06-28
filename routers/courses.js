var express     = require( 'express' ),
    Course      = require( '../models/course' ),
    router      = express.Router();

router.post( '/', function ( req, res, next ) {
    if ( req.session.access_level > 1 ) {
        var err     = new Error( 'Permission denied' );
        err.status  = 401;

        next( err );
    } else {
        Course.create({
            features    : req.body.features,
            name        : req.body.name,
            school      : req.body.school,
            students    : req.body.students,
            teacher     : req.body.teacher
        }, function ( err, course ) {
            if ( err || !course ) {
                err         = new Error( 'Invalid course data' );
                err.status  = 400;

                next( err );
            } else {
                res.json( course );
            }
        });
    }
});

router.put( '/:id', function ( req, res, next ) {
    var updated = function ( err, course ) {
        if ( err ) {
            err         = new Error( 'Invalid course data' );
            err.status  = 403;
            return next( err );
        }

        res.json( course );
    };

    Course.findById( req.params.id, function ( err, course ) {
        if ( err ) {
            err         = new Error( 'Invalid course id' );
            err.status  = 404;

            return next( err );
        } else if ( req.session.access_level > 1 ) {
            err         = new Error( 'Permission denied' );
            err.status  = 401;

            next( err );
        } else {
            for ( var key in req.body ) {
                course[key]   = req.body[key];
            }

            course.save( updated );
        }
    });
});

router.delete( '/:id', function ( req, res, next ) {
    Course.findById( req.params.id, function ( err, course ) {
        if ( err || !course ) {
            err         = new Error( 'Invalid course id' );
            err.status  = 404;

            next( err );
        } else if ( req.session.access_level > 1 ) {
            err         = new Error( 'Permission denied' );
            err.status  = 401;

            next( err );
        } else {
            course.remove( function ( err ) {
                res.json( course );
            });
        }
    });
});

module.exports  = router;
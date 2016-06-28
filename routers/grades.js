var express     = require( 'express' ),
    Grade       = require( '../models/grade' ),
    router      = express.Router(),
    _getRefs    = function () {
        return [
            {
                field   : 'course',
                select  : 'name'
            },
            {
                field   : 'period',
                select  : 'name'
            },
            {
                field   : 'student',
                select  : 'email name'
            },
            {
                field   : 'teacher',
                select  : 'email name'
            }
        ];
    };

router.get( '/:id', function ( req, res, next ) {
    var cursor      = Grade.findById( req.params.id ),
        callback    = function ( err, grade ) {
            if ( err || !grade ) {
                err         = new Error( 'Invalid grade id' );
                err.status  = 404;
                next( err );
            } else {
                res.json( grade );
            }
        };

    if ( req.query.expanded && req.query.expanded === 'true' ) {
        var refs    = _getRefs();
        for ( var i = 0; i < refs.length; i++ ) {
            cursor.populate( refs[i].field, refs[i].select );
        }

        cursor.exec( callback );
    } else {
        cursor.exec( callback )
    }
});

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

router.put( '/:id', function ( req, res, next ) {
    var updated = function ( err, grade ) {
        if ( err ) {
            err         = new Error( 'Invalid grade data' );
            err.status  = 403;
            return next( err );
        }

        res.json( grade );
    };

    Grade.findById( req.params.id, function ( err, grade ) {
        if ( err ) {
            err         = new Error( 'Invalid grade id' );
            err.status  = 404;

            return next( err );
        } else if ( req.session.access_level > 1 ) {
            err         = new Error( 'Permission denied' );
            err.status  = 401;

            next( err );
        } else {
            for ( var key in req.body ) {
                grade[key]   = req.body[key];
            }

            grade.save( updated );
        }
    });
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
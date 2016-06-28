var express     = require( 'express' ),
    Period      = require( '../models/period' ),
    router      = express.Router(),
    _getRefs    = function () {
        return [
            {
                field   : 'group',
                select  : 'name'
            },
            {
                field   : 'school',
                select  : 'features name settings'
            }
        ];
    };

router.get( '/:id', function ( req, res, next ) {
    var cursor      = Period.findById( req.params.id ),
        callback    = function ( err, period ) {
            if ( err || !period ) {
                err         = new Error( 'Invalid period id' );
                err.status  = 404;
                next( err );
            } else {
                res.json( period );
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

router.put( '/:id', function ( req, res, next ) {
    var updated = function ( err, period ) {
        if ( err ) {
            err         = new Error( 'Invalid period data' );
            err.status  = 403;
            return next( err );
        }

        res.json( period );
    };

    Period.findById( req.params.id, function ( err, period ) {
        if ( err ) {
            err         = new Error( 'Invalid period id' );
            err.status  = 404;

            return next( err );
        } else if ( req.session.access_level > 1 ) {
            err         = new Error( 'Permission denied' );
            err.status  = 401;

            next( err );
        } else {
            for ( var key in req.body ) {
                period[key]   = req.body[key];
            }

            period.save( updated );
        }
    });
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
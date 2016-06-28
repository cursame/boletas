var express     = require( 'express' ),
    Group       = require( '../models/group' ),
    router      = express.Router(),
    _getRefs    = function () {
        return [
            {
                field   : 'administrator',
                select  : 'email name'
            },
            {
                field   : 'school',
                select  : 'features name settings'
            }
        ];
    };

router.get( '/:id', function ( req, res, next ) {
    var cursor      = Group.findById( req.params.id ),
        callback    = function ( err, group ) {
            if ( err || !group ) {
                err         = new Error( 'Invalid group id' );
                err.status  = 404;
                next( err );
            } else {
                res.json( group );
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

router.put( '/:id', function ( req, res, next ) {
    var updated = function ( err, group ) {
        if ( err ) {
            err         = new Error( 'Invalid group data' );
            err.status  = 403;
            return next( err );
        }

        res.json( group );
    };

    Group.findById( req.params.id, function ( err, group ) {
        if ( err ) {
            err         = new Error( 'Invalid group id' );
            err.status  = 404;

            return next( err );
        } else if ( req.session.access_level != 0 && ( req.session.access_level != 1 && req.session.school != group.school ) ) {
            err         = new Error( 'Permission denied' );
            err.status  = 401;

            next( err );
        } else {
            for ( var key in req.body ) {
                group[key]   = req.body[key];
            }

            group.save( updated );
        }
    });
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
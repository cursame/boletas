var express     = require( 'express' ),
    User        = require( '../models/user' ),
    Utils       = require( '../lib/utils' ),
    router      = express.Router(),
    _getRefs    = function () {
        return [
            {
                field   : 'school',
                select  : 'features name settings'
            }
        ];
    };

router.get( '/', function ( req, res, next ) {
    var filters     = [ '_id', 'creation_date', 'email', 'name', 'school', 'type' ];

    Utils.paginate( User, filters, _getRefs(), req, res, next );
});

router.get( '/:id', function ( req, res, next ) {
    var cursor      = User.findById( req.params.id ),
        callback    = function ( err, user ) {
            if ( err || !user ) {
                err         = new Error( 'Invalid user id' );
                err.status  = 404;
                next( err );
            } else {
                res.json( user );
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

router.put( '/:id', function ( req, res, next ) {
    var updated = function ( err, user ) {
        if ( err ) {
            err         = new Error( 'Invalid user data' );
            err.status  = 403;
            return next( err );
        }

        res.json( user );
    };

    User.findById( req.params.id, function ( err, user ) {
        if ( err ) {
            err         = new Error( 'Invalid user id' );
            err.status  = 404;

            return next( err );
        } else if ( req.session.access_level > 1 && req.session.user != user.id ) {
            err         = new Error( 'Permission denied' );
            err.status  = 401;

            next( err );
        } else {
            for ( var key in req.body ) {
                if ( key == 'creation_date' || key == 'pass' ) continue;

                user[key]   = req.body[key];
            }

            user.save( updated );
        }
    });
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
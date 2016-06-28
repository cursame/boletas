var express     = require( 'express' ),
    School      = require( '../models/school' ),
    Utils       = require( '../lib/utils' ),
    router      = express.Router();

router.get( '/', function ( req, res, next ) {
    var filters     = [ '_id', 'creation_date', 'name' ];

    Utils.paginate( School, filters, [], req, res, next );
});

router.get( '/:id', function ( req, res, next ) {
    School.findById( req.params.id, function ( err, school ) {
        if ( err || !school ) {
            err         = new Error( 'Invalid school id' );
            err.status  = 404;

            next( err );
        } else {
            res.json( school );
        }
    });
});

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

router.put( '/:id', function ( req, res, next ) {
    var updated = function ( err, school ) {
        if ( err ) {
            err         = new Error( 'Invalid school data' );
            err.status  = 403;
            return next( err );
        }

        res.json( school );
    };

    School.findById( req.params.id, function ( err, school ) {
        if ( err ) {
            err         = new Error( 'Invalid school id' );
            err.status  = 404;

            return next( err );
        } else if ( req.session.access_level != 0 && ( req.session.access_level != 1 && req.session.school != school.id ) ) {
            err         = new Error( 'Permission denied' );
            err.status  = 401;

            next( err );
        } else {
            for ( var key in req.body ) {
                if ( key == "creation_date" ) continue;

                school[key]   = req.body[key];
            }

            school.save( updated );
        }
    });
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
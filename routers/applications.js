var Application = require( '../models/application' ),
    Encrypt     = require( '../lib/encrypt' ),
    express     = require( 'express' ),
    router      = express.Router();

router.post( '/', function ( req, res, next ) {
    Application.create({
        description : req.body.description,
        name        : req.body.name,
        permissions : req.body.permissions
    }, function ( err, application ) {
        if ( err || !application ) {
            err.status  = 403;

            return next( err );
        } else {
            application.secret  = Encrypt.decode( application.secret );
            res.json( application );
        }
    });
});

router.put( '/:id', function ( req, res, next ) {
    var updated = function ( err, application ) {
        application.secret  = Encrypt.decode( application.secret );
        res.json( application );
    }

    Application.findById( req.params.id, function ( err, application ) {
        if ( err || !application ) {
            err.status  = 404;

            return next( err );
        } else {
            for ( var key in req.body ) {
                if ( key == 'creation_date' || key == 'secret' ) {
                    continue;
                }
                application[key]  = req.body[key];
            }

            application.save( updated );
        }
    });
});

router.delete( '/:id', function ( req, res, next ) {
    var removed = function ( err, application ) {
        res.json( application );
    };

    Application.findById( req.params.id, function ( err, application ) {
        if ( err || !application ) {
            err.status  = 404;

            return next( err );
        } else {
            application.remove( removed );
        }
    });
});

module.exports  = router;
var mongoose    = require( 'mongoose' ),
    bcrypt      = require( 'bcrypt' ),
    UserSchema  = new mongoose.Schema({
        creation_date   : {
            type        : Date,
            required    : true,
            default     : Date.now
        },
        email           : {
            type        : String,
            required    : true,
            index       : {
                unique  : true
            }
        },
        name            : {
            type        : String,
            required    : true
        },
        pass            : {
            type        : String,
            required    : false
        },
        school          : {
            type        : mongoose.Schema.Types.ObjectId,
            ref         : 'School',
            required    : true
        },
        type            : {
            type        : Number,
            required    : true
        }
    });

UserSchema.method( 'auth', function ( pass, cb ) {
    var user    = this;
    bcrypt.compare( pass, user.pass, function( err, isMatch ) {
        if ( !isMatch ) {
            cb( false );
        } else {
            cb( user );
        }
    });
});

UserSchema.pre( 'save', function ( next ) {
    var user    = this;

    if ( !user.isModified( 'pass' ) ) {
        next();
    } else {
        bcrypt.hash( user.pass, 10, function ( err, hash ) {
            user.pass   = hash;
            next();
        });
    }
});

module.exports  = mongoose.model( 'User', UserSchema );
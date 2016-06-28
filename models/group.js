var mongoose        = require( 'mongoose' ),
    GroupSchema     = new mongoose.Schema({
        administrator   : {
            type        : mongoose.Schema.Types.ObjectId,
            ref         : 'User',
            required    : true
        },
        name            : {
            type        : String,
            required    : true
        },
        school          : {
            type        : mongoose.Schema.Types.ObjectId,
            ref         : 'School',
            required    : true
        }
    });

module.exports      = mongoose.model( 'Group', GroupSchema );
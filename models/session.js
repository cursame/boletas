var mongoose        = require( 'mongoose' ),
    SessionSchema   = new mongoose.Schema({
        access_level    : {
            type        : Number,
            required    : true
        },
        last_activity   : {
            type        : Date,
            required    : true,
            default     : Date.now
        },
        school          : {
            type        : mongoose.Schema.Types.ObjectId,
            ref         : 'School',
            required    : true
        },
        timestamp       : {
            type        : Date,
            required    : true,
            default     : Date.now
        },
        user_id         : {
            type        : String,
            required    : true
        }
    });

module.exports      = mongoose.model( 'Session', SessionSchema );
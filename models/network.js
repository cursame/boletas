var mongoose        = require( 'mongoose' ),
    NetworkSchema   = new mongoose.Schema({
        creation_date   : {
            type        : Date,
            required    : true,
            default     : Date.now
        },
        name            : {
            type        : String,
            required    : true
        }
    });

module.exports      = mongoose.model( 'Network', NetworkSchema );
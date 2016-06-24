var mongoose        = require( 'mongoose' ),
    SchoolSchema    = new mongoose.Schema({
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

module.exports      = mongoose.model( 'School', SchoolSchema );
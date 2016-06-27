var mongoose        = require( 'mongoose' ),
    SchoolSchema    = new mongoose.Schema({
        creation_date   : {
            type        : Date,
            required    : true,
            default     : Date.now
        },
        features        : {
            type        : Array,
            required    : false
        },
        name            : {
            type        : String,
            required    : true
        },
        settings        : {
            type        : Object,
            required    : false
        }
    });

module.exports      = mongoose.model( 'School', SchoolSchema );
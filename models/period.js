var mongoose        = require( 'mongoose' ),
    PeriodSchema    = new mongoose.Schema({
        due_date        : {
            type        : Date,
            required    : true
        },
        group           : {
            type        : mongoose.Schema.Types.ObjectId,
            ref         : 'Group',
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

module.exports      = mongoose.model( 'Period', PeriodSchema );
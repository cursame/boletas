var mongoose        = require( 'mongoose' ),
    CourseSchema    = new mongoose.Schema({
        features        : {
            type        : Array,
            required    : false
        },
        group           : {
            type        : mongoose.Schema.Types.ObjectId,
            ref         : 'Group',
            required    : true
        },
        name            : {
            type        : String,
            required    : true,
            index       : {
                unique  : true
            }
        },
        school          : {
            type        : mongoose.Schema.Types.ObjectId,
            ref         : 'School',
            required    : true
        },
        students        : [{
            type        : mongoose.Schema.Types.ObjectId,
            ref         : 'User',
            required    : true
        }],
        teacher         : {
            type        : mongoose.Schema.Types.ObjectId,
            ref         : 'User',
            required    : true
        }
    });

module.exports      = mongoose.model( 'Course', CourseSchema );
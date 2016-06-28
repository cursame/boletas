var mongoose    = require( 'mongoose' ),
    GradeSchema = new mongoose.Schema({
        course          : {
            type        : mongoose.Schema.Types.ObjectId,
            ref         : 'Course',
            required    : true
        },
        features        : {
            type        : Array,
            required    : true
        },
        grade           : {
            type        : Number,
            required    : true
        },
        period          : {
            type        : mongoose.Schema.Types.ObjectId,
            ref         : 'Period',
            required    : true
        },
        student         : {
            type        : mongoose.Schema.Types.ObjectId,
            ref         : 'User',
            required    : true
        },
        teacher         : {
            type        : mongoose.Schema.Types.ObjectId,
            ref         : 'User',
            required    : true
        }
    });

module.exports      = mongoose.model( 'Grade', GradeSchema );
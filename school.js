var Utils       = require( './lib/utils' ),
    School      = require( './models/school' ),
    name        = process.argv[2];

Utils.connectDB();

School.create({
    name        : name
}, function ( err, school ) {
    if ( err || !school ) {
        console.log( '============= ERROR ==============' );
        console.log( err );
    } else {
        console.log( '============= SCHOOL ==============' );
        console.log( 'ID - ' + school.id );
        console.log( 'Name - ' + school.name );
    }

    process.exit();
});
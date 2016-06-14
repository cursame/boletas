var Utils       = require( './lib/utils' ),
    Network     = require( './models/network' ),
    name        = process.argv[2];

Utils.connectDB();

Network.create({
    name        : name
}, function ( err, network ) {
    if ( err || !network ) {
        console.log( '============= ERROR ==============' );
        console.log( err );
    } else {
        console.log( '============= NETWORK ==============' );
        console.log( 'ID - ' + network.id );
        console.log( 'Name - ' + network.name );
    }

    process.exit();
});
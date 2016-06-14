var assert  = require( 'assert' ),
    should  = require( 'should' ),
    request = require( 'supertest' ),
    server  = require( '../server' ),
    Encrypt = require( '../lib/encrypt' )

describe( 'AnalyticsAPI Libraries', function () {
    var original    = "HelloWorldUnitTesting",
        encoded     = "";

    it ( 'encode the random string generated', function ( done ) {
        encoded     = Encrypt.encode( original );

        done();
    });

    it ( 'decode the previously generated string', function ( done ) {
        var decoded = Encrypt.decode( encoded );

        assert.equal( original, decoded );
        done();
    });

    it ( 'get an empty string when attempting to decode an invalid cipher', function ( done ) {
        assert.equal( "", Encrypt.decode( "invalid" ) );
        done();
    });
});
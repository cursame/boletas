var assert  = require( 'assert' ),
    should  = require( 'should' ),
    request = require( 'supertest' ),
    server  = require( '../server' ),
    Encrypt = require( '../lib/encrypt' ),
    String  = require( '../lib/string' );

describe( 'AnalyticsAPI Libraries', function () {
    var original    = "",
        encoded     = "";

    it ( 'generate a random string of 12 characters', function ( done ) {
        original    = String.random( 12, "alnum" );

        assert.equal( original.length, 12 );
        done();
    });

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

    it ( 'generate a random numeric string of 10 characters', function ( done ) {
        var random  = String.random( 10, 'numeric' );

        assert.equal( random.length, 10 );
        assert.equal( /^[0-9]+$/.test( random ), true );
        done();
    });

    it ( 'generate a random alpha string of 10 characters', function ( done ) {
        var random  = String.random( 10, 'alpha' );

        assert.equal( random.length, 10 );
        assert.equal( /^[A-z]+$/.test( random ), true );
        done();
    });
});
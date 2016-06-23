var assert      = require( 'assert' ),
    crypto      = require( 'crypto' ),
    should      = require( 'should' ),
    request     = require( 'supertest' ),
    server      = require( '../server' );

describe( 'BoletasAPI', function () {
    it ( 'return a 404 error for an invalid resource request', function ( done ) {
        request( server )
            .get( '/invalid' )
            .expect( 404, done );
    });

    it ( 'return a 200 status code for an options request', function ( done ) {
        request( server )
            .options( '/' )
            .expect( 200, done );
    });
});

describe( 'Sessions', function () {
    var invalid     = {
            email   : 'invalid@cursa.me',
            pass    : 'wrong'
        },
        user        = {
            email   : 'admin@cursa.me',
            pass    : 'admin'
        },
        session     = '';

    it ( 'should get a 403 error when attempting to start a session with invalid credentials', function ( done ) {
        request( server )
            .post( '/sessions' )
            .send( invalid )
            .expect( 403, done );
    });

    it ( 'should start a session in the system', function ( done ) {
        request( server )
            .post( '/sessions' )
            .send( user )
            .end( function ( err, res ) {
                if ( err ) {
                    throw err;
                }

                res.body.should.have.property( 'session' );

                session     = res.body.session;
                done();
            });
    });

    it ( 'should get a 404 error when attempting to delete an unexisting session', function ( done ) {
        request( server )
            .delete( '/sessions/4b61cce1e9de32f6c2c77d702b2286ff0058d9011ad69cadb39149f99cafd48b' )
            .expect( 404, done );
    });

    it ( 'should terminate the statrted session', function ( done ) {
        request( server )
            .delete( '/sessions/' + session )
            .expect( 200, done );
    });
});

describe( 'Applications', function () {
    var app_id          = "",
        application     = {
            name        : 'UnitTestApplication',
            description : 'Application created from the unit test environment to verify the applications resource.',
            permissions : [ 'sessions_write', 'users_write', 'users_read', 'rooms_write', 'rooms_read', 'hotels_write', 'hotels_read', 'reports_write', 'reports_read', 'complains_write', 'complains_read', 'clients_write', 'clients_read', 'products_write', 'products_read', 'sells_write', 'sells_read', 'purchases_write', 'purchases_read', 'payments_write', 'payments_read', 'shifts_write', 'shifts_read', 'applications_write', 'applications_read' ]
        },
        incomplete      = {
            name        : 'IncompleteUnitTestApplication',
            description : 'Application created from the unit test environment without full permissions to check the client authentication.',
            permissions : [ 'sessions_write', 'users_write', 'users_read', 'rooms_write', 'rooms_read', 'hotels_write', 'hotels_read', 'reports_write', 'reports_read', 'complains_write', 'complains_read', 'clients_write', 'clients_read', 'products_write', 'products_read', 'sells_write', 'sells_read', 'purchases_write', 'purchases_read', 'payments_write', 'payments_read' ]
        },
        creation        = "",
        secret          = "",
        incomplete_id   = "",
        inc_secret      = "";

    it ( 'create a new application in the system', function ( done ) {
        request( server )
            .post( '/applications' )
            .send( application )
            .end( function ( err, res ) {
                if ( err ) {
                    throw err;
                }

                res.body.should.have.property( '_id' );
                res.body.should.have.property( 'name' );
                res.body.should.have.property( 'creation_date' );
                res.body.should.have.property( 'description' );
                res.body.should.have.property( 'permissions' );
                res.body.should.have.property( 'secret' );

                app_id      = res.body._id;
                secret      = res.body.secret;
                creation    = res.body.creation_date;

                done();
            });
    });

    it ( 'get a 403 error when attempting to create an invalid application', function ( done ) {
        request( server )
            .post( '/applications' )
            .expect( 403, done );
    });

    it ( 'update the previously created application without modifying the creation date', function ( done ) {
        request( server )
            .put( '/applications/' + app_id )
            .send( { name : 'UnitTestApp', creation_date : Date.now() } )
            .end( function ( err, res ) {
                if ( err ) {
                    throw err;
                }

                res.body.should.have.property( '_id' );
                res.body.should.have.property( 'name' );
                res.body.should.have.property( 'creation_date' );
                res.body.should.have.property( 'description' );
                res.body.should.have.property( 'permissions' );
                res.body.should.have.property( 'secret' );

                assert.equal( 'UnitTestApp', res.body.name );
                assert.equal( secret, res.body.secret );
                assert.equal( creation, res.body.creation_date );

                done();
            });
    });

    it ( 'get a 404 error when attempting to update an invalid application', function ( done ) {
        request( server )
            .put( '/applications/not_there' )
            .expect( 404, done );
    });

    it ( 'create a new application in the system', function ( done ) {
        request( server )
            .post( '/applications' )
            .send( incomplete )
            .end( function ( err, res ) {
                if ( err ) {
                    throw err;
                }

                incomplete_id   = res.body._id;
                inc_secret      = res.body.secret;
                done();
            });
    });

    it ( 'remove the previously created application', function ( done ) {
        request( server )
            .delete( '/applications/' + incomplete_id )
            .expect( 200, done );
    });

    it ( 'remove the previously created application', function ( done ) {
        request( server )
            .delete( '/applications/' + app_id )
            .expect( 200, done );
    });
});
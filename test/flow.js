var assert      = require( 'assert' ),
    should      = require( 'should' ),
    request     = require( 'supertest' ),
    server      = require( '../server' );

describe( 'Server Flow', function () {
    var session         = '',
        school          = {
            features    : [
                {
                    name        : 'Presentation',
                    percentage  : 0.8
                },
                {
                    name        : 'Written Test',
                    percentage  : 0.2
                }
            ],
            name        : 'UnitTestSchool',
            settings    : {
                open_features   : true
            }
        },
        school_id       = '',
        user            = {
            email   : 'admin@cursa.me',
            pass    : 'admin'
        },
        coordinator     = {
            email   : 'coordinator@unitest.com',
            name    : 'John Unit Test',
            pass    : 'coordinator',
            type    : 1
        },
        coordinator_id  = '';

    it ( 'creates a super administrator user session', function ( done ) {
        request( server )
            .post( '/sessions' )
            .send( user )
            .end( function ( err, res ) {
                if ( err ) {
                    throw err;
                }

                session                 = res.body.session;
                school.session          = res.body.session;
                coordinator.session     = res.body.session;
                done();
            });
    });

    it ( 'creates a school record in the system', function ( done ) {
        request( server )
            .post( '/schools' )
            .send( school )
            .end( function ( err, res ) {
                if ( err ) {
                    throw err;
                }

                res.body.should.have.property( '_id' );
                res.body.should.have.property( 'creation_date' );
                res.body.should.have.property( 'features' );
                res.body.should.have.property( 'name' );
                res.body.should.have.property( 'settings' );

                school_id           = res.body._id;
                coordinator.school  = res.body._id;
                done();
            });
    });

    it ( 'updates the school record created', function ( done ) {
        request( server )
            .put( '/schools/' + school_id )
            .send({ name : 'UnitTestSchoolModified', settings : { open_features : false }, session : session })
            .end( function ( err, res ) {
                if ( err ) {
                    throw err;
                }

                assert.equal( 'UnitTestSchoolModified', res.body.name );
                assert.equal( false, res.body.settings.open_features );
                done();
            });
    });

    it ( 'retrieves a list of schools from the database', function ( done ) {
        request( server )
            .get( '/schools' )
            .send({ session : session })
            .end( function ( err, res ) {
                if ( err ) {
                    throw err;
                }

                res.body.should.have.property( 'results' );
                res.body.should.have.property( 'pagination' );
                res.body.pagination.should.have.property( 'page' );
                res.body.pagination.should.have.property( 'per_page' );
                res.body.pagination.should.have.property( 'total' );

                assert.equal( true, Array.isArray( res.body.results ) );
                done();
            });
    });

    it ( 'retrieves the school record by id', function ( done ) {
        request( server )
            .get( '/schools/' + school_id )
            .send({ session : session })
            .end( function ( err, res ) {
                if ( err ) {
                    throw err;
                }

                res.body.should.have.property( '_id' );
                res.body.should.have.property( 'creation_date' );
                res.body.should.have.property( 'features' );
                res.body.should.have.property( 'name' );
                res.body.should.have.property( 'settings' );

                done();
            });
    });

    it ( 'creates a coordinator user in the database', function ( done ) {
        request( server )
            .post( '/users' )
            .send( coordinator )
            .end( function ( err, res ) {
                if ( err ) {
                    throw err;
                }

                res.body.should.have.property( '_id' );
                res.body.should.have.property( 'creation_date' );
                res.body.should.have.property( 'email' );
                res.body.should.have.property( 'name' );
                res.body.should.have.property( 'pass' );
                res.body.should.have.property( 'school' );
                res.body.should.have.property( 'type' );

                coordinator_id  = res.body._id;
                done();
            });
    });

    it ( 'removes the coordinator user created', function ( done ) {
        request( server )
            .delete( '/users/' + coordinator_id )
            .send({ session : session })
            .expect( 200, done );
    });

    it ( 'removes the school record created', function ( done ) {
        request( server )
            .delete( '/schools/' + school_id )
            .send({ session : session })
            .expect( 200, done );
    });

    it ( 'removes the session created for testing purposes', function ( done ) {
        request( server )
            .delete( '/sessions/' + session )
            .expect( 200, done );
    });
});
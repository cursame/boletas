var assert      = require( 'assert' ),
    should      = require( 'should' ),
    request     = require( 'supertest' ),
    server      = require( '../server' );

describe( 'Server Flow', function () {
    var session     = '',
        school      = {
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
        school_id   = '',
        user        = {
            email   : 'admin@cursa.me',
            pass    : 'admin'
        };

    it ( 'creates a super administrator user session', function ( done ) {
        request( server )
            .post( '/sessions' )
            .send( user )
            .end( function ( err, res ) {
                if ( err ) {
                    throw err;
                }

                session         = res.body.session;
                school.session  = res.body.session;
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

                school_id   = res.body._id;
                done();
            });
    });

    it ( 'updated the school record created', function ( done ) {
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
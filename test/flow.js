var assert      = require( 'assert' ),
    should      = require( 'should' ),
    request     = require( 'supertest' ),
    server      = require( '../server' );

describe( 'Server Flow', function () {
    var coordinator     = {
            email   : 'coordinator@unitest.com',
            name    : 'John Unit Test',
            pass    : 'coordinator',
            type    : 1
        },
        coordinator_id  = '',
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
        session         = '',
        student         = {
            email   : 'student@unitest.com',
            name    : 'Student Unit Test',
            pass    : 'student',
            type    : 3
        },
        student_id      = '',
        teacher         = {
            email   : 'teacher@unitest.com',
            name    : 'Teacher Unit Test',
            pass    : 'teacher',
            type    : 2
        },
        teacher_id      = '',
        user            = {
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

                session                 = res.body.session;
                coordinator.session     = res.body.session;
                school.session          = res.body.session;
                student.session         = res.body.session;
                teacher.session         = res.body.session;
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
                student.school      = res.body._id;
                teacher.school      = res.body._id;
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

    it ( 'creates a teacher user in the database', function ( done ) {
        request( server )
            .post( '/users' )
            .send( teacher )
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

                teacher_id      = res.body._id;
                done();
            });
    });

    it ( 'creates a student user in the database', function ( done ) {
        request( server )
            .post( '/users' )
            .send( student )
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

                student_id      = res.body._id;
                done();
            });
    });

    it ( 'updates the coordinator user record created', function ( done ) {
        request( server )
            .put( '/users/' + coordinator_id )
            .send({ name : 'John Unit Modified', session : session })
            .expect( 200, done );
    });

    it ( 'retrieves a list of users from the database', function ( done ) {
        request( server )
            .get( '/users' )
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

    it ( 'retrieves an expanded list of coordinator users from the database', function ( done ) {
        request( server )
            .get( '/users?expanded=true&type=1' )
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
                assert.equal( 'object', typeof res.body.results[0].school );
                done();
            });
    });

    it ( 'retrieves the coordinator user by id', function ( done ) {
        request( server )
            .get( '/users/' + coordinator_id )
            .send({ session : session })
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

                assert.equal( 'string', typeof res.body.school );
                done();
            });
    });

    it ( 'retrieves the expanded coordinator user by id', function ( done ) {
        request( server )
            .get( '/users/' + coordinator_id + '?expanded=true' )
            .send({ session : session })
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

                assert.equal( 'object', typeof res.body.school );
                done();
            });
    });

    it ( 'removes the student user created', function ( done ) {
        request( server )
            .delete( '/users/' + student_id )
            .send({ session : session })
            .expect( 200, done );
    });

    it ( 'removes the teacher user created', function ( done ) {
        request( server )
            .delete( '/users/' + teacher_id )
            .send({ session : session })
            .expect( 200, done );
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
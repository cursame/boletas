var assert      = require( 'assert' ),
    should      = require( 'should' ),
    request     = require( 'supertest' ),
    server      = require( '../server' );

describe( 'Server Flow', function () {
    var administrator       = {
            email   : 'administrator@unitest.com',
            name    : 'Administrator Unit Test',
            pass    : 'administrator',
            type    : 2
        },
        administrator_id    = '',
        coordinator         = {
            email   : 'coordinator@unitest.com',
            name    : 'John Unit Test',
            pass    : 'coordinator',
            type    : 1
        },
        coordinator_id      = '',
        course              = {
            name        : 'UnitTestMath'
        },
        course_id           = '',
        grade               = {
            features    : [
                {
                    name    : 'Presentation',
                    grade   : 8
                },
                {
                    name    : 'Written Test',
                    grade   : 10
                }
            ],
            grade       : 8.6
        },
        grade_id            = '',
        group               = {
            name        : 'UnitTestA',
            students    : []
        },
        period              = {
            due_date    : Date.now(),
            name        : 'First Unit Test'
        },
        period_id           = '',
        school              = {
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
        school_id           = '',
        session             = '',
        student             = {
            email   : 'student@unitest.com',
            name    : 'Student Unit Test',
            pass    : 'student',
            type    : 4
        },
        student_id          = '',
        teacher             = {
            email   : 'teacher@unitest.com',
            name    : 'Teacher Unit Test',
            pass    : 'teacher',
            type    : 3
        },
        teacher_id          = '',
        user                = {
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

                session                 = res.body.token;
                administrator.session   = res.body.token;
                coordinator.session     = res.body.token;
                course.session          = res.body.token;
                grade.session           = res.body.token;
                group.session           = res.body.token;
                period.session          = res.body.token;
                school.session          = res.body.token;
                student.session         = res.body.token;
                teacher.session         = res.body.token;
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

                school_id               = res.body._id;
                administrator.school    = res.body._id;
                coordinator.school      = res.body._id;
                course.school           = res.body._id;
                group.school            = res.body._id;
                period.school           = res.body._id;
                student.school          = res.body._id;
                teacher.school          = res.body._id;
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

    it ( 'creates an administrator user in the database', function ( done ) {
        request( server )
            .post( '/users' )
            .send( administrator )
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

                administrator_id    = res.body._id;
                group.administrator = res.body._id;
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
                course.teacher  = res.body._id;
                grade.teacher   = res.body._id;
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
                grade.student   = res.body._id;
                group.students.push( res.body._id );
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

    it ( 'creates a group object in the database', function ( done ) {
        request( server )
            .post( '/groups' )
            .send( group )
            .end( function ( err, res ) {
                if ( err ) {
                    throw err;
                }

                res.body.should.have.property( '_id' );
                res.body.should.have.property( 'administrator' );
                res.body.should.have.property( 'name' );
                res.body.should.have.property( 'school' );
                res.body.should.have.property( 'students' );

                group_id        = res.body._id;
                course.group    = res.body._id;
                period.group    = res.body._id;
                done();
            });
    });

    it ( 'updates a group record in the system', function ( done ) {
        request( server )
            .put( '/groups/' + group_id )
            .send({ name : 'UnitTestModified', session : session })
            .expect( 200, done );
    });

    it ( 'retrieves a list of groups from the database', function ( done ) {
        request( server )
            .get( '/groups' )
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

    it ( 'retrieves an expanded list of groups from the database', function ( done ) {
        request( server )
            .get( '/groups?expanded=true&school=' + school_id )
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
                assert.equal( 'object', typeof res.body.results[0].administrator );
                assert.equal( 'object', typeof res.body.results[0].school );
                done();
            });
    });

    it ( 'gets a 404 error when attempting to retrieve an unexisting group record', function ( done ) {
        request( server )
            .get( '/groups/invalid_id' )
            .send({ session : session })
            .expect( 404, done );
    });

    it ( 'retrieves the group by id', function ( done ) {
        request( server )
            .get( '/groups/' + group_id )
            .send({ session : session })
            .end( function ( err, res ) {
                if ( err ) {
                    throw err;
                }

                res.body.should.have.property( '_id' );
                res.body.should.have.property( 'administrator' );
                res.body.should.have.property( 'name' );
                res.body.should.have.property( 'school' );
                res.body.should.have.property( 'students' );

                assert.equal( 'string', typeof res.body.administrator );
                assert.equal( 'string', typeof res.body.school );
                done();
            });
    });

    it ( 'retrieves an expanded group record by id', function ( done ) {
        request( server )
            .get( '/groups/' + group_id + '?expanded=true' )
            .send({ session : session })
            .end( function ( err, res ) {
                if ( err ) {
                    throw err;
                }

                res.body.should.have.property( '_id' );
                res.body.should.have.property( 'administrator' );
                res.body.should.have.property( 'name' );
                res.body.should.have.property( 'school' );

                assert.equal( 'object', typeof res.body.administrator );
                assert.equal( 'object', typeof res.body.school );
                assert.equal( 'object', typeof res.body.students[0] );
                done();
            });
    });

    it ( 'creates a course object in the database', function ( done ) {
        request( server )
            .post( '/courses' )
            .send( course )
            .end( function ( err, res ) {
                if ( err ) {
                    throw err;
                }

                res.body.should.have.property( '_id' );
                res.body.should.have.property( 'group' );
                res.body.should.have.property( 'name' );
                res.body.should.have.property( 'school' );
                res.body.should.have.property( 'teacher' );

                course_id       = res.body._id;
                grade.course    = res.body._id;
                done();
            });
    });

    it ( 'gets a 400 error when attempting to duplicate a course record', function ( done ) {
        request( server )
            .post( '/courses' )
            .send( course )
            .expect( 400, done );
    });

    it ( 'gets a 404 error when attempting to update and unexisting course', function ( done ) {
        request( server )
            .put( '/courses/invalid_id' )
            .send({ name : 'UnitTestModified', session : session })
            .expect( 404, done );
    });

    it ( 'updates a course record in the system', function ( done ) {
        request( server )
            .put( '/courses/' + course_id )
            .send({ name : 'UnitTestModified', session : session })
            .expect( 200, done );
    });

    it ( 'gets a 404 error when attempting to retrieve an unexisting course record', function ( done ) {
        request( server )
            .get( '/courses/invalid_id' )
            .send({ session : session })
            .expect( 404, done );
    });

    it ( 'retrieves a list of courses from the database', function ( done ) {
        request( server )
            .get( '/courses' )
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

    it ( 'retrieves an expanded list of courses from the database', function ( done ) {
        request( server )
            .get( '/courses?expanded=true&school=' + school_id )
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
                assert.equal( 'object', typeof res.body.results[0].group );
                assert.equal( 'object', typeof res.body.results[0].school );
                assert.equal( 'object', typeof res.body.results[0].teacher );
                done();
            });
    });

    it ( 'retrieves the course by id', function ( done ) {
        request( server )
            .get( '/courses/' + course_id )
            .send({ session : session })
            .end( function ( err, res ) {
                if ( err ) {
                    throw err;
                }

                res.body.should.have.property( '_id' );
                res.body.should.have.property( 'group' );
                res.body.should.have.property( 'name' );
                res.body.should.have.property( 'school' );
                res.body.should.have.property( 'teacher' );

                assert.equal( 'string', typeof res.body.group );
                assert.equal( 'string', typeof res.body.school );
                assert.equal( 'string', typeof res.body.teacher );
                done();
            });
    });

    it ( 'retrieves an expanded course record by id', function ( done ) {
        request( server )
            .get( '/courses/' + course_id + '?expanded=true' )
            .send({ session : session })
            .end( function ( err, res ) {
                if ( err ) {
                    throw err;
                }

                res.body.should.have.property( '_id' );
                res.body.should.have.property( 'group' );
                res.body.should.have.property( 'name' );
                res.body.should.have.property( 'school' );
                res.body.should.have.property( 'teacher' );

                assert.equal( 'object', typeof res.body.group );
                assert.equal( 'object', typeof res.body.school );
                assert.equal( 'object', typeof res.body.teacher );
                done();
            });
    });

    it ( 'gets a 404 error when attempting to remove an unexisting course record', function ( done ) {
        request( server )
            .delete( '/courses/invalid_id' )
            .send({ session : session })
            .expect( 404, done );
    });

    it ( 'gets a 400 error when attempting to create an invalid period record', function ( done ) {
        request( server )
            .post( '/periods' )
            .send({ name : 'InvalidTestPeriod', session : session })
            .expect( 400, done );
    });

    it ( 'creates a period object in the database', function ( done ) {
        request( server )
            .post( '/periods' )
            .send( period )
            .end( function ( err, res ) {
                if ( err ) {
                    throw err;
                }

                res.body.should.have.property( '_id' );
                res.body.should.have.property( 'due_date' );
                res.body.should.have.property( 'group' );
                res.body.should.have.property( 'name' );
                res.body.should.have.property( 'school' );

                period_id       = res.body._id;
                grade.period    = res.body._id;
                done();
            });
    });

    it ( 'gets a 404 error when attempting to update and unexisting period', function ( done ) {
        request( server )
            .put( '/periods/invalid_id' )
            .send({ name : 'UnitTestModified', session : session })
            .expect( 404, done );
    });

    it ( 'updates a period record in the system', function ( done ) {
        request( server )
            .put( '/periods/' + period_id )
            .send({ name : 'UnitTestModified', session : session })
            .expect( 200, done );
    });

    it ( 'retrieves a list of periods from the database', function ( done ) {
        request( server )
            .get( '/periods' )
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

    it ( 'retrieves an expanded list of periods from the database', function ( done ) {
        request( server )
            .get( '/periods?expanded=true&group=' + group_id )
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
                assert.equal( 'object', typeof res.body.results[0].group );
                assert.equal( 'object', typeof res.body.results[0].school );
                done();
            });
    });

    it ( 'gets a 404 error when attempting to retrieve an unexisting period record', function ( done ) {
        request( server )
            .get( '/periods/invalid_id' )
            .send({ session : session })
            .expect( 404, done );
    });

    it ( 'retrieves the period by id', function ( done ) {
        request( server )
            .get( '/periods/' + period_id )
            .send({ session : session })
            .end( function ( err, res ) {
                if ( err ) {
                    throw err;
                }

                res.body.should.have.property( '_id' );
                res.body.should.have.property( 'due_date' );
                res.body.should.have.property( 'group' );
                res.body.should.have.property( 'name' );
                res.body.should.have.property( 'school' );

                assert.equal( 'string', typeof res.body.group );
                assert.equal( 'string', typeof res.body.school );
                done();
            });
    });

    it ( 'retrieves an expanded period record by id', function ( done ) {
        request( server )
            .get( '/periods/' + period_id + '?expanded=true' )
            .send({ session : session })
            .end( function ( err, res ) {
                if ( err ) {
                    throw err;
                }

                res.body.should.have.property( '_id' );
                res.body.should.have.property( 'due_date' );
                res.body.should.have.property( 'group' );
                res.body.should.have.property( 'name' );
                res.body.should.have.property( 'school' );

                assert.equal( 'object', typeof res.body.group );
                assert.equal( 'object', typeof res.body.school );
                done();
            });
    });

    it ( 'gets a 400 error when attempting to create an invalid grade record', function ( done ) {
        request( server )
            .post( '/grades' )
            .send({ grade : 10, session : session })
            .expect( 400, done );
    });

    it ( 'creates a grade object in the database', function ( done ) {
        request( server )
            .post( '/grades' )
            .send( grade )
            .end( function ( err, res ) {
                if ( err ) {
                    throw err;
                }

                res.body.should.have.property( '_id' );
                res.body.should.have.property( 'course' );
                res.body.should.have.property( 'features' );
                res.body.should.have.property( 'period' );
                res.body.should.have.property( 'student' );
                res.body.should.have.property( 'teacher' );

                grade_id    = res.body._id;
                done();
            });
    });

    it ( 'gets a 404 error when attempting to update and unexisting grade', function ( done ) {
        request( server )
            .put( '/grades/invalid_id' )
            .send({ grade : 10, session : session })
            .expect( 404, done );
    });

    it ( 'updates a grade record in the system', function ( done ) {
        request( server )
            .put( '/grades/' + grade_id )
            .send({ grade : 8.5, session : session })
            .expect( 200, done );
    });

    it ( 'retrieves a list of grades from the database', function ( done ) {
        request( server )
            .get( '/grades' )
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

    it ( 'retrieves an expanded list of grades from the database', function ( done ) {
        request( server )
            .get( '/grades?expanded=true' )
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
                assert.equal( 'object', typeof res.body.results[0].course );
                assert.equal( 'object', typeof res.body.results[0].period );
                assert.equal( 'object', typeof res.body.results[0].student );
                assert.equal( 'object', typeof res.body.results[0].teacher );
                done();
            });
    });

    it ( 'gets a 404 error when attempting to retrieve an unexisting grade record', function ( done ) {
        request( server )
            .get( '/grades/invalid_id' )
            .send({ session : session })
            .expect( 404, done );
    });

    it ( 'retrieves the grade by id', function ( done ) {
        request( server )
            .get( '/grades/' + grade_id )
            .send({ session : session })
            .end( function ( err, res ) {
                if ( err ) {
                    throw err;
                }

                res.body.should.have.property( '_id' );
                res.body.should.have.property( 'course' );
                res.body.should.have.property( 'features' );
                res.body.should.have.property( 'grade' );
                res.body.should.have.property( 'period' );
                res.body.should.have.property( 'student' );
                res.body.should.have.property( 'teacher' );

                assert.equal( 'string', typeof res.body.course );
                assert.equal( 'string', typeof res.body.period );
                assert.equal( 'string', typeof res.body.student );
                assert.equal( 'string', typeof res.body.teacher );
                done();
            });
    });

    it ( 'retrieves an expanded grade record by id', function ( done ) {
        request( server )
            .get( '/grades/' + grade_id + '?expanded=true' )
            .send({ session : session })
            .end( function ( err, res ) {
                if ( err ) {
                    throw err;
                }

                res.body.should.have.property( '_id' );
                res.body.should.have.property( 'course' );
                res.body.should.have.property( 'features' );
                res.body.should.have.property( 'grade' );
                res.body.should.have.property( 'period' );
                res.body.should.have.property( 'student' );
                res.body.should.have.property( 'teacher' );

                assert.equal( 'object', typeof res.body.course );
                assert.equal( 'object', typeof res.body.period );
                assert.equal( 'object', typeof res.body.student );
                assert.equal( 'object', typeof res.body.teacher );
                done();
            });
    });

    it ( 'gets a 404 error when attempting to remove an unexisting grade record', function ( done ) {
        request( server )
            .delete( '/grades/invalid_id' )
            .send({ session : session })
            .expect( 404, done );
    });

    it ( 'removes the grade record created', function ( done ) {
        request( server )
            .delete( '/grades/' + grade_id )
            .send({ session : session })
            .expect( 200, done );
    });

    it ( 'removes the period record created', function ( done ) {
        request( server )
            .delete( '/periods/' + period_id )
            .send({ session : session })
            .expect( 200, done );
    });

    it ( 'removes the course record created', function ( done ) {
        request( server )
            .delete( '/courses/' + course_id )
            .send({ session : session })
            .expect( 200, done );
    });

    it ( 'removes the group record created', function ( done ) {
        request( server )
            .delete( '/groups/' + group_id )
            .send({ session : session })
            .expect( 200, done );
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

    it ( 'removes the administrator user created', function ( done ) {
        request( server )
            .delete( '/users/' + administrator_id )
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
var mongoose        = require( 'mongoose' ),
    config          = require( '../config/app' ),
    db              = require( '../config/db' ),
    setFilters      = function ( supported, query ) {
        var filters = {};
        for ( var i = 0; i < supported.length; i++ ) {
            var key = supported[i];
            if ( query[ key ] ) {
                switch ( key ) {
                    case 'name' :
                    case 'description' :
                        filters[key]        = new RegExp( query[key], 'i' );
                        break;
                    case '$and' :
                        filters.$and        = [];
                        for ( var j = 0; j < query.$and.length; j++ ) {
                            if ( typeof query.$and[j] == 'string' ) {
                                filters.$and[j] = setFilters( supported, JSON.parse( query.$and[j] ) );
                            } else {
                                filters.$and[j] = setFilters( supported, query.$and[j] );
                            }
                        }
                        break;
                    case '$or' :
                        filters.$or         = [];
                        for ( var j = 0; j < query.$or.length; j++ ) {
                            if ( typeof query.$or[j] == 'string' ) {
                                filters.$or[j]  = setFilters( supported, JSON.parse( query.$or[j] ) );
                            } else {
                                filters.$or[j]  = setFilters( supported, query.$or[j] );
                            }
                        }
                        break;
                    case 'creation_date' :
                    case 'date' :
                    case 'due_date' :
                        if ( typeof query[key] == 'object' ) {
                            var objKey              = Object.keys( query[key] )[0];

                            filters[key]            = {};
                            filters[key][objKey]    = new Date( query[key][objKey] );
                        } else {
                            filters[key]            = query[key]
                        }
                        break;
                    case 'course' :
                    case 'network' :
                    case 'student' :
                    case 'students' :
                    case 'teacher' :
                    case 'user' :
                        filters[key]        = new mongoose.Types.ObjectId( query[key] );
                    break;
                    default :
                        if ( Array.isArray( query[key] ) ) {
                            filters[key]    = {
                                "$in"       : query[key]
                            };
                        } else {
                            filters[key]    = query[key];
                        }
                }
            }
        }

        return filters;
    };

exports.connectDB   = function () {
    var conn_str    = 'mongodb://';

    if ( db.user ) {
        conn_str    += db.user;
        if ( db.pass ) {
            conn_str    += ':' + db.pass;
        }

        conn_str    += '@';
    }
    conn_str        += db.host + ':' + db.port + '/' + db.database;

    mongoose.connect( conn_str );
};

exports.cors        = function ( req, res, next ) {
    res.header( 'Access-Control-Allow-Origin', '*' );
    res.header( 'Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE, OPTIONS' );
    res.header( 'Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Lenght, X-Requested-With' );

    if ( req.method == 'OPTIONS' ) {
        res.sendStatus( 200 );
    } else {
        next();
    }
};

exports.paginate    = function ( Model, supported, refs, req, res, next ) {
    supported.push( '$and' );
    supported.push( '$or' );

    var aggregate   = req.query.aggregate,
        filters     = setFilters( supported, req.query ),
        select      = ( req.query.select ) ? req.query.select : null,
        page        = ( req.query.page ) ? req.query.page : 1,
        pageSize    = ( req.query.per_page ) ? req.query.per_page : config.page_size,
        sort        = ( req.query.sort ) ? req.query.sort : 'name',
        order       = ( req.query.order ) ? req.query.order : 'ASC',
        obj         = {};

    if ( req.session.access_level != 0 ) {
        filters.network     = req.session.network;
    }

    obj[sort]       = ( order == 'DESC' ) ? -1 : 1;
    var options     = {
        limit       : parseInt( pageSize ),
        skip        : ( page - 1 ) * pageSize,
        sort        : obj
    };

    if ( aggregate ) {
        var field   = aggregate.substring( 0, aggregate.indexOf( ':' ) ),
            method  = aggregate.substring( aggregate.indexOf( ':' ) + 1 ),
            query   = null,
            date    = new Date();

        switch ( method ) {
            case 'day' :
                query   = [
                    {
                        $match      : filters
                    },
                    {
                        $group      : {
                            _id     : {
                                $dayOfMonth : '$' + field
                            },
                            count   : {
                                $sum    : 1
                            }
                        }
                    },
                    {
                        $sort       : {
                            _id     : 1
                        }
                    }
                ];
                break;
            default :
                query   = [
                    {
                        $match      : filters
                    },
                    {
                        $group      : {
                            _id     : '$' + method,
                            count   : {
                                $sum    : 1
                            }
                        }
                    },
                    {
                        $sort       : {
                            count   : -1
                        }
                    }
                ];
        }

        Model.aggregate( query, function ( err, results ) {
            var response    = {
                results         : results,
                pagination      : {
                    total       : results.length,
                    page        : 1,
                    per_page    : -1
                }
            };

            res.json( response );
        });
    } else {
        var cursor      = Model.find( filters, select, options ),
            callback    = function ( err, docs ) {
                Model.count( filters, function ( err, count ) {
                    var response    = {
                        results     : docs,
                        pagination  : {
                            total       : count,
                            page        : page,
                            per_page    : pageSize
                        }
                    };

                    res.json( response );
                });
            };

        if ( req.query.expanded && req.query.expanded === 'true' ) {
            if ( refs != null ) {
                for ( var i = 0; i < refs.length; i++ ) {
                    cursor.populate( refs[i].field, refs[i].select );
                }
            }

            cursor.exec( callback );
        } else {
            cursor.exec( callback )
        }
    }
};
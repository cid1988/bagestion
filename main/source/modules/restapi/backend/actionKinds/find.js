var oid = require('mongodb').ObjectID;

exports = module.exports = {
  method: 'get',
  isArray: true,
  process: function(resource, action, req, res, db) {
    if (!require('./common').checkAuth(action, req)) {
      res.status(403);
      res.end();
    }
    else {
      db.getDbInstance(function(err, db) {
        var noErr = require('./common').noErr;
        if (noErr(err, res)) {
          var query = {};

          if (resource.params) {
            for (var p in resource.params) {
              if (req.params[p]) {
                  query[p] = req.params[p];
              }
            }
          }
          
          for (var p in req.query) {
            var v = req.query[p];
            
            try {
              query[p] = JSON.parse(v);
            }catch(e) {
              query[p] = v;
            }
          }

          if (query._id && typeof query._id == 'string') {
              query._id = new oid(query._id);
          }

          var collection;
          if (resource.checkUserDbPerm) {
            collection = require('./dbPermColl')({
              get: function (user, callback) {
                db
                .collection('users.permissions')
                .findOne({ username: user }, function (err, doc) {
                   if (err) return callback (err);
                   if (!doc) return callback(new Error('El usuario no existe'));
                   
                   callback(null, doc[resource.checkUserDbPerm]);
                });
              }
            }, db)
            .user(req.session.user.username)
            .collection(resource.collectionName || resource.name); 
          } else {
            collection = db.collection(resource.collectionName || resource.name);
          }
          
          collection
          .find(query, function(err, results) {
            if (noErr(err, res)) {
              if (results.toArray) {
                results.toArray(function(err, array) {
                  if (noErr(err, res)) {
                      res.json(array);
                  }
                });
              } else {
                res.json(results);
              }
            }
          });
        }
      });
    }
  }
};

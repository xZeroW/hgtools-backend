const mongoose = require('../../common/services/mongoose.service').mongoose;
const Schema = mongoose.Schema;

const buildSchema = new Schema({
  title: String,
  content: String,
  creator: {
    type: Schema.Types.ObjectId,
    ref: 'Users'
  }
}, { timestamps: true });

buildSchema.virtual('id').get(function() {
  return this._id.toHexString();
});

// Ensure virtual fields are serialised.
buildSchema.set('toJSON', {
  virtuals: true
});

buildSchema.findById = function(cb) {
  return this.model('Builds').find({ id: this.id }, cb);
};

const Build = mongoose.model('Builds', buildSchema);

exports.findByTitle = title => {
  return Build.find({ title });
};

exports.findByUserId = userId => {
  return Build.find({ userId });
};

exports.findById = id => {
  return Build.findById(id).then(result => {
    result = result.toJSON();
    delete result._id, result.__v; // exclude those fields
    return result;
  });
};

exports.createBuild = buildData => {
  const build = new Build(buildData);
  return build.save();
};

exports.list = (perPage, page) => {
  return new Promise((resolve, reject) => {
    Build.find()
      // .sort({ _id: -1 }) - to sort of the latest
      .select('-__v')
      .limit(perPage)
      .skip(perPage * page)
      .populate('creator', '-password -__v')
      .exec(function(err, builds) {
        if (err) {
          reject(err);
        } else {
          console.log(builds);
          resolve(builds);
        }
      });
  });
};

exports.patchBuild = (id, buildData) => {
  return new Promise((resolve, reject) => {
    Build.findById(id, function(err, build) {
      if (err) {
        reject(err);
      }
      for (let i in buildData) {
        build[i] = buildData[i];
      }
      build.save(function(err, updatedBuild) {
        if (err) return reject(err);
        resolve(updatedBuild);
      });
    });
  });
};

exports.removeById = buildId => {
  return new Promise((resolve, reject) => {
    Build.remove({ _id: buildId }, err => {
      if (err) {
        reject(err);
      } else {
        resolve(err);
      }
    });
  });
};

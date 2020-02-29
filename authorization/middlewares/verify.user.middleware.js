const UserModel = require('../../users/models/users.model');
const crypto = require('crypto');

exports.hasAuthValidFields = (req, res, next) => {
    let errors = [];

    if (req.body) {
        if (!req.body.username) {
            errors.push('Username is required');
        }
        if (!req.body.password) {
            errors.push('Password is required');
        }

        if (errors.length) {
            return res.status(400).send({errors: errors.join(',')});
        } else {
            return next();
        }
    } else {
        return res.status(400).send({errors: 'Username and password are required'});
    }
};

exports.isPasswordAndUserMatch = (req, res, next) => {
    UserModel.findByUsername(req.body.username)
        .then((user) => {
            if(!user[0]){
                res.status(404).send({errors: 'User not found'});
            }else{
                let passwordFields = user[0].password.split('$');
                let salt = passwordFields[0];
                let hash = crypto.createHmac('sha512', salt).update(req.body.password).digest('base64');
                if (hash === passwordFields[1]) {
                    req.body = {
                        userId: user[0]._id,
                        username: user[0].username,
                        role: user[0].role,
                        provider: 'username'
                    };
                    return next();
                } else {
                    return res.status(400).send({errors: 'Invalid Username or Password'});
                }
            }
        });
};
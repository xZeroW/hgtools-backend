const BuildModel = require('../models/builds.model');
const crypto = require('crypto');

exports.insert = (req, res) => {
    let errors = [];
    if (req.body) {
        if (!req.body.title) {
            errors.push('Field title is required');
        }
        if (!req.body.content) {
            errors.push('Field content is required');
        }

        if (errors.length) {
            return res.send({errors});
        }
    }
    
    req.body.userId = req.jwt.userId;
    BuildModel.createBuild(req.body)
        .then(() => {
            res.status(201).send({ message: 'Build posted!' });
        });
};

exports.list = (req, res) => {
    let limit = req.query.limit && req.query.limit <= 100 ? parseInt(req.query.limit) : 10;
    let page = 0;
    if (req.query) {
        if (req.query.page) {
            req.query.page = parseInt(req.query.page);
            page = Number.isInteger(req.query.page) ? req.query.page : 0;
        }
    }
    BuildModel.list(limit, page)
        .then((result) => {
            res.status(200).send(result);
        });
};

exports.getById = (req, res) => {
    BuildModel.findById(req.params.userId)
        .then((result) => {
            res.status(200).send(result);
        });
};

exports.patchById = (req, res) => {
    if (req.body.password) {
        let salt = crypto.randomBytes(16).toString('base64');
        let hash = crypto.createHmac('sha512', salt).update(req.body.password).digest('base64');
        req.body.password = salt + '$' + hash;
    }

    BuildModel.patchUser(req.params.userId, req.body)
        .then(() => {
            res.status(204).send({});
        });

};

exports.removeById = (req, res) => {
    BuildModel.removeById(req.params.userId)
        .then(()=>{
            res.status(204).send({});
        });
};
const BuildsController = require('./controllers/builds.controller');
const PermissionMiddleware = require('../common/middlewares/auth.permission.middleware');
const ValidationMiddleware = require('../common/middlewares/auth.validation.middleware');
const config = require('../common/config/env.config');

// const ADMIN = config.roles.ADMIN;
// const PAID = config.roles.PAID_USER;
const FREE = config.roles.NORMAL_USER;

exports.routesConfig = function (app) {
  // create user
  app.post('/builds', [
    ValidationMiddleware.validJWTNeeded,
    PermissionMiddleware.minimumRoleRequired(FREE),
    BuildsController.insert
  ]);
  // list builds
  app.get('/builds', [
    BuildsController.list
  ]);
  // get build by id
  app.get('/builds/:buildId', [
    BuildsController.getById
  ]);
  // update build
  app.patch('/builds/:buildId', [
    ValidationMiddleware.validJWTNeeded,
    PermissionMiddleware.minimumRoleRequired(FREE),
    PermissionMiddleware.onlySameUserOrAdminCanDoThisAction,
    BuildsController.patchById
  ]);
  // delete build
  app.delete('/builds/:buildId', [
    ValidationMiddleware.validJWTNeeded,
    PermissionMiddleware.minimumRoleRequired(FREE),
    PermissionMiddleware.onlySameUserOrAdminCanDoThisAction,
    BuildsController.removeById
  ]);
};

const koaRouter = require('koa-router');
const papersRouter = require(__dirname + '/api/papers-router.js');

const apiRouter = new koaRouter();
apiRouter.use('/papers', papersRouter.routes());

module.exports = apiRouter;

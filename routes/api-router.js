const koaRouter = require('koa-router');
const authorsRouter = require(__dirname + '/api/authors-router.js');
const papersRouter = require(__dirname + '/api/papers-router.js');

const apiRouter = new koaRouter();
apiRouter.use('/papers', papersRouter.routes());
apiRouter.use('/authors', authorsRouter.routes());

module.exports = apiRouter;

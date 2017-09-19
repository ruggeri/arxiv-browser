const koa = require('koa');
const koaMount = require('koa-mount');
const koaStatic = require('koa-static');
const koaViews = require('koa-views');
const rootRouter = require(__dirname + '/../routes/root-router.js');

const app = new koa();
app.context.models = require(__dirname + '/../models');

// Pre-routes middleware!
app.use(koaViews(__dirname + '/../views'));
app.use(koaMount('/static', koaStatic(__dirname + '/../../static')));
app.use(rootRouter.routes());

// Listen!
app.listen(3000);

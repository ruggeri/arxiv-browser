const koa = require('koa');
const koaMount = require('koa-mount');
const koaRouter = require('koa-router');
const koaStatic = require('koa-static');
const koaViews = require('koa-views');

const app = new koa();

// Pre-routes middleware!
app.use(koaViews(__dirname + '/views'));
app.use(koaMount('/static', koaStatic('static')));

// Routes
const router = new koaRouter();

router.get('/', async ctx => {
  await ctx.render('index.html.pug');
});

const apiRouter = new koaRouter();
const papersRouter = new koaRouter();
papersRouter.get('/', async ctx => {
  ctx.body = { 123: { title: "This is my first paper!" } };
});

apiRouter.use('/papers', papersRouter.routes());
router.use('/api', apiRouter.routes());


app.use(router.routes());

// Listen!
app.listen(3000);

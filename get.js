const Koa = require('koa')
const app = new Koa()

const Router = require('koa-router')

let page = new Router()

page.get('/user', async (ctx) => {
  let url = ctx.url
  // 从上下文的request对象中获取
  let request = ctx.request
  let req_query = request.query
  let req_querystring = request.querystring

  // 从上下文中直接获取
  let ctx_query = ctx.query
  let ctx_querystring = ctx.querystring

  ctx.body = {
    url,
    req_query,
    req_querystring,
    ctx_query,
    ctx_querystring
  }
})

let router = new Router()
router.use('/page', page.routes(), page.allowedMethods())

app.use(router.routes(), router.allowedMethods())

app.listen(3000, () => {
  console.log('[demo] request get is starting at port 3000')
})
const Koa = require('koa')
const app = new Koa()

const Router = require('koa-router')
const bodyParser = require('koa-bodyparser')
app.use(bodyParser())

let home = new Router()

home.get('/', async (ctx) => {
  if (ctx.method === 'GET') {
    // 当GET请求时候返回表单页面
    let html = `
      <h1>koa2 request post demo</h1>
      <form method="POST" action="/">
        <p>username</p>
        <input name="userName"/><br />
        <p>nickname</p>
        <input name="nickName"/><br />
        <p>email</p>
        <input name="email"/><br />
        <button type="submit">submit</button>
      </form>
    `
    ctx.body = html
  } else {
    ctx.body = '<h1>404!!!</h1>'
  }
})
home.post('/', async (ctx) => {
  let postData = ctx.request.body
  ctx.body = postData
})
let router = new Router()
router.use('/', home.routes(), home.allowedMethods())

// 加载路由中间件
app.use(router.routes(), router.allowedMethods())

app.listen(3000, () => {
  console.log('[demo] request post is starting at port 3000')
})
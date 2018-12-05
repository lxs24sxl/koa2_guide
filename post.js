const Koa = require('koa')
const app = new Koa()
const createToken = require('./server/token/createToken.js')
//checkToken作为中间件存在
const checkToken = require('./server/token/checkToken.js');
console.log(checkToken)
var bodyParser = require('koa-bodyparser');

app.use(bodyParser());

const parsePostData = (ctx) => new Promise((resolve, reject) => {
  try {
    let postdata = ""
    ctx.req.addListener('data', (data) => {
      postdata += data
    })
    ctx.req.addListener('end', () => {
      let parseData = parseQueryStr(postdata)
      resolve(parseData)
    })
  } catch (err) {
    reject(err)
  }
})
// 将POST请求参数字符串解析成JSON
function parseQueryStr(queryStr) {
  let queryData = {}
  let queryStrList = queryStr.split('&')
  console.log(queryStrList)
  for (let [index, queryStr] of queryStrList.entries()) {
    let itemList = queryStr.split('=')
    queryData[itemList[0]] = decodeURIComponent(itemList[1])
  }
  return queryData
}
const Router = require('koa-router')

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
  let postData = await parsePostData(ctx)
  ctx.body = postData
})

let login = new Router()
login.get('/', async (ctx) => {
  if (ctx.method === 'GET') {
    // 当GET请求时候返回表单页面
    let html = `
      <h1>koa2 request post demo</h1>
      <form method="POST" action="/login">
        <p>username</p>
        <input name="useruame"/><br />
        <p>password</p>
        <input name="password"/><br />
        <button type="submit">login</button>
      </form>
    `
    ctx.body = html
  } else {
    ctx.body = '<h1>404!!!</h1>'
  }
})
login.post('/', async (ctx) => {
  let body = ctx.request.body
  if (body.password !== '123456') {
    ctx.status = 200
    ctx.body = {
      message: 'error password'
    }
  } else {
    let token = createToken(body.username)
    ctx.res.setHeader("Authorization", token)
    ctx.status = 200
    ctx.body = {
      success: true,
      code: 20000,
      body,
      token
    }
  }
})
const jwt = require('jsonwebtoken')

let test = new Router()
test.get('/', async ( ctx, next) => {
  // ctx.status = 200
  // ctx.body = {
  //   ctx
  // }
  // console.log('ctx', ctx)
  const authorization = ctx.get('Authorization')
  console.log('authorization', authorization)
  if ( authorization === '' ) {
    // ctx.throw(401, 'no token detected in http headerAuthorization')
    ctx.status = 200
    ctx.body = {
      authorization: authorization
    }
  }
  const token = authorization.split(' ')[1]
  let tokenContent
  try {
    tokenContent = await jwt.verify(token, 'linxiaoshun')
  } catch (err) {
    // ctx.throw(401, 'invalid token')
    ctx.status = 200
    ctx.body = {
      tokenContent: tokenContent
    }
  }
  // await next()
})


let router = new Router()
router.use('/', home.routes(), home.allowedMethods())
router.use('/login', login.routes(), login.allowedMethods())
router.use('/test', test.routes(), test.allowedMethods())

// 加载路由中间件
app.use(router.routes(), router.allowedMethods())

app.listen(3000, () => {
  console.log('[demo] request post is starting at port 3000')
})
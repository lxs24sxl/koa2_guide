const Koa = require('koa')
const app = new Koa()


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
let router = new Router()
router.use('/', home.routes(), home.allowedMethods())

// 加载路由中间件
app.use(router.routes(), router.allowedMethods())

app.listen(3000, () => {
  console.log('[demo] request post is starting at port 3000')
})
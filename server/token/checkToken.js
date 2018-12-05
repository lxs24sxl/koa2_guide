const jwt = require('jsonwebtoken')

module.exports = async ( ctx, next) => {
  // ctx.status = 200
  // ctx.body = {
  //   ctx
  // }
  const authorization = ctx.get('Authorization')
  if ( authorization === '' ) {
    // ctx.throw(401, 'no token detected in http headerAuthorization')
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
    ctx.body = {
      tokenContent: tokenContent
    }
  }
  await next()
}
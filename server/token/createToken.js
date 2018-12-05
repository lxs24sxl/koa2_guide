const jwt = require('jsonwebtoken')
module.exports = (user_id) => {
  const token = jwt.sign({user_id: user_id}, 'linxiaoshun', {expiresIn: '60s'})
  return token
}
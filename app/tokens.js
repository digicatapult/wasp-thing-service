const jwt = require('jwt-simple')
const env = require('./env')

const jwtFormat = /^Bearer ([0-9a-zA-Z._-]+)$/

const decodeToken = (tokenRaw) => {
  if (!tokenRaw) return null
  else {
    const token = tokenRaw.match(jwtFormat)
    try {
      return jwt.decode(token[1], env.JWT_SECRET)
    } catch (err) {
      return null
    }
  }
}

const isTokenValid = (tokenRaw) => {
  return decodeToken(tokenRaw) ? true : false
}

module.exports = {
  decodeToken,
  isTokenValid,
}

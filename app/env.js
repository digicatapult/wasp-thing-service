import envalid from 'envalid'
import dotenv from 'dotenv'

import { version } from './version.js'

if (process.env.NODE_ENV === 'test') {
  dotenv.config({ path: 'test/test.env' })
} else {
  dotenv.config()
}

const vars = envalid.cleanEnv(
  process.env,
  {
    LOG_LEVEL: envalid.str({ default: 'info', devDefault: 'debug' }),
    PORT: envalid.port({ default: 3002 }),
    DB_HOST: envalid.host({ devDefault: 'localhost' }),
    DB_PORT: envalid.port({ default: 5432 }),
    DB_NAME: envalid.str({ default: 'things' }),
    DB_USERNAME: envalid.str({ devDefault: 'postgres' }),
    DB_PASSWORD: envalid.str({ devDefault: 'postgres' }),
    JWT_SECRET: envalid.str({ devDefault: 'ogA9ppB$S!dy!hu3Rauvg!L96' }),
    API_VERSION: envalid.str({ default: version }),
  },
  {
    strict: true,
  }
)

export default {
  ...vars,
}

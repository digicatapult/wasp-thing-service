import envalid from 'envalid'

const options = {
  strict: true,
}

const vars = envalid.cleanEnv(
  process.env,
  {
    DB_HOST: envalid.host({ devDefault: 'localhost' }),
    DB_PORT: envalid.port({ default: 5432 }),
    DB_NAME: envalid.str({ devDefault: 'things' }),
    DB_USERNAME: envalid.str({ devDefault: 'postgres' }),
    DB_PASSWORD: envalid.str({ devDefault: 'postgres' }),
  },
  options
)

export default vars

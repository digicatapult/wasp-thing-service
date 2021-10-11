const express = require('express')
const pinoHttp = require('pino-http')
const { initialize } = require('express-openapi')
const v1ApiDoc = require('./api-v1/api-doc')
const swaggerUi = require('swagger-ui-express')
const bodyParser = require('body-parser')
const { PORT, API_MAJOR_VERSION } = require('./env')
const logger = require('./logger')
const cors = require('cors')
const path = require('path')
const v1ThingService = require(`./api-${API_MAJOR_VERSION}/services/thingService`)

async function createHttpServer() {
  const app = express()
  const requestLogger = pinoHttp({ logger })

  // I'm putting this in even though it's not used initially
  // just in case we add other routes. It's good boilerplate
  app.use((req, res, next) => {
    if (req.path !== '/health') requestLogger(req, res)
    next()
  })

  app.get('/health', async (req, res) => {
    res.status(200).send({ status: 'ok' })
  })

  app.use(cors())
  app.use(bodyParser.json())

  initialize({
    app,
    apiDoc: v1ApiDoc,
    dependencies: {
      thingService: v1ThingService,
    },
    paths: [path.resolve(__dirname, `api-${API_MAJOR_VERSION}/routes`)],
  })

  const options = {
    swaggerOptions: {
      urls: [
        {
          url: `http://localhost:${PORT}/${API_MAJOR_VERSION}/api-docs`,
          name: 'ThingService',
        },
      ],
    },
  }

  app.use(`/${API_MAJOR_VERSION}/swagger`, swaggerUi.serve, swaggerUi.setup(null, options))

  // Sorry - app.use checks arity
  // eslint-disable-next-line no-unused-vars
  app.use((err, req, res, next) => {
    if (err.status) {
      res.status(err.status).send({ error: err.status === 401 ? 'Unauthorised' : err.message })
    } else {
      logger.error('Fallback Error %j', err.stack)
      res.status(500).send('Fatal error!')
    }
  })

  return { app }
}

/* istanbul ignore next */
async function startServer() {
  const { app } = await createHttpServer()

  const setupGracefulExit = ({ sigName, server, exitCode }) => {
    process.on(sigName, async () => {
      server.close(() => {
        process.exit(exitCode)
      })
    })
  }

  const server = app.listen(PORT, (err) => {
    if (err) throw new Error('Binding failed: ', err)
    logger.info(`Listening on port ${PORT} `)
  })

  setupGracefulExit({ sigName: 'SIGINT', server, exitCode: 0 })
  setupGracefulExit({ sigName: 'SIGTERM', server, exitCode: 143 })
}

module.exports = { startServer, createHttpServer }

import express from 'express'
import pinoHttp from 'pino-http'
import { initialize } from 'express-openapi'
import swaggerUi from 'swagger-ui-express'
import bodyParser from 'body-parser'
import cors from 'cors'
import path from 'path'
import { fileURLToPath } from 'url'

import v1ApiDoc from './api-v1/api-doc.js'
import env from './env.js'
import logger from './logger.js'
import v1ThingService from './api-v1/services/thingService.js'

const { PORT } = env
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

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
    paths: [path.resolve(__dirname, `api-v1/routes`)],
  })

  const options = {
    swaggerOptions: {
      urls: [
        {
          url: `http://localhost:${PORT}/v1/api-docs`,
          name: 'ThingService',
        },
      ],
    },
  }

  app.use(`/v1/swagger`, swaggerUi.serve, swaggerUi.setup(null, options))

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

export { startServer, createHttpServer }

const { PORT, API_VERSION, API_MAJOR_VERSION } = require('../env')

const apiDoc = {
  openapi: '3.0.3',
  info: {
    title: 'ThingService',
    version: API_VERSION,
  },
  servers: [
    {
      url: `http://localhost:${PORT}/${API_MAJOR_VERSION}`,
    },
  ],
  components: {
    responses: {
      NotFoundError: {
        description: 'This resource cannot be found',
      },
      BadRequestError: {
        description: 'The request is invalid',
      },
      ConflictError: {
        description: 'This resource already exists',
      },
      UnauthorizedError: {
        description: 'Access token is missing or invalid',
      },
      Error: {
        description: 'Something went wrong',
      },
    },
    schemas: {
      Thing: {
        type: 'object',
        properties: {
          id: {
            description: 'id of the thing',
            type: 'string',
          },
          type: {
            description: 'type of the thing',
            type: 'string',
          },
          metadata: {
            description: 'metadata of the thing',
            type: 'object',
          },
        },
        required: ['id', 'type', 'metadata'],
      },
      ThingIngest: {
        type: 'object',
        properties: {
          ingestId: {
            description: 'id of the thing for the ingest',
            type: 'string',
          },
          ingest: {
            description: 'ingest for the thing',
            type: 'string',
          },
          configuration: {
            description: 'configuration for the thing for the ingest',
            type: 'object',
          },
        },
        required: ['id', 'ingest', 'configuration'],
      },
      ThingType: {
        type: 'object',
        properties: {
          id: {
            description: 'id of the thing',
            type: 'string',
          },
          name: {
            description: 'name of the thing',
            type: 'string',
          },
          ingest: {
            description: 'ingest of the thing',
            type: 'string',
          },
        },
        required: ['id', 'name', 'ingest'],
      },
      Ingest: {
        type: 'object',
        properties: {
          name: {
            description: 'name of the thing',
            type: 'string',
          },
        },
        required: ['name'],
      },
    },
  },
  paths: {},
}

module.exports = apiDoc

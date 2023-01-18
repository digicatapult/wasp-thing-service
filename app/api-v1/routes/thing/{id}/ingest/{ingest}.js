export default function (thingService) {
  const doc = {
    GET: async function (req, res) {
      const { id: thingId, ingest } = req.params
      const { statusCode, result } = await thingService.getThingIngestByThingIdAndIngest({ thingId, ingest })

      res.status(statusCode).json(result)
    },
    PUT: async function (req, res) {
      const { id: thingId, ingest } = req.params
      const { statusCode, result } = await thingService.putThingIngestByThingIdAndIngest({ thingId, ingest }, req.body)

      res.status(statusCode).json(result)
    },
    DELETE: async function (req, res) {
      const { id: thingId, ingest } = req.params
      const { statusCode } = await thingService.deleteThingIngestByThingIdAndIngest({ thingId, ingest })

      res.status(statusCode).send()
    },
  }

  doc.GET.apiDoc = {
    summary: 'Get ingest by name',
    parameters: [
      {
        description: 'Id of the thing',
        in: 'path',
        required: true,
        name: 'id',
        allowEmptyValue: true,
      },
      {
        description: 'Name of the ingest',
        in: 'path',
        required: true,
        name: 'ingest',
        allowEmptyValue: true,
      },
    ],
    responses: {
      200: {
        description: 'Return ingest',
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/ThingIngest',
            },
          },
        },
      },
      400: {
        description: 'Invalid request',
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/responses/BadRequestError',
            },
          },
        },
      },
      404: {
        description: 'Resource does not exist',
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/responses/NotFoundError',
            },
          },
        },
      },
      default: {
        description: 'An error occurred',
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/responses/Error',
            },
          },
        },
      },
    },
    tags: ['thingIngest'],
  }

  doc.PUT.apiDoc = {
    summary: 'Update ingest',
    parameters: [
      {
        description: 'Id of the thing',
        in: 'path',
        required: true,
        name: 'id',
        allowEmptyValue: true,
      },
      {
        description: 'Name of the ingest',
        in: 'path',
        required: true,
        name: 'ingest',
        allowEmptyValue: true,
      },
    ],
    requestBody: {
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              ingestId: {
                type: 'string',
              },
              configuration: {
                type: 'object',
              },
            },
            required: ['ingestId', 'configuration'],
          },
        },
      },
    },
    responses: {
      200: {
        description: 'Update thing ingest',
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/ThingIngest',
            },
          },
        },
      },
      400: {
        description: 'Invalid request',
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/responses/BadRequestError',
            },
          },
        },
      },
      404: {
        description: 'Resource does not exist',
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/responses/NotFoundError',
            },
          },
        },
      },
      default: {
        description: 'An error occurred',
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/responses/Error',
            },
          },
        },
      },
    },
    tags: ['thingIngest'],
  }

  doc.DELETE.apiDoc = {
    summary: 'Delete ingest',
    parameters: [
      {
        description: 'Id of the thing',
        in: 'path',
        required: true,
        name: 'id',
        allowEmptyValue: true,
      },
      {
        description: 'Name of the ingest',
        in: 'path',
        required: true,
        name: 'ingest',
        allowEmptyValue: true,
      },
    ],
    responses: {
      204: {
        description: 'Delete thing ingest',
      },
      400: {
        description: 'Invalid request',
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/responses/BadRequestError',
            },
          },
        },
      },
      404: {
        description: 'Resource does not exist',
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/responses/NotFoundError',
            },
          },
        },
      },
      default: {
        description: 'An error occurred',
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/responses/Error',
            },
          },
        },
      },
    },
    tags: ['thingIngest'],
  }

  return doc
}

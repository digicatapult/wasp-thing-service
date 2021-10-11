module.exports = function (thingService) {
  const doc = {
    GET: async function (req, res) {
      const { id: thingId } = req.params
      const { statusCode, result } = await thingService.getThingIngests({ thingId })

      res.status(statusCode).json(result)
    },
    POST: async function (req, res) {
      const { id: thingId } = req.params
      const { statusCode, result } = await thingService.postThingIngest({ thingId }, req.body)

      res.status(statusCode).json(result)
    },
  }

  doc.GET.apiDoc = {
    summary: 'Get ingest things',
    parameters: [
      {
        description: 'Id of the thing',
        in: 'path',
        required: true,
        name: 'id',
        allowEmptyValue: true,
      },
    ],
    responses: {
      200: {
        description: 'Return ingest things',
        content: {
          'application/json': {
            schema: {
              type: 'array',
              items: {
                $ref: '#/components/schemas/ThingIngest',
              },
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

  doc.POST.apiDoc = {
    summary: 'Create ingest thing',
    parameters: [
      {
        description: 'Id of the thing',
        in: 'path',
        required: true,
        name: 'id',
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
              ingest: {
                type: 'string',
              },
              configuration: {
                type: 'object',
              },
            },
            required: ['ingestId', 'ingest', 'configuration'],
          },
        },
      },
    },
    responses: {
      201: {
        description: 'Return thing ingest',
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
      409: {
        description: 'Resource already exists',
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/responses/ConflictError',
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

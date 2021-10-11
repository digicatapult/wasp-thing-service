module.exports = function (thingService) {
  const doc = {
    GET: async function (req, res) {
      const { name } = req.params
      const { statusCode, result } = await thingService.getIngestByName({ name })

      res.status(statusCode).json(result)
    },
    PUT: async function (req, res) {
      const { name } = req.params
      const { statusCode, result } = await thingService.putIngest({ name }, req.body)

      res.status(statusCode).json(result)
    },
    DELETE: async function (req, res) {
      const { name } = req.params
      const { statusCode } = await thingService.deleteIngest({ name })

      res.status(statusCode).send()
    },
  }

  doc.GET.apiDoc = {
    summary: 'Get ingest by name',
    parameters: [
      {
        description: 'Name of the ingest',
        in: 'path',
        required: true,
        name: 'name',
        allowEmptyValue: true,
      },
    ],
    responses: {
      200: {
        description: 'Return ingest',
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/Ingest',
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
    tags: ['ingest'],
  }

  doc.PUT.apiDoc = {
    summary: 'Update ingest',
    parameters: [
      {
        description: 'Name of the ingest',
        in: 'path',
        required: true,
        name: 'name',
        allowEmptyValue: true,
      },
    ],
    requestBody: {
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              name: {
                type: 'string',
              },
            },
            required: ['name'],
          },
        },
      },
    },
    responses: {
      200: {
        description: 'Update ingest',
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/Ingest',
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
    tags: ['ingest'],
  }

  doc.DELETE.apiDoc = {
    summary: 'Delete ingest',
    parameters: [
      {
        description: 'Name of the ingest',
        in: 'path',
        required: true,
        name: 'name',
        allowEmptyValue: true,
      },
    ],
    responses: {
      204: {
        description: 'Delete thing',
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
    tags: ['ingest'],
  }

  return doc
}

module.exports = function (thingService) {
  const doc = {
    GET: async function (req, res) {
      const { statusCode, result } = await thingService.getThings(req.query)

      res.status(statusCode).json(result)
    },
    POST: async function (req, res) {
      const { statusCode, result } = await thingService.postThing(req.body)

      res.status(statusCode).json(result)
    },
  }

  doc.GET.apiDoc = {
    summary: 'Get things',
    parameters: [
      {
        description: 'Things using the Ingest',
        in: 'query',
        required: false,
        name: 'ingest',
        allowEmptyValue: false,
      },
      {
        description: 'Things using the Ingest with the specified Ingest id',
        in: 'query',
        required: false,
        name: 'ingestId',
        allowEmptyValue: false,
      },
      {
        description: 'Things using the Ingest of the specified Type',
        in: 'query',
        required: false,
        name: 'type',
        allowEmptyValue: false,
      },
    ],
    responses: {
      200: {
        description: 'Return things',
        content: {
          'application/json': {
            schema: {
              type: 'array',
              items: {
                $ref: '#/components/schemas/Thing',
              },
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
    tags: ['thing'],
  }

  doc.POST.apiDoc = {
    summary: 'Create thing',
    requestBody: {
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              type: {
                type: 'string',
              },
              metadata: {
                type: 'object',
              },
            },
            required: ['type', 'metadata'],
          },
        },
      },
    },
    responses: {
      201: {
        description: 'Create thing',
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/Thing',
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
    tags: ['thing'],
  }

  return doc
}

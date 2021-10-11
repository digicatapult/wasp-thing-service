module.exports = function (thingService) {
  const doc = {
    GET: async function (req, res) {
      const { statusCode, result } = await thingService.getIngests()

      res.status(statusCode).json(result)
    },
    POST: async function (req, res) {
      const { statusCode, result } = await thingService.postIngest(req.body)

      res.status(statusCode).json(result)
    },
  }

  doc.GET.apiDoc = {
    summary: 'Get ingests',
    responses: {
      200: {
        description: 'Return ingests',
        content: {
          'application/json': {
            schema: {
              type: 'array',
              items: {
                $ref: '#/components/schemas/Ingest',
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
    tags: ['ingest'],
  }

  doc.POST.apiDoc = {
    summary: 'Create ingest',
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
      201: {
        description: 'Create ingest',
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
    tags: ['ingest'],
  }

  return doc
}

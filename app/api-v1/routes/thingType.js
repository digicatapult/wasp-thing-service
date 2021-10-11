module.exports = function (thingService) {
  const doc = {
    GET: async function (req, res) {
      const { statusCode, result } = await thingService.getThingTypes()

      res.status(statusCode).json(result)
    },
    POST: async function (req, res) {
      const { statusCode, result } = await thingService.postThingType(req.body)

      res.status(statusCode).json(result)
    },
  }

  doc.GET.apiDoc = {
    summary: 'Get thing types',
    responses: {
      200: {
        description: 'Return thing types',
        content: {
          'application/json': {
            schema: {
              type: 'array',
              items: {
                $ref: '#/components/schemas/ThingType',
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
    tags: ['thingType'],
  }

  doc.POST.apiDoc = {
    summary: 'Create thing type',
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
        description: 'Create thing type',
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/ThingType',
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
    tags: ['thingType'],
  }

  return doc
}

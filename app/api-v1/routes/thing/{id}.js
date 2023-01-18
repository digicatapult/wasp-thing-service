export default function (thingService) {
  const doc = {
    GET: async function (req, res) {
      const { id } = req.params
      const { statusCode, result } = await thingService.getThingById({ id })

      res.status(statusCode).json(result)
    },
    PUT: async function (req, res) {
      const { id } = req.params
      const { statusCode, result } = await thingService.putThing({ id }, req.body)

      res.status(statusCode).json(result)
    },
    DELETE: async function (req, res) {
      const { id } = req.params
      const { statusCode } = await thingService.deleteThing({ id })

      res.status(statusCode).send()
    },
  }

  doc.GET.apiDoc = {
    summary: 'Get thing',
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
        description: 'Return thing',
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
    tags: ['thing'],
  }

  doc.PUT.apiDoc = {
    summary: 'Update thing',
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
      200: {
        description: 'Update thing',
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
    tags: ['thing'],
  }

  doc.DELETE.apiDoc = {
    summary: 'Delete thing',
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
      204: {
        description: 'Delete thing',
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
    tags: ['thing'],
  }

  return doc
}

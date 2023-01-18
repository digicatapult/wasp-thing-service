export default function (thingService) {
  const doc = {
    GET: async function (req, res) {
      const { name } = req.params
      const { statusCode, result } = await thingService.getThingTypeByName({ name })

      res.status(statusCode).json(result)
    },
    PUT: async function (req, res) {
      const { name } = req.params
      const { statusCode, result } = await thingService.putThingType({ name }, req.body)

      res.status(statusCode).json(result)
    },
    DELETE: async function (req, res) {
      const { name } = req.params
      const { statusCode } = await thingService.deleteThingType({ name })

      res.status(statusCode).send()
    },
  }

  doc.GET.apiDoc = {
    summary: 'Get thing type',
    parameters: [
      {
        description: 'Name of the thing type',
        in: 'path',
        required: true,
        name: 'name',
        allowEmptyValue: true,
      },
    ],
    responses: {
      200: {
        description: 'Return thing type',
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/ThingType',
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
    tags: ['thingType'],
  }

  doc.PUT.apiDoc = {
    summary: 'Update thing type',
    parameters: [
      {
        description: 'Name of the thing type',
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
        description: 'Update thing type',
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
    tags: ['thingType'],
  }

  doc.DELETE.apiDoc = {
    summary: 'Delete thing type',
    parameters: [
      {
        description: 'Name of the thing type',
        in: 'path',
        required: true,
        name: 'name',
        allowEmptyValue: true,
      },
    ],
    responses: {
      204: {
        description: 'Delete thing type',
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
    tags: ['thingType'],
  }

  return doc
}

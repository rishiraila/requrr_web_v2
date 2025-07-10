export const planPaths = {
  '/api/plans': {
    get: {
      summary: 'Get all subscription plans',
      tags: ['Plans'],
      responses: {
        200: {
          description: 'List of available plans',
          content: {
            'application/json': {
              schema: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    id: { type: 'integer', example: 1 },
                    name: { type: 'string', example: 'Starter' },
                    price: { type: 'number', example: 12000 },
                    price_inr: { type: 'number', example: 12000 },
                    price_usd: { type: 'number', example: 144.3 },
                    max_renewals: { type: 'integer', nullable: true, example: 10 },
                    description: {
                      type: 'string',
                      example: 'Basic plan with 10 renewals',
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    post: {
      summary: 'Create a new subscription plan',
      tags: ['Plans'],
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              required: ['name', 'price'],
              properties: {
                name: { type: 'string', example: 'Premium' },
                price: { type: 'number', example: 12000 },
                max_renewals: { type: 'integer', nullable: true, example: 50 },
                description: {
                  type: 'string',
                  example: 'Full access plan with 50 renewals',
                },
              },
            },
          },
        },
      },
      responses: {
        200: {
          description: 'Plan created successfully',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  message: { type: 'string', example: 'Plan created successfully' },
                },
              },
            },
          },
        },
        400: { description: 'Missing required fields' },
        401: { description: 'Unauthorized' },
        500: { description: 'Database error' },
      },
    },
  },

  '/api/plans/{id}': {
    get: {
      summary: 'Get a plan by ID',
      tags: ['Plans'],
      parameters: [
        {
          in: 'path',
          name: 'id',
          required: true,
          schema: { type: 'integer' },
          description: 'Plan ID',
        },
      ],
      responses: {
        200: {
          description: 'Plan found',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  id: { type: 'integer', example: 1 },
                  name: { type: 'string', example: 'Starter' },
                  price: { type: 'number', example: 12000 },
                  price_inr: { type: 'number', example: 12000 },
                  price_usd: { type: 'number', example: 144.3 },
                  max_renewals: { type: 'integer', nullable: true, example: 10 },
                  description: {
                    type: 'string',
                    example: 'Starter plan description',
                  },
                },
              },
            },
          },
        },
        404: { description: 'Plan not found' },
      },
    },

    put: {
      summary: 'Update a subscription plan by ID',
      tags: ['Plans'],
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          in: 'path',
          name: 'id',
          required: true,
          schema: { type: 'integer' },
          description: 'ID of the plan to update',
        },
      ],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              required: ['name', 'price'],
              properties: {
                name: { type: 'string', example: 'Updated Plan' },
                price: { type: 'number', example: 13000 },
                max_renewals: { type: 'integer', nullable: true, example: 20 },
                description: {
                  type: 'string',
                  example: 'Updated plan description',
                },
              },
            },
          },
        },
      },
      responses: {
        200: {
          description: 'Plan updated successfully',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  message: { type: 'string', example: 'Plan updated successfully' },
                },
              },
            },
          },
        },
        401: { description: 'Unauthorized' },
        500: { description: 'Database error' },
      },
    },

    delete: {
      summary: 'Delete a plan by ID',
      tags: ['Plans'],
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          in: 'path',
          name: 'id',
          required: true,
          schema: { type: 'integer' },
          description: 'Plan ID',
        },
      ],
      responses: {
        200: {
          description: 'Plan deleted successfully',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  message: { type: 'string', example: 'Plan deleted successfully' },
                },
              },
            },
          },
        },
        401: { description: 'Unauthorized' },
        500: { description: 'Database error' },
      },
    },
  },
};

export const servicePaths = {
  '/api/Services': {
    get: {
      summary: 'Get all services for the authenticated user',
      tags: ['Services'],
      security: [{ bearerAuth: [] }],
      responses: {
        200: {
          description: 'List of services',
          content: {
            'application/json': {
              schema: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    id: { type: 'integer' },
                    name: { type: 'string' },
                    description: { type: 'string' },
                    billing_type: { type: 'string' },
                    billing_interval: { type: 'string', nullable: true },
                    base_price: { type: 'number' },
                    is_active: { type: 'boolean' },
                  },
                },
              },
            },
          },
        },
        401: { description: 'Unauthorized' },
      },
    },
    post: {
      summary: 'Create a new service for the authenticated user',
      tags: ['Services'],
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              required: ['name', 'description', 'billing_type', 'base_price'],
              properties: {
                name: { type: 'string', example: 'Website Hosting' },
                description: { type: 'string', example: 'Annual hosting and support' },
                billing_type: { type: 'string', example: 'recurring' },
                billing_interval: { type: 'string', nullable: true, example: 'monthly' },
                base_price: { type: 'number', example: 99.99 },
                is_active: { type: 'boolean', example: true },
              },
            },
          },
        },
      },
      responses: {
        200: { description: 'Service created successfully' },
        401: { description: 'Unauthorized' },
      },
    },
  },

  '/api/Services/{id}': {
    get: {
      summary: 'Get a specific service by ID',
      tags: ['Services'],
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          in: 'path',
          name: 'id',
          required: true,
          schema: { type: 'integer' },
          description: 'Service ID',
        },
      ],
      responses: {
        200: {
          description: 'A single service object',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  id: { type: 'integer' },
                  name: { type: 'string' },
                  description: { type: 'string' },
                  billing_type: { type: 'string' },
                  billing_interval: { type: 'string', nullable: true },
                  base_price: { type: 'number' },
                  is_active: { type: 'boolean' },
                },
              },
            },
          },
        },
        401: { description: 'Unauthorized' },
        404: { description: 'Service not found' },
      },
    },

    put: {
      summary: 'Update a service by ID',
      tags: ['Services'],
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          in: 'path',
          name: 'id',
          required: true,
          schema: { type: 'integer' },
          description: 'Service ID',
        },
      ],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              required: ['name', 'description', 'billing_type', 'base_price'],
              properties: {
                name: { type: 'string', example: 'SEO Optimization' },
                description: { type: 'string' },
                billing_type: { type: 'string' },
                billing_interval: { type: 'string', nullable: true },
                base_price: { type: 'number' },
                is_active: { type: 'boolean' },
              },
            },
          },
        },
      },
      responses: {
        200: { description: 'Service updated successfully' },
        401: { description: 'Unauthorized' },
      },
    },

    delete: {
      summary: 'Delete a service by ID',
      tags: ['Services'],
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          in: 'path',
          name: 'id',
          required: true,
          schema: { type: 'integer' },
          description: 'Service ID',
        },
      ],
      responses: {
        200: { description: 'Service deleted successfully' },
        401: { description: 'Unauthorized' },
      },
    },
  },
};

// src/swagger/paths/clients.js

export const clientPaths = {
  '/api/clients': {
    get: {
      summary: 'Get all clients for the authenticated user',
      tags: ['Clients'],
      security: [{ bearerAuth: [] }],
      responses: {
        200: {
          description: 'List of clients',
          content: {
            'application/json': {
              schema: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    id: { type: 'integer', example: 1 },
                    user_id: { type: 'integer', example: 42 },
                    name: { type: 'string', example: 'Jane Doe' },
                    email: { type: 'string', example: 'jane@example.com' },
                    phone: { type: 'string', example: '9876543210' },
                    address: { type: 'string', example: '123 Street Name, City' },
                    notes: { type: 'string', example: 'Important client' },
                    company_name: { type: 'string', example: 'ABC Corp' },
                  },
                },
              },
            },
          },
        },
        401: {
          description: 'Unauthorized',
        },
      },
    },

    post: {
      summary: 'Create a new client for the authenticated user',
      tags: ['Clients'],
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              required: ['name'],
              properties: {
                name: { type: 'string', example: 'Jane Doe' },
                email: { type: 'string', format: 'email', example: 'jane@example.com' },
                phone: { type: 'string', example: '9876543210' },
                address: { type: 'string', example: '123 Street Name, City' },
                notes: { type: 'string', example: 'Follow up next week' },
                company_name: { type: 'string', example: 'ABC Corp' },
              },
            },
          },
        },
      },
      responses: {
        200: {
          description: 'Client created',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  message: { type: 'string', example: 'Client created' },
                },
              },
            },
          },
        },
        401: {
          description: 'Unauthorized',
        },
      },
    },
  },

  '/api/clients/{id}': {
    get: {
      summary: 'Get a specific client by ID',
      tags: ['Clients'],
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          in: 'path',
          name: 'id',
          required: true,
          schema: { type: 'integer' },
          description: 'ID of the client to retrieve',
        },
      ],
      responses: {
        200: {
          description: 'Client object',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  id: { type: 'integer' },
                  name: { type: 'string' },
                  email: { type: 'string' },
                  phone: { type: 'string' },
                  address: { type: 'string' },
                  notes: { type: 'string' },
                  company_name: { type: 'string' },
                },
              },
            },
          },
        },
        401: { description: 'Unauthorized' },
      },
    },

    put: {
      summary: 'Update a client by ID',
      tags: ['Clients'],
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          in: 'path',
          name: 'id',
          required: true,
          schema: { type: 'integer' },
          description: 'ID of the client to update',
        },
      ],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              required: ['name'],
              properties: {
                name: { type: 'string', example: 'Jane Doe' },
                email: { type: 'string', format: 'email', example: 'jane@example.com' },
                phone: { type: 'string', example: '9876543210' },
                address: { type: 'string', example: '123 Street Name' },
                notes: { type: 'string', example: 'VIP client' },
                company_name: { type: 'string', example: 'ABC Corp' },
              },
            },
          },
        },
      },
      responses: {
        200: {
          description: 'Client updated',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  message: { type: 'string', example: 'Client updated' },
                },
              },
            },
          },
        },
        401: { description: 'Unauthorized' },
      },
    },

    delete: {
      summary: 'Delete a client by ID',
      tags: ['Clients'],
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          in: 'path',
          name: 'id',
          required: true,
          schema: { type: 'integer' },
          description: 'ID of the client to delete',
        },
      ],
      responses: {
        200: {
          description: 'Client deleted',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  message: { type: 'string', example: 'Client deleted' },
                },
              },
            },
          },
        },
        401: { description: 'Unauthorized' },
      },
    },
  },
};

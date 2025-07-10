// src/swagger/paths/income.js

export const incomePaths = {
  '/api/income_records': {
    get: {
      summary: 'Get all income records for the authenticated user',
      tags: ['Income Records'],
      security: [{ bearerAuth: [] }],
      responses: {
        200: {
          description: 'List of income records',
          content: {
            'application/json': {
              schema: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    id: { type: 'integer' },
                    user_id: { type: 'integer' },
                    client_id: { type: 'integer' },
                    service_id: { type: 'integer' },
                    amount: { type: 'number' },
                    payment_date: { type: 'string', format: 'date' },
                    due_date: { type: 'string', format: 'date', nullable: true },
                    status: { type: 'string' },
                    is_recurring: { type: 'boolean' },
                    recurrence_id: { type: 'integer', nullable: true },
                    notes: { type: 'string' },
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
      summary: 'Create a new income record',
      tags: ['Income Records'],
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              required: ['client_id', 'service_id', 'amount', 'payment_date'],
              properties: {
                client_id: { type: 'integer', example: 1 },
                service_id: { type: 'integer', example: 2 },
                amount: { type: 'number', example: 1500 },
                payment_date: { type: 'string', format: 'date', example: '2025-07-09' },
                due_date: {
                  type: 'string',
                  format: 'date',
                  nullable: true,
                  example: '2025-07-30',
                },
                status: { type: 'string', example: 'pending' },
                is_recurring: { type: 'boolean', example: false },
                recurrence_id: { type: 'integer', nullable: true, example: null },
                notes: { type: 'string', example: 'Follow-up in August' },
              },
            },
          },
        },
      },
      responses: {
        200: { description: 'Income record created' },
        401: { description: 'Unauthorized' },
        403: { description: 'Limit exceeded or no active subscription' },
      },
    },
  },

  '/api/income_records/{id}': {
    get: {
      summary: 'Get a specific income record by ID',
      tags: ['Income Records'],
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: 'id',
          in: 'path',
          required: true,
          schema: { type: 'integer' },
          description: 'Income record ID',
        },
      ],
      responses: {
        200: {
          description: 'Income record object',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  id: { type: 'integer' },
                  client_id: { type: 'integer' },
                  service_id: { type: 'integer' },
                  amount: { type: 'number' },
                  payment_date: { type: 'string', format: 'date' },
                  due_date: { type: 'string', format: 'date', nullable: true },
                  status: { type: 'string' },
                  is_recurring: { type: 'boolean' },
                  recurrence_id: { type: 'integer', nullable: true },
                  notes: { type: 'string' },
                },
              },
            },
          },
        },
        401: { description: 'Unauthorized' },
      },
    },

    put: {
      summary: 'Update an income record by ID',
      tags: ['Income Records'],
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: 'id',
          in: 'path',
          required: true,
          schema: { type: 'integer' },
          description: 'Income record ID',
        },
      ],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              required: ['client_id', 'service_id', 'amount', 'payment_date'],
              properties: {
                client_id: { type: 'integer', example: 1 },
                service_id: { type: 'integer', example: 2 },
                amount: { type: 'number', example: 2000 },
                payment_date: { type: 'string', format: 'date', example: '2025-07-10' },
                due_date: {
                  type: 'string',
                  format: 'date',
                  nullable: true,
                  example: '2025-07-20',
                },
                status: { type: 'string', example: 'paid' },
                is_recurring: { type: 'boolean', example: false },
                recurrence_id: { type: 'integer', nullable: true, example: null },
                notes: { type: 'string', example: 'Paid in full' },
              },
            },
          },
        },
      },
      responses: {
        200: { description: 'Income record updated' },
        401: { description: 'Unauthorized' },
      },
    },

    delete: {
      summary: 'Delete an income record by ID',
      tags: ['Income Records'],
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: 'id',
          in: 'path',
          required: true,
          schema: { type: 'integer' },
          description: 'Income record ID',
        },
      ],
      responses: {
        200: { description: 'Income record deleted' },
        401: { description: 'Unauthorized' },
      },
    },
  },

  '/api/income_records/upcoming': {
    get: {
      summary: 'Get upcoming income records with client and service info',
      tags: ['Income Records'],
      security: [{ bearerAuth: [] }],
      responses: {
        200: {
          description: 'List of upcoming income records',
          content: {
            'application/json': {
              schema: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    id: { type: 'integer', example: 12 },
                    user_id: { type: 'integer', example: 1 },
                    client_id: { type: 'integer', example: 2 },
                    service_id: { type: 'integer', example: 3 },
                    amount: { type: 'number', example: 1999.99 },
                    payment_date: {
                      type: 'string',
                      format: 'date',
                      example: '2025-07-01',
                    },
                    due_date: {
                      type: 'string',
                      format: 'date',
                      example: '2025-07-15',
                    },
                    status: { type: 'string', example: 'pending' },
                    is_recurring: { type: 'boolean', example: false },
                    recurrence_id: { type: 'integer', nullable: true, example: null },
                    notes: { type: 'string', example: 'Upcoming payment from client' },
                    client_name: { type: 'string', example: 'John Doe' },
                    service_name: { type: 'string', example: 'SEO Consultation' },
                  },
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

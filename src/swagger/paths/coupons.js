// src/swagger/paths/coupons.js

export const couponPaths = {
  '/api/coupons': {
    get: {
      summary: 'Get all coupons',
      tags: ['Coupons'],
      responses: {
        200: {
          description: 'List of all coupons',
          content: {
            'application/json': {
              schema: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    id: { type: 'integer' },
                    code: { type: 'string' },
                    discount_percent: { type: 'number' },
                    max_usage: { type: 'integer', nullable: true },
                    expires_at: { type: 'string', format: 'date-time', nullable: true },
                  },
                },
              },
            },
          },
        },
        500: {
          description: 'Database error',
        },
      },
    },
    post: {
      summary: 'Create a new coupon',
      tags: ['Coupons'],
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              required: ['code', 'discount_percent'],
              properties: {
                code: { type: 'string', example: 'SAVE20' },
                discount_percent: { type: 'number', example: 20 },
                max_usage: { type: 'integer', nullable: true, example: 100 },
                expires_at: {
                  type: 'string',
                  format: 'date-time',
                  nullable: true,
                  example: '2025-12-31T23:59:59Z',
                },
              },
            },
          },
        },
      },
      responses: {
        200: {
          description: 'Coupon created successfully',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  message: { type: 'string', example: 'Coupon created successfully' },
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

  '/api/coupons/{id}': {
    get: {
      summary: 'Get a coupon by ID',
      tags: ['Coupons'],
      parameters: [
        {
          in: 'path',
          name: 'id',
          required: true,
          schema: { type: 'integer' },
          description: 'Coupon ID',
        },
      ],
      responses: {
        200: {
          description: 'Coupon details',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  id: { type: 'integer' },
                  code: { type: 'string' },
                  discount_percent: { type: 'number' },
                  max_usage: { type: 'integer', nullable: true },
                  expires_at: { type: 'string', format: 'date-time', nullable: true },
                },
              },
            },
          },
        },
        404: { description: 'Coupon not found' },
        500: { description: 'Database error' },
      },
    },

    put: {
      summary: 'Update a coupon by ID',
      tags: ['Coupons'],
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          in: 'path',
          name: 'id',
          required: true,
          schema: { type: 'integer' },
          description: 'Coupon ID',
        },
      ],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              required: ['code', 'discount_percent'],
              properties: {
                code: { type: 'string', example: 'SUMMER10' },
                discount_percent: { type: 'number', example: 10 },
                max_usage: { type: 'integer', nullable: true, example: 50 },
                expires_at: {
                  type: 'string',
                  format: 'date-time',
                  nullable: true,
                  example: '2025-12-31T23:59:59Z',
                },
              },
            },
          },
        },
      },
      responses: {
        200: { description: 'Coupon updated successfully' },
        400: { description: 'Missing required fields' },
        401: { description: 'Unauthorized' },
        500: { description: 'Database error' },
      },
    },

    delete: {
      summary: 'Delete a coupon by ID',
      tags: ['Coupons'],
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          in: 'path',
          name: 'id',
          required: true,
          schema: { type: 'integer' },
          description: 'Coupon ID',
        },
      ],
      responses: {
        200: {
          description: 'Coupon deleted successfully',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  message: { type: 'string', example: 'Coupon deleted successfully' },
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

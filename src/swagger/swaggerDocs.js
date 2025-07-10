// src/swagger/swaggerDocs.js

export const swaggerDocument = {
  openapi: '3.0.0',
  info: {
    title: 'My Next.js API',
    version: '1.0.0',
    description: 'Swagger documentation for all API routes',
  },
  servers: [
    { url: 'https://www.requrr.com' },
    { url: 'http://localhost:3000' },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
    },
  },
  security: [{ bearerAuth: [] }],
  paths: {
    '/api/auth/login': {
      post: {
        tags: ['Auth'],
        summary: 'Login user',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  email: { type: 'string' },
                  password: { type: 'string' },
                },
              },
            },
          },
        },
        responses: {
          200: { description: 'Login success' },
          401: { description: 'Unauthorized' },
        },
      },
    },
    // Add more paths here
  },
};

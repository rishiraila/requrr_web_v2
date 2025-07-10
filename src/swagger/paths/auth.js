// src/swagger/paths/auth.js

export const authPaths = {
  '/api/auth/login': {
    post: {
      summary: 'Login a user',
      tags: ['Auth'],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              required: ['email', 'password'],
              properties: {
                email: {
                  type: 'string',
                  example: 'user@example.com',
                },
                password: {
                  type: 'string',
                  example: 'yourpassword',
                },
              },
            },
          },
        },
      },
      responses: {
        200: {
          description: 'Auth success',
        },
        401: {
          description: 'Invalid credentials',
        },
      },
    },
  },
};

// src/app/api/docs/swagger/route.js
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerOptions from '../../../../../swagger.config'; // 👈 now it's default import

export async function GET(req) {
  const protocol = req.headers.get('x-forwarded-proto') || 'http';
  const host = req.headers.get('host');

  const dynamicOptions = {
    ...swaggerOptions,
    definition: {
      ...swaggerOptions.definition,
      servers: [
        {
          url: `${protocol}://${host}`,
        },
      ],
    },
  };

  const specs = swaggerJsdoc(dynamicOptions);

  return new Response(JSON.stringify(specs), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

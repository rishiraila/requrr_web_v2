// src/app/api/docs/swagger/route.js
import swaggerJSDoc from 'swagger-jsdoc';
import { swaggerOptions } from '../../../../../swagger.config';

const specs = swaggerJSDoc(swaggerOptions); // generate once at module level

export function GET() {
  return new Response(JSON.stringify(specs), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

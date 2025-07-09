import { swaggerOptions } from '../../../../../swagger.config';
import swaggerJsdoc from 'swagger-jsdoc';

export async function GET() {
  const specs = swaggerJsdoc(swaggerOptions);
  return new Response(JSON.stringify(specs), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}

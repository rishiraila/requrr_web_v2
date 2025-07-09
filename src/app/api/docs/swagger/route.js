// // src/app/api/docs/swagger/route.js
// import swaggerJSDoc from 'swagger-jsdoc';
// import { swaggerOptions } from '../../../../../swagger.config';

// const specs = swaggerJSDoc(swaggerOptions); // generate once at module level

// export function GET() {
//   return new Response(JSON.stringify(specs), {
//     status: 200,
//     headers: {
//       'Content-Type': 'application/json',
//     },
//   });
// }


import swaggerJsdoc from 'swagger-jsdoc';
import { swaggerOptions } from '../../../../../swagger.config';

export async function GET(req) {
  // Dynamically get the protocol and host (for local & production)
  const protocol = req.headers.get('x-forwarded-proto') || 'http';
  const host = req.headers.get('host');

  // Inject runtime server URL
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

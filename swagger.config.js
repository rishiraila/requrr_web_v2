// // swagger.config.js
// export const swaggerOptions = {
//   definition: {
//     openapi: '3.0.0',
//     info: {
//       title: 'My Next.js API',
//       version: '1.0.0',
//       description: 'Swagger documentation for all API routes',
//     },
//     servers: [
//       {
//         url: 'http://localhost:3000', // or your production URL
//       },
//     ],
//   },
//   apis: ['./src/app/api/**/*.js'], // adjust if your APIs are elsewhere
// };


// swagger.config.js

export const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'My Next.js API',
      version: '1.0.0',
      description: 'Swagger documentation for all API routes',
    },
    // Do NOT hardcode the server URL; it will be injected dynamically in the route
    servers: [], 
  },
  // Adjust this path if your API routes are elsewhere
  apis: ['./src/app/api/**/*.js'], 
};

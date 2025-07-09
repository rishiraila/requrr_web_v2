// src/app/docs/page.js
'use client';

import { useEffect } from 'react';

export default function SwaggerDocsPage() {
  useEffect(() => {
    // Load Swagger UI bundle dynamically from the CDN or public folder
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/swagger-ui-dist/swagger-ui-bundle.js';
    script.async = true;
    script.onload = () => {
      window.SwaggerUIBundle({
        url: '/api/docs/swagger', // Your generated swagger spec
        dom_id: '#swagger-ui',
        presets: [window.SwaggerUIBundle.presets.apis],
        layout: 'BaseLayout',
      });
    };
    document.body.appendChild(script);
  }, []);

  return (
    <div style={{ height: '100vh' }}>
      <link
        rel="stylesheet"
        href="https://cdn.jsdelivr.net/npm/swagger-ui-dist/swagger-ui.css"
      />
      <div id="swagger-ui" />
    </div>
  );
}

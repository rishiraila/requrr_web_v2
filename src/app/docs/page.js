'use client';
import dynamic from 'next/dynamic';
import 'swagger-ui-react/swagger-ui.css';

// Avoid SSR issues
const SwaggerUI = dynamic(() => import('swagger-ui-react'), { ssr: false });

export default function SwaggerDocsPage() {
  return (
    <div style={{ height: '100vh' }}>
      <SwaggerUI url="/api/docs/swagger" />
    </div>
  );
}

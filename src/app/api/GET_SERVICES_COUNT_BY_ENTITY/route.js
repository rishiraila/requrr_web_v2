import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { db } from '../../../db';

// Enable CORS for preflight requests (OPTIONS)
export async function OPTIONS() {
  return NextResponse.json(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}

// Helper function for authentication
async function authenticate(request) {
    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new Error('Authorization token is missing or invalid');
    }
    const token = authHeader.split(' ')[1];
    return jwt.verify(token, process.env.JWT_SECRET);
  }

// GET request to count services by entity
export async function GET(request) {
    try {
      const decoded = await authenticate(request);
      
      const [rows] = await db.execute(
        `SELECT entities.entity_name, COUNT(services.id) AS service_count
         FROM entities
         LEFT JOIN services ON entities.id = services.entity_id
         GROUP BY entities.id`
      );
  
      return NextResponse.json({
        message: 'Service counts by entity fetched successfully',
        data: rows,
      }, {
        status: 200,
        headers: { 'Access-Control-Allow-Origin': '*' },
      });
    } catch (error) {
      return NextResponse.json({ message: error.message }, { status: 500 });
    }
  }
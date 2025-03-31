import { NextResponse } from 'next/server';
import { db } from '../../../db';
import jwt from 'jsonwebtoken';
// DELETE API for deleting a user
export async function DELETE(request) {
    try {
      // 1. Get authorization header
      const authHeader = request.headers.get('Authorization');
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return NextResponse.json({ message: 'Authorization token is missing or invalid' }, { status: 401 });
      }
  
      // 2. Verify the token
      const token = authHeader.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user_id = decoded.user_id;
  
      // 3. Delete user from the database
      const [result] = await db.execute('DELETE FROM users WHERE sr = ?', [user_id]);
  
      if (result.affectedRows === 0) {
        return NextResponse.json({ message: 'User not found' }, { status: 404 });
      }
  
      return NextResponse.json({ message: 'User deleted successfully' }, { status: 200 });
  
    } catch (error) {
      return NextResponse.json({ message: 'Something went wrong', error: error.message }, { status: 500 });
    }
  }
  
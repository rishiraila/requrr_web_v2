import { verifyToken } from '../lib/auth';
export function authenticate(req) {
  const authHeader = req.headers.get('authorization');
  const token = authHeader?.split(' ')[1];
  // return verifyToken(token);
  const user = verifyToken(token);
  if (!user) return null;
  return user;
}

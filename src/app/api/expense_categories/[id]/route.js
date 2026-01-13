import { db } from '../../../../db';
import { authenticate } from '../../../../middleware/auth';

export async function DELETE(req, { params }) {
  const user = authenticate(req);
  if (!user) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const categoryId = params.id;

  // ✅ Verify ownership
  const [[category]] = await db.query(
    'SELECT id FROM expense_categories WHERE id = ? AND user_id = ?',
    [categoryId, user.id]
  );

  if (!category) {
    return Response.json({ error: 'Category not found' }, { status: 404 });
  }

  // 🔄 Remove category reference from expenses
  await db.query(
    'UPDATE recurring_expenses SET category_id = NULL WHERE category_id = ? AND user_id = ?',
    [categoryId, user.id]
  );

  // 🗑️ Delete category
  await db.query(
    'DELETE FROM expense_categories WHERE id = ? AND user_id = ?',
    [categoryId, user.id]
  );

  return Response.json({ message: 'Category deleted successfully' });
}

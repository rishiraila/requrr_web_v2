import fs from 'fs';
import { db } from './src/db.js';

async function runMigration() {
  try {
    const migrationSQL = fs.readFileSync('src/db/migrations/add_whatsapp_notifications_column.sql', 'utf8');
    console.log('Running migration...');
    console.log('Migration SQL:', migrationSQL);

    await db.execute(migrationSQL);
    console.log('✅ Migration completed successfully!');

    process.exit(0);
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

runMigration();

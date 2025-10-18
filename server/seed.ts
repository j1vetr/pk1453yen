import { db } from './db';
import { adminUsers } from '@shared/schema';
import { createAdminUser } from './auth';
import { eq } from 'drizzle-orm';

async function seed() {
  try {
    console.log('🌱 Seeding database...');
    
    // Check if admin user already exists
    const [existing] = await db.select()
      .from(adminUsers)
      .where(eq(adminUsers.username, 'toov'))
      .limit(1);
    
    if (existing) {
      console.log('✅ Admin user "toov" already exists');
    } else {
      // Create default admin user
      await createAdminUser('toov', 'Toov1453@@');
      console.log('✅ Created default admin user:');
      console.log('   Username: toov');
      console.log('   Password: Toov1453@@');
    }
    
    console.log('🎉 Seeding completed!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
}

seed();

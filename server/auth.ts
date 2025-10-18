import bcrypt from 'bcryptjs';
import { db } from './db';
import { adminUsers } from '@shared/schema';
import { eq } from 'drizzle-orm';

const SALT_ROUNDS = 10;

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export async function createAdminUser(username: string, password: string) {
  const passwordHash = await hashPassword(password);
  
  const [user] = await db.insert(adminUsers).values({
    username,
    passwordHash,
    role: 'admin',
  }).returning();
  
  return user;
}

export async function verifyAdminCredentials(username: string, password: string) {
  const [user] = await db.select()
    .from(adminUsers)
    .where(eq(adminUsers.username, username))
    .limit(1);

  if (!user) {
    return null;
  }

  const isValid = await verifyPassword(password, user.passwordHash);
  if (!isValid) {
    return null;
  }

  // Update last login
  await db.update(adminUsers)
    .set({ lastLogin: new Date() })
    .where(eq(adminUsers.id, user.id));

  return {
    id: user.id,
    username: user.username,
    role: user.role,
  };
}

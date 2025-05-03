// server/scripts/createAdmin.ts
import { db } from "../db/client";
import { users } from "../../shared/schema";
import { hash } from "bcryptjs";
import { insertUserSchema } from "../../shared/schema";
import { eq } from "drizzle-orm";

async function createAdminAccount() {
  // Admin account configuration
  const adminData = {
    username: 'admin1',
    password: await hash('Hanoi123', 12),
    email: 'alexphan2687@gmail.com',
    role: 'admin' as const,
    phoneNumber: '+1234567890'
  };

  try {
    // Check if admin already exists - CORRECTED QUERY
    const existingAdmins = await db
      .select()
      .from(users)
      .where(eq(users.role, 'admin1'))
      .limit(1);

    if (existingAdmins.length > 0) {
      console.warn('⚠️ Admin account already exists. ID:', existingAdmins[0].id);
      process.exit(0);
    }

    // Validate against your schema
    const validatedData = insertUserSchema.parse(adminData);
    
    // Insert into database
    const [newAdmin] = await db.insert(users)
      .values(validatedData)
      .returning();
    
    console.log('✅ Admin account created successfully');
    console.log('ID:', newAdmin.id);
    console.log('Username:', newAdmin.username);
    console.log('Email:', newAdmin.email);
    console.log('\n⚠️ Change the default password immediately!');
  } catch (error) {
    console.error('❌ Failed to create admin account:');
    if (error instanceof Error) {
      console.error(error.message);
    }
    process.exit(1);
  } finally {
    process.exit(0);
  }
}

createAdminAccount();
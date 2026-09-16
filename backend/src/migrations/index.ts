// Seeder — run with `npm run seeder` (or `npx prisma db seed`).
// Table creation / indexes are handled by Prisma Migrate (`npm run migrate`),
// so this file only seeds rows.
import prisma, { disconnectFromDatabase } from "../database/prisma";
import { USER_STATUS, USER_TYPE } from "../config/constants";
import { generateHash } from "../utils/jwt";

export async function adminSeeder() {
    try {
        const email = 'admin@apify.com';
        const hashPassword = await generateHash('Admin@123');

        const admin = await prisma.user.upsert({
            where: { email },
            // Runs when the admin already exists — never resets status/type.
            update: {
                name: 'Admin',
                password: hashPassword,
                number: "1234567890",
                isVerified: 1,
                isSubscribed: 1,
            },
            // Runs only on first insert.
            create: {
                email,
                name: 'Admin',
                password: hashPassword,
                number: "1234567890",
                isVerified: 1,
                isSubscribed: 1,
                status: USER_STATUS.active,
                type: USER_TYPE.admin,
                isDeleted: false,
            },
            select: { id: true, email: true },
        });

        console.log("<<<<<<<<<-------------Admin Inserted Successfully------------->>>>>>>>>>>>", admin);
    } catch (error) {
        console.log("<<<<<<<<<<<<<<<--------------seeder error---------------->>>>>>>>>>>>>>>", error);
        throw error;
    }
}

// Run every seeder when this file is executed directly.
if (require.main === module) {
    adminSeeder()
        .then(() => disconnectFromDatabase())
        .catch(async (error) => {
            await disconnectFromDatabase();
            console.error(error);
            process.exit(1);
        });
}

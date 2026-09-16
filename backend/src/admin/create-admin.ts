import "dotenv/config";
import bcrypt from "bcryptjs";
import { prisma } from "../database/prisma";

async function main() {
  const {
    ADMIN_EMAIL,
    ADMIN_PASSWORD,
    ADMIN_NAME = "Administrator",
  } = process.env;
  if (!ADMIN_EMAIL || !ADMIN_PASSWORD || ADMIN_PASSWORD.length < 12)
    throw new Error(
      "Set ADMIN_EMAIL and ADMIN_PASSWORD (at least 12 characters) locally.",
    );
  await prisma.user.create({
    data: {
      name: ADMIN_NAME,
      email: ADMIN_EMAIL.toLowerCase(),
      password: await bcrypt.hash(ADMIN_PASSWORD, 12),
      type: 1,
      status: 1,
      isVerified: 1,
    },
  });
  console.log("Administrator created.");
}
main()
  .catch(() => {
    console.error(
      "Could not create administrator. Check configuration and whether the email already exists.",
    );
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());

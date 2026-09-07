import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding MySQL database at 127.0.0.1:3306/hr_management...");

  // 1. Create or upsert Organization
  const org = await prisma.organization.upsert({
    where: { slug: "roacs-corp" },
    update: {
      name: "Roacs Corporation",
      plan: "Professional",
      employeeLimit: 200,
    },
    create: {
      id: "org-roacs",
      name: "Roacs Corporation",
      slug: "roacs-corp",
      plan: "Professional",
      employeeLimit: 200,
    },
  });

  console.log(`✅ Organization synced: ${org.name} (${org.id})`);

  // 2. Define seed users with plain text passwords (per instruction)
  const seedUsers = [
    {
      name: "Amira Patel",
      email: "admin@roacs.com",
      password: "Admin@123",
      role: "ADMIN_HR",
      organizationId: org.id,
      department: "Human Resources",
      designation: "HR Operations Director",
      phone: "+1 (555) 234-5678",
      status: "ACTIVE",
    },
    {
      name: "Marcus Vance",
      email: "manager@roacs.com",
      password: "Manager@123",
      role: "MANAGER",
      organizationId: org.id,
      department: "Engineering",
      designation: "Engineering VP",
      phone: "+1 (555) 345-6789",
      status: "ACTIVE",
    },
    {
      name: "Sarah Chen",
      email: "teamlead@roacs.com",
      password: "Lead@123",
      role: "TEAM_LEAD",
      organizationId: org.id,
      department: "Engineering",
      designation: "Frontend Tech Lead",
      phone: "+1 (555) 456-7890",
      status: "ACTIVE",
    },
    {
      name: "Liam O'Connor",
      email: "employee@roacs.com",
      password: "User@123",
      role: "EMPLOYEE",
      organizationId: org.id,
      department: "Engineering",
      designation: "Senior Full Stack Engineer",
      phone: "+1 (555) 567-8901",
      status: "ACTIVE",
    },
    {
      name: "Platform Super Admin",
      email: "superadmin@crewsync.com",
      password: "Super@123",
      role: "SUPER_ADMIN",
      organizationId: org.id,
      department: "Executive",
      designation: "Platform Administrator",
      phone: "+1 (555) 999-0000",
      status: "ACTIVE",
    },
  ];

  for (const user of seedUsers) {
    const upserted = await prisma.user.upsert({
      where: { email: user.email },
      update: {
        name: user.name,
        password: user.password,
        role: user.role,
        department: user.department,
        designation: user.designation,
        phone: user.phone,
        status: user.status,
        organizationId: user.organizationId,
      },
      create: {
        name: user.name,
        email: user.email,
        password: user.password,
        role: user.role,
        department: user.department,
        designation: user.designation,
        phone: user.phone,
        status: user.status,
        organizationId: user.organizationId,
      },
    });

    console.log(`👤 User synced: ${upserted.name} (${upserted.email}) -> Role: ${upserted.role}`);
  }

  console.log("✨ Seeding completed successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Seeding error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

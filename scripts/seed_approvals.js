const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding dummy approvals data...");

  // Get a user to assign as the employee
  const employee = await prisma.user.findFirst({
    where: { role: "EMPLOYEE" },
  });

  if (!employee) {
    console.error("No employee found in the database to assign leaves to.");
    return;
  }

  // Create Leave Requests
  await prisma.leaveRequest.create({
    data: {
      employeeId: employee.id,
      type: "Annual Leave",
      startDate: new Date("2026-12-20"),
      endDate: new Date("2027-01-02"),
      duration: "10 days",
      status: "Pending",
      escalatedBy: "Mark T.",
    },
  });

  await prisma.leaveRequest.create({
    data: {
      employeeId: employee.id,
      type: "Sick Leave",
      startDate: new Date("2026-10-15"),
      endDate: new Date("2026-10-17"),
      duration: "3 days",
      status: "Pending",
      escalatedBy: "Mark T.",
    },
  });

  // Create Payroll Adjustments
  await prisma.payrollAdjustment.create({
    data: {
      employeeId: employee.id,
      type: "Overtime Bonus",
      amount: 450.00,
      reason: "Weekend deployment support",
      status: "Pending",
      escalatedBy: "Sarah J.",
    },
  });

  console.log("Seeding complete!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

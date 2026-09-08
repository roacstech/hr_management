import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required." },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
      include: {
        organization: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: "No account found with this email address." },
        { status: 401 }
      );
    }

    // Plain text comparison per instruction: "dont hash password for now"
    if (user.password !== password) {
      return NextResponse.json(
        { error: "Incorrect password. Please verify your credentials." },
        { status: 401 }
      );
    }

    if (user.status === "INACTIVE" || user.status === "OFFBOARDED") {
      return NextResponse.json(
        { error: "Your account is inactive. Please contact your organization administrator." },
        { status: 403 }
      );
    }

    // Determine redirect destination by role
    let redirectUrl = "/hr-dashboard";
    switch (user.role) {
      case "SUPER_ADMIN":
        redirectUrl = "/saas-dashboard/tenants";
        break;
      case "ADMIN_HR":
        redirectUrl = "/hr-dashboard";
        break;
      case "MANAGER":
        redirectUrl = "/manager-dashboard/department";
        break;
      case "TEAM_LEAD":
        redirectUrl = "/tl-dashboard/roster";
        break;
      case "EMPLOYEE":
      default:
        redirectUrl = "/portal/profile";
        break;
    }

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        department: user.department,
        designation: user.designation,
        organizationId: user.organizationId,
        organizationName: user.organization?.name,
      },
      redirectUrl,
    });
  } catch (error: unknown) {
    console.error("Login verification error:", error);
    return NextResponse.json(
      { error: "Database connection error. Please ensure MySQL is running." },
      { status: 500 }
    );
  }
}

"use client";

import ProfileView from "@/components/ProfileView";

export default function ManagerProfilePage() {
  return <ProfileView closeUrl="/manager-dashboard" profileType="manager" />;
}

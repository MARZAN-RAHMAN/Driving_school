import { UserRole } from "@/types";

export type Permission =
  | "access:admin_dashboard"
  | "manage:users"
  | "manage:content"
  | "view:logs"
  | "manage:settings"
  | "access:api_admin"
  | "access:instructor_dashboard"
  | "manage:instructor_lessons"
  | "access:student_dashboard";

export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  ADMIN: [
    "access:admin_dashboard",
    "manage:users",
    "manage:content",
    "view:logs",
    "manage:settings",
    "access:api_admin",
    "access:instructor_dashboard",
    "manage:instructor_lessons",
    "access:student_dashboard",
  ],
  EDITOR: [
    "access:admin_dashboard",
    "manage:content",
  ],
  INSTRUCTOR: [
    "access:instructor_dashboard",
    "manage:instructor_lessons",
  ],
  STUDENT: [
    "access:student_dashboard",
  ],
  USER: [],
};

export function hasPermission(role: UserRole, permission: Permission): boolean {
  const permissions = ROLE_PERMISSIONS[role] || [];
  return permissions.includes(permission);
}

export function canAccessAdminRoute(role: UserRole, pathname: string): boolean {
  if (role === "ADMIN") return true;

  if (role === "EDITOR") {
    // Editor can access dashboard overview and content management
    if (pathname === "/admin" || pathname.startsWith("/admin/content")) {
      return true;
    }
    return false;
  }

  // INSTRUCTOR and STUDENT roles have zero access to /admin
  return false;
}

export function canAccessInstructorRoute(role: UserRole, pathname: string): boolean {
  // Admin can access instructor routes for monitoring and testing
  if (role === "ADMIN") return true;
  if (role === "INSTRUCTOR") return true;
  return false;
}

export function canAccessStudentRoute(role: UserRole, pathname: string): boolean {
  // Admin can access student routes for preview and testing
  if (role === "ADMIN") return true;
  if (role === "STUDENT") return true;
  return false;
}

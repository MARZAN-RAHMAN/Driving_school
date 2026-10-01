export type UserRole = "ADMIN" | "INSTRUCTOR" | "STUDENT" | "EDITOR" | "USER";

export type UserStatus = "ACTIVE" | "INACTIVE" | "PENDING";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  avatar: string;
  passwordHash?: string;
  createdAt: string;
  lastLogin: string;
}

export type ContentStatus = "PUBLISHED" | "DRAFT" | "ARCHIVED";

export interface ContentItem {
  id: string;
  title: string;
  slug: string;
  category: string;
  excerpt: string;
  content: string;
  status: ContentStatus;
  authorName: string;
  views: number;
  updatedAt: string;
  readTime?: string;
}

export interface SystemMetric {
  id: string;
  label: string;
  value: string;
  change: string;
  changeType: "positive" | "negative" | "neutral";
  description: string;
}

export type AuditSeverity = "SUCCESS" | "WARNING" | "FAILED" | "INFO";

export interface AuditLog {
  id: string;
  action: string;
  actorEmail: string;
  target: string;
  timestamp: string;
  ip: string;
  severity: AuditSeverity;
}

export interface AuthSession {
  user: User;
  token: string;
  expiresAt: string;
}

export interface SystemHealth {
  status: "healthy" | "degraded" | "unhealthy";
  version: string;
  phase: string;
  uptimeSeconds: number;
  timestamp: string;
  environment: string;
  services: {
    database: string;
    auth: string;
    api: string;
    cache: string;
  };
}

export type TransmissionType = "MANUAL" | "AUTOMATIC";
export type BookingStatus =
  | "CONFIRMED"
  | "IN_PROGRESS"
  | "COMPLETED"
  | "CANCELLED"
  | "PENDING"
  | "ASSIGNED"
  | "NO_SHOW";

export interface Booking {
  id: string;
  studentName: string;
  studentEmail: string;
  studentPhone: string;
  instructorId: string;
  instructorName: string;
  lessonTitle: string;
  transmission: TransmissionType;
  pickupLocation: string;
  dateTime: string;
  durationHours: number;
  price: number;
  status: BookingStatus;
  notes?: string;
  testCenter?: string;
  instructorNotes?: string;
  progressNotes?: string;
}

export interface InstructorAvailability {
  workingDays: string[];
  startTime: string;
  endTime: string;
  breaks: string[];
  unavailableDates: string[];
}

export interface Instructor {
  id: string;
  name: string;
  badgeNumber: string;
  avatar: string;
  phone: string;
  email: string;
  transmission: TransmissionType | "BOTH";
  rating: number;
  totalPasses: number;
  activeStudents: number;
  status: "ACTIVE" | "ON_LEAVE" | "INACTIVE";
  vehicle: string;
  grade?: string;
  bio?: string;
  areas?: string[];
  qualifications?: string[];
  availability?: InstructorAvailability;
}

export interface LessonPackage {
  id: string;
  title: string;
  transmission: TransmissionType | "BOTH";
  durationHours: number;
  hours?: number;
  price: number;
  level: "Beginner" | "Intermediate" | "Refresher" | "Pass Plus" | "Intensive";
  popular?: boolean;
  badge?: string;
  features: string[];
}

export interface LocationArea {
  id: string;
  name: string;
  postcodes: string[];
  boroughs?: string;
  activeInstructors: number;
  testCenterName: string;
}

export type ProvisionalLicenceStatus = "Yes" | "No" | "Applying soon";

export type TheoryStatus = "NOT_STARTED" | "STUDYING" | "BOOKED" | "PASSED";
export type StudentStatus = "ACTIVE" | "TEST_READY" | "PASSED" | "INACTIVE";

export interface Student {
  id: string;
  name: string;
  email: string;
  phone: string;
  postcode: string;
  theoryStatus: TheoryStatus;
  hoursCompleted: number;
  assignedInstructorId?: string;
  assignedInstructorName?: string;
  status: StudentStatus;
  notes?: string;
  testDate?: string;
  passDate?: string;
  provisionalLicenseNumber?: string;
  createdAt: string;
}

export type InquiryStatus =
  | "NEW"
  | "CONTACTED"
  | "FOLLOW_UP"
  | "CONVERTED"
  | "CLOSED"
  | "BOOKED"
  | "RESOLVED"
  | "ARCHIVED";

export interface ContactInquiry {
  id: string;
  name: string;
  email: string;
  phone: string;
  postcode: string;
  transmission?: TransmissionType;
  targetPackage: string; // Course name
  course?: string; // Course alias
  area?: string; // Area selected (e.g. South West & Wimbledon)
  provisionalLicence?: "Yes" | "No" | "Applying soon" | string;
  notes?: string;
  message?: string;
  howFound?: string; // "Google", "Instagram", etc.
  sourcePage?: string; // Submitted from page URL
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  internalNotes?: string; // Admin internal log/notes
  assignedInstructorId?: string;
  assignedInstructorName?: string;
  status: InquiryStatus;
  createdAt: string;
  updatedAt?: string;
}

export interface InstructorDashboardSummary {
  instructor: Instructor;
  todayLessons: Booking[];
  upcomingLessons: Booking[];
  completedLessons: Booking[];
  assignedStudents: Student[];
  totalStudentsCount: number;
  completedLessonsCount: number;
  pendingLessonsCount: number;
  hoursTaughtThisMonth: number;
}

export interface DashboardSummary {
  revenueThisMonth: string;
  revenueChange: string;
  activeBookingsCount: number;
  totalBookingsCount: number;
  pendingBookingsCount: number;
  confirmedBookingsCount: number;
  activeStudentsCount: number;
  totalStudentsCount: number;
  firstTimePassRate: string;
  activeInstructorsCount: number;
  totalInstructorsCount: number;
  weeklyHoursDelivered: number;
  totalReviewsCount: number;
  reviewsCount?: number;
  averageRating?: number;
  totalInquiriesCount: number;
  newInquiriesCount: number;
  contactedInquiriesCount?: number;
  convertedInquiriesCount?: number;
  totalLeadsCount?: number;
  upcomingLessons: Booking[];
  recentBookings: Booking[];
  recentInquiries: ContactInquiry[];
  instructorsOnDuty: Instructor[];
}

export interface ReviewItem {
  id: string;
  student: string;
  instructor: string;
  testCenter: string;
  rating: number;
  result: string;
  minors: string;
  quote: string;
  date: string;
  verified: boolean;
  featured?: boolean;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
  order: number;
}

export interface BusinessSettings {
  businessName: string;
  tradingName: string;
  companyRegistrationNumber: string;
  dvsaSchoolId: string;
  phone: string;
  emergencyPhone: string;
  email: string;
  headOfficeAddress: string;

  // Brand & Identity
  logoUrl?: string;
  logoBadgeText?: string;
  tagline?: string;

  // Hero Section CMS
  heroBadge: string;
  heroPassRateBadge: string;
  heroHeadline: string;
  heroSubhead: string;
  heroPrimaryCtaText: string;
  heroPrimaryCtaLink: string;
  heroSecondaryCtaText: string;
  heroSecondaryCtaLink: string;
  heroImageUrl?: string;

  // Trust & Conversion Metrics
  firstTimePassRate: string;
  totalPassesCount: string;
  googleRating: string;
  activeFleetCount: string;

  // Social Links
  facebookUrl?: string;
  instagramUrl?: string;
  tiktokUrl?: string;
  youtubeUrl?: string;
  twitterUrl?: string;

  // SEO CMS
  metaTitle: string;
  metaDescription: string;
  metaKeywords: string[];
  ogImageUrl?: string;

  standardSlotDurationMinutes: number;
  weekdayOpeningTime: string;
  weekdayClosingTime: string;
  weekendOpeningTime: string;
  weekendClosingTime: string;
  minAdvanceBookingHours: number;
  maxAdvanceBookingDays: number;
  cancellationNoticeHours: number;

  currency: string;
  currencySymbol: string;
  hourlyRateManual: number;
  hourlyRateAutomatic: number;
  testDayCarHireFee: number;
  weekendSurcharge: number;

  dualControlInspected: boolean;
  freeTheoryAppAccess: boolean;
  insuranceCoverageLevel: string;

  smsRemindersEnabled: boolean;
  instantDispatchAlerts: boolean;
  autoReviewInvites: boolean;
}

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

export interface Account {
  id: string;
  userId: string;
  provider: string; // "google" | "apple" | "linkedin" | "microsoft" | "x"
  providerAccountId: string;
  createdAt: string;
  updatedAt: string;
}

export type InstructorStatus =
  | "ACTIVE"
  | "ON_LEAVE"
  | "INACTIVE"
  | "PENDING"
  | "REJECTED"
  | "SUSPENDED";

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
  status: InstructorStatus;
  vehicle: string;
  grade?: string;
  bio?: string;
  areas?: string[];
  qualifications?: string[];
  availability?: InstructorAvailability;
  applicationDate?: string;
  yearsExperience?: number;
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
  slug?: string;
  description?: string;
  postcodes: string[];
  boroughs?: string;
  activeInstructors: number;
  testCenterName: string;
  latitude?: number;
  longitude?: number;
  coverageText?: string;
  isActive?: boolean;
  displayOrder?: number;
  createdAt?: string;
  updatedAt?: string;
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

  // Social Authentication Providers
  authProviders?: {
    google: boolean;
    apple: boolean;
    linkedin: boolean;
    microsoft: boolean;
    x: boolean;
  };
}

export type PopupTriggerType =
  | "time"
  | "exit_intent"
  | "scroll"
  | "button"
  | "time_scroll"
  | "manual";

export type PopupFrequency =
  | "every_visit"
  | "once_per_session"
  | "once_per_day"
  | "once_3_days"
  | "once_7_days"
  | "once_30_days"
  | "never_after_submission";

export type PopupAfterDismissal = "session" | "cooldown_days";

export type PopupAfterSubmission =
  | "show_success"
  | "close"
  | "redirect_booking"
  | "redirect_custom";

export type PopupPosition = "center" | "bottom_right" | "bottom_left" | "bottom_center";
export type PopupSize = "small" | "medium" | "large";
export type PopupTheme = "auto" | "light" | "dark";
export type PopupAnimation = "fade_scale" | "fade" | "slide_up" | "slide_down" | "none";

export interface PopupFieldConfig {
  id: string;
  fieldKey: string;
  label: string;
  placeholder?: string;
  fieldType: "text" | "email" | "tel" | "select" | "textarea" | "date" | "time";
  options?: string[];
  isEnabled: boolean;
  isRequired: boolean;
  displayOrder: number;
}

export interface PopupCampaign {
  id: string;
  name: string;
  isEnabled: boolean;
  status: "DRAFT" | "PUBLISHED";

  // Content
  title: string;
  subtitle: string;
  description: string;
  buttonText: string;
  successTitle: string;
  successMessage: string;
  trustBadgeText?: string;
  afterSubmissionAction: PopupAfterSubmission;
  customRedirectUrl?: string;

  // Trigger & Timing
  triggerType: PopupTriggerType;
  delaySeconds: number;
  mobileDelaySeconds: number;
  scrollPercentage: number;
  showCountdown: boolean;

  // Frequency
  frequency: PopupFrequency;
  dismissalRule: PopupAfterDismissal;
  cooldownDays: number;

  // Device & Page Targeting
  showDesktop: boolean;
  showTablet: boolean;
  showMobile: boolean;
  targetPages: string[];
  excludedPages?: string[];

  // Design
  position: PopupPosition;
  size: PopupSize;
  theme: PopupTheme;
  animation: PopupAnimation;
  animationDurationMs: number;
  backdropEnabled: boolean;
  backdropOpacity: number;

  // Form Fields
  fields: PopupFieldConfig[];

  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
}

export interface PopupAnalyticsEvent {
  id: string;
  popupId: string;
  event:
    | "popup_impression"
    | "popup_opened"
    | "popup_dismissed"
    | "popup_form_started"
    | "popup_form_field_completed"
    | "popup_submitted"
    | "popup_error";
  pageUrl: string;
  deviceType: "desktop" | "tablet" | "mobile";
  timestamp: string;
}

export interface PopupAnalyticsSummary {
  impressions: number;
  opened: number;
  dismissed: number;
  formStarted: number;
  submitted: number;
  conversionRate: string;
  eventsByDevice: {
    desktop: number;
    tablet: number;
    mobile: number;
  };
  recentEvents: PopupAnalyticsEvent[];
}

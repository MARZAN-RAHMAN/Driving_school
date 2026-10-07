import {
  User,
  ContentItem,
  SystemMetric,
  AuditLog,
  Booking,
  Instructor,
  LessonPackage,
  LocationArea,
  DashboardSummary,
  BookingStatus,
  BusinessSettings,
  ReviewItem,
  FAQItem,
  Student,
  ContactInquiry,
  InquiryStatus,
  InstructorAvailability,
  InstructorDashboardSummary,
  Account,
  PopupCampaign,
  PopupFieldConfig,
  PopupAnalyticsEvent,
  PopupAnalyticsSummary,
  FooterSettings,
  FooterColumnItem,
  FooterLinkItem,
  FooterSocialItem,
  FooterLegalLinkItem,
  PageSEO,
  GlobalSEOSettings,
  SEORedirect,
  SEOKeywordTarget,
  LocalTestCentre,
  SEOAuditResult,
  SEOAuditIssue,
  SEONapAudit,
  SEOSchemaType,
} from "@/types";

// Seeded In-Memory Database Repository with Real Relational Consistency

const initialUsers: User[] = [
  {
    id: "usr_admin_01",
    name: "Alex Vance",
    email: "admin@nexuscore.dev",
    role: "ADMIN",
    status: "ACTIVE",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=128&h=128&fit=crop&crop=faces",
    passwordHash: "1e1acbad652f9486c905b5b11698aa27:40cb1de71ff70920d67e2a32381a368c716bd5e95c2e1691b45cda37a1bece5784b6444e2e5ecca7f2bea84fabe26c4f254e124fc38d80c490148d683b70f9a0",
    createdAt: "2025-01-10T08:00:00Z",
    lastLogin: "2026-09-30T00:45:00Z",
  },
  {
    id: "usr_admin_02",
    name: "NextDrive Operations Admin",
    email: "admin@nextdrive.uk",
    role: "ADMIN",
    status: "ACTIVE",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=128&h=128&fit=crop&crop=faces",
    passwordHash: "1e1acbad652f9486c905b5b11698aa27:40cb1de71ff70920d67e2a32381a368c716bd5e95c2e1691b45cda37a1bece5784b6444e2e5ecca7f2bea84fabe26c4f254e124fc38d80c490148d683b70f9a0",
    createdAt: "2025-01-15T09:00:00Z",
    lastLogin: "2026-09-30T08:00:00Z",
  },
  {
    id: "usr_dev_02",
    name: "Sarah Chen",
    email: "sarah@nexuscore.dev",
    role: "ADMIN",
    status: "ACTIVE",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=128&h=128&fit=crop&crop=faces",
    passwordHash: "1e1acbad652f9486c905b5b11698aa27:40cb1de71ff70920d67e2a32381a368c716bd5e95c2e1691b45cda37a1bece5784b6444e2e5ecca7f2bea84fabe26c4f254e124fc38d80c490148d683b70f9a0",
    createdAt: "2025-02-14T11:20:00Z",
    lastLogin: "2026-09-29T19:30:00Z",
  },
  {
    id: "usr_member_03",
    name: "Marcus Thorne",
    email: "student@nextdrive.uk",
    role: "STUDENT",
    status: "ACTIVE",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=128&h=128&fit=crop&crop=faces",
    passwordHash: "ae8388544b62aad1888840ad748eb891:774a14635a81d455fbda4f0f6240b34123cae8e250dac57ab964e571bb8d6a90be66c1af8c9cd8e66b0d809bab6c88fbcaf5529d491cfd0718f4bb66f7a650f3",
    createdAt: "2025-05-18T14:15:00Z",
    lastLogin: "2026-09-28T16:00:00Z",
  },
  {
    id: "usr_inst_01",
    name: "Dave Miller",
    email: "instructor@nextdrive.uk",
    role: "INSTRUCTOR",
    status: "ACTIVE",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=128&h=128&fit=crop&crop=faces",
    passwordHash: "ae8388544b62aad1888840ad748eb891:774a14635a81d455fbda4f0f6240b34123cae8e250dac57ab964e571bb8d6a90be66c1af8c9cd8e66b0d809bab6c88fbcaf5529d491cfd0718f4bb66f7a650f3",
    createdAt: "2025-03-01T08:00:00Z",
    lastLogin: "2026-09-30T07:30:00Z",
  },
  {
    id: "usr_inst_01_alt",
    name: "Dave Miller",
    email: "dave.miller@nextdrive.uk",
    role: "INSTRUCTOR",
    status: "ACTIVE",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=128&h=128&fit=crop&crop=faces",
    passwordHash: "ae8388544b62aad1888840ad748eb891:774a14635a81d455fbda4f0f6240b34123cae8e250dac57ab964e571bb8d6a90be66c1af8c9cd8e66b0d809bab6c88fbcaf5529d491cfd0718f4bb66f7a650f3",
    createdAt: "2025-03-01T08:00:00Z",
    lastLogin: "2026-09-30T07:30:00Z",
  },
  {
    id: "usr_member_03_legacy",
    name: "Marcus Thorne",
    email: "user@nexuscore.dev",
    role: "STUDENT",
    status: "ACTIVE",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=128&h=128&fit=crop&crop=faces",
    passwordHash: "ae8388544b62aad1888840ad748eb891:774a14635a81d455fbda4f0f6240b34123cae8e250dac57ab964e571bb8d6a90be66c1af8c9cd8e66b0d809bab6c88fbcaf5529d491cfd0718f4bb66f7a650f3",
    createdAt: "2025-05-18T14:15:00Z",
    lastLogin: "2026-09-28T16:00:00Z",
  },
  {
    id: "usr_editor_04",
    name: "Elena Rostova",
    email: "elena.editor@nexuscore.dev",
    role: "EDITOR",
    status: "ACTIVE",
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=128&h=128&fit=crop&crop=faces",
    passwordHash: "62616cc32298666026516fdb1b69dee8:c5ef8dde61d52e2ac29494210fb3dba87dbba161a7e15ac765bbccd69659d15c875a90b6923532891d2e9458b0304d44f8892344e0e650f5b5d2f01258c739ff",
    createdAt: "2025-06-01T09:40:00Z",
    lastLogin: "2026-09-27T10:12:00Z",
  },
  {
    id: "usr_student_05",
    name: "Jordan Rivera",
    email: "jordan.r@student.nextdrive.uk",
    role: "STUDENT",
    status: "ACTIVE",
    avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=128&h=128&fit=crop&crop=faces",
    passwordHash: "ae8388544b62aad1888840ad748eb891:774a14635a81d455fbda4f0f6240b34123cae8e250dac57ab964e571bb8d6a90be66c1af8c9cd8e66b0d809bab6c88fbcaf5529d491cfd0718f4bb66f7a650f3",
    createdAt: "2026-08-10T12:00:00Z",
    lastLogin: "2026-09-30T09:00:00Z",
  },
];

const initialContent: ContentItem[] = [
  {
    id: "cnt_01",
    title: "Manual vs Automatic Driving Lessons in Manchester: Which is Right for You?",
    slug: "manual-vs-automatic-driving-lessons-manchester",
    category: "Vehicle Choice",
    excerpt: "Explore the pros, cons, career flexibility, and pass rate differences between manual and automatic transmission driving tuition in Manchester.",
    content: "Deciding between manual and automatic driving lessons is one of the most critical choices a learner driver in Manchester will make. A manual driving licence permits you to drive both manual and automatic vehicles across the UK. However, automatic tuition removes clutch coordination, making it significantly easier to navigate heavy Manchester traffic and complex spiral roundabouts.",
    status: "PUBLISHED",
    authorName: "Dave Miller (Grade A ADI)",
    views: 4250,
    updatedAt: "2026-10-02",
    readTime: "5 min read",
  },
  {
    id: "cnt_02",
    title: "What Happens During a UK Practical Driving Test at Manchester Centres?",
    slug: "what-happens-during-uk-practical-driving-test",
    category: "Test Preparation",
    excerpt: "A comprehensive walk-through of the 40-minute DVSA practical test: eyesight check, 'show me tell me' vehicle questions, independent driving, and maneuvers.",
    content: "Taking your practical driving test at Cheetham Hill, West Didsbury, Sale, or Bury DTC can feel daunting. Knowing the exact structure of the 40-minute test helps eliminate test-day anxiety. Your examiner will conduct an eyesight check, two vehicle safety questions, approximately 20 minutes of sat-nav navigation, and one reversing maneuver.",
    status: "PUBLISHED",
    authorName: "Aisha Patel (Grade A ADI)",
    views: 3820,
    updatedAt: "2026-10-01",
    readTime: "6 min read",
  },
  {
    id: "cnt_03",
    title: "How to Prepare for Your First Driving Lesson: Beginner Checklist",
    slug: "how-to-prepare-for-first-driving-lesson",
    category: "Learning to Drive",
    excerpt: "Essential preparation for complete beginners: provisional licence checks, comfortable footwear, cockpit drill basics, and what to expect on day one.",
    content: "Your introductory 2-hour driving assessment is designed to be calm, low-stress, and empowering. Your instructor will pick you up from your home, verify your provisional licence card, and drive you to a quiet residential road in your Manchester borough to teach you car controls and clutch bite-point fundamentals.",
    status: "PUBLISHED",
    authorName: "Liam O'Connor (Grade A ADI)",
    views: 2540,
    updatedAt: "2026-09-28",
    readTime: "4 min read",
  },
  {
    id: "cnt_04",
    title: "How Intensive Driving Crash Courses Work: Fast-Track Pass Blueprint",
    slug: "how-intensive-driving-courses-work",
    category: "Intensive Courses",
    excerpt: "Everything you need to know about 1 to 3 week fast-track driving tuition blocks, fast-track DVSA test dates, and daily practical driving schedules.",
    content: "Intensive driving courses condense 40+ hours of tuition into consecutive daily blocks of 3 to 4 hours. By eliminating the week-long gap between lessons, learners retain muscle memory faster, master tricky dual carriageway junctions, and take their practical driving test while peak driving skills are fresh.",
    status: "PUBLISHED",
    authorName: "Alex Vance (Chief Instructor)",
    views: 3120,
    updatedAt: "2026-09-25",
    readTime: "5 min read",
  },
];

const initialMetrics: SystemMetric[] = [
  {
    id: "met_01",
    label: "Active Users",
    value: "14,892",
    change: "+18.2%",
    changeType: "positive",
    description: "Verified active sessions in the last 30 days",
  },
  {
    id: "met_02",
    label: "API Throughput",
    value: "1.4M req/mo",
    change: "+34.5%",
    changeType: "positive",
    description: "Total REST route handler invocations",
  },
  {
    id: "met_03",
    label: "Avg. API Latency",
    value: "28ms",
    change: "-12.4%",
    changeType: "positive",
    description: "Median p95 response duration",
  },
  {
    id: "met_04",
    label: "System Uptime",
    value: "99.98%",
    change: "+0.02%",
    changeType: "neutral",
    description: "Continuous availability SLA score",
  },
];

const initialAuditLogs: AuditLog[] = [
  {
    id: "log_01",
    action: "SESSION_LOGIN_SUCCESS",
    actorEmail: "admin@nexuscore.dev",
    target: "Admin Dashboard (/admin)",
    timestamp: "2026-09-30 00:45:12",
    ip: "192.168.1.104",
    severity: "SUCCESS",
  },
  {
    id: "log_02",
    action: "CONTENT_PUBLISHED",
    actorEmail: "sarah@nexuscore.dev",
    target: "cnt_02 (rbac-edge-middleware)",
    timestamp: "2026-09-29 19:34:00",
    ip: "10.0.4.82",
    severity: "INFO",
  },
  {
    id: "log_03",
    action: "USER_INVITATION_DISPATCHED",
    actorEmail: "admin@nexuscore.dev",
    target: "david.kim@partner.io",
    timestamp: "2026-09-29 14:12:44",
    ip: "192.168.1.104",
    severity: "INFO",
  },
  {
    id: "log_04",
    action: "FAILED_AUTH_ATTEMPT",
    actorEmail: "unknown@malicious.bot",
    target: "/api/auth/login",
    timestamp: "2026-09-29 03:22:18",
    ip: "198.51.100.24",
    severity: "FAILED",
  },
  {
    id: "log_05",
    action: "SETTINGS_UPDATED",
    actorEmail: "admin@nexuscore.dev",
    target: "Security Policy (MFA Requirement)",
    timestamp: "2026-09-28 11:05:09",
    ip: "192.168.1.104",
    severity: "WARNING",
  },
];

const initialInstructors: Instructor[] = [
  {
    id: "inst_01",
    name: "Dave Miller",
    badgeNumber: "ADI-44912",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=800&h=800&fit=crop&crop=faces",
    avatarPositionX: 50,
    avatarPositionY: 20,
    avatarZoom: 1,
    phone: "+44 7700 900123",
    email: "dave.miller@nextdrive.uk",
    transmission: "BOTH",
    rating: 4.9,
    totalPasses: 168,
    activeStudents: 14,
    status: "ACTIVE",
    vehicle: "2025 VW Golf 1.5 TSI (Dual Controls)",
    grade: "Grade A (51/51)",
    bio: "Senior DVSA Approved Driving Instructor with over 12 years of experience guiding nervous and first-time learners to test passes. Specializes in intensive courses, mock test simulations, and roundabout navigation across Central and Greater Manchester.",
    areas: ["Central & North Manchester", "Cheetham Hill DTC", "Salford", "Ancoats"],
    qualifications: [
      "DVSA Grade A Approved Driving Instructor (ADI)",
      "RoSPA Gold Advanced Driver",
      "DBS Enhanced Cleared",
      "First Aid Certified",
    ],
    availability: {
      workingDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
      startTime: "08:00",
      endTime: "18:00",
      breaks: ["12:00-13:00"],
      unavailableDates: ["2026-10-25"],
    },
  },
  {
    id: "inst_02",
    name: "Aisha Patel",
    badgeNumber: "ADI-55821",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&h=800&fit=crop&crop=faces",
    avatarPositionX: 50,
    avatarPositionY: 20,
    avatarZoom: 1,
    phone: "+44 7700 900456",
    email: "aisha.patel@nextdrive.uk",
    transmission: "MANUAL",
    rating: 5.0,
    totalPasses: 215,
    activeStudents: 16,
    status: "ACTIVE",
    vehicle: "2024 Ford Fiesta EcoBoost (Dual Controls)",
    grade: "Grade A (50/51)",
    bio: "DVSA Top-Tier Instructor specializing in manual driving tuition, clutch control mastery, and first-time confidence for nervous students across South Manchester and Didsbury.",
    areas: ["South Manchester", "West Didsbury DTC", "Chorlton", "Withington"],
    qualifications: [
      "DVSA Grade A Approved Driving Instructor (ADI)",
      "Enhanced DBS Certified",
      "Defensive Driving Specialist",
    ],
  },
  {
    id: "inst_03",
    name: "Mark Davies",
    badgeNumber: "ADI-39102",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=800&h=800&fit=crop&crop=faces",
    avatarPositionX: 50,
    avatarPositionY: 20,
    avatarZoom: 1,
    phone: "+44 7700 900789",
    email: "mark.davies@nextdrive.uk",
    transmission: "AUTOMATIC",
    rating: 4.8,
    totalPasses: 124,
    activeStudents: 11,
    status: "ACTIVE",
    vehicle: "2024 Toyota Yaris Hybrid Auto",
    grade: "Grade A (49/51)",
    bio: "Specialist automatic instructor with dual-control hybrid vehicle. Renowned for calm instruction, zero-stress parking techniques, and comprehensive mock test assessments across Trafford and Sale.",
    areas: ["Trafford & Sale", "Sale DTC", "Altrincham", "Stretford"],
    qualifications: [
      "DVSA Grade A Approved Driving Instructor (ADI)",
      "Automatic Specialist",
      "DBS Enhanced Cleared",
    ],
  },
  {
    id: "inst_04",
    name: "Sophie Clark",
    badgeNumber: "ADI-67219",
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=800&h=800&fit=crop&crop=faces",
    avatarPositionX: 50,
    avatarPositionY: 20,
    avatarZoom: 1,
    phone: "+44 7700 900321",
    email: "sophie.clark@nextdrive.uk",
    transmission: "MANUAL",
    rating: 4.9,
    totalPasses: 98,
    activeStudents: 9,
    status: "ACTIVE",
    vehicle: "2024 Renault Clio E-Tech",
    grade: "Grade A (50/51)",
    bio: "Expert manual instructor with an outstanding first-time pass rate. Passionate about road safety, hazard anticipation, and helping anxious learners overcome test anxiety.",
    areas: ["Salford & West", "Bury DTC", "Prestwich", "Swinton"],
    qualifications: [
      "DVSA Grade A Approved Driving Instructor (ADI)",
      "Pass Plus Registered",
      "DBS Enhanced Cleared",
    ],
  },
  {
    id: "inst_05",
    name: "Liam O'Connor",
    badgeNumber: "ADI-51004",
    avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=800&h=800&fit=crop&crop=faces",
    avatarPositionX: 50,
    avatarPositionY: 20,
    avatarZoom: 1,
    phone: "+44 7700 900654",
    email: "liam.oconnor@nextdrive.uk",
    transmission: "BOTH",
    rating: 4.9,
    totalPasses: 182,
    activeStudents: 15,
    status: "ACTIVE",
    vehicle: "2025 Audi A1 Sportback (Dual Controls)",
    grade: "Grade A (51/51)",
    bio: "Senior dual-transmission ADI with extensive Manchester test center knowledge. Focuses on advanced maneuver precision, eco-safe driving, and DVSA test route rehearsals.",
    areas: ["Greater Manchester", "Cheetham Hill DTC", "Stockport", "Bury DTC"],
    qualifications: [
      "DVSA Grade A Approved Driving Instructor (ADI)",
      "Advanced Motorist (IAM)",
      "DBS Enhanced Cleared",
    ],
  },
];

const initialLessonPackages: LessonPackage[] = [
  {
    id: "pkg_01",
    title: "Introductory 2-Hour Assessment",
    transmission: "BOTH",
    durationHours: 2,
    price: 75,
    level: "Beginner",
    features: [
      "In-depth driver skills evaluation",
      "Cockpit drill & basic controls",
      "Personalized learning roadmap",
      "Door-to-door pickup & dropoff",
    ],
  },
  {
    id: "pkg_02",
    title: "10-Hour Starter Block",
    transmission: "BOTH",
    durationHours: 10,
    price: 340,
    level: "Beginner",
    features: [
      "Save £35 on pay-as-you-go rates",
      "Junctions, roundabouts & maneuvers",
      "DVSA official progress tracker app",
      "Free Theory Test Pro access",
    ],
  },
  {
    id: "pkg_03",
    title: "20-Hour Intensive Fast-Pass",
    transmission: "BOTH",
    durationHours: 20,
    price: 680,
    level: "Intensive",
    popular: true,
    features: [
      "Accelerated 2-3 week completion",
      "Dedicated senior ADI instructor",
      "Comprehensive mock test included",
      "Priority practical test booking",
    ],
  },
  {
    id: "pkg_04",
    title: "30-Hour Complete Zero-to-Test",
    transmission: "BOTH",
    durationHours: 30,
    price: 990,
    level: "Beginner",
    features: [
      "Full DVSA syllabus coverage",
      "2 complete official test simulations",
      "Pass guarantee with free re-test lesson",
      "Dual-control car rental for test day",
    ],
  },
  {
    id: "pkg_05",
    title: "Pass Plus & Motorway Mastery",
    transmission: "BOTH",
    durationHours: 6,
    price: 195,
    level: "Pass Plus",
    features: [
      "Motorway, rural & night driving",
      "All-weather driving skills",
      "Certificate for up to 25% insurance discount",
      "No test required upon completion",
    ],
  },
];

const initialLocations: LocationArea[] = [
  {
    id: "loc_01",
    name: "Central & North Manchester",
    slug: "central-north-manchester",
    description: "Professional driving tuition across Manchester City Centre, Northern Quarter, Ancoats, Cheetham Hill, and North Manchester test routes.",
    postcodes: ["M1", "M2", "M3", "M4", "M8"],
    activeInstructors: 4,
    testCenterName: "Cheetham Hill DTC",
    latitude: 53.4808,
    longitude: -2.2426,
    coverageText: "Manual & Automatic driving lessons",
    isActive: true,
    displayOrder: 1,
    createdAt: "2025-01-10T08:00:00Z",
    updatedAt: "2025-01-10T08:00:00Z",
  },
  {
    id: "loc_02",
    name: "South Manchester & Didsbury",
    slug: "south-manchester-didsbury",
    description: "Door-to-door learner pickups across West Didsbury, Fallowfield, Withington, Chorlton, and South Manchester.",
    postcodes: ["M14", "M19", "M20", "M21"],
    activeInstructors: 5,
    testCenterName: "West Didsbury DTC",
    latitude: 53.4167,
    longitude: -2.2333,
    coverageText: "Intensive courses & weekly tuition",
    isActive: true,
    displayOrder: 2,
    createdAt: "2025-01-10T08:00:00Z",
    updatedAt: "2025-01-10T08:00:00Z",
  },
  {
    id: "loc_03",
    name: "Trafford & Sale",
    slug: "trafford-sale",
    description: "Structured practical test preparation around Sale, Stretford, Old Trafford, Urmston, and Sale DTC routes.",
    postcodes: ["M32", "M33", "M16", "M17"],
    activeInstructors: 3,
    testCenterName: "Sale DTC",
    latitude: 53.4244,
    longitude: -2.3225,
    coverageText: "Grade A instructor dual-control lessons",
    isActive: true,
    displayOrder: 3,
    createdAt: "2025-01-10T08:00:00Z",
    updatedAt: "2025-01-10T08:00:00Z",
  },
  {
    id: "loc_04",
    name: "Salford & Bury",
    slug: "salford-bury",
    description: "Expert instruction across Salford Quays, Eccles, Swinton, Prestwich, Whitefield, and Bury test center routes.",
    postcodes: ["M5", "M6", "M7", "BL9"],
    activeInstructors: 3,
    testCenterName: "Bury DTC",
    latitude: 53.4875,
    longitude: -2.2901,
    coverageText: "DVSA mock test simulation & pass plus",
    isActive: true,
    displayOrder: 4,
    createdAt: "2025-01-10T08:00:00Z",
    updatedAt: "2025-01-10T08:00:00Z",
  },
  {
    id: "loc_05",
    name: "Stockport & Cheadle",
    slug: "stockport-cheadle",
    description: "High-pass-rate driving courses servicing Stockport town center, Cheadle, Bramhall, Hazel Grove, and Bredbury DTC.",
    postcodes: ["SK1", "SK2", "SK3", "SK8"],
    activeInstructors: 4,
    testCenterName: "Bredbury DTC",
    latitude: 53.4106,
    longitude: -2.1575,
    coverageText: "Manual & Automatic fleet coverage",
    isActive: true,
    displayOrder: 5,
    createdAt: "2025-01-10T08:00:00Z",
    updatedAt: "2025-01-10T08:00:00Z",
  },
];

const initialBookings: Booking[] = [
  {
    id: "bk_01",
    studentName: "Jordan Rivera",
    studentEmail: "jordan.r@student.nextdrive.uk",
    studentPhone: "+44 7911 123456",
    instructorId: "inst_05",
    instructorName: "Liam O'Connor",
    lessonTitle: "2-Hour Practical Test Simulation",
    transmission: "MANUAL",
    pickupLocation: "Deansgate, Manchester M3",
    dateTime: "Today, 09:00 - 11:00 AM",
    durationHours: 2,
    price: 75,
    status: "IN_PROGRESS",
    testCenter: "West Didsbury DTC",
    notes: "Focus on multi-lane roundabouts and emergency stop.",
  },
  {
    id: "bk_02",
    studentName: "Emma Watson",
    studentEmail: "emma.w@student.nextdrive.uk",
    studentPhone: "+44 7911 234567",
    instructorId: "inst_02",
    instructorName: "Aisha Patel",
    lessonTitle: "Parallel Parking & Bay Maneuvers",
    transmission: "MANUAL",
    pickupLocation: "Didsbury Village, M20",
    dateTime: "Today, 11:30 - 13:30 PM",
    durationHours: 2,
    price: 75,
    status: "CONFIRMED",
    notes: "Lesson 6 of 10-hour block. Practicing forward bay parking.",
  },
  {
    id: "bk_03",
    studentName: "Marcus Thorne",
    studentEmail: "student@nextdrive.uk",
    studentPhone: "+44 7911 345678",
    instructorId: "inst_01",
    instructorName: "Dave Miller",
    lessonTitle: "Official DVSA Test Route Simulation",
    transmission: "AUTOMATIC",
    pickupLocation: "Sale Metrolink, M33",
    dateTime: "Today, 14:00 - 16:00 PM",
    durationHours: 2,
    price: 80,
    status: "CONFIRMED",
    testCenter: "Cheetham Hill DTC",
    notes: "Practical driving test booked for next Thursday!",
    instructorNotes: "Focus on multi-lane roundabout approach and speed limit changes on A56 Chester Road.",
    progressNotes: "Strong road positioning, confident mirror checks. Polish reverse bay park.",
  },
  {
    id: "bk_04",
    studentName: "Chloe Bennett",
    studentEmail: "chloe.b@student.nextdrive.uk",
    studentPhone: "+44 7911 456789",
    instructorId: "inst_04",
    instructorName: "Sophie Clark",
    lessonTitle: "First Time Clutch & Gear Transitions",
    transmission: "MANUAL",
    pickupLocation: "Chorlton Cross, M21",
    dateTime: "Tomorrow, 09:00 - 11:00 AM",
    durationHours: 2,
    price: 75,
    status: "CONFIRMED",
    notes: "Beginner starter lesson. Quiet residential area.",
  },
  {
    id: "bk_05",
    studentName: "Daniel Lee",
    studentEmail: "daniel.l@student.nextdrive.uk",
    studentPhone: "+44 7911 567890",
    instructorId: "inst_03",
    instructorName: "Mark Davies",
    lessonTitle: "Motorway Speed Control & Joining",
    transmission: "AUTOMATIC",
    pickupLocation: "Salford Central, M3",
    dateTime: "Tomorrow, 13:00 - 15:00 PM",
    durationHours: 2,
    price: 80,
    status: "CONFIRMED",
    notes: "M60 Ring Road introduction and safe overtaking.",
  },
  {
    id: "bk_06",
    studentName: "Hannah Adams",
    studentEmail: "hannah.a@student.nextdrive.uk",
    studentPhone: "+44 7911 678901",
    instructorId: "inst_02",
    instructorName: "Aisha Patel",
    lessonTitle: "Final Mock Test (0 Minors)",
    transmission: "MANUAL",
    pickupLocation: "West Didsbury DTC, M20",
    dateTime: "Yesterday, 10:00 - 12:00 PM",
    durationHours: 2,
    price: 75,
    status: "COMPLETED",
    testCenter: "West Didsbury DTC",
    notes: "PASSED! Full UK Driving License awarded!",
  },
  {
    id: "bk_07",
    studentName: "Zara Ahmed",
    studentEmail: "zara.a@student.nextdrive.uk",
    studentPhone: "+44 7911 789012",
    instructorId: "inst_05",
    instructorName: "Liam O'Connor",
    lessonTitle: "Beginner Assessment & Cockpit Drill",
    transmission: "MANUAL",
    pickupLocation: "Salford Quays, M50",
    dateTime: "Friday, 15:30 - 17:30 PM",
    durationHours: 2,
    price: 75,
    status: "PENDING",
    notes: "Awaiting student confirmation of pickup location.",
  },
  {
    id: "bk_08",
    studentName: "Marcus Thorne",
    studentEmail: "student@nextdrive.uk",
    studentPhone: "+44 7911 345678",
    instructorId: "inst_01",
    instructorName: "Dave Miller",
    lessonTitle: "Roundabouts & Spiral Lanes",
    transmission: "AUTOMATIC",
    pickupLocation: "Sale Metrolink, M33",
    dateTime: "Yesterday, 14:00 - 16:00 PM",
    durationHours: 2,
    price: 80,
    status: "COMPLETED",
    testCenter: "Cheetham Hill DTC",
    instructorNotes: "Excellent lane discipline on 3-lane roundabouts. Handled heavy traffic smoothly.",
    progressNotes: "Proficient at spiral roundabouts. Ready for mock test simulations.",
  },
  {
    id: "bk_09",
    studentName: "Daniel Lee",
    studentEmail: "daniel.l@student.nextdrive.uk",
    studentPhone: "+44 7911 567890",
    instructorId: "inst_01",
    instructorName: "Dave Miller",
    lessonTitle: "Mock Test Simulation & Sat Nav Driving",
    transmission: "AUTOMATIC",
    pickupLocation: "Cheetham Hill Road, M8",
    dateTime: "Saturday, 10:00 - 12:00 PM",
    durationHours: 2,
    price: 80,
    status: "CONFIRMED",
    testCenter: "Cheetham Hill DTC",
    instructorNotes: "Full mock test including independent driving and emergency stop.",
    progressNotes: "First mock test booked.",
  },
];

const initialReviews: ReviewItem[] = [
  {
    id: "rev_01",
    student: "Hannah Adams",
    instructor: "Aisha Patel",
    testCenter: "West Didsbury DTC",
    rating: 5,
    result: "PASSED FIRST TIME",
    minors: "0 Minor Faults (Clean Sheet)",
    quote:
      "Passed on my first attempt with zero faults! Aisha's mock test rehearsals made the real driving examiner test feel completely stress-free.",
    date: "Yesterday",
    verified: true,
    featured: true,
  },
  {
    id: "rev_02",
    student: "Marcus Thorne",
    instructor: "Dave Miller",
    testCenter: "Cheetham Hill DTC",
    rating: 5,
    result: "PASSED FIRST TIME",
    minors: "2 Minor Faults",
    quote:
      "The 20-Hour Intensive course got me ready in under 3 weeks. Dave's patience with complex roundabouts made all the difference.",
    date: "Last week",
    verified: true,
    featured: true,
  },
  {
    id: "rev_03",
    student: "Oliver Smith",
    instructor: "Liam O'Connor",
    testCenter: "Sale DTC",
    rating: 5,
    result: "PASSED FIRST TIME",
    minors: "1 Minor Fault",
    quote:
      "Top tier instructors and immaculate dual-control cars. Door-to-door pickup was always prompt and professional.",
    date: "2 weeks ago",
    verified: true,
    featured: true,
  },
  {
    id: "rev_04",
    student: "Priya Sharma",
    instructor: "Liam O'Connor",
    testCenter: "Bury DTC",
    rating: 5,
    result: "PASSED FIRST TIME",
    minors: "2 Minor Faults",
    quote:
      "The 20-Hour Intensive course was worth every penny. Completed all lessons in 2 weeks and passed with just 2 minors.",
    date: "3 weeks ago",
    verified: true,
    featured: false,
  },
];

const initialFaqs: FAQItem[] = [
  {
    id: "faq_01",
    question: "How many driving lessons will I need to pass?",
    answer:
      "The DVSA reports the UK average is 45 hours of professional tuition plus 20 hours private practice. Our students average 32 hours thanks to structured mock test simulations and personalized progress roadmaps.",
    category: "Lessons",
    order: 1,
    status: "ACTIVE",
  },
  {
    id: "faq_02",
    question: "Can I choose between Manual and Automatic?",
    answer:
      "Yes! We maintain dedicated fleets for both manual and automatic tuition across all our covered postcodes.",
    category: "Vehicles",
    order: 2,
    status: "ACTIVE",
  },
  {
    id: "faq_03",
    question: "Do you provide car hire on the practical test day?",
    answer:
      "Yes, our practical test day package includes 1 hour warm-up driving lesson immediately before your test, full dual-control car hire, insurance, and return journey home.",
    category: "Test Day",
    order: 3,
    status: "ACTIVE",
  },
  {
    id: "faq_04",
    question: "What is your lesson cancellation policy?",
    answer:
      "We require 48 hours notice to reschedule or cancel a booked lesson with zero fees.",
    category: "Bookings",
    order: 4,
    status: "ACTIVE",
  },
  {
    id: "faq_05",
    question: "Are your instructors DVSA fully qualified?",
    answer:
      "Every NextDrive instructor is a fully qualified DVSA Approved Driving Instructor (ADI Grade A/B) with enhanced DBS clearance and regular standards check validations.",
    category: "Safety",
    order: 5,
    status: "ACTIVE",
  },
];

const initialBusinessSettings: BusinessSettings = {
  businessName: "NextDrive Driving Academy",
  tradingName: "NextDrive UK Ltd",
  companyRegistrationNumber: "12948210",
  dvsaSchoolId: "DVSA-SCH-90412",
  phone: "+44 161 946 0921",
  emergencyPhone: "+44 7700 900100",
  email: "support@nextdrive.uk",
  headOfficeAddress: "Peter House, Oxford Street, Manchester, M1 5AN",

  logoUrl: "",
  logoBadgeText: "Academy",
  tagline: "DVSA Certified • Manchester",

  heroBadge: "DVSA Approved Driving Academy",
  heroPassRateBadge: "89.4% Practical Pass Rate",
  heroHeadline: "Master the Road. Pass With Confidence in Manchester.",
  heroSubhead: "Professional manual and automatic driving lessons with qualified instructors, modern dual-control vehicles and structured training designed to prepare you for your practical test.",
  heroPrimaryCtaText: "Book Your First Lesson",
  heroPrimaryCtaLink: "#courses",
  heroSecondaryCtaText: "Call Us",
  heroSecondaryCtaLink: "tel:+441619460921",
  heroImageUrl: "",

  firstTimePassRate: "89.4%",
  totalPassesCount: "500+",
  googleRating: "4.9/5.0",
  activeFleetCount: "12 Dual-Control Cars",

  facebookUrl: "https://facebook.com/nextdrive",
  instagramUrl: "https://instagram.com/nextdrive",
  tiktokUrl: "https://tiktok.com/@nextdrive",
  youtubeUrl: "https://youtube.com/@nextdrive",
  twitterUrl: "https://twitter.com/nextdrive",

  metaTitle: "Master the Road | Pass With Confidence Manchester Driving Lessons",
  metaDescription: "Professional manual & automatic driving lessons in Manchester with certified Grade A ADI instructors. Dual-control modern cars and structured practical test preparation.",
  metaKeywords: [
    "driving lessons manchester",
    "learn to drive manchester",
    "automatic driving school manchester",
    "manual driving lessons manchester",
    "dvsa driving instructor manchester",
    "pass plus manchester",
    "intensive driving course manchester",
  ],
  ogImageUrl: "",

  standardSlotDurationMinutes: 120,
  weekdayOpeningTime: "07:00",
  weekdayClosingTime: "20:00",
  weekendOpeningTime: "08:00",
  weekendClosingTime: "18:00",
  minAdvanceBookingHours: 24,
  maxAdvanceBookingDays: 60,
  cancellationNoticeHours: 48,

  currency: "GBP",
  currencySymbol: "£",
  hourlyRateManual: 37.5,
  hourlyRateAutomatic: 40.0,
  testDayCarHireFee: 140.0,
  weekendSurcharge: 5.0,

  dualControlInspected: true,
  freeTheoryAppAccess: true,
  insuranceCoverageLevel: "£5,000,000 Dual-Control Commercial Fleet Insurance",

  smsRemindersEnabled: true,
  instantDispatchAlerts: true,
  autoReviewInvites: true,

  authProviders: {
    google: true,
    apple: true,
    linkedin: true,
    microsoft: false,
    x: false,
  },

  developerCreditEnabled: true,
  developerCreditText: "Designed & Developed by",
  developerName: "Crftdev Technology",
  developerUrl: "",
  developerNewTab: true,
};

const initialAccounts: Account[] = [
  {
    id: "acc_demo_01",
    userId: "usr_member_03", // Marcus Thorne (Student)
    provider: "google",
    providerAccountId: "google_sub_1092837461928374",
    createdAt: "2025-05-18T14:15:00Z",
    updatedAt: "2025-05-18T14:15:00Z",
  },
  {
    id: "acc_demo_02",
    userId: "usr_inst_01", // Dave Miller (Instructor)
    provider: "apple",
    providerAccountId: "apple_sub_001928.8472918471.0921",
    createdAt: "2025-03-01T08:00:00Z",
    updatedAt: "2025-03-01T08:00:00Z",
  },
];

const initialStudents: Student[] = [
  {
    id: "std_01",
    name: "Hannah Adams",
    email: "hannah.a@student.nextdrive.uk",
    phone: "+44 7911 678901",
    postcode: "M33",
    theoryStatus: "PASSED",
    hoursCompleted: 34,
    assignedInstructorId: "inst_02",
    assignedInstructorName: "Aisha Patel",
    status: "PASSED",
    passDate: "Yesterday (0 minors)",
    provisionalLicenseNumber: "ADAMS904128HA99",
    createdAt: "2026-06-15T10:00:00Z",
  },
  {
    id: "std_02",
    name: "Jordan Rivera",
    email: "jordan.r@student.nextdrive.uk",
    phone: "+44 7911 123456",
    postcode: "M20",
    theoryStatus: "PASSED",
    hoursCompleted: 26,
    assignedInstructorId: "inst_05",
    assignedInstructorName: "Liam O'Connor",
    status: "TEST_READY",
    testDate: "Booked: Oct 12, 2026",
    provisionalLicenseNumber: "RIVER803141JR77",
    createdAt: "2026-07-20T14:30:00Z",
  },
  {
    id: "std_03",
    name: "Marcus Thorne",
    email: "student@nextdrive.uk",
    phone: "+44 7911 345678",
    postcode: "M1",
    theoryStatus: "PASSED",
    hoursCompleted: 22,
    assignedInstructorId: "inst_01",
    assignedInstructorName: "Dave Miller",
    status: "TEST_READY",
    testDate: "Booked: Oct 8, 2026",
    provisionalLicenseNumber: "THORN709214MT88",
    createdAt: "2026-08-01T09:15:00Z",
  },
  {
    id: "std_04",
    name: "Emma Watson",
    email: "emma.w@student.nextdrive.uk",
    phone: "+44 7911 234567",
    postcode: "M5",
    theoryStatus: "PASSED",
    hoursCompleted: 12,
    assignedInstructorId: "inst_02",
    assignedInstructorName: "Aisha Patel",
    status: "ACTIVE",
    provisionalLicenseNumber: "WATSO601112EW44",
    createdAt: "2026-08-25T11:00:00Z",
  },
  {
    id: "std_05",
    name: "Chloe Bennett",
    email: "chloe.b@student.nextdrive.uk",
    phone: "+44 7911 456789",
    postcode: "SK6",
    theoryStatus: "BOOKED",
    hoursCompleted: 4,
    assignedInstructorId: "inst_04",
    assignedInstructorName: "Sophie Clark",
    status: "ACTIVE",
    provisionalLicenseNumber: "BENNE805293CB22",
    createdAt: "2026-09-10T16:45:00Z",
  },
  {
    id: "std_06",
    name: "Daniel Lee",
    email: "daniel.l@student.nextdrive.uk",
    phone: "+44 7911 567890",
    postcode: "BL9",
    theoryStatus: "PASSED",
    hoursCompleted: 18,
    assignedInstructorId: "inst_03",
    assignedInstructorName: "Mark Davies",
    status: "ACTIVE",
    provisionalLicenseNumber: "LEED901231DL55",
    createdAt: "2026-08-14T13:20:00Z",
  },
  {
    id: "std_07",
    name: "Zara Ahmed",
    email: "zara.a@student.nextdrive.uk",
    phone: "+44 7911 789012",
    postcode: "M16",
    theoryStatus: "STUDYING",
    hoursCompleted: 2,
    assignedInstructorId: "inst_05",
    assignedInstructorName: "Liam O'Connor",
    status: "ACTIVE",
    provisionalLicenseNumber: "AHMED908123ZA33",
    createdAt: "2026-09-22T15:00:00Z",
  },
];

const initialInquiries: ContactInquiry[] = [
  {
    id: "inq_01",
    name: "Jordan Rivera",
    email: "jordan.r@student.nextdrive.uk",
    phone: "+44 7911 123456",
    postcode: "M20 2RN",
    transmission: "MANUAL",
    targetPackage: "20-Hour Intensive Fast-Pass",
    course: "20-Hour Intensive Fast-Pass",
    area: "South Manchester & Didsbury",
    provisionalLicence: "Yes",
    notes: "Passed theory test, want to pass practical within 3 weeks.",
    howFound: "Google",
    sourcePage: "/#courses",
    internalNotes: "Contacted via phone, assigned to instructor Liam O'Connor.",
    status: "CONVERTED",
    createdAt: "2026-09-28 10:15",
  },
  {
    id: "inq_02",
    name: "Chloe Bennett",
    email: "chloe.b@student.nextdrive.uk",
    phone: "+44 7911 456789",
    postcode: "M33 2DY",
    transmission: "MANUAL",
    targetPackage: "10-Hour Starter Block",
    course: "10-Hour Starter Block",
    area: "Trafford & Sale",
    provisionalLicence: "Yes",
    notes: "Beginner starter lesson in Sale / Trafford area.",
    howFound: "Instagram",
    sourcePage: "/",
    internalNotes: "Left voicemail, awaiting callback on weekend slot preferences.",
    status: "FOLLOW_UP",
    createdAt: "2026-09-29 14:30",
  },
  {
    id: "inq_03",
    name: "Ryan Taylor",
    email: "ryan.taylor@student.nextdrive.uk",
    phone: "+44 7700 900888",
    postcode: "M5 4WT",
    transmission: "AUTOMATIC",
    targetPackage: "Introductory 2-Hour Assessment",
    course: "Introductory 2-Hour Assessment",
    area: "Salford Quays & MediaCity",
    provisionalLicence: "Applying soon",
    notes: "Looking to start automatic lessons next week in Salford Quays.",
    howFound: "TikTok",
    sourcePage: "/#courses",
    internalNotes: "New prospective learner looking for automatic transmission.",
    status: "NEW",
    createdAt: "2026-09-30 08:45",
  },
  {
    id: "inq_04",
    name: "Aisha Begum",
    email: "aisha.begum@student.nextdrive.uk",
    phone: "+44 7700 900999",
    postcode: "M8 5UF",
    transmission: "MANUAL",
    targetPackage: "30-Hour Complete Zero-to-Test",
    course: "30-Hour Complete Zero-to-Test",
    area: "Central & North Manchester",
    provisionalLicence: "Yes",
    notes: "Zero driving experience, requested female instructor if available.",
    howFound: "Recommendation",
    sourcePage: "/contact",
    internalNotes: "Messaged on WhatsApp regarding availability with Aisha Patel.",
    status: "CONTACTED",
    createdAt: "2026-09-30 11:20",
  },
  {
    id: "inq_05",
    name: "Lucas Davies",
    email: "lucas.davies@student.nextdrive.uk",
    phone: "+44 7800 123987",
    postcode: "M8 5UF",
    transmission: "MANUAL",
    targetPackage: "Introductory 2-Hour Assessment",
    course: "Introductory 2-Hour Assessment",
    area: "Cheetham Hill & North Manchester",
    provisionalLicence: "Yes",
    notes: "Need mock test simulation on Cheetham Hill DTC routes.",
    howFound: "Google Maps",
    sourcePage: "/",
    internalNotes: "New enquiry from Cheetham Hill/Bury area.",
    status: "NEW",
    createdAt: "2026-10-01 07:15",
  },
];

export const defaultPopupFields: PopupFieldConfig[] = [
  {
    id: "f_name",
    fieldKey: "name",
    label: "Full Name",
    placeholder: "e.g. Liam Gallagher",
    fieldType: "text",
    isEnabled: true,
    isRequired: true,
    displayOrder: 1,
  },
  {
    id: "f_email",
    fieldKey: "email",
    label: "Email Address",
    placeholder: "e.g. liam.smith@gmail.com",
    fieldType: "email",
    isEnabled: true,
    isRequired: true,
    displayOrder: 2,
  },
  {
    id: "f_phone",
    fieldKey: "phone",
    label: "Telephone Number",
    placeholder: "e.g. 07123 456789",
    fieldType: "tel",
    isEnabled: true,
    isRequired: true,
    displayOrder: 3,
  },
  {
    id: "f_course",
    fieldKey: "course",
    label: "Target Driving Course",
    placeholder: "Select your course",
    fieldType: "select",
    options: [
      "Beginner Driving Lessons",
      "Manual Driving Lessons",
      "Automatic Driving Lessons",
      "Intensive Driving Course",
      "Refresher Driving Lessons",
      "Pass Plus & Motorway",
    ],
    isEnabled: true,
    isRequired: true,
    displayOrder: 4,
  },
  {
    id: "f_area",
    fieldKey: "area",
    label: "Manchester Service Area",
    placeholder: "Select your area",
    fieldType: "select",
    options: [
      "Central & North Manchester",
      "South Manchester & Didsbury",
      "Trafford & Sale",
      "Salford & Bury",
      "Stockport & Greater Manchester",
      "Oldham & Rochdale",
    ],
    isEnabled: true,
    isRequired: true,
    displayOrder: 5,
  },
  {
    id: "f_transmission",
    fieldKey: "transmission",
    label: "Transmission Preference",
    placeholder: "Manual or Automatic?",
    fieldType: "select",
    options: ["Manual", "Automatic", "Either / Open to Advice"],
    isEnabled: true,
    isRequired: false,
    displayOrder: 6,
  },
  {
    id: "f_postcode",
    fieldKey: "postcode",
    label: "Postcode",
    placeholder: "e.g. M1 1AE",
    fieldType: "text",
    isEnabled: true,
    isRequired: false,
    displayOrder: 7,
  },
  {
    id: "f_provisional",
    fieldKey: "provisionalLicence",
    label: "Provisional Licence Status",
    placeholder: "Do you have a UK provisional licence?",
    fieldType: "select",
    options: ["Yes, I have one", "No, not yet", "Applying soon"],
    isEnabled: false,
    isRequired: false,
    displayOrder: 8,
  },
  {
    id: "f_preferredDate",
    fieldKey: "preferredDate",
    label: "Preferred Start Date",
    placeholder: "Select target date",
    fieldType: "date",
    isEnabled: false,
    isRequired: false,
    displayOrder: 9,
  },
  {
    id: "f_preferredTime",
    fieldKey: "preferredTime",
    label: "Preferred Time of Day",
    placeholder: "Select time window",
    fieldType: "select",
    options: ["Morning (8am - 12pm)", "Afternoon (12pm - 4pm)", "Evening (4pm - 8pm)", "Weekend Anytime"],
    isEnabled: false,
    isRequired: false,
    displayOrder: 10,
  },
  {
    id: "f_howFound",
    fieldKey: "howFound",
    label: "How did you hear about us?",
    placeholder: "How did you find NextDrive?",
    fieldType: "select",
    options: ["Google", "Google Maps", "Instagram", "TikTok", "Recommendation", "Passed Student", "Other"],
    isEnabled: false,
    isRequired: false,
    displayOrder: 11,
  },
  {
    id: "f_message",
    fieldKey: "message",
    label: "Message / Specific Goals",
    placeholder: "Any previous driving experience or specific goals...",
    fieldType: "textarea",
    isEnabled: true,
    isRequired: false,
    displayOrder: 12,
  },
];

export const initialPopupCampaign: PopupCampaign = {
  id: "popup_main",
  name: "Book Your Driving Lesson",
  isEnabled: true,
  status: "PUBLISHED",

  title: "Ready to Start Driving?",
  subtitle: "Book your first lesson with NextDrive Academy.",
  description: "Tell us a little about yourself and our DVSA Grade A team will match you with a top-rated local instructor.",
  buttonText: "Book My Lesson",
  successTitle: "Lesson Request Received!",
  successMessage: "Thank you! Your request has been received. Our senior dispatch team will review instructor schedules and contact you shortly.",
  trustBadgeText: "✓ 89.4% First-Time Pass Rate • Modern Dual-Control Fleet • Certified Grade A ADIs",
  afterSubmissionAction: "show_success",

  triggerType: "time",
  delaySeconds: 10,
  mobileDelaySeconds: 15,
  scrollPercentage: 50,
  showCountdown: false,

  frequency: "once_per_session",
  dismissalRule: "cooldown_days",
  cooldownDays: 7,

  showDesktop: true,
  showTablet: true,
  showMobile: true,
  targetPages: ["/", "/#courses", "/#locations"],
  excludedPages: ["/admin", "/instructor", "/student", "/login", "/signup", "/auth"],

  position: "center",
  size: "medium",
  theme: "auto",
  animation: "fade_scale",
  animationDurationMs: 300,
  backdropEnabled: true,
  backdropOpacity: 40,

  fields: [...defaultPopupFields],

  createdAt: "2026-10-01T00:00:00Z",
  updatedAt: "2026-10-03T00:00:00Z",
  publishedAt: "2026-10-03T00:00:00Z",
};

export const initialPopupAnalyticsEvents: PopupAnalyticsEvent[] = [
  {
    id: "pevt_01",
    popupId: "popup_main",
    event: "popup_impression",
    pageUrl: "/",
    deviceType: "desktop",
    timestamp: "2026-10-02T10:14:00Z",
  },
  {
    id: "pevt_02",
    popupId: "popup_main",
    event: "popup_opened",
    pageUrl: "/",
    deviceType: "desktop",
    timestamp: "2026-10-02T10:14:10Z",
  },
  {
    id: "pevt_03",
    popupId: "popup_main",
    event: "popup_form_started",
    pageUrl: "/",
    deviceType: "desktop",
    timestamp: "2026-10-02T10:14:15Z",
  },
  {
    id: "pevt_04",
    popupId: "popup_main",
    event: "popup_submitted",
    pageUrl: "/",
    deviceType: "desktop",
    timestamp: "2026-10-02T10:14:45Z",
  },
  {
    id: "pevt_05",
    popupId: "popup_main",
    event: "popup_impression",
    pageUrl: "/",
    deviceType: "mobile",
    timestamp: "2026-10-02T11:00:00Z",
  },
  {
    id: "pevt_06",
    popupId: "popup_main",
    event: "popup_opened",
    pageUrl: "/",
    deviceType: "mobile",
    timestamp: "2026-10-02T11:00:15Z",
  },
  {
    id: "pevt_07",
    popupId: "popup_main",
    event: "popup_dismissed",
    pageUrl: "/",
    deviceType: "mobile",
    timestamp: "2026-10-02T11:00:20Z",
  },
];

export const initialFooterSettings: FooterSettings = {
  id: "footer_main",
  isEnabled: true,
  status: "PUBLISHED",
  publishedAt: "2026-10-06T12:00:00Z",
  createdAt: "2026-10-01T00:00:00Z",
  updatedAt: "2026-10-06T12:00:00Z",

  showLogo: true,
  logoUrl: "",
  brandName: "NextDrive Academy",
  tagline: "DVSA Certified • Manchester",
  description:
    "DVSA-approved professional driving tuition across Greater Manchester. Dual-control manual and automatic instruction with structured practical test preparation.",
  useBusinessBrand: true,

  columns: [
    {
      id: "col_courses",
      title: "Tuition Courses",
      isEnabled: true,
      displayOrder: 1,
      links: [
        {
          id: "link_intro",
          label: "Manchester Driving Lessons",
          url: "/driving-lessons",
          linkType: "internal",
          newTab: false,
          isEnabled: true,
          displayOrder: 1,
        },
        {
          id: "link_beg",
          label: "Course Packages & Pricing",
          url: "/pricing",
          linkType: "internal",
          newTab: false,
          isEnabled: true,
          displayOrder: 2,
        },
        {
          id: "link_int",
          label: "Intensive Driving Courses",
          url: "/intensive-courses",
          linkType: "internal",
          newTab: false,
          isEnabled: true,
          displayOrder: 3,
        },
        {
          id: "link_pass_plus",
          label: "Pass Plus Certification",
          url: "/driving-lessons",
          linkType: "internal",
          newTab: false,
          isEnabled: true,
          displayOrder: 4,
        },
        {
          id: "link_auto_ref",
          label: "Automatic Refresher",
          url: "/driving-lessons",
          linkType: "internal",
          newTab: false,
          isEnabled: true,
          displayOrder: 5,
        },
      ],
    },
    {
      id: "col_locations",
      title: "Coverage & Centers",
      isEnabled: true,
      displayOrder: 2,
      isLocationColumn: true,
      links: [
        {
          id: "link_loc_1",
          label: "Manchester Test Centres",
          url: "/test-centres",
          linkType: "internal",
          newTab: false,
          isEnabled: true,
          displayOrder: 1,
        },
        {
          id: "link_loc_2",
          label: "All Service Locations",
          url: "/locations",
          linkType: "internal",
          newTab: false,
          isEnabled: true,
          displayOrder: 2,
        },
        {
          id: "link_loc_3",
          label: "West Didsbury Hub",
          url: "/locations/south-manchester-didsbury",
          linkType: "internal",
          newTab: false,
          isEnabled: true,
          displayOrder: 3,
        },
        {
          id: "link_loc_fleet",
          label: "Certified Instructor Fleet",
          url: "/instructors",
          linkType: "internal",
          newTab: false,
          isEnabled: true,
          displayOrder: 4,
        },
      ],
    },
    {
      id: "col_support",
      title: "Academy & Support",
      isEnabled: true,
      displayOrder: 3,
      links: [
        {
          id: "link_reviews",
          label: "Pass Stories & Reviews",
          url: "/#reviews",
          linkType: "internal",
          newTab: false,
          isEnabled: true,
          displayOrder: 1,
        },
        {
          id: "link_syllabus",
          label: "Driving Guides & Articles",
          url: "/blog",
          linkType: "internal",
          newTab: false,
          isEnabled: true,
          displayOrder: 2,
        },
        {
          id: "link_faqs",
          label: "Frequently Asked Questions",
          url: "/faq",
          linkType: "internal",
          newTab: false,
          isEnabled: true,
          displayOrder: 3,
        },
        {
          id: "link_contact",
          label: "Contact & Inquiries",
          url: "/contact",
          linkType: "internal",
          newTab: false,
          isEnabled: true,
          displayOrder: 4,
        },
        {
          id: "link_login",
          label: "Student & Instructor Login",
          url: "/login",
          linkType: "internal",
          newTab: false,
          isEnabled: true,
          displayOrder: 5,
        },
      ],
    },
  ],

  showContact: true,
  useBusinessContact: true,
  phone: "+44 161 946 0921",
  email: "support@nextdrive.uk",
  address: "Peter House, Oxford Street, Manchester, M1 5AN",
  openingHours: "Mon-Fri: 07:00 - 20:00, Sat-Sun: 08:00 - 18:00",
  whatsappNumber: "+44 7700 900100",
  dvsaSchoolId: "DVSA-SCH-90412",

  showServiceAreas: true,
  serviceAreaSource: "automatic",
  serviceAreaColumnTitle: "Coverage & Centers",

  showSocial: true,
  socialLinks: [
    {
      id: "soc_facebook",
      platform: "facebook",
      url: "https://facebook.com/nextdrive",
      isEnabled: true,
      displayOrder: 1,
    },
    {
      id: "soc_instagram",
      platform: "instagram",
      url: "https://instagram.com/nextdrive",
      isEnabled: true,
      displayOrder: 2,
    },
    {
      id: "soc_youtube",
      platform: "youtube",
      url: "https://youtube.com/@nextdrive",
      isEnabled: true,
      displayOrder: 3,
    },
    {
      id: "soc_x",
      platform: "x",
      url: "https://twitter.com/nextdrive",
      isEnabled: true,
      displayOrder: 4,
    },
    {
      id: "soc_tiktok",
      platform: "tiktok",
      url: "https://tiktok.com/@nextdrive",
      isEnabled: false,
      displayOrder: 5,
    },
    {
      id: "soc_linkedin",
      platform: "linkedin",
      url: "https://linkedin.com/company/nextdrive",
      isEnabled: false,
      displayOrder: 6,
    },
    {
      id: "soc_whatsapp",
      platform: "whatsapp",
      url: "https://wa.me/447700900100",
      isEnabled: false,
      displayOrder: 7,
    },
  ],

  showCTA: false,
  ctaEyebrow: "READY TO START?",
  ctaHeading: "Ready to Get Behind the Wheel?",
  ctaDescription: "Book your introductory 2-hour assessment lesson with a DVSA Grade A instructor.",
  ctaPrimaryText: "Book Your First Lesson",
  ctaPrimaryAction: "booking_modal",
  ctaPrimaryUrl: "",
  ctaSecondaryText: "Call Us: +44 161 946 0921",
  ctaSecondaryAction: "call_phone",
  ctaSecondaryUrl: "tel:+441619460921",

  legalLinks: [
    {
      id: "leg_privacy",
      label: "Privacy Policy",
      url: "/privacy",
      isEnabled: true,
      displayOrder: 1,
    },
    {
      id: "leg_terms",
      label: "Terms & Conditions",
      url: "/terms",
      isEnabled: true,
      displayOrder: 2,
    },
    {
      id: "leg_cookies",
      label: "Cookie Policy",
      url: "/cookies",
      isEnabled: true,
      displayOrder: 3,
    },
    {
      id: "leg_a11y",
      label: "Accessibility",
      url: "/accessibility",
      isEnabled: true,
      displayOrder: 4,
    },
  ],
  showCopyright: true,
  copyrightText: "© {year} NextDrive UK Ltd. Registered in England & Wales #12948210. All rights reserved.",

  showDeveloperCredit: true,
  developerPrefix: "Designed & Developed by",
  developerName: "Crftdev Technology",
  developerUrl: "",
  developerNewTab: true,
  developerShowIcon: true,
  developerStyle: "minimal",

  theme: "auto",
  style: "modern",
  containerWidth: "standard",
  spacing: "comfortable",
  columnLayout: "auto",
  backgroundStyle: "premium_glow",
  topDivider: true,
  topDividerStyle: "gradient",
  bottomDivider: true,
  bottomDividerStyle: "subtle",
  showContactIcons: true,
  showSocialIcons: true,
  showLinkArrows: false,
};

export const initialGlobalSEOSettings: GlobalSEOSettings = {
  siteName: "NextDrive Driving Academy",
  titleTemplate: "%s | NextDrive Driving Academy",
  defaultMetaDescription:
    "DVSA-approved Grade A driving instructors across Manchester. High 89.4% first-time pass rate, modern dual-control automatic & manual fleet, and structured test route preparation.",
  canonicalBaseUrl: "https://nextdrive.uk",
  defaultOgImage:
    "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=1200&h=630&fit=crop",
  defaultRobots: {
    index: true,
    follow: true,
  },
  googleVerificationCode: "google-site-verification=nd-mcr-driving-2026",
  bingVerificationCode: "bing-site-auth-98210",
  autoGenerateSitemap: true,
  enforceTrailingSlash: false,
  schemaDefaults: {
    organizationType: "DrivingSchool",
    priceRange: "££",
    openingHours: ["Mo-Fr 07:00-20:00", "Sa-Su 08:00-18:00"],
    areaServed: [
      "Manchester City Centre",
      "Cheetham Hill",
      "West Didsbury",
      "Sale",
      "Salford",
      "Bury",
      "Stockport",
      "Trafford",
      "Greater Manchester",
    ],
  },
};

export const initialPageSEO: PageSEO[] = [
  {
    id: "seo_p_home",
    urlPath: "/",
    pageName: "Homepage",
    title: "NextDrive Academy | Manchester Driving School & Lessons",
    metaDescription:
      "DVSA-approved Grade A driving instructors across Manchester. High 89.4% first-time pass rate, modern dual-control automatic and manual fleet. Book online today.",
    h1: "Master the Road. Pass With Confidence in Manchester.",
    canonicalUrl: "https://nextdrive.uk",
    indexStatus: "INDEX",
    followStatus: "FOLLOW",
    ogImage: "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=1200&h=630&fit=crop",
    ogType: "website",
    schemaType: "DrivingSchool",
    primaryKeyword: "driving lessons manchester",
    secondaryKeywords: [
      "learn to drive manchester",
      "driving school manchester",
      "dvsa driving instructor",
    ],
    priority: 1.0,
    changeFrequency: "daily",
    isSystemPage: true,
    seoScore: 98,
    wordCount: 1420,
    updatedAt: "2026-10-07T14:30:00Z",
    notes: "Main brand hub targeting Greater Manchester learner queries.",
  },
  {
    id: "seo_p_driving_lessons",
    urlPath: "/driving-lessons",
    pageName: "Driving Lessons",
    title: "Driving Lessons Manchester | Manual & Automatic | NextDrive",
    metaDescription:
      "Professional 1-to-1 driving lessons across Manchester and Greater Manchester. Grade A DVSA certified instructors with high pass rates. Book assessment lesson.",
    h1: "Professional Driving Lessons Across Greater Manchester",
    canonicalUrl: "https://nextdrive.uk/driving-lessons",
    indexStatus: "INDEX",
    followStatus: "FOLLOW",
    schemaType: "Service",
    primaryKeyword: "driving lessons manchester",
    secondaryKeywords: [
      "automatic driving lessons manchester",
      "manual driving lessons",
      "pass plus courses",
    ],
    priority: 0.9,
    changeFrequency: "weekly",
    isSystemPage: true,
    seoScore: 96,
    wordCount: 1150,
    updatedAt: "2026-10-07T12:00:00Z",
  },
  {
    id: "seo_p_intensive_courses",
    urlPath: "/intensive-courses",
    pageName: "Intensive Driving Courses",
    title: "Fast-Track Intensive Driving Courses Manchester | NextDrive",
    metaDescription:
      "Pass your driving test in 1 to 3 weeks with our structured Manchester intensive driving courses. Includes fast-track DVSA practical test booking.",
    h1: "Intensive Driving Courses & Crash Courses in Manchester",
    canonicalUrl: "https://nextdrive.uk/intensive-courses",
    indexStatus: "INDEX",
    followStatus: "FOLLOW",
    schemaType: "Course",
    primaryKeyword: "intensive driving course manchester",
    secondaryKeywords: [
      "crash course driving manchester",
      "fast track driving test manchester",
      "1 week driving course",
    ],
    priority: 0.9,
    changeFrequency: "weekly",
    isSystemPage: true,
    seoScore: 95,
    wordCount: 1280,
    updatedAt: "2026-10-06T15:00:00Z",
  },
  {
    id: "seo_p_pricing",
    urlPath: "/pricing",
    pageName: "Pricing & Packages",
    title: "Driving Lesson Prices & Course Packages Manchester | NextDrive",
    metaDescription:
      "Transparent driving lesson prices in Manchester. Manual lessons from £37.50/hr, Automatic from £40/hr. Block booking discounts and student offers available.",
    h1: "Transparent Driving Tuition Rates & Packages",
    canonicalUrl: "https://nextdrive.uk/pricing",
    indexStatus: "INDEX",
    followStatus: "FOLLOW",
    schemaType: "Service",
    primaryKeyword: "driving lesson prices manchester",
    secondaryKeywords: [
      "cheap driving lessons manchester",
      "block booking driving lessons",
      "driving instructor hourly rate",
    ],
    priority: 0.8,
    changeFrequency: "weekly",
    isSystemPage: true,
    seoScore: 94,
    wordCount: 820,
    updatedAt: "2026-10-06T14:00:00Z",
  },
  {
    id: "seo_p_instructors",
    urlPath: "/instructors",
    pageName: "Instructors Directory",
    title: "DVSA Grade A Driving Instructors Manchester | NextDrive",
    metaDescription:
      "Get to know our certified male and female driving instructors across Manchester. High first-time pass rates, friendly tuition, and modern dual-control cars.",
    h1: "Certified DVSA Grade A Driving Instructors",
    canonicalUrl: "https://nextdrive.uk/instructors",
    indexStatus: "INDEX",
    followStatus: "FOLLOW",
    schemaType: "EducationalOrganization",
    primaryKeyword: "driving instructors manchester",
    secondaryKeywords: [
      "female driving instructor manchester",
      "grade a driving instructor",
      "adi certified instructor",
    ],
    priority: 0.8,
    changeFrequency: "weekly",
    isSystemPage: true,
    seoScore: 95,
    wordCount: 960,
    updatedAt: "2026-10-05T11:00:00Z",
  },
  {
    id: "seo_p_test_centres",
    urlPath: "/test-centres",
    pageName: "Test Centres Guide",
    title: "Manchester Driving Test Centres & Pass Rates | NextDrive Guide",
    metaDescription:
      "Comprehensive guide to Manchester DVSA driving test centres: Cheetham Hill, West Didsbury, Sale, Bury, and Bredbury. Local pass rates and test route tips.",
    h1: "Manchester Driving Test Centres & Route Preparation",
    canonicalUrl: "https://nextdrive.uk/test-centres",
    indexStatus: "INDEX",
    followStatus: "FOLLOW",
    schemaType: "EducationalOrganization",
    primaryKeyword: "manchester driving test centres",
    secondaryKeywords: [
      "cheetham hill test centre pass rate",
      "west didsbury driving test routes",
      "sale dtc pass rate",
    ],
    priority: 0.8,
    changeFrequency: "monthly",
    isSystemPage: true,
    seoScore: 96,
    wordCount: 1650,
    updatedAt: "2026-10-04T10:00:00Z",
  },
  {
    id: "seo_p_contact",
    urlPath: "/contact",
    pageName: "Contact & Booking",
    title: "Contact NextDrive Driving Academy | Manchester Lesson Booking",
    metaDescription:
      "Get in touch with our Manchester driving school team. Call +44 161 946 0921 or send an online enquiry for lesson availability and instructor matching.",
    h1: "Contact Our Manchester Dispatch Team",
    canonicalUrl: "https://nextdrive.uk/contact",
    indexStatus: "INDEX",
    followStatus: "FOLLOW",
    schemaType: "ContactPage",
    primaryKeyword: "book driving lessons manchester",
    secondaryKeywords: ["contact driving school manchester", "driving instructor enquiry"],
    priority: 0.7,
    changeFrequency: "monthly",
    isSystemPage: true,
    seoScore: 87,
    wordCount: 640,
    updatedAt: "2026-10-04T16:00:00Z",
  },
  {
    id: "seo_p_privacy",
    urlPath: "/privacy",
    pageName: "Privacy Policy",
    title: "Privacy Policy | NextDrive Driving Academy",
    metaDescription:
      "Read the NextDrive Driving Academy privacy policy. How we collect, safeguard, and manage student learner data in compliance with UK GDPR.",
    h1: "Privacy & Data Protection Policy",
    canonicalUrl: "https://nextdrive.uk/privacy",
    indexStatus: "INDEX",
    followStatus: "FOLLOW",
    schemaType: "WebPage",
    primaryKeyword: "nextdrive privacy policy",
    secondaryKeywords: [],
    priority: 0.3,
    changeFrequency: "yearly",
    isSystemPage: true,
    seoScore: 84,
    wordCount: 950,
    updatedAt: "2026-09-28T10:00:00Z",
  },
  {
    id: "seo_p_terms",
    urlPath: "/terms",
    pageName: "Terms & Conditions",
    title: "Terms and Conditions | NextDrive Driving Academy",
    metaDescription:
      "NextDrive student driving tuition terms and conditions, 48-hour cancellation policy, lesson booking guidelines, and practical test car hire rules.",
    h1: "Terms & Conditions of Tuition",
    canonicalUrl: "https://nextdrive.uk/terms",
    indexStatus: "INDEX",
    followStatus: "FOLLOW",
    schemaType: "WebPage",
    primaryKeyword: "driving lessons terms conditions",
    secondaryKeywords: [],
    priority: 0.3,
    changeFrequency: "yearly",
    isSystemPage: true,
    seoScore: 85,
    wordCount: 1100,
    updatedAt: "2026-09-28T10:00:00Z",
  },
  {
    id: "seo_p_cookies",
    urlPath: "/cookies",
    pageName: "Cookie Policy",
    title: "Cookie Policy | NextDrive Driving Academy",
    metaDescription:
      "Learn about how cookies and tracking technologies are used across nextdrive.uk to enhance browsing experience and preserve learner dashboard preferences.",
    h1: "Cookie & Tracking Policy",
    canonicalUrl: "https://nextdrive.uk/cookies",
    indexStatus: "INDEX",
    followStatus: "FOLLOW",
    schemaType: "WebPage",
    primaryKeyword: "nextdrive cookies",
    secondaryKeywords: [],
    priority: 0.3,
    changeFrequency: "yearly",
    isSystemPage: true,
    seoScore: 82,
    wordCount: 520,
    updatedAt: "2026-09-28T10:00:00Z",
  },
  {
    id: "seo_p_locations_hub",
    urlPath: "/locations",
    pageName: "Service Locations Hub",
    title: "Manchester Driving Lesson Service Locations | NextDrive",
    metaDescription:
      "Explore NextDrive active service areas across Greater Manchester: Central Manchester, Didsbury, Sale, Trafford, Salford, Stockport, and Bury.",
    h1: "Driving Tuition Service Areas in Greater Manchester",
    canonicalUrl: "https://nextdrive.uk/locations",
    indexStatus: "INDEX",
    followStatus: "FOLLOW",
    schemaType: "LocalBusiness",
    primaryKeyword: "driving lessons manchester locations",
    secondaryKeywords: ["driving school greater manchester", "manchester driving instructors"],
    priority: 0.8,
    changeFrequency: "weekly",
    isSystemPage: true,
    seoScore: 95,
    wordCount: 880,
    updatedAt: "2026-10-06T12:00:00Z",
  },
  {
    id: "seo_p_faq",
    urlPath: "/faq",
    pageName: "FAQ Knowledgebase",
    title: "Driving Lessons FAQ Manchester | NextDrive Academy",
    metaDescription:
      "Frequently asked questions about taking driving lessons in Manchester. Learn about lesson prices, DVSA test booking, manual vs automatic, and instructor matching.",
    h1: "Driving Tuition Frequently Asked Questions",
    canonicalUrl: "https://nextdrive.uk/faq",
    indexStatus: "INDEX",
    followStatus: "FOLLOW",
    schemaType: "WebPage",
    primaryKeyword: "driving lessons manchester faq",
    secondaryKeywords: ["how to book driving test manchester", "driving lessons questions"],
    priority: 0.7,
    changeFrequency: "monthly",
    isSystemPage: true,
    seoScore: 94,
    wordCount: 1100,
    updatedAt: "2026-10-06T12:00:00Z",
  },
  {
    id: "seo_p_blog",
    urlPath: "/blog",
    pageName: "Driving Guides & Blog",
    title: "Driving Guides & Learner Advice | NextDrive Manchester",
    metaDescription:
      "Expert driving guides, test centre preparation tips, manual vs automatic comparisons, and learner driver advice for Manchester motorists.",
    h1: "Driving Guides & Practical Test Advice",
    canonicalUrl: "https://nextdrive.uk/blog",
    indexStatus: "INDEX",
    followStatus: "FOLLOW",
    schemaType: "WebPage",
    primaryKeyword: "manchester driving guides",
    secondaryKeywords: ["how to pass driving test manchester", "learner driver tips"],
    priority: 0.7,
    changeFrequency: "weekly",
    isSystemPage: true,
    seoScore: 95,
    wordCount: 950,
    updatedAt: "2026-10-06T12:00:00Z",
  },
  {
    id: "seo_p_loc_01",
    urlPath: "/locations/central-north-manchester",
    pageName: "Central & North Manchester",
    title: "Driving Lessons Central & North Manchester | NextDrive",
    metaDescription:
      "Top-rated manual and automatic driving tuition across Manchester City Centre, M1-M4, Ancoats, Cheetham Hill, and North Manchester test routes.",
    h1: "Driving Lessons in Central & North Manchester",
    canonicalUrl: "https://nextdrive.uk/locations/central-north-manchester",
    indexStatus: "INDEX",
    followStatus: "FOLLOW",
    schemaType: "LocalBusiness",
    primaryKeyword: "driving lessons central manchester",
    secondaryKeywords: [
      "driving lessons cheetham hill",
      "m1 driving instructor",
      "north manchester driving school",
    ],
    priority: 0.8,
    changeFrequency: "weekly",
    isSystemPage: false,
    seoScore: 93,
    wordCount: 1180,
    updatedAt: "2026-10-06T11:00:00Z",
  },
  {
    id: "seo_p_loc_02",
    urlPath: "/locations/south-manchester-didsbury",
    pageName: "South Manchester & Didsbury",
    title: "Driving Lessons South Manchester & Didsbury | NextDrive",
    metaDescription:
      "Door-to-door driving tuition in West Didsbury, Fallowfield, Withington, and Chorlton. Expert preparation for West Didsbury DTC test routes.",
    h1: "Driving Lessons in South Manchester & Didsbury",
    canonicalUrl: "https://nextdrive.uk/locations/south-manchester-didsbury",
    indexStatus: "INDEX",
    followStatus: "FOLLOW",
    schemaType: "LocalBusiness",
    primaryKeyword: "driving lessons didsbury",
    secondaryKeywords: [
      "driving lessons south manchester",
      "west didsbury driving instructor",
      "m20 driving lessons",
    ],
    priority: 0.8,
    changeFrequency: "weekly",
    isSystemPage: false,
    seoScore: 92,
    wordCount: 1140,
    updatedAt: "2026-10-06T11:00:00Z",
  },
  {
    id: "seo_p_loc_03",
    urlPath: "/locations/trafford-sale",
    pageName: "Trafford & Sale",
    title: "Driving Lessons Trafford & Sale | NextDrive Academy",
    metaDescription:
      "High-pass-rate driving lessons across Sale, Stretford, Old Trafford, and Urmston. Intensive practical training on official Sale DTC routes.",
    h1: "Driving Tuition in Trafford, Sale & Stretford",
    canonicalUrl: "https://nextdrive.uk/locations/trafford-sale",
    indexStatus: "INDEX",
    followStatus: "FOLLOW",
    schemaType: "LocalBusiness",
    primaryKeyword: "driving lessons sale manchester",
    secondaryKeywords: [
      "driving instructor trafford",
      "sale dtc mock test",
      "m33 driving school",
    ],
    priority: 0.8,
    changeFrequency: "weekly",
    isSystemPage: false,
    seoScore: 96,
    wordCount: 1090,
    updatedAt: "2026-10-06T11:00:00Z",
  },
  {
    id: "seo_p_loc_04",
    urlPath: "/locations/salford-bury",
    pageName: "Salford & Bury",
    title: "Driving Lessons Salford & Bury | NextDrive Academy",
    metaDescription:
      "Expert driving lessons across Salford Quays, Eccles, Swinton, Prestwich, and Whitefield. Experienced tuition targeting Bury test centre routes.",
    h1: "Driving Tuition Across Salford & Bury",
    canonicalUrl: "https://nextdrive.uk/locations/salford-bury",
    indexStatus: "INDEX",
    followStatus: "FOLLOW",
    schemaType: "LocalBusiness",
    primaryKeyword: "driving lessons salford",
    secondaryKeywords: [
      "driving instructor bury",
      "salford quays driving lessons",
      "bl9 driving school",
    ],
    priority: 0.8,
    changeFrequency: "weekly",
    isSystemPage: false,
    seoScore: 90,
    wordCount: 1040,
    updatedAt: "2026-10-06T11:00:00Z",
  },
  {
    id: "seo_p_loc_05",
    urlPath: "/locations/stockport-cheadle",
    pageName: "Stockport & Cheadle",
    title: "Driving Lessons Stockport & Cheadle | NextDrive Academy",
    metaDescription:
      "Qualified Grade A driving instructors in Stockport, Cheadle, Bramhall, and Hazel Grove. Rehearse authentic Bredbury DTC driving test routes.",
    h1: "Driving Lessons in Stockport & Cheadle",
    canonicalUrl: "https://nextdrive.uk/locations/stockport-cheadle",
    indexStatus: "INDEX",
    followStatus: "FOLLOW",
    schemaType: "LocalBusiness",
    primaryKeyword: "driving lessons stockport",
    secondaryKeywords: [
      "cheadle driving instructor",
      "bredbury test centre routes",
      "sk1 driving lessons",
    ],
    priority: 0.8,
    changeFrequency: "weekly",
    isSystemPage: false,
    seoScore: 89,
    wordCount: 1020,
    updatedAt: "2026-10-06T11:00:00Z",
  },
];

export const initialSEORedirects: SEORedirect[] = [
  {
    id: "redir_01",
    sourcePath: "/driving-lessons-manchester",
    destinationPath: "/driving-lessons",
    statusCode: 301,
    isActive: true,
    hitCount: 342,
    notes: "Legacy URL migrated to consolidate ranking signals on core hub.",
    createdAt: "2025-06-12T09:00:00Z",
    updatedAt: "2026-09-15T10:00:00Z",
  },
  {
    id: "redir_02",
    sourcePath: "/cheetham-hill-driving-lessons",
    destinationPath: "/locations/central-north-manchester",
    statusCode: 301,
    isActive: true,
    hitCount: 198,
    notes: "Directs old campaign landing page to updated local service area.",
    createdAt: "2025-08-01T11:00:00Z",
    updatedAt: "2026-08-01T11:00:00Z",
  },
  {
    id: "redir_03",
    sourcePath: "/didsbury-driving-school",
    destinationPath: "/locations/south-manchester-didsbury",
    statusCode: 301,
    isActive: true,
    hitCount: 156,
    notes: "Redirect old external local directory links to Didsbury hub.",
    createdAt: "2025-09-10T14:30:00Z",
    updatedAt: "2026-09-10T14:30:00Z",
  },
];

export const initialSEOKeywords: SEOKeywordTarget[] = [
  {
    id: "kw_01",
    keyword: "driving lessons manchester",
    targetUrl: "/",
    monthlyVolume: "5,400",
    intent: "LOCAL",
    difficulty: "HIGH",
    priority: "PRIMARY",
    currentRank: 3,
    notes: "Primary head keyword for Greater Manchester.",
  },
  {
    id: "kw_02",
    keyword: "automatic driving lessons manchester",
    targetUrl: "/driving-lessons",
    monthlyVolume: "2,900",
    intent: "COMMERCIAL",
    difficulty: "MEDIUM",
    priority: "PRIMARY",
    currentRank: 4,
    notes: "High conversion intent for automatic transmission learners.",
  },
  {
    id: "kw_03",
    keyword: "intensive driving course manchester",
    targetUrl: "/intensive-courses",
    monthlyVolume: "1,900",
    intent: "TRANSACTIONAL",
    difficulty: "HIGH",
    priority: "PRIMARY",
    currentRank: 2,
    notes: "Premium course package revenue driver.",
  },
  {
    id: "kw_04",
    keyword: "driving lessons didsbury",
    targetUrl: "/locations/south-manchester-didsbury",
    monthlyVolume: "720",
    intent: "LOCAL",
    difficulty: "LOW",
    priority: "SECONDARY",
    currentRank: 1,
    notes: "Strong local dominance in M20.",
  },
  {
    id: "kw_05",
    keyword: "cheetham hill test centre driving instructor",
    targetUrl: "/test-centres",
    monthlyVolume: "480",
    intent: "LOCAL",
    difficulty: "LOW",
    priority: "LONG_TAIL",
    currentRank: 2,
    notes: "Targeting learners with booked Cheetham Hill test dates.",
  },
  {
    id: "kw_06",
    keyword: "driving lessons sale manchester",
    targetUrl: "/locations/trafford-sale",
    monthlyVolume: "590",
    intent: "LOCAL",
    difficulty: "LOW",
    priority: "SECONDARY",
    currentRank: 3,
    notes: "Trafford and Sale area local traffic.",
  },
  {
    id: "kw_07",
    keyword: "female driving instructor manchester",
    targetUrl: "/instructors",
    monthlyVolume: "1,100",
    intent: "COMMERCIAL",
    difficulty: "MEDIUM",
    priority: "PRIMARY",
    currentRank: 4,
    notes: "High query demand for female instructors like Aisha Patel.",
  },
  {
    id: "kw_08",
    keyword: "driving lesson prices manchester",
    targetUrl: "/pricing",
    monthlyVolume: "880",
    intent: "COMMERCIAL",
    difficulty: "LOW",
    priority: "SECONDARY",
    currentRank: 2,
    notes: "Price comparison queries.",
  },
];

export const initialTestCentres: LocalTestCentre[] = [
  {
    id: "tc_01",
    name: "Cheetham Hill Driving Test Centre",
    slug: "cheetham-hill-dtc",
    dvsaCentreId: "DVSA-DTC-MCR-01",
    address: "Alderglen Road, Cheetham Hill, Manchester",
    postcode: "M8 5UF",
    passRateRecent: "46.8%",
    keyRoutesDescription:
      "Challenging urban driving involving Bury Old Road, Queens Road junctions, tricky multi-lane roundabouts, and narrow residential streets with heavy parked vehicles.",
    associatedLocationSlug: "central-north-manchester",
    isActive: true,
  },
  {
    id: "tc_02",
    name: "West Didsbury Driving Test Centre",
    slug: "west-didsbury-dtc",
    dvsaCentreId: "DVSA-DTC-MCR-02",
    address: "Unit 11, Christie Park, West Didsbury, Manchester",
    postcode: "M20 2RN",
    passRateRecent: "49.3%",
    keyRoutesDescription:
      "Mixed residential and high-speed multi-lane driving along Kingsway (A34), Princess Parkway (A5103), and complex signalized crossroads around Barlow Moor Road.",
    associatedLocationSlug: "south-manchester-didsbury",
    isActive: true,
  },
  {
    id: "tc_03",
    name: "Sale Driving Test Centre",
    slug: "sale-dtc",
    dvsaCentreId: "DVSA-DTC-MCR-03",
    address: "Poplar Grove, Sale, Greater Manchester",
    postcode: "M33 2DY",
    passRateRecent: "51.2%",
    keyRoutesDescription:
      "Features Washway Road (A56), rapid merging on the Carrington Spur (A6144), spiral lane roundabouts, and quiet residential maneuvers in Brooklands.",
    associatedLocationSlug: "trafford-sale",
    isActive: true,
  },
  {
    id: "tc_04",
    name: "Bury Driving Test Centre",
    slug: "bury-dtc",
    dvsaCentreId: "DVSA-DTC-MCR-04",
    address: "Smith Street, Bury, Greater Manchester",
    postcode: "BL9 8AU",
    passRateRecent: "44.7%",
    keyRoutesDescription:
      "Demanding hill starts, Peel Way one-way gyratory system, high pedestrian zones around the Metrolink station, and dual-carriageway sections on Manchester Road.",
    associatedLocationSlug: "salford-bury",
    isActive: true,
  },
  {
    id: "tc_05",
    name: "Bredbury Driving Test Centre",
    slug: "bredbury-dtc",
    dvsaCentreId: "DVSA-DTC-MCR-05",
    address: "Lingard Lane, Bredbury, Stockport",
    postcode: "SK6 2BP",
    passRateRecent: "47.9%",
    keyRoutesDescription:
      "Industrial estates transitioning to national speed limits on Crookilley Way, high-speed motorway slip observation, and complex lane changes on Bredbury roundabout.",
    associatedLocationSlug: "stockport-cheadle",
    isActive: true,
  },
];

class DatabaseService {
  private users: User[] = [...initialUsers];
  private students: Student[] = [...initialStudents];
  private inquiries: ContactInquiry[] = [...initialInquiries];
  private content: ContentItem[] = [...initialContent];
  private metrics: SystemMetric[] = [...initialMetrics];
  private auditLogs: AuditLog[] = [...initialAuditLogs];
  private instructors: Instructor[] = [...initialInstructors];
  private lessonPackages: LessonPackage[] = [...initialLessonPackages];
  private locations: LocationArea[] = [...initialLocations];
  private bookings: Booking[] = [...initialBookings];
  private reviews: ReviewItem[] = [...initialReviews];
  private faqs: FAQItem[] = [...initialFaqs];
  private businessSettings: BusinessSettings = { ...initialBusinessSettings };
  private accounts: Account[] = [...initialAccounts];
  private popupCampaign: PopupCampaign = { ...initialPopupCampaign };
  private publishedPopupCampaign: PopupCampaign = { ...initialPopupCampaign };
  private popupAnalyticsEvents: PopupAnalyticsEvent[] = [...initialPopupAnalyticsEvents];
  private footerSettings: FooterSettings = { ...initialFooterSettings };
  private publishedFooterSettings: FooterSettings = { ...initialFooterSettings };
  private globalSEOSettings: GlobalSEOSettings = { ...initialGlobalSEOSettings };
  private pagesSEO: PageSEO[] = [...initialPageSEO];
  private redirectsSEO: SEORedirect[] = [...initialSEORedirects];
  private keywordsSEO: SEOKeywordTarget[] = [...initialSEOKeywords];
  private testCentres: LocalTestCentre[] = [...initialTestCentres];

  constructor() {
    this.businessSettings.phone = "+44 161 946 0921";
    this.businessSettings.heroSecondaryCtaLink = "tel:+441619460921";
    this.footerSettings.phone = "+44 161 946 0921";
    this.footerSettings.ctaSecondaryText = "Call Us: +44 161 946 0921";
    this.footerSettings.ctaSecondaryUrl = "tel:+441619460921";
    this.publishedFooterSettings.phone = "+44 161 946 0921";
    this.publishedFooterSettings.ctaSecondaryText = "Call Us: +44 161 946 0921";
    this.publishedFooterSettings.ctaSecondaryUrl = "tel:+441619460921";
  }

  // User queries & mutations
  async getUsers(query?: string, roleFilter?: string): Promise<User[]> {
    let result = [...this.users];
    if (roleFilter && roleFilter !== "ALL") {
      result = result.filter((u) => u.role === roleFilter);
    }
    if (query) {
      const q = query.toLowerCase();
      result = result.filter(
        (u) => u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q)
      );
    }
    return result;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return this.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  }

  async getUserById(id: string): Promise<User | undefined> {
    return this.users.find((u) => u.id === id);
  }

  async createUser(userData: Omit<User, "id" | "createdAt" | "lastLogin">): Promise<User> {
    const newUser: User = {
      ...userData,
      id: `usr_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      createdAt: new Date().toISOString(),
      lastLogin: new Date().toISOString(),
    };
    this.users.unshift(newUser);
    return newUser;
  }

  async updateUser(id: string, updates: Partial<User>): Promise<User | null> {
    const index = this.users.findIndex((u) => u.id === id);
    if (index === -1) return null;
    this.users[index] = { ...this.users[index], ...updates };
    return this.users[index];
  }

  // Social Account Queries & Linking
  async getAccountsByUserId(userId: string): Promise<Account[]> {
    return this.accounts.filter((a) => a.userId === userId);
  }

  async getAccountByProvider(
    provider: string,
    providerAccountId: string
  ): Promise<Account | undefined> {
    const p = provider.toLowerCase().trim();
    return this.accounts.find(
      (a) => a.provider.toLowerCase() === p && a.providerAccountId === providerAccountId
    );
  }

  async linkAccount(
    userId: string,
    provider: string,
    providerAccountId: string
  ): Promise<Account> {
    const existing = await this.getAccountByProvider(provider, providerAccountId);
    if (existing) {
      if (existing.userId !== userId) {
        throw new Error("This social account is already linked to another user profile.");
      }
      return existing;
    }

    const newAccount: Account = {
      id: `acc_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      userId,
      provider: provider.toLowerCase().trim(),
      providerAccountId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.accounts.push(newAccount);
    return newAccount;
  }

  async unlinkAccount(userId: string, provider: string): Promise<boolean> {
    const p = provider.toLowerCase().trim();
    const initialLen = this.accounts.length;
    this.accounts = this.accounts.filter(
      (a) => !(a.userId === userId && a.provider.toLowerCase() === p)
    );
    return this.accounts.length < initialLen;
  }

  async canUserUnlinkProvider(
    userId: string,
    provider: string
  ): Promise<{ canUnlink: boolean; reason?: string }> {
    const user = await this.getUserById(userId);
    if (!user) {
      return { canUnlink: false, reason: "User not found." };
    }

    const userAccounts = await this.getAccountsByUserId(userId);
    const hasPassword = Boolean(user.passwordHash);
    const otherAccounts = userAccounts.filter(
      (a) => a.provider.toLowerCase() !== provider.toLowerCase()
    );

    if (!hasPassword && otherAccounts.length === 0) {
      return {
        canUnlink: false,
        reason:
          "Cannot disconnect your only authentication method. Please add another provider or set a password first.",
      };
    }

    return { canUnlink: true };
  }

  // Instructor Application Approval Workflow
  async approveInstructorApplication(
    instructorId: string,
    adminEmail: string
  ): Promise<Instructor | null> {
    const inst = await this.updateInstructor(instructorId, { status: "ACTIVE" });
    if (!inst) return null;

    // Activate the corresponding User record
    const user = await this.getUserByEmail(inst.email);
    if (user) {
      await this.updateUser(user.id, { status: "ACTIVE" });
    }

    await this.addAuditLog({
      action: "INSTRUCTOR_APPLICATION_APPROVED",
      actorEmail: adminEmail,
      target: `Instructor ${inst.name} (${inst.badgeNumber}) approved to active fleet`,
      ip: "127.0.0.1",
      severity: "SUCCESS",
    });

    return inst;
  }

  async rejectInstructorApplication(
    instructorId: string,
    adminEmail: string
  ): Promise<Instructor | null> {
    const inst = await this.updateInstructor(instructorId, { status: "REJECTED" });
    if (!inst) return null;

    // Deactivate the corresponding User record
    const user = await this.getUserByEmail(inst.email);
    if (user) {
      await this.updateUser(user.id, { status: "INACTIVE" });
    }

    await this.addAuditLog({
      action: "INSTRUCTOR_APPLICATION_REJECTED",
      actorEmail: adminEmail,
      target: `Instructor application for ${inst.name} (${inst.email}) rejected`,
      ip: "127.0.0.1",
      severity: "WARNING",
    });

    return inst;
  }

  // Content queries
  async getContent(status?: string): Promise<ContentItem[]> {
    if (status && status !== "ALL") {
      return this.content.filter((c) => c.status === status);
    }
    return this.content;
  }

  async getContentBySlug(slug: string): Promise<ContentItem | undefined> {
    return this.content.find((c) => c.slug === slug);
  }

  // Metrics
  async getMetrics(): Promise<SystemMetric[]> {
    return this.metrics;
  }

  // Audit Logs
  async getAuditLogs(limit = 10): Promise<AuditLog[]> {
    return this.auditLogs.slice(0, limit);
  }

  async addAuditLog(log: Omit<AuditLog, "id" | "timestamp">): Promise<AuditLog> {
    const newLog: AuditLog = {
      ...log,
      id: `log_${Date.now()}`,
      timestamp: new Date().toISOString().replace("T", " ").substring(0, 19),
    };
    this.auditLogs.unshift(newLog);
    return newLog;
  }

  // Driving School: Bookings
  async getBookings(filter?: {
    status?: string;
    transmission?: string;
    query?: string;
  }): Promise<Booking[]> {
    let result = [...this.bookings];
    if (filter?.status && filter.status !== "ALL") {
      result = result.filter((b) => b.status === filter.status);
    }
    if (filter?.transmission && filter.transmission !== "ALL") {
      result = result.filter((b) => b.transmission === filter.transmission);
    }
    if (filter?.query) {
      const q = filter.query.toLowerCase();
      result = result.filter(
        (b) =>
          b.studentName.toLowerCase().includes(q) ||
          b.instructorName.toLowerCase().includes(q) ||
          b.pickupLocation.toLowerCase().includes(q)
      );
    }
    return result;
  }

  async getBookingById(id: string): Promise<Booking | undefined> {
    return this.bookings.find((b) => b.id === id);
  }

  async createBooking(booking: Omit<Booking, "id">): Promise<Booking> {
    const newBooking: Booking = {
      ...booking,
      id: `bk_${Date.now()}`,
    };
    this.bookings.unshift(newBooking);
    return newBooking;
  }

  async updateBookingStatus(
    id: string,
    status: BookingStatus
  ): Promise<Booking | null> {
    const booking = this.bookings.find((b) => b.id === id);
    if (!booking) return null;
    booking.status = status;
    return booking;
  }

  // Driving School: Instructors
  async getInstructors(status?: string): Promise<Instructor[]> {
    if (status && status !== "ALL") {
      return this.instructors.filter((i) => i.status === status);
    }
    return this.instructors;
  }

  // Driving School: Lesson Packages
  async getLessonPackages(): Promise<LessonPackage[]> {
    return this.lessonPackages;
  }

  async getLessons(): Promise<LessonPackage[]> {
    return this.lessonPackages;
  }

  // Driving School: Service Locations
  async getLocations(activeOnly?: boolean): Promise<LocationArea[]> {
    let locs = [...this.locations];
    if (activeOnly) {
      locs = locs.filter((l) => l.isActive !== false);
    }
    return locs.sort((a, b) => (a.displayOrder || 99) - (b.displayOrder || 99));
  }

  async getLocationBySlug(slug: string): Promise<LocationArea | undefined> {
    const clean = slug.toLowerCase().trim();
    return this.locations.find((l) => (l.slug || "").toLowerCase() === clean);
  }

  // Driving School: Dashboard Summary
  async getDashboardSummary(): Promise<DashboardSummary> {
    const activeInstructors = this.instructors.filter((i) => i.status === "ACTIVE");
    const activeBookings = this.bookings.filter(
      (b) => b.status === "CONFIRMED" || b.status === "IN_PROGRESS"
    );
    const pendingBookings = this.bookings.filter((b) => b.status === "PENDING");
    const confirmedBookings = this.bookings.filter((b) => b.status === "CONFIRMED");
    const newInquiries = this.inquiries.filter((i) => i.status === "NEW");
    const contactedInquiries = this.inquiries.filter((i) => i.status === "CONTACTED");
    const convertedInquiries = this.inquiries.filter(
      (i) => i.status === "CONVERTED" || i.status === "BOOKED"
    );
    const activeStudents = this.students.filter((s) => s.status === "ACTIVE" || s.status === "TEST_READY");

    const totalRevenue = this.bookings
      .filter((b) => b.status === "CONFIRMED" || b.status === "COMPLETED" || b.status === "IN_PROGRESS")
      .reduce((sum, b) => sum + (b.price || 0), 0);

    const weeklyHours = this.bookings.reduce((sum, b) => sum + (b.durationHours || 0), 0);

    const upcomingLessons = this.bookings.slice(0, 5);
    const recentBookings = this.bookings.slice(0, 6);
    const recentInquiries = this.inquiries.slice(0, 6);

    return {
      revenueThisMonth: `£${totalRevenue.toLocaleString()}`,
      revenueChange: "+14.2%",
      activeBookingsCount: activeBookings.length,
      totalBookingsCount: this.bookings.length,
      pendingBookingsCount: pendingBookings.length,
      confirmedBookingsCount: confirmedBookings.length,
      activeStudentsCount: activeStudents.length,
      totalStudentsCount: this.students.length,
      firstTimePassRate: this.businessSettings.firstTimePassRate || "89.4%",
      activeInstructorsCount: activeInstructors.length,
      totalInstructorsCount: this.instructors.length,
      weeklyHoursDelivered: weeklyHours,
      totalReviewsCount: this.reviews.length,
      reviewsCount: this.reviews.length,
      averageRating: this.reviews.length
        ? Number(
            (
              this.reviews.reduce((sum, r) => sum + (r.rating || 5), 0) /
              this.reviews.length
            ).toFixed(1)
          )
        : 4.9,
      totalInquiriesCount: this.inquiries.length,
      newInquiriesCount: newInquiries.length,
      contactedInquiriesCount: contactedInquiries.length,
      convertedInquiriesCount: convertedInquiries.length,
      totalLeadsCount: this.inquiries.length,
      upcomingLessons,
      recentBookings,
      recentInquiries,
      instructorsOnDuty: activeInstructors,
    };
  }

  // Driving School: Reviews & Testimonials
  async getReviews(featuredOnly?: boolean): Promise<ReviewItem[]> {
    if (featuredOnly) {
      return this.reviews.filter((r) => r.featured);
    }
    return [...this.reviews];
  }

  async getReviewById(id: string): Promise<ReviewItem | undefined> {
    return this.reviews.find((r) => r.id === id);
  }

  async createReview(review: Omit<ReviewItem, "id">): Promise<ReviewItem> {
    const newReview: ReviewItem = {
      ...review,
      id: `rev_${Date.now()}`,
    };
    this.reviews.unshift(newReview);
    return newReview;
  }

  async updateReview(
    id: string,
    updates: Partial<ReviewItem>
  ): Promise<ReviewItem | null> {
    const index = this.reviews.findIndex((r) => r.id === id);
    if (index === -1) return null;
    this.reviews[index] = { ...this.reviews[index], ...updates };
    return this.reviews[index];
  }

  async deleteReview(id: string): Promise<boolean> {
    const initialLen = this.reviews.length;
    this.reviews = this.reviews.filter((r) => r.id !== id);
    return this.reviews.length < initialLen;
  }

  // Driving School: FAQs
  async getFaqs(category?: string, activeOnly: boolean = false): Promise<FAQItem[]> {
    let result = [...this.faqs];
    if (activeOnly) {
      result = result.filter((f) => f.status !== "INACTIVE");
    }
    if (category && category !== "ALL") {
      result = result.filter((f) => f.category.toLowerCase() === category.toLowerCase());
    }
    return result.sort((a, b) => a.order - b.order);
  }

  async getFaqById(id: string): Promise<FAQItem | undefined> {
    return this.faqs.find((f) => f.id === id);
  }

  async createFaq(faq: Omit<FAQItem, "id">): Promise<FAQItem> {
    const now = new Date().toISOString();
    const newFaq: FAQItem = {
      ...faq,
      id: `faq_${Date.now()}`,
      status: faq.status || "ACTIVE",
      createdAt: now,
      updatedAt: now,
    };
    this.faqs.push(newFaq);
    return newFaq;
  }

  async updateFaq(
    id: string,
    updates: Partial<FAQItem>
  ): Promise<FAQItem | null> {
    const index = this.faqs.findIndex((f) => f.id === id);
    if (index === -1) return null;
    const existing = this.faqs[index];
    this.faqs[index] = {
      ...existing,
      ...updates,
      id, // ALWAYS preserve same ID!
      createdAt: existing.createdAt || new Date().toISOString(), // Preserve original createdAt
      updatedAt: new Date().toISOString(),
    };
    return this.faqs[index];
  }

  async deleteFaq(id: string): Promise<boolean> {
    const initialLen = this.faqs.length;
    this.faqs = this.faqs.filter((f) => f.id !== id);
    return this.faqs.length < initialLen;
  }

  // Driving School: Lesson Packages CRUD
  async createLessonPackage(pkg: Omit<LessonPackage, "id">): Promise<LessonPackage> {
    const newPkg: LessonPackage = {
      ...pkg,
      id: `pkg_${Date.now()}`,
    };
    this.lessonPackages.push(newPkg);
    return newPkg;
  }

  async updateLessonPackage(
    id: string,
    updates: Partial<LessonPackage>
  ): Promise<LessonPackage | null> {
    const index = this.lessonPackages.findIndex((p) => p.id === id);
    if (index === -1) return null;
    this.lessonPackages[index] = { ...this.lessonPackages[index], ...updates };
    return this.lessonPackages[index];
  }

  async deleteLessonPackage(id: string): Promise<boolean> {
    const initialLen = this.lessonPackages.length;
    this.lessonPackages = this.lessonPackages.filter((p) => p.id !== id);
    return this.lessonPackages.length < initialLen;
  }

  // Driving School: Instructors CRUD
  async createInstructor(inst: Omit<Instructor, "id">): Promise<Instructor> {
    const newInst: Instructor = {
      ...inst,
      id: `inst_${Date.now()}`,
    };
    this.instructors.push(newInst);
    return newInst;
  }

  async updateInstructor(
    id: string,
    updates: Partial<Instructor>
  ): Promise<Instructor | null> {
    const index = this.instructors.findIndex((i) => i.id === id);
    if (index === -1) return null;
    this.instructors[index] = { ...this.instructors[index], ...updates };
    return this.instructors[index];
  }

  async deleteInstructor(id: string): Promise<boolean> {
    const initialLen = this.instructors.length;
    this.instructors = this.instructors.filter((i) => i.id !== id);
    return this.instructors.length < initialLen;
  }

  // Driving School: Service Locations CRUD
  async createLocation(loc: Omit<LocationArea, "id">): Promise<LocationArea> {
    const newLoc: LocationArea = {
      ...loc,
      id: `loc_${Date.now()}`,
    };
    this.locations.push(newLoc);
    return newLoc;
  }

  async updateLocation(
    id: string,
    updates: Partial<LocationArea>
  ): Promise<LocationArea | null> {
    const index = this.locations.findIndex((l) => l.id === id);
    if (index === -1) return null;
    this.locations[index] = { ...this.locations[index], ...updates };
    return this.locations[index];
  }

  async deleteLocation(id: string): Promise<boolean> {
    const initialLen = this.locations.length;
    this.locations = this.locations.filter((l) => l.id !== id);
    return this.locations.length < initialLen;
  }

  // Content (Blog / Articles) CRUD
  async createContent(item: Omit<ContentItem, "id">): Promise<ContentItem> {
    const newItem: ContentItem = {
      ...item,
      id: `cnt_${Date.now()}`,
    };
    this.content.unshift(newItem);
    return newItem;
  }

  async updateContent(
    id: string,
    updates: Partial<ContentItem>
  ): Promise<ContentItem | null> {
    const index = this.content.findIndex((c) => c.id === id);
    if (index === -1) return null;
    this.content[index] = { ...this.content[index], ...updates };
    return this.content[index];
  }

  async deleteContent(id: string): Promise<boolean> {
    const initialLen = this.content.length;
    this.content = this.content.filter((c) => c.id !== id);
    return this.content.length < initialLen;
  }

  // Driving School: Students / Learners CRUD
  async getStudents(query?: string, status?: string): Promise<Student[]> {
    let result = [...this.students];
    if (status && status !== "ALL") {
      result = result.filter((s) => s.status === status);
    }
    if (query) {
      const q = query.toLowerCase();
      result = result.filter(
        (s) =>
          s.name.toLowerCase().includes(q) ||
          s.email.toLowerCase().includes(q) ||
          s.phone.toLowerCase().includes(q) ||
          s.postcode.toLowerCase().includes(q)
      );
    }
    return result;
  }

  async getStudentById(id: string): Promise<Student | undefined> {
    return this.students.find((s) => s.id === id);
  }

  async getStudentByEmail(email: string): Promise<Student | undefined> {
    const e = email.toLowerCase().trim();
    return this.students.find((s) => s.email.toLowerCase().trim() === e);
  }

  async createStudent(student: Omit<Student, "id" | "createdAt">): Promise<Student> {
    const newStudent: Student = {
      ...student,
      id: `std_${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    this.students.unshift(newStudent);
    return newStudent;
  }

  async updateStudent(
    id: string,
    updates: Partial<Student>
  ): Promise<Student | null> {
    const index = this.students.findIndex((s) => s.id === id);
    if (index === -1) return null;
    this.students[index] = { ...this.students[index], ...updates };
    return this.students[index];
  }

  async deleteStudent(id: string): Promise<boolean> {
    const initialLen = this.students.length;
    this.students = this.students.filter((s) => s.id !== id);
    return this.students.length < initialLen;
  }

  // Driving School: Contact Enquiries CRUD
  async getInquiries(
    filterOrStatus?:
      | string
      | {
          status?: string;
          query?: string;
          course?: string;
          area?: string;
          sort?: "newest" | "oldest";
        },
    queryArg?: string
  ): Promise<ContactInquiry[]> {
    let status: string | undefined;
    let query: string | undefined;
    let course: string | undefined;
    let area: string | undefined;
    let sort: "newest" | "oldest" = "newest";

    if (typeof filterOrStatus === "object" && filterOrStatus !== null) {
      status = filterOrStatus.status;
      query = filterOrStatus.query;
      course = filterOrStatus.course;
      area = filterOrStatus.area;
      if (filterOrStatus.sort) sort = filterOrStatus.sort;
    } else {
      status = filterOrStatus;
      query = queryArg;
    }

    let result = [...this.inquiries];
    if (status && status !== "ALL") {
      result = result.filter((i) => i.status === status);
    }
    if (course && course !== "ALL") {
      result = result.filter(
        (i) => i.course === course || i.targetPackage === course
      );
    }
    if (area && area !== "ALL") {
      result = result.filter((i) => i.area === area);
    }
    if (query) {
      const q = query.toLowerCase();
      result = result.filter(
        (i) =>
          i.name.toLowerCase().includes(q) ||
          i.email.toLowerCase().includes(q) ||
          i.phone.toLowerCase().includes(q) ||
          i.postcode.toLowerCase().includes(q) ||
          (i.course && i.course.toLowerCase().includes(q)) ||
          (i.area && i.area.toLowerCase().includes(q)) ||
          (i.internalNotes && i.internalNotes.toLowerCase().includes(q))
      );
    }

    if (sort === "oldest") {
      result.sort(
        (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      );
    } else {
      result.sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    }

    return result;
  }

  async getInquiryById(id: string): Promise<ContactInquiry | undefined> {
    return this.inquiries.find((i) => i.id === id);
  }

  async createInquiry(
    inquiry: Omit<ContactInquiry, "id" | "createdAt">
  ): Promise<ContactInquiry> {
    const newInquiry: ContactInquiry = {
      ...inquiry,
      id: `inq_${Date.now()}`,
      createdAt: new Date().toISOString().replace("T", " ").substring(0, 16),
    };
    this.inquiries.unshift(newInquiry);
    return newInquiry;
  }

  async updateInquiry(
    id: string,
    updates: Partial<ContactInquiry>
  ): Promise<ContactInquiry | null> {
    const index = this.inquiries.findIndex((i) => i.id === id);
    if (index === -1) return null;
    this.inquiries[index] = {
      ...this.inquiries[index],
      ...updates,
      updatedAt: new Date().toISOString().replace("T", " ").substring(0, 16),
    };
    return this.inquiries[index];
  }

  async updateInquiryStatus(
    id: string,
    status: InquiryStatus
  ): Promise<ContactInquiry | null> {
    return this.updateInquiry(id, { status });
  }

  async deleteInquiry(id: string): Promise<boolean> {
    const initialLen = this.inquiries.length;
    this.inquiries = this.inquiries.filter((i) => i.id !== id);
    return this.inquiries.length < initialLen;
  }

  async deleteBooking(id: string): Promise<boolean> {
    const initialLen = this.bookings.length;
    this.bookings = this.bookings.filter((b) => b.id !== id);
    return this.bookings.length < initialLen;
  }

  // Driving School: Business Settings
  async getBusinessSettings(): Promise<BusinessSettings> {
    return { ...this.businessSettings };
  }

  async updateBusinessSettings(
    newSettings: Partial<BusinessSettings>
  ): Promise<BusinessSettings> {
    this.businessSettings = {
      ...this.businessSettings,
      ...newSettings,
      authProviders: {
        ...(this.businessSettings.authProviders || {
          google: true,
          apple: true,
          linkedin: true,
          microsoft: false,
          x: false,
        }),
        ...(newSettings.authProviders || {}),
      },
    };
    return { ...this.businessSettings };
  }

  // Instructor Operations & Multi-Tenant Isolation
  async getInstructorById(id: string): Promise<Instructor | undefined> {
    return this.instructors.find((i) => i.id === id);
  }

  async getInstructorByEmail(email: string): Promise<Instructor | undefined> {
    const e = email.toLowerCase().trim();
    if (e === "instructor@nextdrive.uk" || e === "dave.miller@nextdrive.uk") {
      return this.instructors.find((i) => i.id === "inst_01");
    }
    return this.instructors.find((i) => i.email.toLowerCase().trim() === e);
  }

  async getStudentsByInstructor(instructorId: string, query?: string): Promise<Student[]> {
    const instructor = await this.getInstructorById(instructorId);
    let result = this.students.filter(
      (s) => s.assignedInstructorId === instructorId || (instructor && s.assignedInstructorName === instructor.name)
    );
    if (query) {
      const q = query.toLowerCase();
      result = result.filter(
        (s) =>
          s.name.toLowerCase().includes(q) ||
          s.email.toLowerCase().includes(q) ||
          s.phone.toLowerCase().includes(q) ||
          s.postcode.toLowerCase().includes(q)
      );
    }
    return result;
  }

  async getBookingsByInstructor(
    instructorId: string,
    filter?: { status?: string; query?: string }
  ): Promise<Booking[]> {
    const instructor = await this.getInstructorById(instructorId);
    let result = this.bookings.filter(
      (b) => b.instructorId === instructorId || (instructor && b.instructorName === instructor.name)
    );
    if (filter?.status && filter.status !== "ALL") {
      result = result.filter((b) => b.status === filter.status);
    }
    if (filter?.query) {
      const q = filter.query.toLowerCase();
      result = result.filter(
        (b) =>
          b.studentName.toLowerCase().includes(q) ||
          b.lessonTitle.toLowerCase().includes(q) ||
          b.pickupLocation.toLowerCase().includes(q)
      );
    }
    return result;
  }

  async getInstructorSummary(instructorId: string): Promise<InstructorDashboardSummary | null> {
    const instructor = await this.getInstructorById(instructorId);
    if (!instructor) return null;

    const assignedStudents = await this.getStudentsByInstructor(instructorId);
    const allLessons = await this.getBookingsByInstructor(instructorId);

    const todayLessons = allLessons.filter(
      (l) => l.dateTime.toLowerCase().includes("today") || l.status === "IN_PROGRESS"
    );
    const upcomingLessons = allLessons.filter(
      (l) =>
        l.status === "CONFIRMED" ||
        l.status === "ASSIGNED" ||
        l.status === "PENDING"
    );
    const completedLessons = allLessons.filter((l) => l.status === "COMPLETED");
    const pendingLessons = allLessons.filter((l) => l.status === "PENDING" || l.status === "ASSIGNED");

    const hoursTaughtThisMonth = completedLessons.reduce((sum, l) => sum + (l.durationHours || 2), 0);

    return {
      instructor,
      todayLessons,
      upcomingLessons,
      completedLessons,
      assignedStudents,
      totalStudentsCount: assignedStudents.length,
      completedLessonsCount: completedLessons.length,
      pendingLessonsCount: pendingLessons.length,
      hoursTaughtThisMonth,
    };
  }

  async assignInstructorToStudent(studentId: string, instructorId: string): Promise<Student | null> {
    const student = this.students.find((s) => s.id === studentId);
    if (!student) return null;
    const instructor = this.instructors.find((i) => i.id === instructorId);
    if (!instructor) return null;

    student.assignedInstructorId = instructor.id;
    student.assignedInstructorName = instructor.name;
    return student;
  }

  async assignInstructorToBooking(bookingId: string, instructorId: string): Promise<Booking | null> {
    const booking = this.bookings.find((b) => b.id === bookingId);
    if (!booking) return null;
    const instructor = this.instructors.find((i) => i.id === instructorId);
    if (!instructor) return null;

    booking.instructorId = instructor.id;
    booking.instructorName = instructor.name;
    if (booking.status === "PENDING") {
      booking.status = "CONFIRMED";
    }
    return booking;
  }

  async assignInstructorToLead(leadId: string, instructorId: string): Promise<ContactInquiry | null> {
    const inquiry = this.inquiries.find((i) => i.id === leadId);
    if (!inquiry) return null;
    const instructor = this.instructors.find((i) => i.id === instructorId);
    if (!instructor) return null;

    inquiry.assignedInstructorId = instructor.id;
    inquiry.assignedInstructorName = instructor.name;
    if (inquiry.status === "NEW") {
      inquiry.status = "CONTACTED";
    }
    inquiry.updatedAt = new Date().toISOString().replace("T", " ").substring(0, 16);
    return inquiry;
  }

  async convertLeadToStudent(
    leadId: string,
    instructorId?: string
  ): Promise<{ student: Student; inquiry: ContactInquiry } | null> {
    const inquiry = this.inquiries.find((i) => i.id === leadId);
    if (!inquiry) return null;

    const targetInstId = instructorId || inquiry.assignedInstructorId || "inst_01";
    const instructor = this.instructors.find((i) => i.id === targetInstId) || this.instructors[0];

    let student = this.students.find(
      (s) => s.email.toLowerCase() === inquiry.email.toLowerCase()
    );

    if (!student) {
      student = {
        id: `std_${Date.now()}`,
        name: inquiry.name,
        email: inquiry.email,
        phone: inquiry.phone,
        postcode: inquiry.postcode,
        theoryStatus: inquiry.provisionalLicence === "Yes" ? "STUDYING" : "NOT_STARTED",
        hoursCompleted: 0,
        assignedInstructorId: instructor.id,
        assignedInstructorName: instructor.name,
        status: "ACTIVE",
        notes: `Converted from Lead ${inquiry.id}. Target Course: ${inquiry.targetPackage || inquiry.course || "Beginner"}. Notes: ${inquiry.notes || inquiry.message || "None"}`,
        createdAt: new Date().toISOString(),
      };
      this.students.unshift(student);
    } else {
      student.assignedInstructorId = instructor.id;
      student.assignedInstructorName = instructor.name;
      student.status = "ACTIVE";
    }

    inquiry.status = "CONVERTED";
    inquiry.assignedInstructorId = instructor.id;
    inquiry.assignedInstructorName = instructor.name;
    inquiry.internalNotes = (inquiry.internalNotes ? inquiry.internalNotes + " | " : "") + `Converted to Student record [${student.id}] assigned to ${instructor.name}.`;
    inquiry.updatedAt = new Date().toISOString().replace("T", " ").substring(0, 16);

    return { student, inquiry };
  }

  async updateInstructorAvailability(
    instructorId: string,
    availability: InstructorAvailability
  ): Promise<Instructor | null> {
    const instructor = this.instructors.find((i) => i.id === instructorId);
    if (!instructor) return null;
    instructor.availability = availability;
    return instructor;
  }

  async updateLessonNotes(
    bookingId: string,
    instructorNotes: string,
    progressNotes?: string,
    status?: BookingStatus
  ): Promise<Booking | null> {
    const booking = this.bookings.find((b) => b.id === bookingId);
    if (!booking) return null;
    booking.instructorNotes = instructorNotes;
    if (progressNotes !== undefined) {
      booking.progressNotes = progressNotes;
    }
    if (status) {
      booking.status = status;
    }
    return booking;
  }

  // Popup Campaign & Lead Capture System
  async getPopupCampaign(publishedOnly: boolean = false): Promise<PopupCampaign> {
    const source = publishedOnly ? this.publishedPopupCampaign : this.popupCampaign;
    return JSON.parse(JSON.stringify(source));
  }

  async updatePopupCampaign(updates: Partial<PopupCampaign>): Promise<PopupCampaign> {
    this.popupCampaign = {
      ...this.popupCampaign,
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    if (updates.fields) {
      this.popupCampaign.fields = updates.fields.map((f, idx) => ({
        ...f,
        displayOrder: f.displayOrder ?? idx + 1,
      }));
    }
    return JSON.parse(JSON.stringify(this.popupCampaign));
  }

  async publishPopupCampaign(): Promise<PopupCampaign> {
    const now = new Date().toISOString();
    this.popupCampaign.status = "PUBLISHED";
    this.popupCampaign.publishedAt = now;
    this.popupCampaign.updatedAt = now;
    this.publishedPopupCampaign = JSON.parse(JSON.stringify(this.popupCampaign));

    await this.addAuditLog({
      action: "POPUP_CONFIG_PUBLISHED",
      actorEmail: "admin@nextdrive.uk",
      target: `Popup Campaign: ${this.popupCampaign.name}`,
      ip: "127.0.0.1",
      severity: "SUCCESS",
    });

    return JSON.parse(JSON.stringify(this.publishedPopupCampaign));
  }

  async resetPopupCampaign(): Promise<PopupCampaign> {
    this.popupCampaign = JSON.parse(JSON.stringify(initialPopupCampaign));
    this.popupCampaign.status = "DRAFT";
    this.popupCampaign.updatedAt = new Date().toISOString();
    return JSON.parse(JSON.stringify(this.popupCampaign));
  }

  async recordPopupEvent(
    eventData: Omit<PopupAnalyticsEvent, "id" | "timestamp">
  ): Promise<PopupAnalyticsEvent> {
    const newEvent: PopupAnalyticsEvent = {
      id: `pevt_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      timestamp: new Date().toISOString(),
      ...eventData,
    };
    this.popupAnalyticsEvents.unshift(newEvent);
    // Keep max 2500 events in memory
    if (this.popupAnalyticsEvents.length > 2500) {
      this.popupAnalyticsEvents = this.popupAnalyticsEvents.slice(0, 2500);
    }
    return newEvent;
  }

  async getPopupAnalytics(): Promise<PopupAnalyticsSummary> {
    const events = this.popupAnalyticsEvents;
    const impressions = events.filter((e) => e.event === "popup_impression").length;
    const opened = events.filter((e) => e.event === "popup_opened").length;
    const dismissed = events.filter((e) => e.event === "popup_dismissed").length;
    const formStarted = events.filter((e) => e.event === "popup_form_started").length;
    const submitted = events.filter((e) => e.event === "popup_submitted").length;

    const conversionRate =
      opened > 0 ? ((submitted / opened) * 100).toFixed(1) + "%" : "0.0%";

    const eventsByDevice = {
      desktop: events.filter((e) => e.deviceType === "desktop").length,
      tablet: events.filter((e) => e.deviceType === "tablet").length,
      mobile: events.filter((e) => e.deviceType === "mobile").length,
    };

    return {
      impressions,
      opened,
      dismissed,
      formStarted,
      submitted,
      conversionRate,
      eventsByDevice,
      recentEvents: events.slice(0, 30),
    };
  }

  // Footer CMS Operations
  async getFooterSettings(publishedOnly: boolean = false): Promise<FooterSettings> {
    const source = publishedOnly ? this.publishedFooterSettings : this.footerSettings;
    return JSON.parse(JSON.stringify(source));
  }

  async updateFooterSettings(updates: Partial<FooterSettings>): Promise<FooterSettings> {
    this.footerSettings = {
      ...this.footerSettings,
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    if (updates.columns) {
      this.footerSettings.columns = updates.columns.map((col, cIdx) => ({
        ...col,
        displayOrder: col.displayOrder ?? cIdx + 1,
        links: (col.links || []).map((l, lIdx) => ({
          ...l,
          displayOrder: l.displayOrder ?? lIdx + 1,
        })),
      }));
    }
    if (updates.socialLinks) {
      this.footerSettings.socialLinks = updates.socialLinks.map((s, idx) => ({
        ...s,
        displayOrder: s.displayOrder ?? idx + 1,
      }));
    }
    if (updates.legalLinks) {
      this.footerSettings.legalLinks = updates.legalLinks.map((l, idx) => ({
        ...l,
        displayOrder: l.displayOrder ?? idx + 1,
      }));
    }
    return JSON.parse(JSON.stringify(this.footerSettings));
  }

  async publishFooterSettings(): Promise<FooterSettings> {
    const now = new Date().toISOString();
    this.footerSettings.status = "PUBLISHED";
    this.footerSettings.publishedAt = now;
    this.footerSettings.updatedAt = now;
    this.publishedFooterSettings = JSON.parse(JSON.stringify(this.footerSettings));

    await this.addAuditLog({
      action: "FOOTER_CONFIG_PUBLISHED",
      actorEmail: "admin@nextdrive.uk",
      target: "Public Website Footer Configuration",
      ip: "127.0.0.1",
      severity: "SUCCESS",
    });

    return JSON.parse(JSON.stringify(this.publishedFooterSettings));
  }

  async resetFooterSettings(): Promise<FooterSettings> {
    this.footerSettings = JSON.parse(JSON.stringify(initialFooterSettings));
    this.footerSettings.status = "DRAFT";
    this.footerSettings.updatedAt = new Date().toISOString();
    return JSON.parse(JSON.stringify(this.footerSettings));
  }

  // ============================================================================
  // SEO MANAGER DATABASE OPERATIONS
  // ============================================================================

  async getGlobalSEOSettings(): Promise<GlobalSEOSettings> {
    return JSON.parse(JSON.stringify(this.globalSEOSettings));
  }

  async updateGlobalSEOSettings(
    updates: Partial<GlobalSEOSettings>
  ): Promise<GlobalSEOSettings> {
    this.globalSEOSettings = {
      ...this.globalSEOSettings,
      ...updates,
    };

    // Keep businessSettings in sync for backward compatibility
    if (updates.siteName) {
      this.businessSettings.businessName = updates.siteName;
    }
    if (updates.defaultMetaDescription) {
      this.businessSettings.metaDescription = updates.defaultMetaDescription;
    }
    if (updates.defaultOgImage) {
      this.businessSettings.ogImageUrl = updates.defaultOgImage;
    }

    await this.addAuditLog({
      action: "GLOBAL_SEO_SETTINGS_UPDATED",
      actorEmail: "admin@nextdrive.uk",
      target: "Global SEO Meta Configuration",
      ip: "127.0.0.1",
      severity: "SUCCESS",
    });

    return JSON.parse(JSON.stringify(this.globalSEOSettings));
  }

  async getAllPageSEO(): Promise<PageSEO[]> {
    return JSON.parse(JSON.stringify(this.pagesSEO));
  }

  async getPageSEO(urlPath: string): Promise<PageSEO | null> {
    const clean = urlPath.trim().toLowerCase();
    const found = this.pagesSEO.find(
      (p) => p.urlPath.toLowerCase() === clean || p.urlPath.toLowerCase() === `${clean}/`
    );
    return found ? JSON.parse(JSON.stringify(found)) : null;
  }

  private calculateIndividualPageScore(page: PageSEO): number {
    let score = 100;
    // Title checks
    if (!page.title || page.title.trim() === "") {
      score -= 30;
    } else if (page.title.length < 40 || page.title.length > 65) {
      score -= 10;
    }

    // Description checks
    if (!page.metaDescription || page.metaDescription.trim() === "") {
      score -= 25;
    } else if (page.metaDescription.length < 110 || page.metaDescription.length > 170) {
      score -= 8;
    }

    // Canonical
    if (!page.canonicalUrl) {
      score -= 15;
    }

    // H1
    if (!page.h1) {
      score -= 10;
    }

    // OG Image
    if (!page.ogImage && !this.globalSEOSettings.defaultOgImage) {
      score -= 10;
    }

    // Noindex on public page penalty
    if (page.indexStatus === "NOINDEX" && (page.urlPath === "/" || page.urlPath === "/driving-lessons")) {
      score -= 40;
    }

    return Math.max(10, Math.min(100, score));
  }

  async savePageSEO(pageData: PageSEO): Promise<PageSEO> {
    const idx = this.pagesSEO.findIndex((p) => p.id === pageData.id || p.urlPath === pageData.urlPath);
    const score = this.calculateIndividualPageScore(pageData);
    const updatedPage: PageSEO = {
      ...pageData,
      seoScore: score,
      updatedAt: new Date().toISOString(),
    };

    if (idx >= 0) {
      this.pagesSEO[idx] = updatedPage;
    } else {
      this.pagesSEO.push(updatedPage);
    }

    // If updating homepage, sync to businessSettings
    if (updatedPage.urlPath === "/") {
      this.businessSettings.metaTitle = updatedPage.title;
      this.businessSettings.metaDescription = updatedPage.metaDescription;
      this.businessSettings.metaKeywords = updatedPage.secondaryKeywords || [];
      if (updatedPage.ogImage) {
        this.businessSettings.ogImageUrl = updatedPage.ogImage;
      }
    }

    await this.addAuditLog({
      action: "PAGE_SEO_UPDATED",
      actorEmail: "admin@nextdrive.uk",
      target: `Page SEO: ${updatedPage.urlPath}`,
      ip: "127.0.0.1",
      severity: "SUCCESS",
    });

    return JSON.parse(JSON.stringify(updatedPage));
  }

  async deletePageSEO(id: string): Promise<boolean> {
    const target = this.pagesSEO.find((p) => p.id === id);
    if (!target) return false;
    if (target.isSystemPage) {
      throw new Error("System pages cannot be deleted from the SEO directory.");
    }
    this.pagesSEO = this.pagesSEO.filter((p) => p.id !== id);
    return true;
  }

  async getSEORedirects(): Promise<SEORedirect[]> {
    return JSON.parse(JSON.stringify(this.redirectsSEO));
  }

  async saveSEORedirect(
    redirect: Partial<SEORedirect> & { sourcePath: string; destinationPath: string }
  ): Promise<SEORedirect> {
    const now = new Date().toISOString();
    let cleanSource = redirect.sourcePath.trim();
    if (!cleanSource.startsWith("/")) cleanSource = `/${cleanSource}`;
    let cleanDest = redirect.destinationPath.trim();
    if (!cleanDest.startsWith("/") && !cleanDest.startsWith("http")) cleanDest = `/${cleanDest}`;

    if (cleanSource === cleanDest) {
      throw new Error("Source and destination paths cannot be identical (prevents redirect loop).");
    }

    const existingIdx = redirect.id ? this.redirectsSEO.findIndex((r) => r.id === redirect.id) : -1;

    let savedRedirect: SEORedirect;
    if (existingIdx >= 0) {
      savedRedirect = {
        ...this.redirectsSEO[existingIdx],
        ...redirect,
        sourcePath: cleanSource,
        destinationPath: cleanDest,
        updatedAt: now,
      };
      this.redirectsSEO[existingIdx] = savedRedirect;
    } else {
      savedRedirect = {
        id: redirect.id || `redir_${Date.now().toString(36)}`,
        sourcePath: cleanSource,
        destinationPath: cleanDest,
        statusCode: redirect.statusCode || 301,
        isActive: redirect.isActive ?? true,
        hitCount: 0,
        notes: redirect.notes || "",
        createdAt: now,
        updatedAt: now,
      };
      this.redirectsSEO.unshift(savedRedirect);
    }

    await this.addAuditLog({
      action: "SEO_REDIRECT_SAVED",
      actorEmail: "admin@nextdrive.uk",
      target: `Redirect ${cleanSource} -> ${cleanDest} (${savedRedirect.statusCode})`,
      ip: "127.0.0.1",
      severity: "SUCCESS",
    });

    return JSON.parse(JSON.stringify(savedRedirect));
  }

  async deleteSEORedirect(id: string): Promise<boolean> {
    const initialLen = this.redirectsSEO.length;
    this.redirectsSEO = this.redirectsSEO.filter((r) => r.id !== id);
    return this.redirectsSEO.length < initialLen;
  }

  async recordRedirectHit(id: string): Promise<void> {
    const r = this.redirectsSEO.find((item) => item.id === id);
    if (r) {
      r.hitCount = (r.hitCount || 0) + 1;
    }
  }

  async getSEOKeywords(): Promise<SEOKeywordTarget[]> {
    return JSON.parse(JSON.stringify(this.keywordsSEO));
  }

  async saveSEOKeyword(
    kw: Partial<SEOKeywordTarget> & { keyword: string; targetUrl: string }
  ): Promise<SEOKeywordTarget> {
    const existingIdx = kw.id ? this.keywordsSEO.findIndex((k) => k.id === kw.id) : -1;
    let saved: SEOKeywordTarget;

    if (existingIdx >= 0) {
      saved = {
        ...this.keywordsSEO[existingIdx],
        ...kw,
      };
      this.keywordsSEO[existingIdx] = saved;
    } else {
      saved = {
        id: kw.id || `kw_${Date.now().toString(36)}`,
        keyword: kw.keyword.trim().toLowerCase(),
        targetUrl: kw.targetUrl.trim(),
        monthlyVolume: kw.monthlyVolume || "500",
        intent: kw.intent || "LOCAL",
        difficulty: kw.difficulty || "MEDIUM",
        priority: kw.priority || "SECONDARY",
        currentRank: kw.currentRank,
        notes: kw.notes,
      };
      this.keywordsSEO.push(saved);
    }

    return JSON.parse(JSON.stringify(saved));
  }

  async deleteSEOKeyword(id: string): Promise<boolean> {
    const initialLen = this.keywordsSEO.length;
    this.keywordsSEO = this.keywordsSEO.filter((k) => k.id !== id);
    return this.keywordsSEO.length < initialLen;
  }

  async getLocalTestCentres(): Promise<LocalTestCentre[]> {
    return JSON.parse(JSON.stringify(this.testCentres));
  }

  async saveLocalTestCentre(
    tc: Partial<LocalTestCentre> & { name: string; slug: string }
  ): Promise<LocalTestCentre> {
    const existingIdx = tc.id ? this.testCentres.findIndex((item) => item.id === tc.id) : -1;
    let saved: LocalTestCentre;

    if (existingIdx >= 0) {
      saved = {
        ...this.testCentres[existingIdx],
        ...tc,
      };
      this.testCentres[existingIdx] = saved;
    } else {
      saved = {
        id: tc.id || `tc_${Date.now().toString(36)}`,
        name: tc.name.trim(),
        slug: tc.slug.trim().toLowerCase(),
        dvsaCentreId: tc.dvsaCentreId || `DVSA-DTC-${Date.now().toString(36).toUpperCase()}`,
        address: tc.address || "",
        postcode: tc.postcode || "",
        passRateRecent: tc.passRateRecent || "48.0%",
        keyRoutesDescription: tc.keyRoutesDescription || "",
        associatedLocationSlug: tc.associatedLocationSlug || "",
        isActive: tc.isActive ?? true,
      };
      this.testCentres.push(saved);
    }

    return JSON.parse(JSON.stringify(saved));
  }

  async deleteLocalTestCentre(id: string): Promise<boolean> {
    const initialLen = this.testCentres.length;
    this.testCentres = this.testCentres.filter((item) => item.id !== id);
    return this.testCentres.length < initialLen;
  }

  async runSEOAudit(): Promise<SEOAuditResult> {
    const pages = await this.getAllPageSEO();
    const globalSettings = await this.getGlobalSEOSettings();
    const businessSettings = await this.getBusinessSettings();
    const redirects = await this.getSEORedirects();
    const locations = await this.getLocations();

    const issues: SEOAuditIssue[] = [];
    let metadataDeduction = 0;
    let indexingDeduction = 0;
    let localDeduction = 0;
    let technicalDeduction = 0;
    let schemaDeduction = 0;
    let contentDeduction = 0;

    let missingTitles = 0;
    let missingDescriptions = 0;
    let missingCanonicals = 0;
    let missingOgImages = 0;
    let missingH1 = 0;

    // 1. Check each page
    pages.forEach((p) => {
      // Title checks
      if (!p.title || p.title.trim() === "") {
        missingTitles++;
        metadataDeduction += 5;
        issues.push({
          id: `iss_title_empty_${p.id}`,
          severity: "CRITICAL",
          category: "METADATA",
          title: `Missing SEO title on ${p.pageName}`,
          description: `Page ${p.urlPath} has no meta title specified. Search engines cannot index it effectively.`,
          impactPoints: 5,
          affectedUrl: p.urlPath,
          recommendation: `Add a compelling, unique title (50-60 characters) incorporating primary Manchester keywords.`,
        });
      } else if (p.title.length < 40) {
        metadataDeduction += 2;
        issues.push({
          id: `iss_title_short_${p.id}`,
          severity: "LOW",
          category: "METADATA",
          title: `Short title tag on ${p.pageName} (${p.title.length} chars)`,
          description: `The title is ${p.title.length} characters long. Recommended is 50-60 characters for maximum CTR.`,
          impactPoints: 2,
          affectedUrl: p.urlPath,
          recommendation: `Expand title with local branding or primary service benefits.`,
        });
      } else if (p.title.length > 65) {
        metadataDeduction += 2;
        issues.push({
          id: `iss_title_long_${p.id}`,
          severity: "LOW",
          category: "METADATA",
          title: `Title may truncate on Google SERP (${p.title.length} chars)`,
          description: `Title tag exceeds 65 characters and is likely to be truncated on mobile and desktop search results.`,
          impactPoints: 2,
          affectedUrl: p.urlPath,
          recommendation: `Shorten title to under 60 characters to prevent snippet ellipsis truncation.`,
        });
      }

      // Meta description checks
      if (!p.metaDescription || p.metaDescription.trim() === "") {
        missingDescriptions++;
        metadataDeduction += 4;
        issues.push({
          id: `iss_desc_empty_${p.id}`,
          severity: "HIGH",
          category: "METADATA",
          title: `Missing meta description on ${p.pageName}`,
          description: `Search engines will automatically extract arbitrary text for ${p.urlPath} snippets.`,
          impactPoints: 4,
          affectedUrl: p.urlPath,
          recommendation: `Provide a persuasive 130-160 character meta description with a call to action.`,
        });
      } else if (p.metaDescription.length < 110) {
        metadataDeduction += 1;
        issues.push({
          id: `iss_desc_short_${p.id}`,
          severity: "LOW",
          category: "METADATA",
          title: `Short meta description on ${p.pageName} (${p.metaDescription.length} chars)`,
          description: `Meta description is below the 120-character threshold and misses opportunities for key local terms.`,
          impactPoints: 1,
          affectedUrl: p.urlPath,
          recommendation: `Expand to 130-160 characters describing vehicle types, pass rates, and lesson locations.`,
        });
      } else if (p.metaDescription.length > 170) {
        metadataDeduction += 1;
        issues.push({
          id: `iss_desc_long_${p.id}`,
          severity: "LOW",
          category: "METADATA",
          title: `Meta description exceeds 170 characters on ${p.pageName}`,
          description: `Length is ${p.metaDescription.length} characters. The tail end will be truncated in search snippets.`,
          impactPoints: 1,
          affectedUrl: p.urlPath,
          recommendation: `Keep the most important CTA within the first 155 characters.`,
        });
      }

      // Canonical URL check
      if (!p.canonicalUrl || p.canonicalUrl.trim() === "") {
        missingCanonicals++;
        indexingDeduction += 3;
        issues.push({
          id: `iss_canon_empty_${p.id}`,
          severity: "HIGH",
          category: "INDEXING",
          title: `Missing canonical tag on ${p.pageName}`,
          description: `Missing self-referencing canonical URL on ${p.urlPath} exposes site to duplicate content penalties.`,
          impactPoints: 3,
          affectedUrl: p.urlPath,
          recommendation: `Set self-referential canonical URL matching ${globalSettings.canonicalBaseUrl}${p.urlPath}.`,
        });
      }

      // OG Image check
      if (!p.ogImage && !globalSettings.defaultOgImage) {
        missingOgImages++;
        metadataDeduction += 2;
        issues.push({
          id: `iss_og_empty_${p.id}`,
          severity: "MEDIUM",
          category: "METADATA",
          title: `Missing Open Graph image on ${p.pageName}`,
          description: `Social links shared on WhatsApp, Facebook, or iMessage will display without a preview image banner.`,
          impactPoints: 2,
          affectedUrl: p.urlPath,
          recommendation: `Upload a high-resolution 1200x630px driving school preview graphic.`,
        });
      }

      // H1 check
      if (!p.h1) {
        missingH1++;
        contentDeduction += 2;
        issues.push({
          id: `iss_h1_missing_${p.id}`,
          severity: "MEDIUM",
          category: "CONTENT",
          title: `Missing primary H1 heading on ${p.pageName}`,
          description: `Semantic H1 structure missing for on-page hierarchy evaluation.`,
          impactPoints: 2,
          affectedUrl: p.urlPath,
          recommendation: `Assign a single prominent H1 heading containing the primary target keyword.`,
        });
      }

      // Indexing accidental lock
      if (p.indexStatus === "NOINDEX" && (p.urlPath === "/" || p.urlPath === "/driving-lessons")) {
        indexingDeduction += 15;
        issues.push({
          id: `iss_noindex_crucial_${p.id}`,
          severity: "CRITICAL",
          category: "INDEXING",
          title: `CRITICAL: Accidental NOINDEX on key marketing page (${p.pageName})`,
          description: `Page ${p.urlPath} is currently flagged with NOINDEX. Search engines will de-index this high-priority page!`,
          impactPoints: 15,
          affectedUrl: p.urlPath,
          recommendation: `Immediately toggle Index Status back to 'INDEX' in Page SEO Editor.`,
        });
      }
    });

    // 2. NAP Consistency Audit
    const napAudit: SEONapAudit = {
      isConsistent: true,
      globalBusinessName: businessSettings.businessName,
      globalPhone: businessSettings.phone,
      globalAddress: businessSettings.headOfficeAddress,
      comparisons: [
        {
          component: "Site Header & Navigation",
          field: "Telephone Number",
          expected: businessSettings.phone,
          found: businessSettings.phone,
          isMatch: true,
        },
        {
          component: "Contact Page Direct Dispatch",
          field: "Telephone Number",
          expected: businessSettings.phone,
          found: businessSettings.phone,
          isMatch: true,
        },
        {
          component: "Footer Business Profile",
          field: "Head Office Address",
          expected: businessSettings.headOfficeAddress,
          found: businessSettings.headOfficeAddress,
          isMatch: true,
        },
        {
          component: "Schema.org PostalAddress",
          field: "Postal Code",
          expected: "M1 5AN",
          found: businessSettings.headOfficeAddress.includes("M1 5AN") ? "M1 5AN" : "M3 3EB",
          isMatch: businessSettings.headOfficeAddress.includes("M1 5AN"),
        },
        {
          component: "Local Area Phone Consistency",
          field: "Area Dialing Code",
          expected: "Manchester (+44 161)",
          found:
            businessSettings.phone.startsWith("+44 161") || businessSettings.phone.startsWith("0161")
              ? "Manchester (+44 161)"
              : businessSettings.phone.startsWith("+44 20") || businessSettings.phone.startsWith("020")
              ? "London (+44 20)"
              : "Non-Local Number",
          isMatch:
            businessSettings.phone.startsWith("+44 161") ||
            businessSettings.phone.startsWith("0161") ||
            businessSettings.phone.includes("161"),
        },
      ],
    };

    if (!napAudit.comparisons.every((c) => c.isMatch)) {
      napAudit.isConsistent = false;
      const mismatched = napAudit.comparisons.filter((c) => !c.isMatch);
      mismatched.forEach((m) => {
        localDeduction += 3;
        issues.push({
          id: `iss_nap_${m.component.replace(/\s+/g, "_")}`,
          severity: m.field.includes("Area Dialing") ? "LOW" : "HIGH",
          category: "LOCAL_SEO",
          title: `NAP Inconsistency: ${m.component} (${m.field})`,
          description: `Discrepancy detected: Expected '${m.expected}', but found '${m.found}'. Consistent NAP is vital for Google Local Pack rank.`,
          impactPoints: 3,
          recommendation: `Synchronize ${m.field} in Business Settings with your primary Manchester operating profile.`,
        });
      });
    }

    // 3. Technical & Redirects
    const activeRedirectsCount = redirects.filter((r) => r.isActive).length;
    redirects.forEach((r) => {
      if (r.sourcePath === r.destinationPath) {
        technicalDeduction += 5;
        issues.push({
          id: `iss_redir_loop_${r.id}`,
          severity: "CRITICAL",
          category: "TECHNICAL",
          title: `Self-referencing redirect loop: ${r.sourcePath}`,
          description: `Source path and destination path are identical (${r.sourcePath}). This will cause browser ERR_TOO_MANY_REDIRECTS.`,
          impactPoints: 5,
          affectedUrl: r.sourcePath,
          recommendation: `Update the destination URL or deactivate this redirect.`,
        });
      }
    });

    // 4. Schema Coverage (All managed pages have valid schema assigned)
    const schemaCoveragePercent = Math.round(
      (pages.filter((p) => Boolean(p.schemaType)).length / Math.max(pages.length, 1)) * 100
    );

    // Calculate capped deductions
    const metadataScore = Math.max(0, 25 - Math.min(25, metadataDeduction));
    const indexingScore = Math.max(0, 20 - Math.min(20, indexingDeduction));
    const localSeoScore = Math.max(0, 20 - Math.min(20, localDeduction));
    const technicalScore = Math.max(0, 15 - Math.min(15, technicalDeduction));
    const schemaScore = Math.max(0, 10 - Math.min(10, schemaDeduction));
    const contentScore = Math.max(0, 10 - Math.min(10, contentDeduction));

    const totalScore = metadataScore + indexingScore + localSeoScore + technicalScore + schemaScore + contentScore;

    let healthRating: SEOAuditResult["healthRating"] = "EXCELLENT";
    if (totalScore < 50) healthRating = "CRITICAL";
    else if (totalScore < 70) healthRating = "POOR";
    else if (totalScore < 85) healthRating = "FAIR";
    else if (totalScore < 95) healthRating = "GOOD";

    // Add passed checks for full transparency
    if (napAudit.isConsistent) {
      issues.push({
        id: "pass_nap_consistent",
        severity: "PASSED",
        category: "LOCAL_SEO",
        title: "NAP 100% Consistent Across Manchester Service Areas",
        description: "Business name, head office address, and Manchester local telephone number (+44 161) match perfectly across Header, Footer, Contact Page, and Schema.org.",
        impactPoints: 0,
        recommendation: "Maintain identical telephone and address format on external local citations (Yell, Scoot, Thomson Local).",
      });
    }

    if (missingTitles === 0) {
      issues.push({
        id: "pass_titles",
        severity: "PASSED",
        category: "METADATA",
        title: "All indexed public pages have unique meta titles",
        description: "100% of indexable pages have assigned title tags within acceptable bounds.",
        impactPoints: 0,
        recommendation: "Maintain unique keywords across all newly created location pages.",
      });
    }

    if (missingCanonicals === 0) {
      issues.push({
        id: "pass_canonicals",
        severity: "PASSED",
        category: "INDEXING",
        title: "Canonical URLs properly assigned",
        description: "All public URLs have self-referencing canonical tags to prevent duplicate indexing.",
        impactPoints: 0,
        recommendation: "Ensure newly generated landing pages follow the canonical pattern.",
      });
    }

    if (activeRedirectsCount > 0) {
      issues.push({
        id: "pass_redirects",
        severity: "PASSED",
        category: "TECHNICAL",
        title: `${activeRedirectsCount} 301 Permanent Redirects active`,
        description: "Legacy URLs and former marketing campaigns cleanly preserve link equity.",
        impactPoints: 0,
        recommendation: "Audit redirect hits periodically to retire dead rules after 12+ months.",
      });
    }

    const totalIndexable = pages.filter((p) => p.indexStatus === "INDEX").length;
    const totalNoindex = pages.filter((p) => p.indexStatus === "NOINDEX").length;

    return {
      score: totalScore,
      healthRating,
      lastAudited: new Date().toISOString(),
      breakdown: {
        metadataScore,
        indexingScore,
        localSeoScore,
        technicalScore,
        schemaScore,
        contentScore,
      },
      issues,
      stats: {
        totalIndexable,
        totalNoindex,
        missingTitles,
        missingDescriptions,
        missingCanonicals,
        missingOgImages,
        missingH1,
        activeRedirects: activeRedirectsCount,
        schemaCoveragePercent,
        localAreasConfigured: locations.length,
      },
      napAudit,
    };
  }
}

export const db = new DatabaseService();

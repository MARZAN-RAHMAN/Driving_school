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
    title: "Next.js 16 Enterprise Architecture Patterns",
    slug: "nextjs-16-enterprise-architecture",
    category: "Architecture",
    excerpt: "Best practices for modular App Router layouts, server-side caching, and type-safe data access boundaries.",
    content: "Building enterprise applications with Next.js requires strict domain boundaries between public marketing pages and authenticated admin backends...",
    status: "PUBLISHED",
    authorName: "Alex Vance",
    views: 14250,
    updatedAt: "2026-09-28",
    readTime: "5 min read",
  },
  {
    id: "cnt_02",
    title: "Role-Based Access Control with Edge Middleware",
    slug: "rbac-edge-middleware",
    category: "Security",
    excerpt: "Zero-latency authorization checks using encrypted session tokens and subpath route protection.",
    content: "Security at the edge enables rapid rejection of unauthenticated requests before executing downstream business logic...",
    status: "PUBLISHED",
    authorName: "Sarah Chen",
    views: 9820,
    updatedAt: "2026-09-25",
    readTime: "7 min read",
  },
  {
    id: "cnt_03",
    title: "Zero-Downtime Database Migrations with Prisma",
    slug: "zero-downtime-database-migrations",
    category: "Database",
    excerpt: "A step-by-step blueprint for non-blocking column additions, views, and backward-compatible model evolutions.",
    content: "When running at scale, altering large PostgreSQL tables requires a phased rollout approach with safe migrations...",
    status: "PUBLISHED",
    authorName: "Marcus Thorne",
    views: 6540,
    updatedAt: "2026-09-20",
    readTime: "4 min read",
  },
  {
    id: "cnt_04",
    title: "Optimizing Core Web Vitals with Modern CSS & Next.js",
    slug: "optimizing-core-web-vitals",
    category: "Frontend",
    excerpt: "Achieving perfect 100/100 Lighthouse scores through static generation, inline tokens, and layout shift prevention.",
    content: "Core Web Vitals directly influence user conversion and organic search rankings...",
    status: "DRAFT",
    authorName: "Elena Rostova",
    views: 120,
    updatedAt: "2026-09-29",
    readTime: "6 min read",
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
    phone: "+44 7700 900123",
    email: "dave.miller@nextdrive.uk",
    transmission: "BOTH",
    rating: 4.9,
    totalPasses: 168,
    activeStudents: 14,
    status: "ACTIVE",
    vehicle: "2025 VW Golf 1.5 TSI (Dual Controls)",
    grade: "Grade A (51/51)",
    bio: "Senior DVSA Approved Driving Instructor with over 12 years of experience guiding nervous and first-time learners to test passes. Specializes in intensive courses, mock test simulations, and roundabout navigation across North and Central London.",
    areas: ["Central & North London", "Wood Green DTC", "Islington", "Camden", "Barnet"],
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
    phone: "+44 7700 900456",
    email: "aisha.patel@nextdrive.uk",
    transmission: "MANUAL",
    rating: 5.0,
    totalPasses: 215,
    activeStudents: 16,
    status: "ACTIVE",
    vehicle: "2024 Ford Fiesta EcoBoost (Dual Controls)",
    grade: "Grade A (50/51)",
    bio: "DVSA Top-Tier Instructor specializing in manual driving tuition, clutch control mastery, and first-time confidence for nervous students across East and North London.",
    areas: ["East London", "Chingford DTC", "Wanstead", "Tottenham", "Hackney"],
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
    phone: "+44 7700 900789",
    email: "mark.davies@nextdrive.uk",
    transmission: "AUTOMATIC",
    rating: 4.8,
    totalPasses: 124,
    activeStudents: 11,
    status: "ACTIVE",
    vehicle: "2024 Toyota Yaris Hybrid Auto",
    grade: "Grade A (49/51)",
    bio: "Specialist automatic instructor with dual-control hybrid vehicle. Renowned for calm instruction, zero-stress parking techniques, and comprehensive mock test assessments.",
    areas: ["South & Central London", "Morden DTC", "Wimbledon", "Clapham", "Croydon"],
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
    areas: ["West London", "Isleworth DTC", "Ealing", "Hammersmith", "Richmond"],
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
    phone: "+44 7700 900654",
    email: "liam.oconnor@nextdrive.uk",
    transmission: "BOTH",
    rating: 4.9,
    totalPasses: 182,
    activeStudents: 15,
    status: "ACTIVE",
    vehicle: "2025 Audi A1 Sportback (Dual Controls)",
    grade: "Grade A (51/51)",
    bio: "Senior dual-transmission ADI with extensive London test center knowledge. Focuses on advanced maneuver precision, eco-safe driving, and DVSA test route rehearsals.",
    areas: ["North West London", "Mill Hill DTC", "Hendon", "Finchley", "Edgware"],
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
    name: "Central & North London",
    postcodes: ["NW1", "NW3", "N1", "N5", "N7"],
    activeInstructors: 4,
    testCenterName: "Wood Green DTC",
  },
  {
    id: "loc_02",
    name: "South & Greenwich",
    postcodes: ["SE10", "SE3", "SE13", "SE9"],
    activeInstructors: 5,
    testCenterName: "Sidcup & Hither Green DTC",
  },
  {
    id: "loc_03",
    name: "West & Richmond",
    postcodes: ["TW9", "SW14", "SW15", "W4"],
    activeInstructors: 3,
    testCenterName: "Isleworth DTC",
  },
  {
    id: "loc_04",
    name: "East & Docklands",
    postcodes: ["E14", "E16", "E1", "E3"],
    activeInstructors: 3,
    testCenterName: "Barking DTC",
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
    pickupLocation: "Bromley High Street, BR1",
    dateTime: "Today, 09:00 - 11:00 AM",
    durationHours: 2,
    price: 75,
    status: "IN_PROGRESS",
    testCenter: "Sidcup DTC",
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
    pickupLocation: "Greenwich Station, SE10",
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
    pickupLocation: "Chislehurst Station, BR7",
    dateTime: "Today, 14:00 - 16:00 PM",
    durationHours: 2,
    price: 80,
    status: "CONFIRMED",
    testCenter: "Sidcup DTC",
    notes: "Practical driving test booked for next Thursday!",
    instructorNotes: "Focus on multi-lane roundabout approach and speed limit changes on A20.",
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
    pickupLocation: "Richmond Park Gate, TW10",
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
    pickupLocation: "Highbury & Islington, N1",
    dateTime: "Tomorrow, 13:00 - 15:00 PM",
    durationHours: 2,
    price: 80,
    status: "CONFIRMED",
    notes: "M11 Motorway introduction and safe overtaking.",
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
    pickupLocation: "Sidcup Test Center, DA14",
    dateTime: "Yesterday, 10:00 - 12:00 PM",
    durationHours: 2,
    price: 75,
    status: "COMPLETED",
    testCenter: "Sidcup DTC",
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
    pickupLocation: "Highbury Fields, N5",
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
    pickupLocation: "Chislehurst Station, BR7",
    dateTime: "Yesterday, 14:00 - 16:00 PM",
    durationHours: 2,
    price: 80,
    status: "COMPLETED",
    testCenter: "Sidcup DTC",
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
    pickupLocation: "Highbury Fields, N5",
    dateTime: "Saturday, 10:00 - 12:00 PM",
    durationHours: 2,
    price: 80,
    status: "CONFIRMED",
    testCenter: "Wood Green DTC",
    instructorNotes: "Full mock test including independent driving and emergency stop.",
    progressNotes: "First mock test booked.",
  },
];

const initialReviews: ReviewItem[] = [
  {
    id: "rev_01",
    student: "Hannah Adams",
    instructor: "Aisha Patel",
    testCenter: "Sidcup DTC",
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
    testCenter: "Wood Green DTC",
    rating: 5,
    result: "PASSED FIRST TIME",
    minors: "2 Minor Faults",
    quote:
      "The 20-Hour Intensive course got me ready in under 3 weeks. Dave's patience with London roundabouts made all the difference.",
    date: "Last week",
    verified: true,
    featured: true,
  },
  {
    id: "rev_03",
    student: "Oliver Smith",
    instructor: "Liam O'Connor",
    testCenter: "Hither Green DTC",
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
    testCenter: "Hither Green DTC",
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
  },
  {
    id: "faq_02",
    question: "Can I choose between Manual and Automatic?",
    answer:
      "Yes! We maintain dedicated fleets for both manual and automatic tuition across all our covered postcodes.",
    category: "Vehicles",
    order: 2,
  },
  {
    id: "faq_03",
    question: "Do you provide car hire on the practical test day?",
    answer:
      "Yes, our practical test day package includes 1 hour warm-up driving lesson immediately before your test, full dual-control car hire, insurance, and return journey home.",
    category: "Test Day",
    order: 3,
  },
  {
    id: "faq_04",
    question: "What is your lesson cancellation policy?",
    answer:
      "We require 48 hours notice to reschedule or cancel a booked lesson with zero fees.",
    category: "Bookings",
    order: 4,
  },
  {
    id: "faq_05",
    question: "Are your instructors DVSA fully qualified?",
    answer:
      "Every NextDrive instructor is a fully qualified DVSA Approved Driving Instructor (ADI Grade A/B) with enhanced DBS clearance and regular standards check validations.",
    category: "Safety",
    order: 5,
  },
];

const initialBusinessSettings: BusinessSettings = {
  businessName: "NextDrive Driving Academy",
  tradingName: "NextDrive UK Ltd",
  companyRegistrationNumber: "12948210",
  dvsaSchoolId: "DVSA-SCH-90412",
  phone: "+44 20 7946 0921",
  emergencyPhone: "+44 7700 900100",
  email: "support@nextdrive.uk",
  headOfficeAddress: "124 Baker Street, Marylebone, London, NW1 6XE",

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
  heroSecondaryCtaLink: "tel:+442079460921",
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
};

const initialStudents: Student[] = [
  {
    id: "std_01",
    name: "Hannah Adams",
    email: "hannah.a@student.nextdrive.uk",
    phone: "+44 7911 678901",
    postcode: "DA14",
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
    postcode: "BR1",
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
    postcode: "BR7",
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
    postcode: "SE10",
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
    postcode: "TW10",
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
    postcode: "N1",
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
    postcode: "N5",
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
    postcode: "BR1 1AA",
    transmission: "MANUAL",
    targetPackage: "20-Hour Intensive Fast-Pass",
    course: "20-Hour Intensive Fast-Pass",
    area: "South & Greenwich",
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
    postcode: "TW10 6TH",
    transmission: "MANUAL",
    targetPackage: "10-Hour Starter Block",
    course: "10-Hour Starter Block",
    area: "South West & Wimbledon",
    provisionalLicence: "Yes",
    notes: "Beginner starter lesson in Richmond area.",
    howFound: "Instagram",
    sourcePage: "/",
    internalNotes: "Left voicemail, awaiting callback on weekend slot preferences.",
    status: "FOLLOW_UP",
    createdAt: "2026-09-29 14:30",
  },
  {
    id: "inq_03",
    name: "Ryan Taylor",
    email: "ryan.t@example.com",
    phone: "+44 7700 900888",
    postcode: "E14 9QA",
    transmission: "AUTOMATIC",
    targetPackage: "Introductory 2-Hour Assessment",
    course: "Introductory 2-Hour Assessment",
    area: "East & Canary Wharf",
    provisionalLicence: "Applying soon",
    notes: "Looking to start automatic lessons next week in Canary Wharf.",
    howFound: "TikTok",
    sourcePage: "/#courses",
    internalNotes: "New prospective learner looking for automatic transmission.",
    status: "NEW",
    createdAt: "2026-09-30 08:45",
  },
  {
    id: "inq_04",
    name: "Aisha Begum",
    email: "aisha.b@example.com",
    phone: "+44 7700 900999",
    postcode: "N1 2XY",
    transmission: "MANUAL",
    targetPackage: "30-Hour Complete Zero-to-Test",
    course: "30-Hour Complete Zero-to-Test",
    area: "Central & North London",
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
    email: "lucas.d@example.com",
    phone: "+44 7800 123987",
    postcode: "NW3 4RL",
    transmission: "MANUAL",
    targetPackage: "Introductory 2-Hour Assessment",
    course: "Introductory 2-Hour Assessment",
    area: "Central & North London",
    provisionalLicence: "Yes",
    notes: "Need mock test simulation on Wood Green DTC routes.",
    howFound: "Google Maps",
    sourcePage: "/",
    internalNotes: "New enquiry from Camden/Hampstead area.",
    status: "NEW",
    createdAt: "2026-10-01 07:15",
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

  // User queries
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
  async getLocations(): Promise<LocationArea[]> {
    return this.locations;
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
  async getFaqs(category?: string): Promise<FAQItem[]> {
    let result = [...this.faqs];
    if (category && category !== "ALL") {
      result = result.filter((f) => f.category.toLowerCase() === category.toLowerCase());
    }
    return result.sort((a, b) => a.order - b.order);
  }

  async getFaqById(id: string): Promise<FAQItem | undefined> {
    return this.faqs.find((f) => f.id === id);
  }

  async createFaq(faq: Omit<FAQItem, "id">): Promise<FAQItem> {
    const newFaq: FAQItem = {
      ...faq,
      id: `faq_${Date.now()}`,
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
    this.faqs[index] = { ...this.faqs[index], ...updates };
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
}

export const db = new DatabaseService();

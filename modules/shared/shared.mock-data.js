// @ts-check

/**
 * Mock data for development
 * This file contains mock responses for inquiries and inputs
 */

// ============================================
// INQUIRY MOCK DATA
// ============================================

export const mockInquiries = [
	{
		id: "inq-1",
		title: "Lab Equipment Feedback - Fall 2024",
		description:
			"Share your experience with the computer lab facilities and equipment. Help us improve the infrastructure for better learning outcomes.",
		status: "ACTIVE",
		targetDepartments: ["Computer Science", "Software Engineering"],
		targetPrograms: ["BS Computer Science", "BS Software Engineering"],
		targetSemesters: ["5", "6", "7", "8"],
		startDate: "2024-11-01T00:00:00Z",
		endDate: "2024-12-31T23:59:59Z",
		totalInputs: 156,
		createdAt: "2024-10-15T10:00:00Z",
		updatedAt: "2024-11-04T08:30:00Z",
		createdBy: "admin@kfueit.edu.pk",
	},
	{
		id: "inq-2",
		title: "Course Content Evaluation - AI & ML",
		description:
			"Provide feedback on the AI and Machine Learning course content, teaching methodology, and practical assignments.",
		status: "ACTIVE",
		targetDepartments: ["Computer Science"],
		targetPrograms: ["BS Computer Science"],
		targetSemesters: ["7", "8"],
		startDate: "2024-10-15T00:00:00Z",
		endDate: "2024-11-30T23:59:59Z",
		totalInputs: 89,
		createdAt: "2024-10-10T14:20:00Z",
		updatedAt: "2024-11-03T16:45:00Z",
		createdBy: "admin@kfueit.edu.pk",
	},
	{
		id: "inq-3",
		title: "Library Resources Survey",
		description:
			"Help us understand your needs regarding library resources, study spaces, and digital collections.",
		status: "ACTIVE",
		targetDepartments: [],
		targetPrograms: [],
		targetSemesters: [],
		startDate: "2024-11-01T00:00:00Z",
		endDate: "2025-01-31T23:59:59Z",
		totalInputs: 234,
		createdAt: "2024-10-20T09:15:00Z",
		updatedAt: "2024-11-04T11:20:00Z",
		createdBy: "admin@kfueit.edu.pk",
	},
	{
		id: "inq-4",
		title: "Examination System Review",
		description:
			"Share your thoughts on the current examination and assessment system.",
		status: "DRAFT",
		targetDepartments: [],
		targetPrograms: [],
		targetSemesters: [],
		startDate: "2024-12-01T00:00:00Z",
		endDate: "2024-12-15T23:59:59Z",
		totalInputs: 0,
		createdAt: "2024-10-25T13:00:00Z",
		updatedAt: "2024-10-25T13:00:00Z",
		createdBy: "admin@kfueit.edu.pk",
	},
	{
		id: "inq-5",
		title: "Campus Facilities Spring 2024",
		description:
			"Feedback on campus facilities including cafeteria, sports, and common areas.",
		status: "CLOSED",
		targetDepartments: [],
		targetPrograms: [],
		targetSemesters: [],
		startDate: "2024-03-01T00:00:00Z",
		endDate: "2024-05-31T23:59:59Z",
		totalInputs: 567,
		createdAt: "2024-02-15T10:00:00Z",
		updatedAt: "2024-06-01T09:00:00Z",
		createdBy: "admin@kfueit.edu.pk",
	},
];

// ============================================
// INPUT MOCK DATA
// ============================================

export const mockInputs = [
	{
		id: "inp-1",
		body: "The computers in the programming lab are extremely outdated and slow. When we try to run Android Studio or any modern IDE, they freeze constantly. It takes 10-15 minutes just to compile a simple project. This is seriously affecting our ability to complete assignments on time, especially for the Mobile App Development course.",
		type: "INQUIRY_LINKED",
		inquiryId: "inq-1",
		inquiryTitle: "Lab Equipment Feedback - Fall 2024",
		studentId: "usr-123",
		department: "Computer Science",
		program: "BS Computer Science",
		semester: "5",
		aiAnalysis: {
			theme: "Lab Equipment & Infrastructure",
			sentiment: "NEGATIVE",
			importance: "HIGH",
			summary:
				"Student reports severely outdated lab computers causing significant compilation delays and affecting coursework completion.",
			detailedInsight:
				"The feedback highlights critical infrastructure issues in the programming lab. Outdated hardware is preventing students from effectively using modern development tools like Android Studio, with compilation times reaching 10-15 minutes. This directly impacts the Mobile App Development course and students' ability to complete assignments on time. The issue affects practical learning outcomes and student productivity.",
			actionableItems: [
				"Upgrade lab computers to support modern IDEs (Android Studio, Visual Studio, etc.)",
				"Prioritize Mobile App Development lab with higher-spec machines",
				"Consider phased hardware refresh across all programming labs",
			],
		},
		status: "PROCESSED",
		createdAt: "2024-11-04T10:30:00Z",
	},
	{
		id: "inp-2",
		body: "Dr. Ahmed's teaching methodology in the Database Systems course is excellent. He explains complex concepts with real-world examples and always encourages class participation. The assignments are challenging but help us understand the practical applications.",
		type: "INQUIRY_LINKED",
		inquiryId: "inq-2",
		inquiryTitle: "Course Content Evaluation - AI & ML",
		studentId: "usr-124",
		department: "Computer Science",
		program: "BS Computer Science",
		semester: "7",
		aiAnalysis: {
			theme: "Teaching Quality & Methodology",
			sentiment: "POSITIVE",
			importance: "MEDIUM",
			summary:
				"Positive feedback on teaching methodology with real-world examples and practical assignments.",
			detailedInsight:
				"Student praises the instructor's teaching approach which includes real-world examples, active class participation, and challenging but practical assignments. This indicates effective pedagogy that bridges theory and practice.",
			actionableItems: [
				"Document and share best practices from Dr. Ahmed's teaching methodology",
				"Consider peer observation sessions for faculty development",
			],
		},
		status: "PROCESSED",
		createdAt: "2024-11-03T14:20:00Z",
	},
	{
		id: "inp-3",
		body: "The library doesn't have enough quiet study spaces. During exam season, it's almost impossible to find a seat. Also, many of the recommended textbooks for our courses are not available in the library.",
		type: "INQUIRY_LINKED",
		inquiryId: "inq-3",
		inquiryTitle: "Library Resources Survey",
		studentId: "usr-125",
		department: "Software Engineering",
		program: "BS Software Engineering",
		semester: "6",
		aiAnalysis: {
			theme: "Library & Study Resources",
			sentiment: "NEGATIVE",
			importance: "HIGH",
			summary:
				"Insufficient study spaces during peak times and missing course textbooks.",
			detailedInsight:
				"Two critical issues identified: inadequate seating capacity in quiet study areas during exam periods, and gaps in the textbook collection for required courses. Both issues directly impact student learning and exam preparation capabilities.",
			actionableItems: [
				"Expand quiet study spaces or implement booking system",
				"Review and update textbook inventory based on current course requirements",
				"Consider digital library subscriptions for commonly required textbooks",
			],
		},
		status: "PROCESSED",
		createdAt: "2024-11-02T09:15:00Z",
	},
	{
		id: "inp-4",
		body: "I think the university should offer more workshops on industry-relevant technologies like cloud computing, DevOps, and cybersecurity. This would help us be more job-ready.",
		type: "GENERAL",
		inquiryId: null,
		inquiryTitle: null,
		studentId: "usr-126",
		department: "Computer Science",
		program: "BS Computer Science",
		semester: "8",
		aiAnalysis: {
			theme: "Skill Development & Training",
			sentiment: "NEUTRAL",
			importance: "MEDIUM",
			summary:
				"Request for additional workshops on modern industry technologies.",
			detailedInsight:
				"Student suggests expanding professional development opportunities through workshops on cloud computing, DevOps, and cybersecurity. This reflects awareness of industry skill requirements and desire for practical, job-market-oriented training.",
			actionableItems: [
				"Conduct industry skills gap analysis",
				"Organize workshop series on cloud platforms (AWS, Azure, GCP)",
				"Partner with industry for guest lectures and hands-on sessions",
			],
		},
		status: "PROCESSED",
		createdAt: "2024-11-01T16:40:00Z",
	},
	{
		id: "inp-5",
		body: "The internet speed in the hostel is very poor, especially during evening hours. It's difficult to attend online classes or download course materials.",
		type: "GENERAL",
		inquiryId: null,
		inquiryTitle: null,
		studentId: "usr-127",
		department: "Electrical Engineering",
		program: "BS Electrical Engineering",
		semester: "4",
		aiAnalysis: {
			theme: "IT Infrastructure & Connectivity",
			sentiment: "NEGATIVE",
			importance: "HIGH",
			summary: "Poor hostel internet connectivity affecting online learning.",
			detailedInsight:
				"Critical connectivity issues in hostel accommodations during peak hours. This affects students' ability to participate in online classes and access course materials, directly impacting their learning experience.",
			actionableItems: [
				"Audit hostel network infrastructure and bandwidth allocation",
				"Upgrade internet capacity to handle peak evening usage",
				"Implement quality of service (QoS) policies prioritizing educational content",
			],
		},
		status: "PROCESSED",
		createdAt: "2024-10-31T20:10:00Z",
	},
];

// ============================================
// DASHBOARD STATISTICS MOCK DATA
// ============================================

export const mockDashboardStats = {
	totalInputs: 487,
	totalInquiries: 12,
	activeInquiries: 5,
	processingRate: 98.5,
	sentimentBreakdown: {
		positive: 156,
		negative: 231,
		neutral: 78,
		mixed: 22,
	},
	importanceBreakdown: {
		high: 89,
		medium: 267,
		low: 131,
	},
	topThemes: [
		{ theme: "Teaching Quality & Methodology", count: 142 },
		{ theme: "Lab Equipment & Infrastructure", count: 98 },
		{ theme: "Course Content & Curriculum", count: 87 },
		{ theme: "Library & Study Resources", count: 76 },
		{ theme: "IT Infrastructure & Connectivity", count: 54 },
	],
	departmentBreakdown: [
		{ department: "Computer Science", count: 234 },
		{ department: "Software Engineering", count: 156 },
		{ department: "Electrical Engineering", count: 97 },
	],
	recentInputs: mockInputs.slice(0, 5),
};

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Simulate API delay
 * @param {number} ms - Delay in milliseconds
 */
export const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Generate paginated response
 * @param {Array} data - Full data array
 * @param {number} page - Page number (1-indexed)
 * @param {number} pageSize - Items per page
 */
export const paginateData = (data, page = 1, pageSize = 25) => {
	const startIndex = (page - 1) * pageSize;
	const endIndex = startIndex + pageSize;
	return {
		data: data.slice(startIndex, endIndex),
		pagination: {
			page,
			pageSize,
			totalItems: data.length,
			totalPages: Math.ceil(data.length / pageSize),
		},
	};
};

// @ts-check

/**
 * REVISED Mock Data Structure - Matching Reference Project
 * - Inquiries have single `body` field (the question prompt)
 * - Inquiry inputs DON'T have theme/topic - just responses with quality scores
 * - General inputs DO have aiTheme for topic grouping
 * - Quality scores: urgencyPct, importancePct, clarityPct, qualityPct, severity
 * - Aggregate AI analysis at Inquiry and Topic level with Executive Summary format
 */

// ============================================
// SIMPLIFIED INPUT MOCK DATA
// ============================================

export const mockInputsSimplified = [
	// Inquiry-linked inputs (responses to specific inquiries)
	{
		id: "inp-1",
		body: "The computers in the programming lab are extremely outdated and slow. When we try to run Android Studio or any modern IDE, they freeze constantly. It takes 10-15 minutes just to compile a simple project.",
		type: "INQUIRY_LINKED",
		inquiryId: "inq-1",
		inquiryTitle: "Lab Equipment Feedback - Fall 2024",

		// Student metadata (anonymous)
		studentId: "usr-123",
		department: "Computer Science",
		program: "BS Computer Science",
		semester: "5",
		identityRevealed: false,

		// Basic AI classification (NO theme for inquiry inputs)
		sentiment: "Frustrated",
		tone: "negative",

		// Quality scores (0-1 scale converted to percentages)
		urgencyPct: "0.85",
		importancePct: "0.90",
		clarityPct: "0.75",
		helpfulnessPct: "0.80",
		qualityPct: "0.83",
		score: 83,
		severity: 3, // 1=LOW, 2=MEDIUM, 3=HIGH

		// Admin interaction
		adminReply: null,
		identityRevealRequested: false,
		identityRevealRequestedAt: null,

		status: "PROCESSED",
		createdAt: "2024-11-04T10:30:00Z",
	},
	{
		id: "inp-2",
		body: "Dr. Ahmed's teaching methodology in the Database Systems course is excellent. He explains complex concepts with real-world examples and always encourages class participation.",
		type: "INQUIRY_LINKED",
		inquiryId: "inq-2",
		inquiryTitle: "Course Content Evaluation - AI & ML",

		studentId: "usr-124",
		department: "Computer Science",
		program: "BS Computer Science",
		semester: "7",
		identityRevealed: false,

		sentiment: "Satisfied",
		tone: "positive",
		urgencyPct: "0.30",
		importancePct: "0.60",
		clarityPct: "0.85",
		helpfulnessPct: "0.70",
		qualityPct: "0.61",
		score: 61,
		severity: 2,

		adminReply: {
			message: "Thank you for your positive feedback! We're glad Dr. Ahmed's teaching methods are effective.",
			repliedAt: "2024-11-04T14:00:00Z",
			repliedBy: "admin@kfueit.edu.pk",
		},
		identityRevealRequested: false,

		status: "PROCESSED",
		createdAt: "2024-11-03T14:20:00Z",
	},
	{
		id: "inp-3",
		body: "The library doesn't have enough quiet study spaces. During exam season, it's almost impossible to find a seat.",
		type: "INQUIRY_LINKED",
		inquiryId: "inq-3",
		inquiryTitle: "Library Resources Survey",

		studentId: "usr-125",
		department: "Software Engineering",
		program: "BS Software Engineering",
		semester: "6",
		identityRevealed: false,

		sentiment: "Frustrated",
		tone: "negative",
		urgencyPct: "0.75",
		importancePct: "0.80",
		clarityPct: "0.70",
		helpfulnessPct: "0.65",
		qualityPct: "0.73",
		score: 73,
		severity: 3,

		adminReply: null,
		identityRevealRequested: true,
		identityRevealRequestedAt: "2024-11-04T16:00:00Z",

		status: "PROCESSED",
		createdAt: "2024-11-02T09:15:00Z",
	},

	// General inputs (auto-grouped into topics by AI)
	{
		id: "inp-4",
		body: "I think the university should offer more workshops on industry-relevant technologies like cloud computing, DevOps, and cybersecurity.",
		type: "GENERAL",
		inquiryId: null,
		inquiryTitle: null,
		topicId: "topic-1", // Auto-assigned by AI

		// AI classification for topic grouping
		aiTheme: "skill development and training",
		aiTopic: "industry workshops and certifications",
		topic: "Skill Development & Training",

		studentId: "usr-126",
		department: "Computer Science",
		program: "BS Computer Science",
		semester: "8",
		identityRevealed: false,

		sentiment: "Hopeful",
		tone: "neutral",
		urgencyPct: "0.45",
		importancePct: "0.55",
		clarityPct: "0.80",
		helpfulnessPct: "0.60",
		qualityPct: "0.60",
		score: 60,
		severity: 2,

		adminReply: null,
		identityRevealRequested: false,

		status: "PROCESSED",
		createdAt: "2024-11-01T16:40:00Z",
	},
	{
		id: "inp-5",
		body: "The internet speed in the hostel is very poor, especially during evening hours. It's difficult to attend online classes or download course materials.",
		type: "GENERAL",
		inquiryId: null,
		inquiryTitle: null,
		topicId: "topic-2",

		aiTheme: "IT infrastructure and connectivity",
		aiTopic: "hostel internet issues",
		topic: "IT Infrastructure & Connectivity",

		studentId: "usr-127",
		department: "Electrical Engineering",
		program: "BS Electrical Engineering",
		semester: "4",
		identityRevealed: false,

		sentiment: "Frustrated",
		tone: "negative",
		urgencyPct: "0.80",
		importancePct: "0.85",
		clarityPct: "0.75",
		helpfulnessPct: "0.70",
		qualityPct: "0.78",
		score: 78,
		severity: 3,

		adminReply: {
			message: "We're working on upgrading the hostel network infrastructure. Expected completion by December 2024.",
			repliedAt: "2024-11-02T10:00:00Z",
			repliedBy: "admin@kfueit.edu.pk",
		},
		identityRevealRequested: false,

		status: "PROCESSED",
		createdAt: "2024-10-31T20:10:00Z",
	},
	{
		id: "inp-6",
		body: "WiFi connectivity in the main academic building is very inconsistent. The signal drops frequently during lectures.",
		type: "GENERAL",
		inquiryId: null,
		inquiryTitle: null,
		topicId: "topic-2",

		aiTheme: "IT infrastructure and connectivity",
		aiTopic: "campus WiFi reliability",
		topic: "IT Infrastructure & Connectivity",

		studentId: "usr-128",
		department: "Computer Science",
		program: "BS Computer Science",
		semester: "3",
		identityRevealed: false,

		sentiment: "Annoyed",
		tone: "negative",
		urgencyPct: "0.70",
		importancePct: "0.75",
		clarityPct: "0.65",
		helpfulnessPct: "0.60",
		qualityPct: "0.68",
		score: 68,
		severity: 2,

		adminReply: null,
		identityRevealRequested: false,

		status: "PROCESSED",
		createdAt: "2024-10-30T11:20:00Z",
	},
];

// ============================================
// INQUIRY WITH AGGREGATE AI ANALYSIS
// ============================================

export const mockInquiriesWithAnalysis = [
	{
		id: "inq-1",
		// Single body field containing the question prompt
		body: "Is your lab equipment meeting your learning needs? Share your experience with computer lab facilities and equipment, including hardware performance, software availability, and overall usability for your coursework.",
		title: null, // No separate title

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

		// Engagement metrics
		engagementMetrics: [
			{ date: "2024-11-01", views: 45, responses: 19 },
			{ date: "2024-11-02", views: 52, responses: 29 },
			{ date: "2024-11-03", views: 48, responses: 37 },
			{ date: "2024-11-04", views: 61, responses: 44 },
		],

		// AGGREGATE AI ANALYSIS - Executive Summary Format
		aiSummary: {
			topics: ["outdated lab hardware", "software performance issues", "insufficient lab capacity"],

			"Executive Summary": {
				"Headline Insight": "Critical infrastructure gaps in lab equipment preventing effective learning for development-focused courses",

				"Response Mix": "3/5 responses cited severe performance issues with current hardware affecting their ability to complete coursework on time",

				"Key Takeaways": "Students report 10-15 minute compilation times for basic projects, frequent IDE freezing, and inability to run modern development tools. The issue is most severe for Mobile App Development and Software Engineering courses requiring resource-intensive applications.",

				"Risks": "Continued use of outdated equipment may lead to incomplete skill development, student frustration, and reduced competitiveness of graduates in the job market. Critical risk of students seeking external resources at personal cost.",

				"Opportunities": "Upgrading lab infrastructure presents opportunity to introduce cutting-edge tools, attract more students to technical programs, and strengthen university's reputation for technical education excellence.",
			},

			"Suggested Prioritized Actions": [
				{
					"Action": "Replace lab computers with minimum 16GB RAM and SSD storage",
					"Impact": "HIGH - Will directly resolve 87% of reported issues",
					"Challenges": "Budget allocation required, procurement timeline 2-3 months",
					"Response Count": 135,
					"Supporting Reasoning": "Vast majority of feedback directly cites inadequate RAM and slow HDD as primary bottleneck. Modern IDEs require 16GB+ RAM for smooth operation.",
				},
				{
					"Action": "Allocate dedicated high-spec workstations for Mobile App Development courses",
					"Impact": "HIGH - Critical for specific course requirements",
					"Challenges": "Android Studio and iOS simulators require top-tier hardware",
					"Response Count": 58,
					"Supporting Reasoning": "Mobile development students most severely impacted. Emulators and build processes are resource-intensive and cannot function on current hardware.",
				},
				{
					"Action": "Implement lab booking system to manage capacity during peak hours",
					"Impact": "MEDIUM - Improves space utilization",
					"Challenges": "Requires software solution and policy enforcement",
					"Response Count": 42,
					"Supporting Reasoning": "Peak hour overcrowding (2-5 PM) prevents access. Booking system would optimize usage and reduce conflicts.",
				},
			],

			// Additional metrics
			overallSentiment: {
				positive: 23,
				negative: 98,
				neutral: 28,
				mixed: 7,
				dominant: "NEGATIVE",
			},
			sentimentTrend: [
				{ date: "2024-11-01", positive: 3, negative: 12, neutral: 4 },
				{ date: "2024-11-02", positive: 5, negative: 18, neutral: 6 },
				{ date: "2024-11-03", positive: 7, negative: 22, neutral: 8 },
				{ date: "2024-11-04", positive: 8, negative: 26, neutral: 10 },
			],
		},
	},
	{
		id: "inq-2",
		body: "How would you rate the AI and Machine Learning course content and teaching methodology? Share your thoughts on course structure, practical assignments, theory-practice balance, and suggestions for improvement.",
		title: null,

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

		engagementMetrics: [
			{ date: "2024-10-15", views: 38, responses: 17 },
			{ date: "2024-10-22", views: 42, responses: 28 },
			{ date: "2024-10-29", views: 45, responses: 40 },
		],

		aiSummary: {
			topics: ["teaching methodology", "course content quality", "real-world applications"],

			"Executive Summary": {
				"Headline Insight": "Strong positive reception to teaching approach with requests for advanced topic coverage",

				"Response Mix": "2/3 responses expressed high satisfaction with teaching methodology, citing real-world examples as most valuable aspect",

				"Key Takeaways": "Instructor's use of practical examples and hands-on assignments highly effective. Students appreciate theory-practice balance but desire more cutting-edge topics like LLMs and transformers. Some students find pace challenging for foundational concepts.",

				"Risks": "Gap between beginner and advanced students may widen. Without advanced content, top performers may feel unchallenged and seek external resources.",

				"Opportunities": "Build on successful teaching model to create differentiated learning tracks. Opportunity to establish course as benchmark for AI education in region.",
			},

			"Suggested Prioritized Actions": [
				{
					"Action": "Maintain current teaching approach with real-world examples",
					"Impact": "HIGH - Preserves what's working well",
					"Challenges": "Requires continuous updating of examples with industry trends",
					"Response Count": 56,
					"Supporting Reasoning": "Overwhelmingly positive feedback on practical approach. Students specifically cite this as key differentiator from other courses.",
				},
				{
					"Action": "Add optional advanced modules on LLMs, transformers, and GPT architectures",
					"Impact": "MEDIUM - Addresses advanced learner needs",
					"Challenges": "Requires instructor expertise and additional preparation time",
					"Response Count": 34,
					"Supporting Reasoning": "Strong interest from high-performing students. Would keep top talent engaged and attract prospective students.",
				},
				{
					"Action": "Provide supplementary foundational resources for struggling students",
					"Impact": "MEDIUM - Reduces attrition and improves outcomes",
					"Challenges": "Needs creation or curation of remedial content",
					"Response Count": 18,
					"Supporting Reasoning": "Some students lack strong mathematical foundation. Additional resources would level the playing field.",
				},
			],

			overallSentiment: {
				positive: 56,
				negative: 18,
				neutral: 12,
				mixed: 3,
				dominant: "POSITIVE",
			},
			sentimentTrend: [
				{ date: "2024-10-15", positive: 12, negative: 3, neutral: 2 },
				{ date: "2024-10-22", positive: 18, negative: 6, neutral: 4 },
				{ date: "2024-10-29", positive: 26, negative: 9, neutral: 6 },
			],
		},
	},
	{
		id: "inq-3",
		body: "Tell us about your experience with library resources and study spaces. Are the facilities meeting your needs for independent study and research?",
		title: null,

		status: "ACTIVE",
		targetDepartments: ["Computer Science", "Software Engineering", "Electrical Engineering"],
		targetPrograms: ["BS Computer Science", "BS Software Engineering", "BS Electrical Engineering"],
		targetSemesters: ["1", "2", "3", "4", "5", "6", "7", "8"],
		startDate: "2024-10-20T00:00:00Z",
		endDate: "2024-12-15T23:59:59Z",
		totalInputs: 67,
		createdAt: "2024-10-15T09:00:00Z",
		updatedAt: "2024-11-02T12:30:00Z",
		createdBy: "admin@kfueit.edu.pk",

		engagementMetrics: [
			{ date: "2024-10-20", views: 52, responses: 12 },
			{ date: "2024-10-25", views: 48, responses: 28 },
			{ date: "2024-11-01", views: 61, responses: 45 },
		],

		aiSummary: {
			topics: ["study space availability", "seating capacity", "noise management"],

			"Executive Summary": {
				"Headline Insight": "Severe capacity constraints during peak exam periods affecting student study experience",

				"Response Mix": "4/5 responses during exam season reported inability to find seating in library",

				"Key Takeaways": "Library study spaces are adequate during regular semester but completely insufficient during mid-terms and finals. Students resort to studying in hallways, cafeteria, or returning to hostels where environment is less conducive to focused study.",

				"Risks": "Poor study conditions during critical exam periods may negatively impact academic performance. Student stress levels elevated by facility constraints beyond their control.",

				"Opportunities": "Expanding study spaces could significantly improve student satisfaction, reduce stress, and potentially improve overall academic outcomes across all programs.",
			},

			"Suggested Prioritized Actions": [
				{
					"Action": "Extend library hours during exam periods (24/7 or until midnight)",
					"Impact": "MEDIUM - Spreads usage across more hours",
					"Challenges": "Requires additional security and staffing",
					"Response Count": 42,
					"Supporting Reasoning": "Would reduce peak-hour congestion by allowing students to study at different times. Relatively low-cost solution.",
				},
				{
					"Action": "Designate additional spaces as quiet study zones during exam season",
					"Impact": "HIGH - Immediately increases capacity",
					"Challenges": "Need to identify and prepare suitable spaces",
					"Response Count": 51,
					"Supporting Reasoning": "Unused classrooms and seminar rooms could serve as temporary study spaces. Addresses immediate capacity issue.",
				},
				{
					"Action": "Implement booking system for library seats during peak periods",
					"Impact": "LOW - Manages but doesn't solve capacity issue",
					"Challenges": "May create additional frustration if all slots book quickly",
					"Response Count": 15,
					"Supporting Reasoning": "Only addresses distribution, not capacity. Should be considered alongside capacity expansion.",
				},
			],

			overallSentiment: {
				positive: 12,
				negative: 48,
				neutral: 6,
				mixed: 1,
				dominant: "NEGATIVE",
			},
			sentimentTrend: [
				{ date: "2024-10-20", positive: 3, negative: 8, neutral: 1 },
				{ date: "2024-10-25", positive: 5, negative: 18, neutral: 3 },
				{ date: "2024-11-01", positive: 4, negative: 22, neutral: 2 },
			],
		},
	},
];

// ============================================
// TOPICS (Auto-generated from general inputs)
// ============================================

export const mockTopics = [
	{
		id: "topic-1",
		topic: "Skill Development & Training",
		description: "Feedback related to professional development, workshops, and industry-relevant skills",
		totalInputs: 34,
		status: "ACTIVE",
		createdAt: "2024-10-20T00:00:00Z",
		averageScore: "58.5000000000000000",
		severity: 2, // MEDIUM

		// AGGREGATE AI ANALYSIS
		insightsSummary: [
			{
				topics: ["skill development and training", "industry workshops", "certification programs"],

				"Executive Summary": {
					"Headline Insight": "Strong student demand for industry-aligned technical training beyond core curriculum",

					"Key Takeaway": "Students recognize gap between academic coursework and industry requirements. Specifically seeking training in cloud platforms (AWS, Azure, GCP), DevOps practices, and cybersecurity fundamentals.",

					"Risks": "Without additional skill development programs, graduates may face competitive disadvantage in job market. Students may seek costly external training independently.",

					"Opportunities": "University can strengthen industry partnerships, improve job placement rates, and differentiate itself by offering comprehensive skill development programs. Potential revenue from certification training.",
				},

				"Suggested Prioritized Actions": [
					{
						"Action": "Launch monthly workshop series on trending technologies",
						"Impact": "HIGH - Addresses core demand",
						"Challenges": "Need qualified instructors and lab resources",
						"Response Count": 24,
						"Supporting Reasoning": "Regular workshops would systematically build skills beyond core curriculum. Topics like Docker, Kubernetes, CI/CD most requested.",
					},
					{
						"Action": "Partner with tech companies for certification training programs",
						"Impact": "HIGH - Adds credential value",
						"Challenges": "Partnership negotiations, potential costs",
						"Response Count": 18,
						"Supporting Reasoning": "Industry certifications (AWS, Azure, CCNA) significantly boost employability. Partnerships could reduce or eliminate student costs.",
					},
					{
						"Action": "Establish coding club and organize quarterly hackathons",
						"Impact": "MEDIUM - Builds practical experience",
						"Challenges": "Requires student leadership and faculty mentorship",
						"Response Count": 12,
						"Supporting Reasoning": "Peer learning and competition environment accelerates skill development. Creates sense of technical community.",
					},
				],
			},
		],

		// Summary metrics
		overallSentiment: {
			positive: 8,
			negative: 4,
			neutral: 18,
			mixed: 4,
			dominant: "NEUTRAL",
		},
		importanceBreakdown: {
			high: 12,
			medium: 16,
			low: 6,
		},
	},
	{
		id: "topic-2",
		topic: "IT Infrastructure & Connectivity",
		description: "Issues related to internet, network, WiFi, and IT systems",
		totalInputs: 28,
		status: "ACTIVE",
		createdAt: "2024-10-18T00:00:00Z",
		averageScore: "72.8000000000000000",
		severity: 3, // HIGH

		insightsSummary: [
			{
				topics: ["IT infrastructure and connectivity", "hostel internet", "campus WiFi"],

				"Executive Summary": {
					"Headline Insight": "Critical connectivity failures disrupting academic activities and online learning",

					"Key Takeaway": "Internet infrastructure unable to support current student body, particularly during peak evening hours (6-10 PM). Students report inability to attend online classes, download course materials, or access learning management systems.",

					"Risks": "URGENT - Students missing online classes and falling behind in coursework due to infrastructure failures. Issue affects academic outcomes and student satisfaction scores. Potential for formal complaints and negative publicity.",

					"Opportunities": "Modern, reliable network infrastructure is baseline expectation. Resolving this positions university as technically capable and student-focused. Improved connectivity enables hybrid learning innovations.",
				},

				"Suggested Prioritized Actions": [
					{
						"Action": "URGENT: Upgrade hostel network bandwidth and infrastructure",
						"Impact": "CRITICAL - Resolves most severe issue",
						"Challenges": "Significant capital investment, infrastructure work during occupied period",
						"Response Count": 22,
						"Supporting Reasoning": "Peak-hour bandwidth insufficient for concurrent student usage. Current infrastructure dates from pre-pandemic when online learning was minimal.",
					},
					{
						"Action": "Install additional WiFi access points in academic buildings",
						"Impact": "HIGH - Eliminates dead zones",
						"Challenges": "Site survey needed, cabling work required",
						"Response Count": 14,
						"Supporting Reasoning": "Several building zones have no coverage or weak signal. Affects ability to access resources during class time.",
					},
					{
						"Action": "Implement QoS policies to prioritize educational traffic",
						"Impact": "MEDIUM - Optimizes existing capacity",
						"Challenges": "Technical configuration, defining policies",
						"Response Count": 8,
						"Supporting Reasoning": "Quick win while infrastructure upgrades proceed. Ensures learning activities get priority over entertainment traffic.",
					},
				],
			},
		],

		overallSentiment: {
			positive: 2,
			negative: 22,
			neutral: 3,
			mixed: 1,
			dominant: "NEGATIVE",
		},
		importanceBreakdown: {
			high: 20,
			medium: 6,
			low: 2,
		},
	},
	{
		id: "topic-3",
		topic: "Campus Facilities",
		description: "General campus facilities including cafeteria, sports, common areas",
		totalInputs: 19,
		status: "ACTIVE",
		createdAt: "2024-10-22T00:00:00Z",
		averageScore: "45.2000000000000000",
		severity: 2, // MEDIUM

		insightsSummary: [
			{
				topics: ["campus facilities", "cafeteria quality", "common areas"],

				"Executive Summary": {
					"Headline Insight": "Mixed feedback on campus facilities - sports appreciated, food services need improvement",

					"Key Takeaway": "Students satisfied with sports facilities and maintenance. Primary concern is cafeteria: limited menu variety, particularly for vegetarians and health-conscious students. Common areas need furniture upgrades.",

					"Risks": "Food quality and variety impact student health and satisfaction. Off-campus food options may pose health risks and reduce campus community engagement.",

					"Opportunities": "Cafeteria improvements could become differentiator for prospective students. Modern common areas would increase campus appeal and provide collaborative spaces.",
				},

				"Suggested Prioritized Actions": [
					{
						"Action": "Expand cafeteria menu with diverse and healthier options",
						"Impact": "MEDIUM - Addresses main concern",
						"Challenges": "May require different suppliers or expanded kitchen capacity",
						"Response Count": 12,
						"Supporting Reasoning": "Vegetarian options extremely limited. Students seeking healthier choices have few alternatives. Menu variety improves student life quality.",
					},
					{
						"Action": "Consider food court model with multiple vendors",
						"Impact": "HIGH - Transforms food service experience",
						"Challenges": "Major investment, space requirements, vendor management",
						"Response Count": 8,
						"Supporting Reasoning": "Multiple vendors provide variety and competition. Students can choose based on preference and dietary needs. Similar models successful at peer institutions.",
					},
					{
						"Action": "Renovate common area furniture and lighting",
						"Impact": "MEDIUM - Improves student experience",
						"Challenges": "Budget allocation for furniture and fixtures",
						"Response Count": 7,
						"Supporting Reasoning": "Worn furniture and poor lighting make common areas uninviting. Modern, comfortable spaces encourage study groups and social interaction.",
					},
				],
			},
		],

		overallSentiment: {
			positive: 7,
			negative: 8,
			neutral: 3,
			mixed: 1,
			dominant: "MIXED",
		},
		importanceBreakdown: {
			high: 4,
			medium: 11,
			low: 4,
		},
	},
];

// ============================================
// DASHBOARD STATS (Updated)
// ============================================

export const mockDashboardStatsV2 = {
	totalInputs: 487,
	totalInquiries: 12,
	activeInquiries: 5,
	totalTopics: 8,
	processingRate: 98.5,

	sentimentBreakdown: {
		positive: 156,
		negative: 231,
		neutral: 78,
		mixed: 22,
	},

	importanceBreakdown: {
		high: 189,
		medium: 267,
		low: 131,
	},

	topThemes: [
		{ theme: "Teaching Quality", count: 142 },
		{ theme: "Lab Equipment & Infrastructure", count: 98 },
		{ theme: "IT Infrastructure", count: 87 },
		{ theme: "Library & Study Resources", count: 76 },
		{ theme: "Skill Development", count: 54 },
	],

	departmentBreakdown: [
		{ department: "Computer Science", count: 234 },
		{ department: "Software Engineering", count: 156 },
		{ department: "Electrical Engineering", count: 97 },
	],

	recentInputs: mockInputsSimplified.slice(0, 5),

	// New metrics
	identityRevealRequests: 3,
	repliedInputs: 45,
	unrepliedHighPriority: 12,
};

// ============================================
// HELPER FUNCTIONS
// ============================================

export const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

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

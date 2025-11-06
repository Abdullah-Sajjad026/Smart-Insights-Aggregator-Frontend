# Backend Integration Plan

## Overview

This document outlines the plan to integrate the .NET 8 backend API with our existing Next.js frontend following our established **Volt** architecture patterns.

---

## Current Architecture Summary

### Our Module System
```
/modules/[module]/
├── api/[operation]/[operation].api.js     # API functions + React Query hooks
├── components/                             # Module-specific components
├── hooks/                                  # Custom hooks
├── models/                                 # Zod schemas
├── [module].config.js                      # Constants, enums
├── [module].context.js                     # React context
├── [module].routes.js                      # Route definitions
└── index.js                                # Barrel exports
```

### Our API Pattern
Every API function follows this structure:
1. JSDoc type definitions
2. Main API function (uses axios `apiClient`)
3. Query/Mutation key generators
4. Data selectors
5. React Query hooks (useQuery or useMutation)

### Our Stack
- **Framework**: Next.js 14 (Pages Router)
- **UI**: Material-UI (MUI) with `sx` prop styling
- **State**: React Query + Context API
- **Forms**: React Hook Form + Zod validation
- **HTTP Client**: Axios with interceptors
- **Notifications**: react-toastify

---

## Backend API Endpoints (from .NET 8)

### Authentication
- `POST /api/auth/login` → Returns token, email, role, userId, fullName

### Users
- `GET /api/users` → Paginated list
- `GET /api/users/{id}` → Single user
- `POST /api/users` → Create
- `PUT /api/users/{id}` → Update
- `DELETE /api/users/{id}` → Delete
- `GET /api/users/stats` → Statistics
- `POST /api/users/import-csv` → Import
- `GET /api/users/csv-template` → Template download

### Inquiries
- `GET /api/inquiries` → Paginated list
- `GET /api/inquiries/{id}` → Single inquiry
- `POST /api/inquiries` → Create
- `PUT /api/inquiries/{id}` → Update
- `DELETE /api/inquiries/{id}` → Delete
- `POST /api/inquiries/{id}/send` → Send inquiry
- `POST /api/inquiries/{id}/close` → Close inquiry
- `GET /api/inquiries/my-inquiries` → Student's inquiries
- `GET /api/inquiries/stats` → Statistics

### Inputs (Feedback)
- `GET /api/inputs/filter` → Filtered paginated list
- `GET /api/inputs/{id}` → Single input
- `POST /api/inputs` → Create (anonymous allowed)
- `PUT /api/inputs/{id}` → Update
- `DELETE /api/inputs/{id}` → Delete
- `POST /api/inputs/{id}/reveal-request` → Request identity reveal
- `POST /api/inputs/{id}/reveal-respond` → Respond to reveal request
- `GET /api/inputs/my-inputs` → Student's inputs
- `GET /api/inputs/stats` → Statistics
- `GET /api/inputs/{id}/replies` → Get replies
- `POST /api/inputs/{id}/replies` → Create reply

### Topics
- `GET /api/topics` → Paginated list
- `GET /api/topics/{id}` → Single topic
- `POST /api/topics` → Create
- `PUT /api/topics/{id}` → Update
- `DELETE /api/topics/{id}` → Delete
- `GET /api/topics/stats` → Statistics

### Departments
- `GET /api/departments` → Paginated list
- `GET /api/departments/{id}` → Single
- `POST /api/departments` → Create
- `PUT /api/departments/{id}` → Update
- `DELETE /api/departments/{id}` → Delete

### Programs
- `GET /api/programs` → Paginated list
- `GET /api/programs/{id}` → Single
- `POST /api/programs` → Create
- `PUT /api/programs/{id}` → Update
- `DELETE /api/programs/{id}` → Delete

### Semesters
- `GET /api/semesters` → Paginated list
- `GET /api/semesters/{id}` → Single
- `POST /api/semesters` → Create
- `PUT /api/semesters/{id}` → Update
- `DELETE /api/semesters/{id}` → Delete

### Themes
- `GET /api/themes` → Paginated list
- `GET /api/themes/{id}` → Single
- `POST /api/themes` → Create
- `PUT /api/themes/{id}` → Update
- `DELETE /api/themes/{id}` → Delete

---

## Integration Tasks

### Phase 1: Core Infrastructure (Foundation)

#### 1.1 Environment Configuration ✅
- [x] Create `.env.local` with backend URL
- [x] Add API_BASE_URL, timeout, token keys

#### 1.2 Type Definitions
- [ ] Create `/types/api.ts` with all backend DTOs
  - Enums: Role, InquiryStatus, InputStatus, InputType, Sentiment, Tone, ThemeType, RevealStatus
  - DTOs: LoginResponse, UserDto, InquiryDto, InputDto, TopicDto, DepartmentDto, ProgramDto, SemesterDto, ThemeDto
  - Request types: CreateXxx, UpdateXxx
  - Stats types: UserStatsDto, InquiryStatsDto, InputStatsDto, TopicStatsDto

#### 1.3 Update Axios Instance
- [ ] Update `/pages/api/AxiosInstance.js`
  - Change response interceptor to return `response.data.data` (backend wraps in ApiResponse)
  - Update error handling to match backend error format
  - Keep existing 401 redirect logic

---

### Phase 2: Authentication Module

#### 2.1 Update Auth API
- [ ] Update `/modules/auth/api/sign-in/sign-in.api.js`
  - Change endpoint from `/app/login` to `/auth/login`
  - Update response structure to match `LoginResponse`
  - Store `userId`, `role`, `fullName` in addition to token

#### 2.2 Update Auth Context
- [ ] Update `/modules/auth/auth.context.js`
  - Store full user info (not just token)
  - Add `role`, `userId`, `fullName`, `email` to context

#### 2.3 Create Sign Out Hook
- [ ] Verify `/modules/auth/hooks/sign-out/sign-out.hook.js` exists
  - Clear localStorage
  - Redirect to login

---

### Phase 3: User Module

#### 3.1 Update Existing API
- [ ] Update `/modules/user/api/get-user/get-user.api.js`
  - Currently fetches current user
  - May need to map to `/users/{id}` or keep separate

#### 3.2 Add New User APIs
Create these new API files following our pattern:

- [ ] `/modules/user/api/get-all-users/get-all-users.api.js`
  - Maps to `GET /users`
  - Supports pagination, filtering
  - Returns PaginatedResult

- [ ] `/modules/user/api/create-user/create-user.api.js`
  - Maps to `POST /users`
  - useMutation hook

- [ ] `/modules/user/api/update-user/update-user.api.js`
  - Maps to `PUT /users/{id}`
  - useMutation hook

- [ ] `/modules/user/api/delete-user/delete-user.api.js`
  - Maps to `DELETE /users/{id}`
  - useMutation hook

- [ ] `/modules/user/api/get-user-stats/get-user-stats.api.js`
  - Maps to `GET /users/stats`
  - useQuery hook

- [ ] `/modules/user/api/import-users-csv/import-users-csv.api.js`
  - Maps to `POST /users/import-csv`
  - FormData upload
  - useMutation hook

#### 3.3 Add User Models
- [ ] Create `/modules/user/models/user-dto/user-dto.js`
  - Zod schema matching backend UserDto
  - Include all fields: departmentId, programId, semesterId, isActive

---

### Phase 4: Inquiry Module

#### 4.1 Update Existing APIs
Replace mock implementations with real backend calls:

- [ ] `/modules/inquiry/api/get-active-inquiries/get-active-inquiries.api.js`
  - Maps to `GET /inquiries?status=Sent`
  - Or `GET /inquiries/my-inquiries` for students

- [ ] `/modules/inquiry/api/get-all-inquiries/get-all-inquiries.api.js`
  - Maps to `GET /inquiries`
  - Add pagination support

- [ ] `/modules/inquiry/api/get-inquiry-by-id/get-inquiry-by-id.api.js`
  - Maps to `GET /inquiries/{id}`
  - Update response structure

- [ ] `/modules/inquiry/api/create-inquiry/create-inquiry.api.js`
  - Maps to `POST /inquiries`
  - Match CreateInquiryRequest structure

- [ ] `/modules/inquiry/api/update-inquiry/update-inquiry.api.js`
  - Maps to `PUT /inquiries/{id}`
  - Match UpdateInquiryRequest structure

- [ ] `/modules/inquiry/api/delete-inquiry/delete-inquiry.api.js`
  - Maps to `DELETE /inquiries/{id}`

#### 4.2 Add New Inquiry APIs
- [ ] `/modules/inquiry/api/send-inquiry/send-inquiry.api.js`
  - Maps to `POST /inquiries/{id}/send`
  - Changes status to Sent

- [ ] `/modules/inquiry/api/close-inquiry/close-inquiry.api.js`
  - Maps to `POST /inquiries/{id}/close`
  - Changes status to Closed

- [ ] `/modules/inquiry/api/get-inquiry-stats/get-inquiry-stats.api.js`
  - Maps to `GET /inquiries/stats`

#### 4.3 Update Inquiry Models
- [ ] Update `/modules/inquiry/models/` to match backend DTOs
  - Add departmentIds, programIds, semesterIds arrays
  - Add inputCount field

---

### Phase 5: Input Module

#### 5.1 Update Existing APIs
Replace mock implementations:

- [ ] `/modules/input/api/submit-input/submit-input.api.js`
  - Maps to `POST /inputs`
  - Remove mock delay and random errors
  - Match CreateInputRequest structure

- [ ] `/modules/input/api/get-my-inputs/get-my-inputs.api.js`
  - Maps to `GET /inputs/my-inputs`
  - Add pagination

- [ ] `/modules/input/api/get-all-inputs/get-all-inputs.api.js`
  - Maps to `GET /inputs/filter`
  - Support InputFilterDto params

- [ ] `/modules/input/api/get-dashboard-stats/get-dashboard-stats.api.js`
  - Maps to `GET /inputs/stats`
  - Match InputStatsDto structure

#### 5.2 Add New Input APIs
- [ ] `/modules/input/api/get-input-by-id/get-input-by-id.api.js`
  - Maps to `GET /inputs/{id}`

- [ ] `/modules/input/api/update-input/update-input.api.js`
  - Maps to `PUT /inputs/{id}`

- [ ] `/modules/input/api/delete-input/delete-input.api.js`
  - Maps to `DELETE /inputs/{id}`

- [ ] `/modules/input/api/request-reveal/request-reveal.api.js`
  - Maps to `POST /inputs/{id}/reveal-request`
  - Admin only

- [ ] `/modules/input/api/respond-to-reveal/respond-to-reveal.api.js`
  - Maps to `POST /inputs/{id}/reveal-respond`
  - Student only
  - Body: { approved: boolean }

- [ ] `/modules/input/api/get-input-replies/get-input-replies.api.js`
  - Maps to `GET /inputs/{id}/replies`

- [ ] `/modules/input/api/create-input-reply/create-input-reply.api.js`
  - Maps to `POST /inputs/{id}/replies`

#### 5.3 Update Input Models
- [ ] Update models to match InputDto
  - Add all AI analysis fields: sentiment, tone, scores
  - Add revealStatus, identityRevealedAt
  - Add topic fields

---

### Phase 6: New Modules for Backend Resources

#### 6.1 Create Topic Module
- [ ] Create `/modules/topic/` directory structure
- [ ] Create APIs:
  - `get-all-topics.api.js` → GET /topics
  - `get-topic-by-id.api.js` → GET /topics/{id}
  - `create-topic.api.js` → POST /topics
  - `update-topic.api.js` → PUT /topics/{id}
  - `delete-topic.api.js` → DELETE /topics/{id}
  - `get-topic-stats.api.js` → GET /topics/stats
- [ ] Create models with Zod schemas
- [ ] Create topic.config.js with constants
- [ ] Create topic.routes.js

#### 6.2 Create Department Module
- [ ] Create `/modules/department/` directory
- [ ] Create APIs (CRUD operations)
- [ ] Create models
- [ ] Create config and routes

#### 6.3 Create Program Module
- [ ] Create `/modules/program/` directory
- [ ] Create APIs (CRUD + filter by department)
- [ ] Create models
- [ ] Create config and routes

#### 6.4 Create Semester Module
- [ ] Create `/modules/semester/` directory
- [ ] Create APIs (CRUD operations)
- [ ] Create models
- [ ] Create config and routes

#### 6.5 Create Theme Module
- [ ] Create `/modules/theme/` directory
- [ ] Create APIs (CRUD operations)
- [ ] Create models with ThemeType enum
- [ ] Create config and routes

---

### Phase 7: Page Updates

#### 7.1 Admin Pages
Update existing pages to use real APIs:

- [ ] `/pages/admin/dashboard.js`
  - Use real stats APIs
  - Display UserStats, InquiryStats, InputStats

- [ ] `/pages/admin/inquiries.js`
  - Use real pagination
  - Add send/close actions

- [ ] `/pages/admin/inquiries/[inquiryId].js`
  - Display real inquiry details
  - Show all responses with AI analysis

- [ ] `/pages/admin/users.js` (if exists, or create)
  - List, create, edit, delete users
  - CSV import functionality

#### 7.2 Create New Admin Pages
- [ ] `/pages/admin/topics/index.js`
  - List topics with input counts
  - CRUD operations

- [ ] `/pages/admin/topics/[topicId].js`
  - View topic details
  - List all inputs in topic

- [ ] `/pages/admin/departments.js`
  - Manage departments

- [ ] `/pages/admin/programs.js`
  - Manage programs (filter by department)

- [ ] `/pages/admin/semesters.js`
  - Manage semesters

- [ ] `/pages/admin/themes.js`
  - Manage themes

- [ ] `/pages/admin/inputs/[inputId].js`
  - View input details
  - Show AI analysis
  - Reply functionality
  - Request reveal functionality

#### 7.3 Student Pages
- [ ] `/pages/student/dashboard.js` (or `/pages/index.js`)
  - Show active inquiries for student's dept/program/semester
  - Show student's input history

- [ ] `/pages/input/submit.js`
  - Update to use real API
  - Show success message

- [ ] `/pages/input/my-inputs.js`
  - List student's inputs
  - Show admin replies
  - Handle reveal requests

- [ ] `/pages/input/inquiries/[inquiryId].js`
  - Show inquiry details
  - Submit response

---

### Phase 8: Components

#### 8.1 Update Existing Components
- [ ] Update inquiry components to show new fields
- [ ] Update input components to show AI analysis
- [ ] Add reveal request UI components

#### 8.2 Create New Components
- [ ] `/modules/input/components/input-reply-list/`
  - Display conversation thread
  - Show user role badges

- [ ] `/modules/input/components/reveal-request-dialog/`
  - Admin: Request reveal button + dialog
  - Student: Approve/deny reveal dialog

- [ ] `/modules/input/components/ai-analysis-card/`
  - Display sentiment, tone, scores
  - Show quality metrics

- [ ] Management dialogs for new resources:
  - `/modules/topic/components/topic-dialog/`
  - `/modules/department/components/department-dialog/`
  - `/modules/program/components/program-dialog/`
  - `/modules/semester/components/semester-dialog/`
  - `/modules/theme/components/theme-dialog/`

---

### Phase 9: Authorization & Access Control

#### 9.1 Role-Based Access
- [ ] Update `withUser` HOC to support role checking
- [ ] Apply HOC to admin-only pages
- [ ] Apply HOC to student-only pages

#### 9.2 Middleware (Optional)
- [ ] Consider adding Next.js middleware for route protection
  - Check token existence
  - Redirect unauthenticated users

---

### Phase 10: Enums & Configuration

#### 10.1 Create Global Enum Utilities
- [ ] Create `/constants/enums.js`
  - Import from `/types/api.ts`
  - Create label mappings
  - Create dropdown options

Example:
```javascript
export const ROLE_LABELS = {
  [Role.Admin]: 'Administrator',
  [Role.Student]: 'Student',
};

export const roleOptions = [
  { value: Role.Admin, label: 'Administrator' },
  { value: Role.Student, label: 'Student' },
];
```

#### 10.2 Update Module Configs
- [ ] Update each module's config.js with backend enums
- [ ] Remove old mock constants if they conflict

---

### Phase 11: Error Handling & UX

#### 11.1 Update Error Handling
- [ ] Verify `getApiErrorMessage` in shared utils works with backend errors
- [ ] Update to extract from `error.response.data.message`
- [ ] Handle validation errors from `error.response.data.errors`

#### 11.2 Loading States
- [ ] Ensure all mutations show loading buttons
- [ ] Add skeleton loaders for lists
- [ ] Add suspense/loading states for queries

#### 11.3 Success Messages
- [ ] Add toast notifications on successful mutations
- [ ] Invalidate relevant queries after mutations

---

### Phase 12: Testing & Validation

#### 12.1 API Testing
- [ ] Test each endpoint with real backend
- [ ] Verify pagination works correctly
- [ ] Test error scenarios

#### 12.2 Flow Testing
- [ ] Test admin inquiry creation → send → student response flow
- [ ] Test general input → AI analysis flow
- [ ] Test reply conversation flow
- [ ] Test identity reveal flow

#### 12.3 Access Control Testing
- [ ] Verify admin can access admin pages
- [ ] Verify students cannot access admin pages
- [ ] Verify 401 redirects work

---

## Implementation Guidelines

### Follow These Patterns

#### 1. API Function Pattern
```javascript
// /modules/[module]/api/[operation]/[operation].api.js

/**
 * @typedef {Object} GetUsersParams
 * @property {number} [page]
 * @property {number} [pageSize]
 * @property {string} [role]
 */

/**
 * @typedef {Object} GetUsersResponse
 * @property {Array} items
 * @property {number} totalCount
 */

export function getUsers(params = {}) {
  return apiClient.get("/users", { params });
}

export const getGetUsersQueryKey = (params) => ["users", params];

export const selectGetUsersQueryData = (response) => response;

export function useGetUsers(params = {}, options = {}) {
  return useQuery({
    queryFn: () => getUsers(params),
    queryKey: getGetUsersQueryKey(params),
    select: selectGetUsersQueryData,
    ...options,
  });
}
```

#### 2. Mutation Pattern
```javascript
export function createUser(data) {
  return apiClient.post("/users", data);
}

export const getCreateUserMutationKey = () => ["create-user"];

export function useCreateUserMutation(options = {}) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createUser,
    mutationKey: getCreateUserMutationKey(),
    onSuccess: () => {
      // Invalidate users list
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success("User created successfully");
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, "Failed to create user"));
    },
    ...options,
  });
}
```

#### 3. Model Pattern
```javascript
// /modules/user/models/user-dto/user-dto.js
import { z } from "zod";
import { Role } from "@/types/api";

export const UserDtoSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  fullName: z.string(),
  role: z.nativeEnum(Role),
  departmentId: z.string().optional(),
  departmentName: z.string().optional(),
  programId: z.string().optional(),
  programName: z.string().optional(),
  semesterId: z.string().optional(),
  semesterName: z.string().optional(),
  isActive: z.boolean(),
  createdAt: z.string(),
});

/**
 * @typedef { z.infer<typeof UserDtoSchema> } UserDto
 */

export const defaultUserDto = {
  id: "",
  email: "",
  fullName: "",
  role: Role.Student,
  isActive: true,
  createdAt: new Date().toISOString(),
};
```

---

## Migration from Mock to Real APIs

### Step-by-Step for Each Module

1. **Keep the file structure** - Don't rename or move files
2. **Replace mock implementation** - Remove delays, random errors, hardcoded data
3. **Update to real endpoint** - Change URL to backend endpoint
4. **Match backend DTOs** - Ensure request/response match backend
5. **Test immediately** - Verify with real backend before moving on
6. **Update related components** - If DTO structure changed, update components
7. **Add invalidation** - Ensure mutations invalidate relevant queries

---

## Environment Variables

Required in `.env.local`:
```bash
NEXT_PUBLIC_API_BASE_URL=http://localhost:5000/api
NEXT_PUBLIC_API_TIMEOUT=30000
NEXT_PUBLIC_JWT_STORAGE_KEY=smart_insights_token
NEXT_PUBLIC_ENV=development
NEXT_PUBLIC_DEBUG_API=true
```

---

## Dependencies to Install

Already have:
- axios ✅
- react-query ✅
- react-hook-form ✅
- zod ✅
- react-toastify ✅
- @mui/material ✅

No additional packages needed!

---

## Estimated Timeline

- **Phase 1-2** (Infrastructure & Auth): 2 hours
- **Phase 3** (User Module): 3 hours
- **Phase 4** (Inquiry Module): 3 hours
- **Phase 5** (Input Module): 4 hours
- **Phase 6** (New Modules): 4 hours
- **Phase 7** (Page Updates): 4 hours
- **Phase 8** (Components): 3 hours
- **Phase 9** (Authorization): 2 hours
- **Phase 10-11** (Config & UX): 2 hours
- **Phase 12** (Testing): 3 hours

**Total: ~30 hours of focused development**

---

## Success Criteria

Integration is complete when:

1. ✅ All authentication works (login, logout, token refresh)
2. ✅ Admin can create inquiries and send them
3. ✅ Students see targeted inquiries based on their dept/program/semester
4. ✅ Students can submit responses and general feedback
5. ✅ Admin can view all inputs with AI analysis
6. ✅ Topics are created and inputs are grouped
7. ✅ Conversation/reply system works
8. ✅ Identity reveal request/response flow works
9. ✅ All CRUD operations work for departments, programs, semesters, themes
10. ✅ User management (create, edit, delete, CSV import) works
11. ✅ Dashboard shows real statistics
12. ✅ Role-based access control prevents unauthorized access
13. ✅ Error handling shows meaningful messages
14. ✅ Loading states work correctly
15. ✅ No console errors or warnings

---

## Notes

- **Don't change existing patterns** - Follow the Volt architecture
- **Keep module structure** - Use existing folder organization
- **JSDoc, not TypeScript** - Use @typedef comments
- **React Query first** - All server state via React Query
- **MUI styling** - Use `sx` prop, not custom CSS
- **Toast notifications** - Use react-toastify for feedback
- **Test incrementally** - Test each API as you update it

---

**This plan ensures we integrate the backend seamlessly while maintaining our clean, modular, and maintainable frontend architecture.**

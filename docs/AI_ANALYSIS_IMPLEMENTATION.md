# AI Analysis Implementation Guide

## Overview
This document describes the implementation of AI-powered feedback analysis features, including the design philosophy, color semantics, component structure, and usage guidelines.

---

## 🎨 Color Philosophy & Semantic Design

### Core Principle
**Colors should have semantic meaning and never contradict each other.**

- 🔴 **Red** = ONLY for negative/error states (problems, issues, negative sentiment)
- 🟢 **Green** = ONLY for positive states (success, positive sentiment)
- 🟣 **Purple** = High importance/priority (neutral urgency - works for both positive & negative)
- 🔵 **Blue** = Medium importance/significance (professional, calm, neutral)
- ⚪ **Gray** = Low priority/routine OR neutral sentiment
- 🟠 **Orange** = Mixed states (warnings, mixed sentiment)

### Why This Matters
AI analyzes feedback across **multiple independent dimensions**. A student can give **positive, constructive feedback** about an **urgent, high-priority matter**:

```
Example: "I love the new AI course, but we urgently need better GPUs!"

Importance: 🟣 High (critical infrastructure need)
Sentiment: 🟢 Positive (appreciative tone)

This is NOT contradictory - it's constructive, high-value feedback!
```

---

## 📊 AI Analysis Dimensions

### 1. Importance Level
**What it measures:** How urgent/critical the matter is (regardless of sentiment)

| Level | Value | Color | Icon | Meaning |
|-------|-------|-------|------|---------|
| High | 3 | 🟣 Purple `#9c27b0` | ⭐ Full Star | Critical matters requiring prompt attention |
| Medium | 2 | 🔵 Blue `#1976d2` | ⭐ Half Star | Significant topics worth timely attention |
| Low | 1 | ⚪ Gray `#757575` | ☆ Empty Star | Routine suggestions, minor observations |

**Component:** `ImportanceLevelBadge`
**Location:** `/frontend/modules/shared/components/importance-level-badge/`

**Color Codes:**
```javascript
High Importance:
  - Background: #f3e5f5 (light purple)
  - Text/Icon: #9c27b0 (purple)
  - Border: #ce93d8 (light purple border)

Medium Importance:
  - Background: #e3f2fd (light blue)
  - Text/Icon: #1976d2 (blue)
  - Border: #90caf9 (light blue border)

Low Importance:
  - Background: #f5f5f5 (light gray)
  - Text/Icon: #757575 (gray)
  - Border: #bdbdbd (gray border)
```

---

### 2. Sentiment
**What it measures:** Emotional tone of the feedback

| Type | Color | Icon | Meaning |
|------|-------|------|---------|
| Positive | 🟢 Green `#4caf50` | 😊 | Satisfaction, appreciation, optimism |
| Negative | 🔴 Red `#f44336` | 😞 | Dissatisfaction, frustration, concern |
| Neutral | ⚪ Gray `#9e9e9e` | 😐 | Objective, factual, no strong emotion |
| Mixed | 🟠 Orange `#ff9800` | 😕 | Both positive and negative elements |

**Component:** `SentimentIndicator`
**Location:** `/frontend/modules/shared/components/sentiment-indicator/`

**Usage:**
```javascript
<SentimentIndicator sentiment="POSITIVE" />
```

---

### 3. Tone
**What it measures:** Communication style of the feedback

| Type | Color | Meaning |
|------|-------|---------|
| Formal | 🔵 Blue (Primary) | Structured, professional, proper grammar |
| Informal | 🟣 Purple (Secondary) | Conversational, relaxed, casual |
| Neutral | ⚪ Gray (Default) | Balanced, matter-of-fact |
| Professional | 🔵 Blue | Business-like, well-composed |
| Casual | 🟣 Purple | Relaxed, friendly |

**Component:** `ToneIndicator`
**Location:** `/frontend/modules/shared/components/tone-indicator/`

**Usage:**
```javascript
<ToneIndicator tone="Formal" />
```

---

### 4. Theme
**What it measures:** AI-detected thematic category (e.g., Academics, Infrastructure, etc.)

**Component:** `ThemeChip`
**Location:** `/frontend/modules/shared/components/theme-chip/`

**Color:** Primary blue (indicates AI-generated category)

---

### 5. Topic
**What it measures:** Admin-assigned organizational category

**Component:** `Chip` (Material-UI standard)
**Color:** Secondary purple (outlined variant)

**Difference from Theme:**
- **Theme** = AI automatically categorizes
- **Topic** = Admin manually assigns for organization

---

## 🧩 Component Architecture

### InputCard Component
**Location:** `/frontend/modules/input/components/input-card/`

**Structure:**
```
┌─────────────────────────────────────────────────────────┐
│ [Type Badge] [Status] [Reply Count]         Date        │
├─────────────────────────────────────────────────────────┤
│ Feedback body text...                                   │
├─────────────────────────────────────────────────────────┤
│ AI Analysis                                             │
│                                                         │
│ Importance        Sentiment      Tone       Theme       │
│ 🟣 High Importance 🟢 Positive   🗣️ Formal  🏷️ Academics │
└─────────────────────────────────────────────────────────┘
```

**Features:**
- Each badge has a **label above it** (e.g., "Importance", "Sentiment")
- Tooltips on hover explain what each badge means
- Responsive wrapping on mobile
- Conditional rendering (only shows available AI data)

**Props:**
```javascript
<InputCard
  input={inputObject}
  showAIAnalysis={true}      // Show AI badges
  showInquiryLink={true}     // Show linked inquiry
  onClick={() => {...}}      // Optional click handler
/>
```

---

## 🔍 Admin Filtering System

### Filter Page
**Location:** `/frontend/pages/admin/inputs/index.js`

### Available Filters

#### 1. Search
Full-text search through feedback content

#### 2. Status
Filter by processing workflow:
- Pending
- Processing
- Processed
- Reviewed
- Resolved
- Archived

#### 3. Type
- General Feedback
- Inquiry Response

#### 4. Importance (AI Filter)
- 🟣 High Importance
- 🔵 Medium Importance
- ⚪ Low Importance

**Backend Field:** `severity` (1, 2, or 3)

#### 5. Sentiment (AI Filter)
- 😊 Positive
- 😐 Neutral
- 😞 Negative
- 😕 Mixed

**Backend Field:** `sentiment` (string)

#### 6. Tone (AI Filter)
- Formal
- Informal
- Neutral
- Professional
- Casual

**Backend Field:** `tone` (string)

#### 7. Sort Options
- 📅 Date Created
- ⭐ Importance Level
- 💯 Quality Score

---

## 📋 Filtering Best Practices

### Common Use Cases

#### Crisis Management
```
Filters:
  Importance: 🟣 High
  Sentiment: 🔴 Negative
  Sort By: ⭐ Importance Level

Result: Urgent problems requiring immediate action
```

#### Constructive Feedback Discovery
```
Filters:
  Importance: 🟣 High
  Sentiment: 🟢 Positive

Result: Valuable suggestions from engaged students
```

#### Quality Analysis
```
Filters:
  Sentiment: 🟢 Positive
  Sort By: 💯 Quality Score (desc)

Result: Best positive feedback for testimonials
```

#### Triage Workflow
```
Filters:
  Status: Pending
  Sort By: ⭐ Importance Level (desc)

Result: New feedback, most urgent first
```

---

## 🎯 Data Structure

### API Response Format
```json
{
  "id": "uuid",
  "body": "Feedback text...",
  "type": "General" | "InquiryLinked",
  "status": "Pending" | "Processing" | "Processed" | "Reviewed" | "Resolved" | "Archived",

  "sentiment": "Positive" | "Negative" | "Neutral" | "Mixed",
  "tone": "Formal" | "Informal" | "Neutral" | "Professional" | "Casual",

  "metrics": {
    "severity": 1 | 2 | 3,        // Maps to Low/Medium/High Importance
    "urgency": 0.0-1.0,
    "importance": 0.0-1.0,
    "clarity": 0.0-1.0,
    "quality": 0.0-1.0,
    "helpfulness": 0.0-1.0,
    "score": 0.0-1.0
  },

  "theme": {
    "id": "uuid",
    "name": "Academics" | "Infrastructure" | etc.
  },

  "topic": {
    "id": "uuid",
    "name": "Admin-assigned topic name"
  },

  "replyCount": 4,
  "createdAt": "ISO-8601 timestamp"
}
```

### Backend Filter Endpoint
**Endpoint:** `GET /api/inputs/filter`

**Query Parameters:**
```javascript
{
  page: number,
  pageSize: number,
  type: "General" | "InquiryLinked",
  sentiment: "Positive" | "Negative" | "Neutral" | "Mixed",
  severity: 1 | 2 | 3,
  tone: string,
  status: string,
  search: string,
  sortBy: "createdAt" | "severity" | "score",
  sortOrder: "asc" | "desc"
}
```

---

## 🔄 Student Conversation Feature

### Student Input Details Page
**Location:** `/frontend/pages/input/[inputId].js`

**Features:**
- View full feedback submission
- **Dynamic conversation thread** with admin
- Send replies to admin
- Handle identity reveal requests (Approve/Deny)
- Color-coded messages:
  - Admin messages: Blue left border, light blue background
  - Student messages: Green left border, gray background

**Access:** Students click on input cards in `/input/my-inputs`

### Admin Input Details Page
**Location:** `/frontend/pages/admin/inputs/[inputId].js`

**Features:**
- View full input details with AI analysis
- **Conversation thread** with student
- Send replies to student
- Request identity reveal (for anonymous feedback)

---

## 🎨 Component Styling Guidelines

### Badge Spacing
- Gap between badges: `3` (MUI spacing units)
- Label margin-bottom: `0.5` (MUI spacing units)
- Label font-size: `0.7rem`

### Color Consistency
**ALWAYS use these exact color codes:**

```javascript
// Importance
PURPLE_HIGH = "#9c27b0"
BLUE_MEDIUM = "#1976d2"
GRAY_LOW = "#757575"

// Sentiment
GREEN_POSITIVE = "#4caf50"
RED_NEGATIVE = "#f44336"
GRAY_NEUTRAL = "#9e9e9e"
ORANGE_MIXED = "#ff9800"
```

### Tooltip Guidelines
- Placement: `top`
- Include arrow: `arrow={true}`
- Explain **what** the badge means AND **why** it was assigned
- Mention AI analysis where applicable

---

## 📦 Component Exports

### Shared Components Index
**Location:** `/frontend/modules/shared/components/index.js`

```javascript
export * from "./importance-level-badge";  // NEW - Use this!
export * from "./severity-badge";          // DEPRECATED - Old red/orange/blue
export * from "./importance-badge";        // DEPRECATED - Old green/orange/red
export * from "./sentiment-indicator";
export * from "./tone-indicator";
export * from "./theme-chip";
```

**Note:** Always use `ImportanceLevelBadge`, NOT `SeverityBadge` or `ImportanceBadge`

---

## 🚨 Common Pitfalls & Solutions

### Issue: Red color on importance badges
**Problem:** Using old `SeverityBadge` component
**Solution:** Use `ImportanceLevelBadge` instead
**File:** Any component importing badges

### Issue: Green on Low Importance
**Problem:** Using old `ImportanceBadge` component
**Solution:** Use `ImportanceLevelBadge` instead

### Issue: Colors not showing correctly
**Problem:** Relying on Material-UI theme's `color="secondary"`
**Solution:** `ImportanceLevelBadge` now uses explicit hex colors
**File:** `/frontend/modules/shared/components/importance-level-badge/`

### Issue: No labels above badges
**Problem:** Using old flat badge layout
**Solution:** Each badge is wrapped in a `<Box>` with label Typography
**File:** `/frontend/modules/input/components/input-card/`

### Issue: Filters not working
**Problem:** Backend field name mismatch
**Solution:** Use `severity` for importance, not `importance`
**File:** `/frontend/pages/admin/inputs/index.js`

---

## 🧪 Testing Checklist

### Visual Tests
- [ ] High Importance badge shows PURPLE (not red)
- [ ] Medium Importance badge shows BLUE
- [ ] Low Importance badge shows GRAY (not green)
- [ ] Positive Sentiment shows GREEN
- [ ] Negative Sentiment shows RED
- [ ] Labels appear above each badge
- [ ] Tooltips appear on hover
- [ ] Badges wrap properly on mobile

### Functional Tests
- [ ] Filter by High Importance works
- [ ] Filter by Negative Sentiment works
- [ ] Combine filters (High + Negative)
- [ ] Sort by Importance Level works
- [ ] Search + filters work together
- [ ] Clear All button resets filters
- [ ] Active filter counter accurate

### Integration Tests
- [ ] Student can click card → navigate to details
- [ ] Student can send reply in conversation
- [ ] Admin can filter and find specific inputs
- [ ] AI badges show real backend data
- [ ] Reply count updates after sending message

---

## 📚 Reference Links

### Components
- ImportanceLevelBadge: `/frontend/modules/shared/components/importance-level-badge/`
- SentimentIndicator: `/frontend/modules/shared/components/sentiment-indicator/`
- ToneIndicator: `/frontend/modules/shared/components/tone-indicator/`
- ThemeChip: `/frontend/modules/shared/components/theme-chip/`
- InputCard: `/frontend/modules/input/components/input-card/`

### Pages
- Admin All Inputs: `/frontend/pages/admin/inputs/index.js`
- Admin Input Details: `/frontend/pages/admin/inputs/[inputId].js`
- Student My Inputs: `/frontend/pages/input/my-inputs.js`
- Student Input Details: `/frontend/pages/input/[inputId].js`

### APIs
- Get All Inputs: `/frontend/modules/input/apis/get-all-inputs/`
- Get Input By ID: `/frontend/modules/input/apis/get-input-by-id/`
- Get Input Replies: `/frontend/modules/input/apis/get-input-replies/`
- Create Reply: `/frontend/modules/input/apis/create-input-reply/`

### Backend
- Inputs Controller: `/backend/src/SmartInsights.API/Controllers/InputsController.cs`
- Input Service: `/backend/src/SmartInsights.Application/Services/InputService.cs`
- Input Filter DTO: `/backend/src/SmartInsights.Application/DTOs/Inputs/InputFilterDto.cs`

---

## 🔮 Future Enhancements

### Potential Additions
1. **Composite Priority Score** - Combine importance + sentiment for overall priority
2. **Trend Analysis** - Track importance/sentiment over time
3. **Department Filtering** - Filter by student department (currently removed)
4. **Topic Filtering** - Filter by topic (currently available on Topics page)
5. **Bulk Actions** - Mark multiple inputs as reviewed/resolved
6. **Export Filtered Results** - Download filtered inputs as CSV/PDF
7. **Saved Filters** - Save common filter combinations
8. **Filter Presets** - Quick access to "Crisis", "Constructive", "Praise" filters

### Color Palette Expansion
If new analysis dimensions are added:
- 🟤 Brown - Could represent "Factual/Data-driven"
- 💛 Yellow - Could represent "Question/Inquiry"
- 🔶 Teal - Could represent "Suggestion/Recommendation"

---

## 📝 Change Log

### Version 1.0 - December 2025
- ✅ Created `ImportanceLevelBadge` with purple/blue/gray colors
- ✅ Renamed "Severity" to "Importance" across UI
- ✅ Added labels above all AI badges
- ✅ Implemented comprehensive filtering system
- ✅ Built student conversation feature
- ✅ Added tooltips to all badges
- ✅ Removed Topic and Department filters from All Inputs page
- ✅ Deprecated old `SeverityBadge` and `ImportanceBadge` components

---

## 🤝 Contributing

When working on AI analysis features:

1. **Always use semantic colors** - Red = negative, Green = positive, Purple = urgent/important
2. **Add tooltips** - Explain what badges mean and why they were assigned
3. **Test combinations** - Verify High Importance + Positive Sentiment displays correctly
4. **Mobile-first** - Ensure badges wrap properly on small screens
5. **Backend alignment** - Verify field names match backend DTOs
6. **Documentation** - Update this file when adding new features

---

**Last Updated:** December 2025
**Maintained By:** FYP Development Team
**Questions?** Check the codebase or backend API documentation.

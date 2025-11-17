# Event Creation Feature - Architecture & Flow

## System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                     SLIIT CHOIR APPLICATION                     │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │                    FRONTEND (React/Vite)                │   │
│  │                                                           │   │
│  │  ┌─────────────────────────────────────────────────┐    │   │
│  │  │              App.tsx (Main Router)              │    │   │
│  │  │  ┌─────────────────────────────────────────┐   │    │   │
│  │  │  │ Home | Members | CreateEvent | Success │   │    │   │
│  │  │  └─────────────────────────────────────────┘   │    │   │
│  │  └─────────────────────────────────────────────────┘    │   │
│  │           ↓                ↓              ↓              │   │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐   │   │
│  │  │ Navigation   │  │   Members    │  │EventCreation │   │   │
│  │  │ Component    │  │   Portal     │  │  Component   │   │   │
│  │  │              │  │              │  │              │   │   │
│  │  │ "Create      │  │ View Events  │  │ Form:        │   │   │
│  │  │  Event" btn  │  │ User Profile │  │ - Title      │   │   │
│  │  │ (visible for │  │ User Settings│  │ - Date       │   │   │
│  │  │ admin/mod)   │  │              │  │ - Location   │   │   │
│  │  │              │  │              │  │ - Time       │   │   │
│  │  └──────────────┘  └──────────────┘  │ - Type       │   │   │
│  │                                       │ - Capacity   │   │   │
│  │  ┌──────────────────────────────┐   │ - Image      │   │   │
│  │  │    Utility Functions         │   │              │   │   │
│  │  │    (roleUtils.ts)            │   │ Validation:  │   │   │
│  │  │                              │   │ - Dates      │   │   │
│  │  │ - canCreateEvents()          │   │ - Required   │   │   │
│  │  │ - hasRole()                  │   │ - Capacity   │   │   │
│  │  │ - isAdmin()                  │   │              │   │   │
│  │  │ - isModerator()              │   │ API Request: │   │   │
│  │  │ - getCurrentMember()         │   │ POST /events │   │   │
│  │  └──────────────────────────────┘   └──────────────┘   │   │
│  │                                                           │   │
│  │  ┌──────────────────────────────┐                        │   │
│  │  │     localStorage             │                        │   │
│  │  │  ┌────────────────────────┐  │                        │   │
│  │  │  │ authToken: JWT         │  │                        │   │
│  │  │  │ member: {              │  │                        │   │
│  │  │  │   firstName,           │  │                        │   │
│  │  │  │   lastName,            │  │                        │   │
│  │  │  │   role: admin/mod/...  │  │                        │   │
│  │  │  │   ...                  │  │                        │   │
│  │  │  │ }                      │  │                        │   │
│  │  │  └────────────────────────┘  │                        │   │
│  │  └──────────────────────────────┘                        │   │
│  │                                                           │   │
│  └──────────────────────────────────────────────────────────┘   │
│                         ↓ HTTP Requests                         │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │            BACKEND (Node.js/Express)                    │   │
│  │                                                           │   │
│  │  ┌────────────────────────────────────────────────────┐  │   │
│  │  │           API Routes (routes/events.js)           │  │   │
│  │  │                                                    │  │   │
│  │  │  POST   /events      (Create - admin/mod only)   │  │   │
│  │  │  GET    /events      (Get all events)            │  │   │
│  │  │  GET    /events/:id  (Get single event)          │  │   │
│  │  │  PUT    /events/:id  (Update - admin/mod only)   │  │   │
│  │  │  DELETE /events/:id  (Delete - admin/mod only)   │  │   │
│  │  │  POST   /events/:id/register (Register member)   │  │   │
│  │  │                                                    │  │   │
│  │  └────────────────────────────────────────────────────┘  │   │
│  │         ↓ (authenticate, authorize)                       │   │
│  │  ┌────────────────────────────────────────────────────┐  │   │
│  │  │        Middleware (middleware/auth.js)            │  │   │
│  │  │                                                    │  │   │
│  │  │  JWT Verification                                 │  │   │
│  │  │  ├─ Extract token from Authorization header      │  │   │
│  │  │  ├─ Verify JWT signature                         │  │   │
│  │  │  ├─ Check token expiration                       │  │   │
│  │  │  └─ Attach user data to request                 │  │   │
│  │  │                                                    │  │   │
│  │  │  Role Authorization                              │  │   │
│  │  │  ├─ Check user role in token                     │  │   │
│  │  │  ├─ Allow only admin/moderator for events       │  │   │
│  │  │  └─ Return 403 if unauthorized                  │  │   │
│  │  │                                                    │  │   │
│  │  └────────────────────────────────────────────────────┘  │   │
│  │         ↓                                                  │   │
│  │  ┌────────────────────────────────────────────────────┐  │   │
│  │  │    Controllers (controllers/authController.js)     │  │   │
│  │  │                                                    │  │   │
│  │  │  createEvent(req, res)                            │  │   │
│  │  │  ├─ Validate request data                         │  │   │
│  │  │  ├─ Check required fields                         │  │   │
│  │  │  ├─ Create Event model instance                  │  │   │
│  │  │  ├─ Set createdBy to current user               │  │   │
│  │  │  ├─ Save to database                             │  │   │
│  │  │  └─ Return created event                         │  │   │
│  │  │                                                    │  │   │
│  │  └────────────────────────────────────────────────────┘  │   │
│  │         ↓                                                  │   │
│  │  ┌────────────────────────────────────────────────────┐  │   │
│  │  │      Database Models (models/Event.js)            │  │   │
│  │  │                                                    │  │   │
│  │  │  Event {                                          │  │   │
│  │  │    _id: ObjectId                                  │  │   │
│  │  │    title: String ⚠️ required                      │  │   │
│  │  │    description: String                            │  │   │
│  │  │    date: Date ⚠️ required                         │  │   │
│  │  │    time: String                                   │  │   │
│  │  │    location: String ⚠️ required                   │  │   │
│  │  │    eventType: String ⚠️ required                  │  │   │
│  │  │    capacity: Number (default: 100)                │  │   │
│  │  │    image: String (URL)                            │  │   │
│  │  │    createdBy: ObjectId (ref: Member)             │  │   │
│  │  │    registrations: Array                           │  │   │
│  │  │    status: String (upcoming/ongoing/completed)    │  │   │
│  │  │    createdAt: Date                                │  │   │
│  │  │    updatedAt: Date                                │  │   │
│  │  │  }                                                 │  │   │
│  │  │                                                    │  │   │
│  │  └────────────────────────────────────────────────────┘  │   │
│  │                                                           │   │
│  └──────────────────────────────────────────────────────────┘   │
│                         ↓                                        │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │        DATABASE (MongoDB Atlas/Local)                   │   │
│  │                                                           │   │
│  │  ┌────────────────────────────────────────────────────┐  │   │
│  │  │  Collections:                                      │  │   │
│  │  │  ├─ members (Users with roles)                    │  │   │
│  │  │  │  └─ role: 'member' | 'moderator' | 'admin'    │  │   │
│  │  │  │                                                 │  │   │
│  │  │  └─ events (Events created by admin/moderators)   │  │   │
│  │  │     └─ createdBy: ObjectId (ref: members)        │  │   │
│  │  │                                                    │  │   │
│  │  └────────────────────────────────────────────────────┘  │   │
│  │                                                           │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

## Data Flow for Event Creation

```
┌─────────────────────────────────────────────────────────────────┐
│                   USER ACTION: CLICK "CREATE EVENT"             │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│   Navigation Component (canCreateEvents() === true)             │
│   └─ Only visible if user is admin or moderator                │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│        App.tsx navigates to /create-event route                 │
│        └─ Sets currentPage = "create-event"                    │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│      EventCreation Component renders with form                  │
│      ┌───────────────────────────────────────────────────────┐  │
│      │ Form fields:                                          │  │
│      │ - Title (required)                                    │  │
│      │ - Description (optional)                              │  │
│      │ - Date (required)                                     │  │
│      │ - Time (optional)                                     │  │
│      │ - Location (required)                                 │  │
│      │ - Event Type (required)                               │  │
│      │ - Capacity (optional)                                 │  │
│      │ - Image URL (optional)                                │  │
│      │                                                        │  │
│      │ ┌──────────────────────────────────────┐             │  │
│      │ │   [Create Event]  [Cancel]           │             │  │
│      │ └──────────────────────────────────────┘             │  │
│      └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│         USER ACTION: FILL FORM & CLICK "CREATE EVENT"           │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│          CLIENT-SIDE VALIDATION (EventCreation.tsx)             │
│          ├─ Check all required fields are filled                │
│          ├─ Validate date is not in the past                    │
│          ├─ Validate capacity >= 1                              │
│          └─ Show error message if validation fails              │
└─────────────────────────────────────────────────────────────────┘
                              ↓ (if valid)
┌─────────────────────────────────────────────────────────────────┐
│       FETCH REQUEST (with JWT token from localStorage)          │
│                                                                   │
│  POST /api/events                                                │
│  Headers: {                                                      │
│    Authorization: "Bearer eyJhbGciOiJIUzI1NiIs...",            │
│    Content-Type: "application/json"                             │
│  }                                                               │
│  Body: {                                                         │
│    title: "Annual Concert 2025",                                │
│    description: "Join us...",                                   │
│    date: "2025-12-20",                                          │
│    time: "18:30",                                               │
│    location: "SLIIT Auditorium",                                │
│    eventType: "performance",                                    │
│    capacity: 500,                                               │
│    image: "https://..."                                         │
│  }                                                               │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│           BACKEND AUTHENTICATION (middleware/auth.js)           │
│                                                                   │
│  ├─ Extract JWT from Authorization header                       │
│  ├─ Verify JWT signature using JWT_SECRET                       │
│  ├─ Decode JWT to get user data:                               │
│  │  {                                                            │
│  │    id: "507f1f77bcf86cd799439011",                          │
│  │    studentId: "AD12345678",                                  │
│  │    role: "admin"  or  "moderator"                            │
│  │  }                                                            │
│  └─ Attach to req.user for next middleware                     │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│        BACKEND AUTHORIZATION (authorize middleware)             │
│                                                                   │
│  ├─ Check if req.user exists                                    │
│  ├─ Check if req.user.role === 'admin' OR 'moderator'         │
│  └─ If not authorized, return 403 Forbidden                    │
└─────────────────────────────────────────────────────────────────┘
                              ↓ (if authorized)
┌─────────────────────────────────────────────────────────────────┐
│    BACKEND VALIDATION (routes/events.js controller)             │
│                                                                   │
│  ├─ Validate required fields: title, date, eventType            │
│  ├─ Validate field formats                                      │
│  └─ Return 400 Bad Request if invalid                           │
└─────────────────────────────────────────────────────────────────┘
                              ↓ (if valid)
┌─────────────────────────────────────────────────────────────────┐
│      SAVE TO DATABASE (models/Event.js)                         │
│                                                                   │
│  new Event({                                                     │
│    title: "Annual Concert 2025",                                │
│    description: "Join us...",                                   │
│    date: 2025-12-20T00:00:00Z,                                  │
│    time: "18:30",                                               │
│    location: "SLIIT Auditorium",                                │
│    eventType: "performance",                                    │
│    capacity: 500,                                               │
│    image: "https://...",                                        │
│    createdBy: req.user.id,  ← Current user's ID                │
│    status: "upcoming",                                          │
│    registrations: [],                                           │
│    createdAt: new Date(),                                       │
│    updatedAt: new Date()                                        │
│  })                                                              │
│  .save()                                                         │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│     RESPONSE SENT TO FRONTEND                                   │
│                                                                   │
│  Status: 201 Created                                             │
│  Body: {                                                         │
│    success: true,                                               │
│    data: {                                                       │
│      _id: "507f1f77bcf86cd799439012",                          │
│      title: "Annual Concert 2025",                              │
│      ...                                                         │
│    },                                                            │
│    message: "Event created"                                     │
│  }                                                               │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│    FRONTEND SUCCESS HANDLING (EventCreation.tsx)                │
│                                                                   │
│  ├─ Display success message ✓                                   │
│  ├─ Show CheckCircle icon                                       │
│  ├─ Display "Event created successfully" message                │
│  ├─ Show "Redirecting you back..." text                         │
│  └─ Wait 1.5 seconds...                                         │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│    AUTO-REDIRECT TO MEMBERS PORTAL                              │
│                                                                   │
│  ├─ Call onEventCreated() callback                              │
│  ├─ Set currentPage = "members"                                 │
│  ├─ Navigate to /members route                                  │
│  └─ User returns to Members Portal                              │
└─────────────────────────────────────────────────────────────────┘
```

## Error Flow

```
┌─────────────────────────────────────────┐
│   User submits form with invalid data   │
└─────────────────────────────────────────┘
              ↓
┌─────────────────────────────────────────────────────────────────┐
│         CLIENT-SIDE VALIDATION FAILS                            │
│         (EventCreation.tsx validation logic)                    │
│                                                                   │
│         Error Examples:                                         │
│         - "Event title is required"                             │
│         - "Event location is required"                          │
│         - "Event capacity must be at least 1"                   │
│         - "Event date and time cannot be in the past"           │
│                                                                   │
│         Result: setError(errorMessage)                          │
└─────────────────────────────────────────────────────────────────┘
              ↓
┌─────────────────────────────────────────────────────────────────┐
│   ERROR DISPLAYED TO USER                                       │
│                                                                   │
│   ┌──────────────────────────────────────────────────────────┐  │
│   │ ⚠️  Event title is required                             │  │
│   └──────────────────────────────────────────────────────────┘  │
│                                                                   │
│   User can fix error and resubmit                               │
└─────────────────────────────────────────────────────────────────┘

---

┌─────────────────────────────────────────┐
│   Network/API Error during submission   │
└─────────────────────────────────────────┘
              ↓
┌─────────────────────────────────────────────────────────────────┐
│         API REQUEST FAILS                                       │
│                                                                   │
│         Possible Errors:                                        │
│         - 401 Unauthorized (token expired)                      │
│         - 403 Forbidden (not admin/moderator)                   │
│         - 400 Bad Request (invalid data)                        │
│         - 500 Server Error                                      │
│         - Network error                                         │
│                                                                   │
│         Result: catch(err) → setError(err.message)              │
└─────────────────────────────────────────────────────────────────┘
              ↓
┌─────────────────────────────────────────────────────────────────┐
│   ERROR DISPLAYED & USER CAN RETRY                              │
│                                                                   │
│   ┌──────────────────────────────────────────────────────────┐  │
│   │ ⚠️  Failed to create event: Not authorized             │  │
│   └──────────────────────────────────────────────────────────┘  │
│                                                                   │
│   Form remains visible, user can fix and retry                  │
└─────────────────────────────────────────────────────────────────┘
```

## Component Hierarchy

```
App.tsx
├── Navigation
│   └── "Create Event" Button (visible for admin/moderator)
│       └── onCreateEventClick() → triggers EventCreation
│
├── EventCreation (when currentPage === "create-event")
│   ├── Card (form container)
│   │   ├── CardHeader
│   │   │   ├── CardTitle: "Create New Event"
│   │   │   └── CardDescription
│   │   │
│   │   └── CardContent
│   │       └── Form
│   │           ├── Error Alert (conditional)
│   │           ├── Input Fields
│   │           │   ├── Title (text input)
│   │           │   ├── Description (textarea)
│   │           │   ├── Date (date input)
│   │           │   ├── Time (time input)
│   │           │   ├── Location (text input)
│   │           │   ├── Capacity (number input)
│   │           │   └── Image URL (url input)
│   │           │
│   │           ├── Select (Event Type)
│   │           │   ├── SelectTrigger
│   │           │   └── SelectContent
│   │           │       ├── Performance
│   │           │       ├── Practice
│   │           │       ├── Charity
│   │           │       ├── Competition
│   │           │       └── Other
│   │           │
│   │           └── Button Group
│   │               ├── Create Event Button
│   │               └── Cancel Button
│   │
│   └── Success Screen (when success === true)
│       └── Card
│           ├── CheckCircle Icon
│           ├── Success Title
│           └── Redirect Message
│
├── MembersPortal (when currentPage === "members")
└── Other pages...
```

## Role-Based Access Control Flow

```
┌──────────────────────────────┐
│   User Logs In               │
│   JWT Token Created          │
│   Member Data Stored         │
└──────────────────────────────┘
              ↓
┌──────────────────────────────────────────────────────────────┐
│   localStorage contains:                                     │
│   {                                                          │
│     authToken: "JWT_TOKEN",                                 │
│     member: {                                               │
│       _id: "...",                                           │
│       firstName: "...",                                     │
│       role: "admin" | "moderator" | "member"               │
│     }                                                        │
│   }                                                          │
└──────────────────────────────────────────────────────────────┘
              ↓
┌──────────────────────────────────────────────────────────────┐
│   Navigation Component Checks:                              │
│   canCreateEvents() → hasRole(['admin', 'moderator'])       │
└──────────────────────────────────────────────────────────────┘
              ↓
    ┌─────────────────────────┬──────────────────────────┐
    ↓ (role is admin/mod)     ↓ (role is member)         ↓ (not logged in)
┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐
│  SHOW BUTTON     │  │  HIDE BUTTON     │  │  SHOW LOGIN      │
│                  │  │                  │  │                  │
│ Green "Create    │  │ Button invisible │  │ BUTTON           │
│  Event" Button   │  │ to user          │  │                  │
│                  │  │                  │  │                  │
│ Can navigate to  │  │ Cannot access    │  │ Access denied    │
│ /create-event    │  │ event creation   │  │                  │
│                  │  │ feature          │  │                  │
└──────────────────┘  └──────────────────┘  └──────────────────┘
```

---

**Legend:**
- ⚠️ = Warning/Error
- ✓ = Success
- → = Leads to / Next Step
- └─ = Contains / Part of

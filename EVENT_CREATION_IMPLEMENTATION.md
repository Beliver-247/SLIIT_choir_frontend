# Event Creation Page Implementation Guide

## Overview
This document explains the implementation of the **Event Creation Page** with role-based access control for admin and moderator users in the SLIIT Choir application.

## Features Implemented

### 1. **Role-Based Access Control**
- **Admin users** can create events
- **Moderator users** can create events
- **Regular members** cannot access the event creation page

### 2. **Event Creation Page**
A dedicated page (`/create-event`) where authorized users can create new events with the following fields:
- **Event Title** (required) - Name of the event
- **Description** (optional) - Detailed description
- **Event Date** (required) - Date of the event
- **Event Time** (optional) - Time of the event
- **Location** (required) - Event venue/location
- **Event Type** (required) - Performance, Practice, Charity, Competition, or Other
- **Capacity** (optional) - Maximum number of attendees (default: 100)
- **Image URL** (optional) - Event poster/image link

### 3. **Form Validation**
The form includes comprehensive validation:
- Checks for required fields
- Validates date is not in the past
- Validates event capacity is at least 1
- Provides clear error messages

### 4. **Navigation Integration**
- "Create Event" button appears in the navigation bar only for admins/moderators
- Button is visible only when the user is on the Members Portal page
- Green styled button with a plus icon for easy identification

## File Structure

### Frontend Files Created/Modified

```
src/
├── utils/
│   └── roleUtils.ts                 (NEW) - Role checking utilities
├── components/
│   ├── EventCreation.tsx            (NEW) - Event creation form component
│   ├── Navigation.tsx               (MODIFIED) - Added create event button
│   └── App.tsx                      (MODIFIED) - Added create event page routing
```

### Backend
The backend already had support for event creation with role authorization:
- `routes/events.js` - Event creation endpoint with `authorize('moderator', 'admin')`
- `middleware/auth.js` - JWT authentication and role-based authorization
- `models/Event.js` - Event schema with `createdBy` field

## Implementation Details

### 1. Role Utilities (`src/utils/roleUtils.ts`)
Provides helper functions to check user roles:
```typescript
- getCurrentMember()      // Get logged-in user's member data
- getCurrentUserRole()    // Get user's role from stored data
- hasRole(role)          // Check if user has specific role(s)
- canCreateEvents()      // Check if user can create events
- isAdmin()              // Check if user is admin
- isModerator()          // Check if user is moderator
```

### 2. Event Creation Component (`src/components/EventCreation.tsx`)
Features:
- Form with all event fields
- Real-time validation
- JWT token authentication
- Success/error handling
- Loading states
- Success message with auto-redirect to Members Portal

### 3. Navigation Updates (`src/components/Navigation.tsx`)
- New `onCreateEventClick` callback prop
- New `currentPage` type includes `"create-event"`
- Conditional rendering: "Create Event" button only shows for:
  - Logged-in users
  - Users with admin/moderator roles
  - When on the Members Portal page

### 4. App Component Updates (`src/App.tsx`)
- Added `"create-event"` to page type options
- New event creation state in URL routing
- Handler for navigating to/from event creation
- Integration of EventCreation component

## Usage Flow

### For Admin/Moderator Users:
1. Log in with admin/moderator credentials
2. Navigate to Members Portal
3. See "Create Event" button in the navigation bar (green button with + icon)
4. Click the button to access the event creation form
5. Fill in event details
6. Click "Create Event" to submit
7. Get a success confirmation
8. Automatically redirected back to Members Portal

### For Regular Members:
- Event creation button is not visible
- Cannot access `/create-event` route (only shows form without creating)
- Can only view and register for existing events

## Database Integration

### Event Model Fields:
```javascript
{
  title: String (required),
  description: String,
  date: Date (required),
  time: String,
  location: String (required),
  eventType: String (enum: ['performance', 'practice', 'charity', 'competition', 'other']),
  image: String (URL),
  capacity: Number (default: 100),
  createdBy: ObjectId (ref: Member),
  status: String (enum: ['upcoming', 'ongoing', 'completed', 'cancelled']),
  registrations: Array,
  createdAt: Date,
  updatedAt: Date
}
```

## API Endpoint

### Create Event
- **Method:** POST
- **URL:** `http://localhost:5000/api/events`
- **Authentication:** Required (JWT Bearer token)
- **Authorization:** Requires 'moderator' or 'admin' role

**Request Headers:**
```
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json
```

**Request Body:**
```json
{
  "title": "Annual Concert 2025",
  "description": "Join us for our annual concert...",
  "date": "2025-12-15",
  "time": "18:30",
  "location": "SLIIT Auditorium, Malabe",
  "eventType": "performance",
  "capacity": 500,
  "image": "https://example.com/event.jpg"
}
```

**Success Response (201):**
```json
{
  "success": true,
  "data": {
    "_id": "...",
    "title": "Annual Concert 2025",
    ...
  },
  "message": "Event created"
}
```

**Error Response (403):**
```json
{
  "message": "Not authorized"
}
```

## Testing

### Test Case 1: Admin Creating Event
1. Log in with admin credentials
2. Go to Members Portal
3. Click "Create Event"
4. Fill in event details
5. Submit
6. ✅ Event should be created successfully

### Test Case 2: Moderator Creating Event
1. Log in with moderator credentials
2. Go to Members Portal
3. Click "Create Event"
4. Fill in event details
5. Submit
6. ✅ Event should be created successfully

### Test Case 3: Member Cannot See Create Button
1. Log in with regular member credentials
2. Go to Members Portal
3. ❌ "Create Event" button should NOT be visible

### Test Case 4: Form Validation
1. Try submitting with empty required fields
2. ✅ Should show error message
3. Try setting event date in the past
4. ✅ Should show error message

## Future Enhancements

1. **Event Editing** - Allow admins/moderators to edit existing events
2. **Event Deletion** - Add delete functionality for event creators
3. **Event Management Dashboard** - Display all created events with statistics
4. **Event Notifications** - Notify members of new events
5. **Event Categories** - Add more filtering options
6. **Image Upload** - Allow uploading images instead of just URLs
7. **Recurring Events** - Support for repeating events

## Notes

- The "Create Event" button uses a green color (`bg-green-600`) to differentiate it from other actions
- Form validates client-side before sending to server
- Backend also validates and enforces role-based authorization
- JWT token is automatically included from localStorage
- Successful creation redirects user back to Members Portal
- All timestamps are stored in UTC format

## Troubleshooting

### Issue: "Create Event" button not showing
- **Solution:** Ensure user is logged in with admin/moderator role
- Check localStorage for member data with correct role

### Issue: Form submission fails with 403 error
- **Solution:** Token may have expired
- Log out and log back in to get a fresh token

### Issue: Event not appearing after creation
- **Solution:** Refresh the page or navigate away and back
- Check that event date is not in the past

---

**Version:** 1.0  
**Last Updated:** November 17, 2025  
**Status:** Complete and Ready for Testing

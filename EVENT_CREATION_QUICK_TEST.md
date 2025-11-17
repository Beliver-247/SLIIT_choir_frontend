# Quick Start: Event Creation Feature Testing

## Prerequisites
- Backend server running on `http://localhost:5000`
- Frontend server running on `http://localhost:5173` (or similar)
- MongoDB connected and running
- Admin/Moderator test user created in database

## Quick Setup (5 minutes)

### 1. Create Test Admin User
Use MongoDB Compass or Atlas to add this document to the `members` collection:

```json
{
  "firstName": "Admin",
  "lastName": "Test",
  "studentId": "AD12345678",
  "email": "admin@test.com",
  "password": "hashedpasswordwillcreatehere",
  "role": "admin",
  "status": "active",
  "createdAt": "2025-11-17T00:00:00Z",
  "updatedAt": "2025-11-17T00:00:00Z"
}
```

**OR** Register through API:
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Admin",
    "lastName": "Test",
    "studentId": "AD12345678",
    "email": "admin@test.com",
    "password": "admin123",
    "confirmPassword": "admin123"
  }'
```

Then update role in database: `db.members.updateOne({studentId: "AD12345678"}, {$set: {role: "admin"}})`

### 2. Test Event Creation (5 minutes)

**Step 1: Login**
- Open frontend: `http://localhost:5173`
- Click "Members Login"
- Enter: `AD12345678` / `admin123`

**Step 2: Create Event**
- After login, Members Portal opens
- Look for green "Create Event" button (with + icon) in navigation
- Click it
- Fill in form:
  - Title: "Test Concert"
  - Date: Tomorrow's date
  - Time: 18:00
  - Location: "Auditorium"
  - Type: "Performance"
  - Capacity: 100
- Click "Create Event"

**Step 3: Verify**
- Should see success message
- Auto-redirect to Members Portal
- Event should appear in Events list

## Test Scenarios

### Scenario 1: Admin Creates Event ✅
**Expected:** Success - Event created  
**Button visible:** YES

### Scenario 2: Moderator Creates Event ✅
**Expected:** Success - Event created  
**Button visible:** YES  
**Setup:** Change test user role to "moderator"

### Scenario 3: Member Cannot Create Event ✅
**Expected:** Button hidden  
**Button visible:** NO  
**Setup:** Change test user role to "member"

### Scenario 4: Validation Testing
**Test:** Leave title empty → Click Create
**Expected:** Error: "Event title is required"

**Test:** Select past date → Click Create  
**Expected:** Error: "Event date and time cannot be in the past"

**Test:** Set capacity to 0 → Click Create
**Expected:** Error: "Event capacity must be at least 1"

## Files Modified

```
Frontend:
✅ src/utils/roleUtils.ts - NEW (Role checking utilities)
✅ src/components/EventCreation.tsx - NEW (Event form component)
✅ src/components/Navigation.tsx - MODIFIED (Added create button)
✅ src/App.tsx - MODIFIED (Added page routing)

Backend:
✅ routes/events.js - Already supports admin/moderator authorization
✅ middleware/auth.js - Already has role checking
✅ models/Event.js - Already has proper schema
```

## What's New

### Components
- **EventCreation.tsx:** Full event creation form with validation
- **roleUtils.ts:** Helper functions for role checking

### Features
- ✅ Role-based access control (admin/moderator only)
- ✅ Form validation (required fields, date validation)
- ✅ JWT authentication (token from localStorage)
- ✅ Success/error feedback
- ✅ Loading states
- ✅ Auto-redirect after creation

### UI Changes
- Green "Create Event" button in navigation (admin/moderator only)
- Button visible in Members Portal
- Full-page event creation form
- Success confirmation screen

## API Endpoint

**POST** `http://localhost:5000/api/events`

**Headers:**
```
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json
```

**Body:**
```json
{
  "title": "Event Name",
  "description": "Event description",
  "date": "2025-12-20",
  "time": "18:30",
  "location": "Venue",
  "eventType": "performance",
  "capacity": 100,
  "image": "https://example.com/image.jpg"
}
```

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Button not showing | Ensure logged-in user has admin/moderator role |
| Login fails | Verify user exists in database with correct StudentID |
| Form submission fails (403) | Log out and back in to refresh token |
| Event not appearing | Refresh page or check event date is not in past |

## Browser Console

Check browser console (F12) for:
- Network requests to `/api/events`
- JWT token in Authorization header
- Stored member data in localStorage

## Next Steps After Testing

1. ✅ Verify all 4 scenarios work
2. ✅ Test form validation
3. ✅ Test with multiple users
4. ✅ Review created events in database
5. 📋 Plan event editing feature
6. 📋 Plan event deletion feature
7. 📋 Add event management dashboard

---

**Estimated Time:** 10-15 minutes for full testing  
**Status:** Ready to Test  
**Version:** 1.0

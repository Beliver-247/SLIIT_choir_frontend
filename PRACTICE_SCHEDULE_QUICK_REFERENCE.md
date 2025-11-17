# 🎯 Practice Schedule - Quick Reference

## 🚀 Quick Start

### For Moderators/Admins
1. **Log in** to the member portal
2. Click **"Create Schedule"** (purple button)
3. Fill the form and submit
4. ✅ Schedule created and visible to all members!

---

## 📁 Files Created/Modified

### Backend
```
✅ models/PracticeSchedule.js          [NEW]
✅ routes/schedules.js                 [NEW]
✅ server.js                           [UPDATED - added route import]
```

### Frontend
```
✅ src/components/PracticeScheduleCreation.tsx  [NEW]
✅ src/components/PracticeSchedules.tsx         [NEW]
✅ src/utils/api.ts                            [UPDATED - added schedules endpoint]
✅ src/utils/roleUtils.ts                      [UPDATED - added canCreateSchedules()]
✅ src/App.tsx                                 [UPDATED - added routing for /create-schedule]
✅ src/components/Navigation.tsx               [UPDATED - added Create Schedule button]
```

---

## 🔌 API Endpoints

| Method | Path | Permission | Action |
|--------|------|-----------|--------|
| POST | `/api/schedules` | Moderator/Admin | Create |
| GET | `/api/schedules` | Public | List all |
| GET | `/api/schedules/:id` | Public | Get details |
| PUT | `/api/schedules/:id` | Moderator/Admin | Update |
| DELETE | `/api/schedules/:id` | Moderator/Admin | Delete |
| POST | `/api/schedules/:id/attendance` | Moderator/Admin | Mark attendance |
| GET | `/api/schedules/:id/attendance` | Public | Get attendance |

---

## 💻 Frontend Integration

### Create Schedule Component
```tsx
<PracticeScheduleCreation 
  onScheduleCreated={() => {
    // Redirect to members portal
  }}
/>
```

### View Schedules Component
```tsx
<PracticeSchedules 
  onScheduleSelect={(schedule) => {
    // Handle schedule click
  }}
  showCreateButton={canCreate}
  onCreateClick={() => {
    // Navigate to create page
  }}
/>
```

---

## 📋 Form Fields

| Field | Type | Required | Format |
|-------|------|----------|--------|
| Title | Text | Yes | Any text |
| Description | TextArea | No | Any text |
| Date | Date | Yes | YYYY-MM-DD |
| Start Time | Time | Yes | HH:MM (24h) |
| End Time | Time | Yes | HH:MM (24h) |
| Lecture Hall ID | Text | Yes | e.g., A503, B403 |

---

## ✅ Validation

✅ Title: Required  
✅ Date: Required and valid  
✅ Start Time < End Time  
✅ Lecture Hall ID: Required  
✅ User: Must be moderator/admin  

---

## 🎨 UI Elements

### Buttons
- **Create Schedule** (Purple) - Only for moderators/admins
- **Create Practice Schedule** (Form submit) - Submit form

### Status Badges
- **Upcoming** (Blue) - Future practice
- **Ongoing** (Yellow) - Currently happening
- **Completed** (Green) - Past practice
- **Cancelled** (Red) - Cancelled practice

### Icons
- 📅 Clock icon - Date/Time
- 📍 Map pin icon - Location
- ⏰ Clock icon - General time reference

---

## 🔐 Authorization

```
Member       → Can view schedules only
Moderator    → Can create, update, delete, manage attendance
Admin        → Can create, update, delete, manage attendance
```

---

## 🧪 Testing Commands

### Start Backend
```bash
cd /Users/dumindumendis/Downloads/my\ Projects/SLIIT_choir_backend
npm run dev
```

### Start Frontend
```bash
cd /Users/dumindumendis/Downloads/my\ Projects/SLIIT_choir_frontend
npm run dev
```

### Test Create Schedule API
```bash
curl -X POST http://localhost:5000/api/schedules \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Weekly Practice",
    "date": "2025-12-20T00:00:00Z",
    "timePeriod": {
      "startTime": "18:30",
      "endTime": "20:00"
    },
    "location": {
      "lectureHallId": "A503"
    }
  }'
```

### Test Get Schedules
```bash
curl http://localhost:5000/api/schedules?status=upcoming
```

---

## 🐛 Common Issues

| Issue | Solution |
|-------|----------|
| Create Schedule button not showing | Verify logged in as moderator/admin |
| Form validation errors | Check all required fields filled |
| Schedule not appearing | Refresh page or check status filter |
| Time validation error | Ensure start time < end time |
| Unauthorized error | Check JWT token, might be expired |

---

## 📊 Database Schema

```javascript
{
  _id: ObjectId,
  title: String,
  description: String,
  date: Date,
  timePeriod: {
    startTime: String,
    endTime: String
  },
  location: {
    lectureHallId: String
  },
  status: String,
  attendance: [{
    memberId: ObjectId,
    markedAt: Date,
    status: String
  }],
  notes: String,
  createdBy: ObjectId,
  createdAt: Date,
  updatedAt: Date
}
```

---

## 🎯 Key Features

✅ Moderators create practice schedules  
✅ Members view all schedules  
✅ Automatic date/time formatting  
✅ Location stored as lecture hall ID  
✅ Status tracking (upcoming/ongoing/completed/cancelled)  
✅ Attendance tracking capability  
✅ Form validation (client + server)  
✅ Error handling and loading states  
✅ Responsive design  
✅ Type-safe TypeScript  

---

## 🔗 Related Features

- **Events** - Similar to schedules but for performances/events
- **Members** - User management
- **Authentication** - JWT-based login
- **Attendance** - Track participation

---

## 📞 Support

For issues or enhancements:
1. Check the PRACTICE_SCHEDULE_IMPLEMENTATION.md for detailed docs
2. Review error messages in console
3. Check API responses in network tab
4. Verify user role permissions

---

**Last Updated:** November 17, 2025  
**Status:** ✅ Production Ready

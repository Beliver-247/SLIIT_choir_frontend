# Event Creation Feature - Quick Reference Guide

## 📚 Documentation Files

All documentation files are in the **frontend** folder:

1. **EVENT_CREATION_SUMMARY.md** ⭐ START HERE
   - Overview of entire implementation
   - What's included
   - How to use it

2. **EVENT_CREATION_QUICK_TEST.md** 🧪 QUICK TEST
   - 5-minute setup
   - Test scenarios
   - Troubleshooting

3. **EVENT_CREATION_IMPLEMENTATION.md** 📖 DETAILED
   - Feature breakdown
   - Technical details
   - API documentation
   - Future enhancements

4. **EVENT_CREATION_ARCHITECTURE.md** 🏗️ ARCHITECTURE
   - System architecture diagram
   - Data flow diagrams
   - Component hierarchy
   - Error flows

5. **IMPLEMENTATION_VERIFICATION_CHECKLIST.md** ✅ CHECKLIST
   - Implementation checklist
   - Testing checklist
   - File structure verification
   - Code quality checklist

6. **ADMIN_SETUP_GUIDE.md** (Backend folder) 🔐 SETUP
   - How to create admin/moderator users
   - Test credentials
   - Database setup

---

## 🎯 Quick Start (5 Minutes)

### 1. Create Admin User
Open MongoDB Compass or Atlas, add to `members` collection:
```json
{
  "firstName": "Admin",
  "lastName": "User",
  "studentId": "AD12345678",
  "email": "admin@test.com",
  "password": "admin123",
  "role": "admin",
  "status": "active",
  "createdAt": "2025-11-17T00:00:00Z"
}
```

**Note:** Password will be hashed when saved through API.

### 2. Start Servers
```bash
# Terminal 1: Backend
cd SLIIT_choir_backend
npm start
# Should see: Server running on port 5000

# Terminal 2: Frontend
cd SLIIT_choir_frontend
npm run dev
# Should see: VITE v... ready in ... ms
```

### 3. Test Event Creation
1. Open browser: `http://localhost:5173`
2. Click "Members Login"
3. Enter: `AD12345678` / `admin123`
4. Click "Create Event" button (green, with + icon)
5. Fill form and submit
6. ✅ Success message should appear

---

## 🏗️ Implementation Summary

### New Files Created
- ✅ `src/utils/roleUtils.ts` - Role utilities
- ✅ `src/components/EventCreation.tsx` - Form component

### Files Modified
- ✅ `src/components/Navigation.tsx` - Added button
- ✅ `src/App.tsx` - Added routing

### Backend (Already Supports)
- ✅ `routes/events.js` - Authorization already in place
- ✅ `middleware/auth.js` - JWT/role checking
- ✅ `models/Event.js` - Schema ready

---

## 📋 Features

### Role-Based Access
```
Admin/Moderator:     ✅ Can create events
                     ✅ See "Create Event" button
                     ✅ Fill form and submit

Regular Member:      ❌ Cannot create events
                     ❌ Don't see button
                     ❌ Cannot access form
```

### Form Fields
- Title (required)
- Description (optional)
- Date (required)
- Time (optional)
- Location (required)
- Event Type (required)
- Capacity (optional)
- Image URL (optional)

### Validation
- Required field checking
- Date cannot be in past
- Capacity >= 1
- Clear error messages

### API Endpoint
```
POST /api/events

Headers:
  Authorization: Bearer <TOKEN>
  Content-Type: application/json

Body:
  {
    title: string (required),
    description: string,
    date: string (required),
    time: string,
    location: string (required),
    eventType: string (required),
    capacity: number,
    image: string
  }
```

---

## 🧪 Test Scenarios

### Scenario 1: Admin Creates Event
```
1. Login as admin (AD12345678 / admin123)
2. Go to Members Portal
3. See green "Create Event" button
4. Click button
5. Fill form with valid data
6. Click "Create Event"
7. ✅ Success message
8. ✅ Redirects to Members Portal
9. ✅ Event appears in list
```

### Scenario 2: Member Cannot Create
```
1. Login as member
2. Go to Members Portal
3. ❌ "Create Event" button NOT visible
4. ❌ Cannot access event creation
```

### Scenario 3: Form Validation
```
1. Click "Create Event"
2. Leave title empty
3. Click "Create Event"
4. ✅ Error: "Event title is required"
```

### Scenario 4: Invalid Date
```
1. Click "Create Event"
2. Set date to yesterday
3. Click "Create Event"
4. ✅ Error: "Event date and time cannot be in the past"
```

---

## 🔍 Verification Commands

### Check Backend is Running
```bash
curl http://localhost:5000/api/events \
  -H "Content-Type: application/json"
# Should return list of events (may be empty)
```

### Check Auth Endpoint
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "studentId": "AD12345678",
    "password": "admin123"
  }'
# Should return token and user data
```

### Create Event via API (After Login)
```bash
curl -X POST http://localhost:5000/api/events \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test Event",
    "date": "2025-12-20",
    "time": "18:30",
    "location": "Test Location",
    "eventType": "performance",
    "capacity": 100
  }'
# Should return 201 with created event
```

---

## 🐛 Troubleshooting

### Issue: "Create Event" button not showing
**Solution:** 
- Ensure you're logged in as admin/moderator
- Check localStorage: Open DevTools → Application → Storage → localStorage
- Look for `member` entry with `role: "admin"` or `role: "moderator"`

### Issue: Form submission fails with 403
**Solution:**
- Token may be expired
- Log out and log back in
- Check Authorization header in network tab

### Issue: Event not appearing after creation
**Solution:**
- Refresh page
- Check MongoDB for event document
- Ensure event date is not in past

### Issue: Backend not running
**Solution:**
- Check if port 5000 is in use: `lsof -i :5000`
- Kill process if needed: `kill -9 PID`
- Restart backend: `npm start`

### Issue: Frontend not running
**Solution:**
- Check if port 5173 is in use
- Try different port: `npm run dev -- --port 5174`
- Check Node.js version: `node --version` (should be 14+)

---

## 📊 Database Commands

### Create Admin User (MongoDB)
```javascript
// In MongoDB shell or Compass
db.members.insertOne({
  firstName: "Admin",
  lastName: "User",
  studentId: "AD12345678",
  email: "admin@test.com",
  password: "admin123", // Will need to be hashed
  role: "admin",
  status: "active",
  createdAt: new Date(),
  updatedAt: new Date()
})
```

### Change User Role
```javascript
db.members.updateOne(
  { studentId: "CS12345678" },
  { $set: { role: "admin" } }
)
```

### View Created Events
```javascript
db.events.find({ createdBy: ObjectId("USER_ID") })
```

### Delete Test Events
```javascript
db.events.deleteMany({ title: "Test Event" })
```

---

## 🔐 Environment Variables

### Backend (.env)
```
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/sliit_choir
JWT_SECRET=your_secret_key_here
JWT_EXPIRE=7d
NODE_ENV=development
```

### Frontend
No environment file needed (localhost:5000 hardcoded in api.ts)

To change API URL:
- Edit `src/utils/api.ts`
- Or hardcode in `src/components/EventCreation.tsx`

---

## 📱 Browser DevTools Tips

### Check JWT Token
1. Open DevTools (F12)
2. Go to Application → Storage → localStorage
3. Look for `authToken` value
4. Copy and paste into https://jwt.io to decode
5. Verify `role` field is "admin" or "moderator"

### Monitor Network Requests
1. Open DevTools → Network tab
2. Create an event
3. Look for POST /api/events request
4. Check:
   - Status: 201 (success) or 4xx/5xx (error)
   - Headers: Authorization header present
   - Request Body: All form data
   - Response: Created event object

### Check Console Errors
1. Open DevTools → Console tab
2. Look for red error messages
3. Check network requests for 401/403 errors
4. Look for validation error messages

---

## 🚀 After Testing

### If Everything Works
1. ✅ Proceed with deployment
2. ✅ Create more test users with different roles
3. ✅ Test with real data
4. ✅ Plan next features

### If Issues Found
1. ❌ Check logs in backend terminal
2. ❌ Check browser console (DevTools F12)
3. ❌ Review error messages
4. ❌ Check MongoDB data
5. ❌ Restart servers

---

## 📞 Common Error Messages

| Error | Cause | Solution |
|-------|-------|----------|
| "Event title is required" | Missing title | Fill in title field |
| "Event date and time cannot be in the past" | Past date selected | Choose future date |
| "Event capacity must be at least 1" | Capacity 0 or negative | Set capacity >= 1 |
| "Not authorized" (403) | Not admin/moderator | Log in as admin user |
| "Invalid token" (401) | Token expired/invalid | Log out and back in |
| "Network error" | Backend not running | Start backend server |
| "ECONNREFUSED" | Wrong API URL | Check server address |

---

## ✅ Success Indicators

You'll know it's working when:
1. ✅ Green "Create Event" button visible (admin only)
2. ✅ Form opens without errors
3. ✅ Form validates input correctly
4. ✅ Event creates successfully
5. ✅ Success message displays
6. ✅ Auto-redirects to Members Portal
7. ✅ Event appears in events list
8. ✅ Event saved in MongoDB

---

## 📈 Performance Checklist

- [ ] Form submission takes < 2 seconds
- [ ] Loading spinner shows during submission
- [ ] No console errors
- [ ] No memory leaks
- [ ] Responsive on all devices
- [ ] Works on slow networks

---

**Version:** 1.0  
**Last Updated:** November 17, 2025  
**Total Implementation Time:** ~2 hours  
**Total Testing Time:** ~15 minutes  
**Status:** ✅ Ready to Test

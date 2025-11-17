# Real Events Integration - Setup Guide

## Overview
The frontend Events component has been updated to fetch and display **real events from the API** instead of dummy data.

## Changes Made

### Updated Files
- **`src/components/Events.tsx`** - Now fetches events from `GET /api/events?status=upcoming`

### Key Features
- ✅ Real API integration with `api.events.getAll()`
- ✅ Loading state while fetching
- ✅ Error handling with user-friendly messages
- ✅ Empty state message if no events
- ✅ Graceful fallback if image is not available
- ✅ Proper date and time formatting
- ✅ No dummy data

## How to Test

### Option 1: Create Events via Frontend
1. Login as **Admin or Moderator** user
2. Go to Members Portal
3. Click **"Create Event"** button (green)
4. Fill in event details:
   - **Title:** Event name
   - **Date:** Date of event
   - **Time:** Event time (e.g., 18:30)
   - **Location:** Event venue
   - **Event Type:** Pick from dropdown
   - **Description:** Event details
   - **Capacity:** Number of attendees (optional)
   - **Image URL:** Event image (optional)
5. Click **"Create Event"**
6. Go to home page → Events section
7. ✅ Your event should appear!

### Option 2: Create Events via API (curl/Postman)
```bash
# First, login to get JWT token
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "studentId": "AD12345678",
    "password": "admin123"
  }'

# Copy the token from response, then create event:
curl -X POST http://localhost:5000/api/events \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Annual Concert 2025",
    "description": "Join us for our biggest performance of the year",
    "date": "2025-12-20",
    "time": "18:30",
    "location": "SLIIT Auditorium, Malabe",
    "eventType": "performance",
    "capacity": 500,
    "image": "https://via.placeholder.com/500x300?text=Concert"
  }'
```

### Option 3: Create via MongoDB
```javascript
// In MongoDB shell/Compass
db.events.insertOne({
  title: "University Foundation Day Concert",
  description: "A special musical performance celebrating SLIIT",
  date: ISODate("2025-12-15T18:00:00Z"),
  time: "18:00",
  location: "SLIIT Main Auditorium",
  eventType: "performance",
  capacity: 300,
  image: "https://via.placeholder.com/500x300?text=Performance",
  status: "upcoming",
  createdBy: ObjectId("YOUR_ADMIN_USER_ID"),
  registrations: [],
  createdAt: ISODate("2025-11-17T00:00:00Z"),
  updatedAt: ISODate("2025-11-17T00:00:00Z")
})
```

## Test Data Examples

### Event 1: Christmas Carol Service
```json
{
  "title": "Annual Christmas Carol Service",
  "description": "Our biggest event of the year - a beautiful carol service for charity",
  "date": "2025-12-20",
  "time": "19:00",
  "location": "Cathedral of Christ the Living Saviour",
  "eventType": "charity",
  "capacity": 500,
  "image": "https://via.placeholder.com/500x300?text=Christmas+Carol"
}
```

### Event 2: Music Festival
```json
{
  "title": "Inter-University Music Festival",
  "description": "Representing SLIIT at the prestigious inter-university competition",
  "date": "2025-01-25",
  "time": "17:00",
  "location": "Nelum Pokuna Theatre",
  "eventType": "competition",
  "capacity": 400,
  "image": "https://via.placeholder.com/500x300?text=Music+Festival"
}
```

### Event 3: Practice Session
```json
{
  "title": "Weekly Choir Practice",
  "description": "Regular practice session for all choir members",
  "date": "2025-11-20",
  "time": "16:30",
  "location": "SLIIT Music Room, Building 5",
  "eventType": "practice",
  "capacity": 50,
  "image": null
}
```

## How It Works

### API Flow
```
Frontend Event Component
        ↓
useEffect (on mount)
        ↓
api.events.getAll({ status: 'upcoming' })
        ↓
GET /api/events?status=upcoming
        ↓
Backend filters events with status='upcoming'
        ↓
Returns sorted by date
        ↓
Display in grid
```

### Event Display Logic
```
Is Loading?
  ├─ Yes → Show spinner
  └─ No → Continue

Has Error?
  ├─ Yes → Show error message
  └─ No → Continue

Has Events?
  ├─ Yes → Display event cards
  └─ No → Show "No events" message
```

## Event Card Features

✅ **Image Display**
- Shows event image if available
- Falls back to gray placeholder if not

✅ **Date & Time Formatting**
- Converts ISO date to readable format
- Shows "Time TBA" if no time provided

✅ **Text Truncation**
- Title: 2 lines max
- Description: 2 lines max
- Location: 1 line (no wrap)

✅ **Interactive**
- Hover effect on cards
- "Register" button

## Filtering

Events are automatically filtered to show only:
- Status: `upcoming`
- Sorted by date (earliest first)

To change this, modify in `Events.tsx`:
```typescript
const data = await api.events.getAll({ status: 'upcoming' });
```

Available filters:
- `status`: 'upcoming' | 'ongoing' | 'completed' | 'cancelled'
- `type`: 'performance' | 'practice' | 'charity' | 'competition' | 'other'
- `startDate`: ISO date string
- `endDate`: ISO date string

## Example: Show All Events (Including Past)
```typescript
// Change from:
const data = await api.events.getAll({ status: 'upcoming' });

// To:
const data = await api.events.getAll();
```

## Troubleshooting

### Events Not Showing
1. Check browser console (F12) for errors
2. Verify backend is running on port 5000
3. Check that events exist in MongoDB
4. Verify events have `status: 'upcoming'`

### Images Not Loading
1. Check image URL is valid and public
2. Verify CORS is configured on backend
3. Check browser console for image load errors
4. Use placeholder image: `https://via.placeholder.com/500x300?text=Event`

### Loading Spinner Stuck
1. Check network tab for failed requests
2. Verify API endpoint: `GET /api/events`
3. Check authentication token if required
4. Look for API errors in console

## Next Steps

1. ✅ Create some test events (using one of the methods above)
2. ✅ Open frontend and go to home page
3. ✅ Scroll to Events section
4. ✅ Verify events are loading and displaying correctly
5. ✅ Test "Register" button (if you want to add that functionality)

## Code Reference

### Component File
```
src/components/Events.tsx
├─ Lines 1-6: Imports
├─ Lines 8-15: Event interface
├─ Lines 17-39: State & API fetch
├─ Lines 41-48: Date formatting helper
├─ Lines 50-53: Time formatting helper
└─ Lines 55-126: JSX rendering
```

### Key Parts
- **API Call:** Line 27-29
- **Loading State:** Line 70-76
- **Error State:** Line 78-82
- **Empty State:** Line 84-88
- **Event Mapping:** Line 92-122

## Done! 🎉

Your Events component now displays **real data from the API** instead of dummy data. Create some events and they'll automatically show up on the home page!

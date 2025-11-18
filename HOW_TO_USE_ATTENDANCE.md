# Attendance Feature - User Guide (After Integration)

## How to Access Attendance Features

### For Moderators and Admins

#### Method 1: Via Navigation Bar
When you're logged in and in the Member Portal:
1. Look at the top navigation bar
2. You'll see two new buttons:
   - **"Take Attendance"** (Blue button with icon)
   - **"Attendance Analytics"** (Indigo button with icon)
3. Click either button to access the feature

#### Method 2: Via Member Portal Tab
1. Login and go to Member Portal
2. You'll see a new **"Attendance"** tab at the top
3. Click the Attendance tab
4. Two buttons appear:
   - **"Take Attendance"** - Start marking attendance
   - **"View Analytics"** - View attendance reports
5. Click the desired button

#### Method 3: Direct URL
Type directly in the browser:
- For taking attendance: `http://localhost:5173/attendance`
- For analytics: `http://localhost:5173/attendance-analytics`

### For Regular Members

#### Method 1: Via Member Portal Tab
1. Login and go to Member Portal
2. Click the **"Attendance"** tab
3. You'll see your personal attendance info
4. Click **"View My Attendance"** to see your detailed history

#### Method 2: Direct URL
- `http://localhost:5173/member-report/{your-member-id}`

---

## Feature 1: Take Attendance

### What You Can Do
✅ Mark members as Present, Absent, Excused, or Late  
✅ Search for specific members  
✅ Add optional notes/comments  
✅ See when attendance was last marked  
✅ Works for events or practice schedules  

### How to Use It

1. **Navigate to Take Attendance**
   - Click "Take Attendance" button (See access methods above)

2. **View the Attendance Screen**
   - Title: "Mark Attendance"
   - Shows Event/Schedule ID at the top
   - Search bar to find members

3. **Search for a Member**
   - Type in the search box
   - Can search by:
     - Name (First or Last)
     - Email
     - Student ID

4. **Mark Attendance**
   - Find the member in the list
   - See their info: Name, Student ID, Email
   - Click one of the status buttons:
     - 🟢 **Present** - Member was there
     - 🔴 **Absent** - Member didn't attend
     - 🟡 **Excused** - Member had a reason
     - 🔵 **Late** - Member arrived late

5. **View Confirmation**
   - Success message appears at top
   - Button color changes to show selected status
   - "Last marked" time updates
   - Data saved immediately to database

### Example Flow
```
1. Click "Take Attendance"
2. See list of registered members
3. Search for "John" → Finds John Doe
4. Click the "Present" button next to John
5. Success! Attendance marked
6. Button turns green, time updates
7. Continue for other members
8. No need to save - auto-saved
```

---

## Feature 2: Attendance Analytics

### What You Can See
✅ Overall attendance rate  
✅ Breakdown by status (Present/Absent/Excused/Late)  
✅ Individual member attendance percentages  
✅ Daily attendance trends  
✅ Export data to Excel (.xlsx)  

### Dashboard Tabs

#### Tab 1: Summary
Shows:
- **Total Records** - Total attendance entries
- **Present** - Number marked present
- **Absent** - Number marked absent
- **Excused** - Number marked excused
- **Late** - Number marked late
- **Overall Attendance Rate** - Percentage present out of total
- **Status Distribution Chart** - Visual bars showing breakdown

Example:
```
Total Records: 500
Present: 450 (90%)
Absent: 30 (6%)
Excused: 15 (3%)
Late: 5 (1%)
Overall Rate: 90%
```

#### Tab 2: Member Analytics
Shows a table with:
- Member name
- Total attendance records
- Count by status (Present, Absent, Excused, Late)
- Attendance percentage
- Color coding:
  - 🟢 Green: 80%+ (Excellent)
  - 🟡 Yellow: 60-79% (Good)
  - 🔴 Red: <60% (Needs Attention)

Example:
```
| Name        | Total | Present | Absent | Rate  |
|-------------|-------|---------|--------|-------|
| John Doe    | 10    | 9       | 1      | 90.00%|
| Jane Smith  | 10    | 10      | 0      | 100%  |
| Bob Wilson  | 10    | 6       | 4      | 60.00%|
```

#### Tab 3: Daily Trends
Shows a table with:
- Date
- Total members marked that day
- Count by status for that day
- Helps see patterns (e.g., Mondays have low attendance)

Example:
```
| Date       | Total | Present | Absent |
|------------|-------|---------|--------|
| 2025-11-15 | 50    | 45      | 5      |
| 2025-11-16 | 48    | 46      | 2      |
| 2025-11-17 | 50    | 48      | 2      |
```

### How to Use Analytics

1. **Navigate to Analytics**
   - Click "Attendance Analytics" button

2. **Set Date Range (Optional)**
   - Use "Start Date" and "End Date" fields
   - Leave blank to see all data
   - Click "Apply Filters" to update

3. **View Different Tabs**
   - Click "Summary" for overall view
   - Click "Members" for individual stats
   - Click "Trends" for daily patterns

4. **Export to Excel**
   - Click "Export Excel" button
   - File downloads as `.xlsx`
   - Opens in Excel, Google Sheets, etc.
   - Includes all columns and current filters

### Export File Contents
When you click "Export Excel", you get a file with columns:
- First Name
- Last Name
- Email
- Student ID
- Event/Schedule Title
- Date
- Status
- Marked By (who marked it)
- Marked At (when marked)
- Comments (any notes added)

---

## Feature 3: Member Attendance Report

### What You Can See (As a Regular Member)
✅ Your personal attendance history  
✅ Your attendance percentage  
✅ Breakdown of your status records  
✅ Detailed list of each event/schedule  

### What You Can See (As Moderator/Admin)
✅ Any member's attendance history  
✅ Their percentage and stats  
✅ All their records paginated  

### How to Access

**As a Member:**
1. Go to Member Portal
2. Click "Attendance" tab
3. Click "View My Attendance"

**As Moderator (Viewing Another Member):**
- Direct URL: `/member-report/{member-id}`

### Information Displayed

**Header:**
- Member name
- Email
- Student ID

**Statistics Cards:**
- Total records
- Present count
- Absent count
- Excused count
- Late count

**Attendance Percentage:**
- Visual progress bar
- Percentage displayed

**Filters:**
- Start Date field
- End Date field
- "Apply Filters" button

**Attendance Table:**
- Event/Schedule name
- Date
- Status (with color)
- Who marked it
- When it was marked
- Any comments

**Pagination:**
- 10 records per page
- Previous/Next buttons
- Page numbers

### Example View
```
JOHN DOE
john@example.com
CS12345678

Total: 20 | Present: 18 | Absent: 1 | Excused: 1 | Late: 0

Attendance Rate: 90.00% [████████████  ]

| Event                        | Date       | Status   | By           | Time              |
|------------------------------|------------|----------|--------------|-------------------|
| Practice Session             | Nov 15     | Present  | Dr. Smith    | Nov 15, 3:45 PM   |
| Foundation Day Event         | Nov 14     | Late     | Mr. Johnson  | Nov 14, 11:20 AM  |
| Christmas Carol Practice     | Nov 13     | Excused  | Dr. Smith    | Nov 13, 6:30 PM   |
```

---

## Feature Availability

### What Moderators/Admins Can Do
- ✅ Take attendance for events
- ✅ Take attendance for practice schedules
- ✅ View analytics dashboard
- ✅ Export attendance data to Excel
- ✅ View any member's attendance history
- ✅ Filter by date range
- ✅ See attendance trends

### What Members Can Do
- ✅ View their own attendance history
- ✅ See their attendance percentage
- ✅ See attendance breakdown
- ✅ Filter their records by date

### What Guests Cannot Do
- ❌ Access any attendance features
- ❌ Must be logged in as member/moderator/admin

---

## Common Tasks

### Task 1: Mark Attendance for an Event

1. Click "Take Attendance" button
2. Identify the event from the page
3. Search for each member
4. Click their status button (usually "Present")
5. Continue for all members
6. Done! Data is saved automatically

**Time:** ~2 minutes for 50 members

### Task 2: Generate Attendance Report

1. Click "Attendance Analytics"
2. (Optional) Set start and end dates
3. Click "Apply Filters" if date range set
4. Review the "Summary" tab for overview
5. Click "Members" tab to see individual rates
6. Click "Export Excel" to download report

**Time:** ~2 minutes

### Task 3: Check Member's Attendance

1. Click "Attendance" tab in Member Portal
2. Click "View My Attendance" (for your own)
   OR
3. Use direct URL `/member-report/{member-id}` (for viewing others)
4. Filter by date if needed
5. View the detailed table

**Time:** ~1 minute

### Task 4: Find Members with Low Attendance

1. Go to Attendance Analytics
2. Click "Members" tab
3. Look for red (under 60%) or yellow (60-79%) entries
4. Click on member name or student ID to view details
5. Contact member to discuss attendance

**Time:** ~3 minutes

---

## Visual Design

### Colors Used
- 🟢 **Green**: Present / Success states
- 🔴 **Red**: Absent / Warning states
- 🟡 **Yellow**: Excused / Caution states
- 🔵 **Blue**: Late / Info states
- ⚪ **Gray**: Neutral/Unset states

### Button Locations

**Desktop (Top Navigation Bar):**
```
[Home] [About] ... [Member Portal] [Take Attendance] [Analytics] [User] [Logout]
```

**Mobile Menu:**
```
Expandable menu shows same buttons stacked vertically
```

**Member Portal Tabs:**
```
[Schedule] [Merchandise] [Resources] [Attendance]
                                        ↑ New!
```

---

## Tips & Best Practices

1. **Taking Attendance:**
   - Mark attendance immediately while session is ongoing
   - Use search to quickly find members
   - Add comments for late arrivals or excused absences

2. **Viewing Analytics:**
   - Use date ranges to see trends over time
   - Check member analytics to identify at-risk members
   - Export monthly reports for records

3. **For Members:**
   - Check your attendance regularly
   - Contact moderator if you see errors
   - Keep attendance above 80% as recommended

4. **Data Management:**
   - Exported Excel files can be stored as records
   - Analytics update in real-time
   - All data is permanently stored in database

---

## Troubleshooting

### Issue: Can't see "Take Attendance" button
**Solution:** 
- You must be logged in as moderator or admin
- You must be in Member Portal (not home page)
- Try refreshing the page

### Issue: Members list is empty
**Solution:**
- Make sure members are registered for the event
- Check if you selected the correct event/schedule
- Try refreshing the page

### Issue: Excel export not working
**Solution:**
- Check your browser download settings
- Make sure you have enough disk space
- Try a different browser

### Issue: Can't find member in search
**Solution:**
- Check spelling of name/email
- Try searching by student ID
- Member might not be registered for that event

---

## Support

For technical issues:
- Check ATTENDANCE_FEATURE.md for API details
- Check ATTENDANCE_FRONTEND.md for component details
- Contact system administrator

For usage questions:
- Refer to this guide
- Check ATTENDANCE_TAKING_PROCEDURE.md
- Ask your moderator/admin

---

## Summary

The attendance feature is now fully integrated and accessible:

✅ **Moderators/Admins:** Can take attendance and view analytics  
✅ **Members:** Can view their own attendance history  
✅ **Data:** All changes saved automatically  
✅ **Export:** Excel export available with one click  
✅ **Analytics:** Real-time comprehensive statistics  

**Everything is production-ready!**

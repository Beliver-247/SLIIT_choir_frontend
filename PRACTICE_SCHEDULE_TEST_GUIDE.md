# 🧪 Quick Test Guide - Practice Schedule Feature

**Purpose:** Verify the Practice Schedule feature is working correctly  
**Time:** ~15 minutes  
**Date:** November 17, 2025  

---

## ✅ Pre-Test Checklist

Before starting tests:
- [ ] Backend server running on http://localhost:5000
- [ ] Frontend dev server running on http://localhost:5173
- [ ] MongoDB connection active
- [ ] Browser developer tools open (F12)
- [ ] No other apps blocking ports 5000 or 5173

---

## 🧪 Test Cases

### Test 1: Create Practice Schedule (Happy Path)

**Objective:** Verify moderator can create a practice schedule

**Steps:**
1. Open http://localhost:5173 in browser
2. Log in with moderator/admin credentials
3. Click "Member Portal" button
4. Verify "Create Schedule" button appears (purple)
5. Click "Create Schedule" button
6. Verify form loads with all fields:
   - [ ] Practice Title field
   - [ ] Description field
   - [ ] Date picker
   - [ ] Start Time picker
   - [ ] End Time picker
   - [ ] Lecture Hall ID field
7. Fill form with test data:
   - Title: "Weekly Choir Practice"
   - Description: "Regular practice session"
   - Date: Tomorrow or next week
   - Start Time: 18:30
   - End Time: 20:00
   - Lecture Hall ID: A503
8. Click "Create Practice Schedule" button
9. **Expected Result:** 
   - [ ] Loading spinner appears
   - [ ] Success message displays
   - [ ] Form resets
   - [ ] Redirects to Members Portal after ~1.5 seconds

**Pass/Fail:** ___________

---

### Test 2: View Created Schedule

**Objective:** Verify created schedule appears in the schedule list

**Steps:**
1. After successful creation from Test 1, verify you're on Members Portal
2. Scroll down to find "Practice Schedules" section
3. Look for your created schedule card
4. Verify schedule displays:
   - [ ] Title: "Weekly Choir Practice"
   - [ ] Date: Formatted as "Day, Month DD, YYYY"
   - [ ] Time: "18:30 - 20:00"
   - [ ] Location: "Hall A503"
   - [ ] Status badge showing "Upcoming"
   - [ ] Creator name visible

**Pass/Fail:** ___________

---

### Test 3: Form Validation (Invalid Time)

**Objective:** Verify form rejects invalid time period

**Steps:**
1. Click "Create Schedule" button again
2. Fill form with test data
3. Set Start Time: 20:00
4. Set End Time: 18:30 (BEFORE start time)
5. Click "Create Practice Schedule"
6. **Expected Result:**
   - [ ] Error message displays
   - [ ] Message says "Start time must be before end time"
   - [ ] Form doesn't submit
   - [ ] Form stays on page with data intact

**Pass/Fail:** ___________

---

### Test 4: Form Validation (Missing Required Field)

**Objective:** Verify form rejects incomplete submissions

**Steps:**
1. Click "Create Schedule" button
2. Fill only Title: "Test Practice"
3. Leave other required fields empty
4. Click "Create Practice Schedule"
5. **Expected Result:**
   - [ ] Error message displays
   - [ ] Message indicates missing required field
   - [ ] Form doesn't submit

**Pass/Fail:** ___________

---

### Test 5: Authorization (Member Cannot Create)

**Objective:** Verify non-moderators cannot create schedules

**Steps:**
1. Log out
2. Log in with regular member credentials (non-moderator)
3. Navigate to Members Portal
4. **Expected Result:**
   - [ ] "Create Schedule" button is NOT visible
   - [ ] Only "Create Event" button visible for members
   - [ ] No error shown (graceful hiding)

**Pass/Fail:** ___________

---

### Test 6: API Direct Test

**Objective:** Verify API endpoint works correctly

**Steps:**
1. Open terminal
2. Get a valid JWT token from login response
3. Run curl command:
```bash
curl -X GET http://localhost:5000/api/schedules
```
4. **Expected Result:**
   - [ ] Returns JSON with success: true
   - [ ] Data array contains your created schedules
   - [ ] Each schedule has proper fields
   - [ ] Status 200 OK

**Pass/Fail:** ___________

---

### Test 7: API Create with Invalid Data

**Objective:** Verify API validation works

**Steps:**
1. Get JWT token from login
2. Run curl command with missing field:
```bash
curl -X POST http://localhost:5000/api/schedules \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test"
  }'
```
3. **Expected Result:**
   - [ ] Returns error status (400 or 401)
   - [ ] Error message about missing fields
   - [ ] Schedule not created

**Pass/Fail:** ___________

---

### Test 8: Loading State

**Objective:** Verify loading feedback is visible

**Steps:**
1. Click "Create Schedule" button
2. Fill form completely
3. Quickly click "Create Practice Schedule"
4. Watch for loading spinner BEFORE success message
5. **Expected Result:**
   - [ ] Loading spinner appears briefly
   - [ ] Button text says "Creating Schedule..."
   - [ ] Form inputs disabled during loading
   - [ ] Spinner disappears after request completes

**Pass/Fail:** ___________

---

### Test 9: Error State

**Objective:** Verify error handling

**Steps:**
1. Stop the backend server (Ctrl+C)
2. Click "Create Schedule" button
3. Fill form with valid data
4. Click "Create Practice Schedule"
5. **Expected Result:**
   - [ ] After 3-5 seconds, error message appears
   - [ ] Error message is readable and helpful
   - [ ] Form doesn't submit
   - [ ] Restart backend server for next tests

**Pass/Fail:** ___________

---

### Test 10: Responsive Design (Mobile)

**Objective:** Verify design works on mobile

**Steps:**
1. Open http://localhost:5173 in browser
2. Press F12 to open DevTools
3. Click responsive design mode icon
4. Select mobile device (e.g., iPhone 12)
5. Navigate to Create Schedule
6. **Expected Result:**
   - [ ] Form fields stack vertically
   - [ ] Buttons are full width
   - [ ] Text is readable
   - [ ] No horizontal scrolling needed
   - [ ] All form elements accessible

**Pass/Fail:** ___________

---

### Test 11: Date Formatting

**Objective:** Verify dates display correctly

**Steps:**
1. Create a practice schedule for January 15, 2026
2. View the schedule card
3. **Expected Result:**
   - [ ] Date displays as "Wednesday, January 15, 2026"
   - [ ] Not as "2026-01-15" or other format
   - [ ] Day of week is correct
   - [ ] Month name spelled out

**Pass/Fail:** ___________

---

### Test 12: Lecture Hall ID Uppercase

**Objective:** Verify lecture hall ID stored in uppercase

**Steps:**
1. Create schedule with hall ID: "a503" (lowercase)
2. Get the schedule via API:
```bash
curl http://localhost:5000/api/schedules
```
3. Check the location.lectureHallId field
4. **Expected Result:**
   - [ ] Stored as "A503" (uppercase)
   - [ ] Displayed as "Hall A503"
   - [ ] Not as "Hall a503"

**Pass/Fail:** ___________

---

### Test 13: Schedule List Sorting

**Objective:** Verify schedules sorted by date

**Steps:**
1. Create 3 schedules with different dates:
   - Schedule 1: Dec 25, 2025
   - Schedule 2: Dec 20, 2025
   - Schedule 3: Dec 30, 2025
2. View schedule list
3. **Expected Result:**
   - [ ] Schedules displayed in chronological order
   - [ ] Schedule 2 appears first (Dec 20)
   - [ ] Schedule 1 appears second (Dec 25)
   - [ ] Schedule 3 appears last (Dec 30)

**Pass/Fail:** ___________

---

### Test 14: Status Badge Colors

**Objective:** Verify status badges display correct colors

**Steps:**
1. View practice schedule
2. Check status badge color
3. For "Upcoming" status:
   - **Expected:** Blue background, blue text
4. If you can manually change status via API to "completed":
   - **Expected:** Green background, green text
5. For "cancelled" status (if available):
   - **Expected:** Red background, red text

**Pass/Fail:** ___________

---

### Test 15: Console Errors Check

**Objective:** Verify no JavaScript errors in console

**Steps:**
1. Open browser DevTools (F12)
2. Click "Console" tab
3. Navigate through Create Schedule feature
4. Submit a form
5. **Expected Result:**
   - [ ] No red error messages
   - [ ] No TypeScript errors
   - [ ] No network errors
   - [ ] Only informational logs if any

**Pass/Fail:** ___________

---

## 📊 Test Summary

### Total Tests: 15
- **Passed:** ___ / 15
- **Failed:** ___ / 15
- **Skipped:** ___ / 15

### Pass Rate: ____%

---

## 🎯 Critical Tests (Must Pass)

1. ✅ Create Schedule (Test 1) - **CRITICAL**
2. ✅ View Schedule (Test 2) - **CRITICAL**
3. ✅ Authorization (Test 5) - **CRITICAL**
4. ✅ API Validation (Test 7) - **CRITICAL**
5. ✅ No Console Errors (Test 15) - **CRITICAL**

**All Critical Tests Passed:** ☐ YES ☐ NO

---

## 🐛 Issues Found

### Issue 1
**Test:** _______________  
**Description:** _______________  
**Severity:** [ ] Critical [ ] High [ ] Medium [ ] Low  
**Status:** [ ] New [ ] In Progress [ ] Resolved  
**Notes:** _______________  

### Issue 2
**Test:** _______________  
**Description:** _______________  
**Severity:** [ ] Critical [ ] High [ ] Medium [ ] Low  
**Status:** [ ] New [ ] In Progress [ ] Resolved  
**Notes:** _______________  

---

## ✅ Test Completion Checklist

- [ ] All tests executed
- [ ] Results recorded
- [ ] Issues documented
- [ ] Screenshots taken (if needed)
- [ ] Logs reviewed
- [ ] Browser cache cleared between tests
- [ ] Both moderator and member roles tested
- [ ] Mobile and desktop tested
- [ ] Error scenarios tested
- [ ] API endpoints tested

---

## 📋 Sign-Off

**Tested By:** _______________  
**Date:** _______________  
**Time Taken:** _______________  
**Environment:** [ ] Local [ ] Staging [ ] Production  
**Overall Status:** [ ] PASS ✅ [ ] FAIL ❌ [ ] PARTIAL ⚠️  

**Notes:**
_______________________________________________________________
_______________________________________________________________
_______________________________________________________________

---

## 🚀 Ready for Deployment?

- [ ] All tests passed
- [ ] No critical issues found
- [ ] Documentation reviewed
- [ ] Code review completed
- [ ] Performance acceptable
- [ ] Security verified

**Deployment Approval:** _______________  
**Approved By:** _______________  
**Date:** _______________  

---

**Quick Test Guide Version:** 1.0.0  
**Created:** November 17, 2025  
**Status:** Ready to Use

# Attendance Feature - Frontend Documentation

## Overview
The frontend provides a complete UI for attendance management with three main components:
1. **AttendanceTaking** - For marking attendance
2. **AttendanceAnalytics** - For viewing analytics and exporting reports
3. **MemberAttendanceReport** - For viewing individual member attendance history

## Components

### 1. AttendanceTaking Component

**Location:** `src/components/AttendanceTaking.tsx`

**Purpose:** Allows moderators and admins to mark attendance for members in a specific event or practice schedule.

**Props:**
```typescript
interface AttendanceTakingProps {
  eventId?: string;           // Event to take attendance for
  scheduleId?: string;        // Or practice schedule to take attendance for
  registeredMembers?: Member[]; // Pre-loaded registered members (optional)
  onClose?: () => void;       // Callback when closing
}
```

**Features:**
- Search members by name, email, or student ID
- Mark attendance status: Present, Absent, Excused, Late
- View last marked attendance time
- Optional comments for each record
- Real-time feedback on mark operations
- Loads registered members automatically if eventId or scheduleId provided

**Usage Example:**
```tsx
import AttendanceTaking from './components/AttendanceTaking';

<AttendanceTaking 
  eventId="event_123"
  onClose={() => {/* handle close */}}
/>
```

### 2. AttendanceAnalytics Component

**Location:** `src/components/AttendanceAnalytics.tsx`

**Purpose:** Provides comprehensive analytics dashboard for attendance data.

**Features:**
- Three views: Summary, Member Analytics, and Daily Trends
- Date range filtering
- Export to Excel functionality
- Visual statistics with progress bars
- Member-wise attendance percentages
- Daily attendance trends
- Color-coded attendance rates

**Summary Tab:**
- Total records count
- Status distribution (Present, Absent, Excused, Late)
- Overall attendance rate percentage
- Visual progress bars for status distribution

**Member Analytics Tab:**
- Table of all members with attendance records
- Total attendance count per member
- Breakdown by status
- Attendance percentage for each member
- Color-coded percentage indicators (green ≥80%, yellow ≥60%, red <60%)

**Daily Trends Tab:**
- Date-wise attendance summary
- Status breakdown for each date
- Useful for identifying patterns

**Usage Example:**
```tsx
import AttendanceAnalytics from './components/AttendanceAnalytics';

<AttendanceAnalytics />
```

### 3. MemberAttendanceReport Component

**Location:** `src/components/MemberAttendanceReport.tsx`

**Purpose:** Displays detailed attendance history for a specific member.

**Props:**
```typescript
interface MemberAttendanceReportProps {
  memberId: string;  // Member ID to view report for
}
```

**Features:**
- Member information display
- Statistics overview (Total, Present, Absent, Excused, Late)
- Attendance rate percentage with visual progress bar
- Date range filtering
- Paginated attendance records (10 per page)
- Detailed record information including:
  - Event/Schedule name
  - Event date
  - Attendance status
  - Who marked the attendance
  - When it was marked
  - Comments/notes

**Usage Example:**
```tsx
import MemberAttendanceReport from './components/MemberAttendanceReport';

<MemberAttendanceReport memberId="member_123" />
```

## Integration with Main App

### Adding to Navigation
Add attendance links in your main navigation component:

```tsx
// In Navigation.tsx
{(userRole === 'moderator' || userRole === 'admin') && (
  <>
    <NavLink to="/attendance">Take Attendance</NavLink>
    <NavLink to="/attendance-analytics">Attendance Analytics</NavLink>
  </>
)}
```

### Creating Route Pages

**Attendance Taking Page:**
```tsx
// pages/AttendancePage.tsx
import AttendanceTaking from '../components/AttendanceTaking';

export default function AttendancePage() {
  return (
    <div className="container mx-auto py-8">
      <AttendanceTaking />
    </div>
  );
}
```

**Analytics Page:**
```tsx
// pages/AttendanceAnalyticsPage.tsx
import AttendanceAnalytics from '../components/AttendanceAnalytics';

export default function AttendanceAnalyticsPage() {
  return (
    <div className="container mx-auto py-8">
      <AttendanceAnalytics />
    </div>
  );
}
```

**Member Report Page:**
```tsx
// pages/MemberReportPage.tsx
import MemberAttendanceReport from '../components/MemberAttendanceReport';
import { useParams } from 'react-router-dom';

export default function MemberReportPage() {
  const { memberId } = useParams();
  return (
    <div className="container mx-auto py-8">
      <MemberAttendanceReport memberId={memberId!} />
    </div>
  );
}
```

## API Integration

All components use the `api.attendance` module from `src/utils/api.ts`:

```typescript
api.attendance.markAttendance(data)        // Mark attendance
api.attendance.getAll(filters)             // Get all records
api.attendance.getEventAttendance(eventId) // Get event attendance
api.attendance.getScheduleAttendance(scheduleId) // Get schedule attendance
api.attendance.updateAttendance(id, data)  // Update a record
api.attendance.deleteAttendance(id)        // Delete a record
api.attendance.exportToExcel(filters)      // Export to Excel
api.attendance.getAnalytics(filters)       // Get analytics
api.attendance.getMemberHistory(memberId, filters) // Get member history
```

## Styling

All components use Tailwind CSS for styling. Ensure your project has Tailwind configured.

Color scheme used:
- **Green**: Present status / Success states
- **Red**: Absent status / Error states
- **Yellow**: Excused status / Warning states
- **Blue**: Late status / Info states
- **Gray**: Neutral/default states

## Error Handling

All components include error handling with user-friendly messages:
- Network errors
- API validation errors
- Missing data errors
- Authorization errors

## Responsive Design

Components are fully responsive:
- Mobile: Single column layout
- Tablet: 2-column grid for cards
- Desktop: Full 4-5 column layouts

## Performance Considerations

- Pagination on member lists (10 records per page)
- Lazy loading of attendance data
- Efficient filtering on the frontend
- Optimized table rendering with virtualization for large datasets (can be enhanced)

## Future Enhancements

1. **Bulk Operations:**
   - Bulk mark attendance
   - Bulk import from CSV

2. **Advanced Filtering:**
   - Filter by status on analytics page
   - Member-specific analytics

3. **Charts & Visualization:**
   - Pie charts for status distribution
   - Line charts for attendance trends
   - Heatmaps for attendance patterns

4. **Export Options:**
   - PDF export
   - CSV export
   - Email export

5. **Real-time Updates:**
   - WebSocket integration for live attendance
   - Real-time notification of records

6. **QR Code Integration:**
   - QR code scanning for attendance
   - Mobile app support

## Accessibility

Components include:
- Proper semantic HTML
- ARIA labels where appropriate
- Keyboard navigation support
- Color-blind friendly indicators

## Testing

Recommended test cases:
1. Mark attendance with different statuses
2. Search and filter members
3. View analytics with date ranges
4. Export to Excel
5. Pagination on member reports
6. Error handling for invalid data
7. Permission checks (only moderators/admins can access certain features)

## Troubleshooting

**Issue:** Components not loading
- Check that API_BASE_URL is correctly configured in `api.ts`
- Verify authentication token is stored in localStorage

**Issue:** Export to Excel fails
- Ensure backend xlsx library is installed
- Check that temp directory exists on backend

**Issue:** Styling not applied
- Ensure Tailwind CSS is properly configured
- Check that UI component imports are correct

**Issue:** Data not loading
- Check browser console for API errors
- Verify user has proper permissions (moderator/admin)
- Check network tab for failed requests

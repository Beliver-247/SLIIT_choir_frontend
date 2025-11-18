import React, { useState } from 'react';
import { api } from '../utils/api';
import { Button } from './ui/button';
import { Input } from './ui/input';

interface AttendanceRecord {
  _id: string;
  eventId?: { title: string; date: string };
  scheduleId?: { title: string; date: string };
  status: 'present' | 'absent' | 'excused' | 'late';
  markedAt: string;
  markedBy?: { firstName: string; lastName: string };
  comments?: string;
}

interface MemberInfo {
  id: string;
  name: string;
  email: string;
  studentId: string;
}

interface AttendanceStats {
  total: number;
  present: number;
  absent: number;
  excused: number;
  late: number;
}

interface MemberAttendanceReportProps {
  memberId: string;
}

const MemberAttendanceReport: React.FC<MemberAttendanceReportProps> = ({ memberId }) => {
  const [member, setMember] = useState<MemberInfo | null>(null);
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const [stats, setStats] = useState<AttendanceStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const loadAttendanceHistory = async (page = 1) => {
    try {
      setLoading(true);
      setError(null);

      const filters: Record<string, string> = {};
      if (startDate) filters.startDate = startDate;
      if (endDate) filters.endDate = endDate;
      filters.page = page.toString();
      filters.limit = '10';

      const response = await api.attendance.getMemberHistory(memberId, filters);

      if (response.success && response.data) {
        setMember(response.data.member);
        setAttendance(response.data.attendance);
        setStats(response.data.stats);
        setCurrentPage(response.data.pagination.page);
        setTotalPages(response.data.pagination.pages);
      } else {
        setError(response.error || 'Failed to load attendance history');
      }
    } catch (err) {
      setError('Error loading attendance history');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleApplyFilters = () => {
    setCurrentPage(1);
    loadAttendanceHistory(1);
  };

  React.useEffect(() => {
    loadAttendanceHistory(1);
  }, [memberId]);

  const getStatusBadge = (status: string) => {
    const badgeClasses = {
      present: 'bg-green-100 text-green-800 border border-green-300',
      absent: 'bg-red-100 text-red-800 border border-red-300',
      excused: 'bg-yellow-100 text-yellow-800 border border-yellow-300',
      late: 'bg-blue-100 text-blue-800 border border-blue-300',
    };
    return badgeClasses[status as keyof typeof badgeClasses] || 'bg-gray-100 text-gray-800';
  };

  const getEventTitle = (record: AttendanceRecord) => {
    return record.eventId?.title || record.scheduleId?.title || 'Unknown';
  };

  const getEventDate = (record: AttendanceRecord) => {
    const dateStr = record.eventId?.date || record.scheduleId?.date;
    return dateStr ? new Date(dateStr).toLocaleDateString() : 'N/A';
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      {/* Header */}
      {member && (
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-800">{member.name}</h2>
          <p className="text-gray-600 text-sm mt-1">{member.email}</p>
          <p className="text-gray-600 text-sm">Student ID: {member.studentId}</p>
        </div>
      )}

      {/* Statistics */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-xs font-medium text-gray-600 uppercase">Total</p>
            <p className="text-2xl font-bold text-blue-600 mt-1">{stats.total}</p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <p className="text-xs font-medium text-gray-600 uppercase">Present</p>
            <p className="text-2xl font-bold text-green-600 mt-1">{stats.present}</p>
          </div>
          <div className="bg-red-50 p-4 rounded-lg">
            <p className="text-xs font-medium text-gray-600 uppercase">Absent</p>
            <p className="text-2xl font-bold text-red-600 mt-1">{stats.absent}</p>
          </div>
          <div className="bg-yellow-50 p-4 rounded-lg">
            <p className="text-xs font-medium text-gray-600 uppercase">Excused</p>
            <p className="text-2xl font-bold text-yellow-600 mt-1">{stats.excused}</p>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg">
            <p className="text-xs font-medium text-gray-600 uppercase">Late</p>
            <p className="text-2xl font-bold text-purple-600 mt-1">{stats.late}</p>
          </div>
        </div>
      )}

      {/* Attendance Rate */}
      {stats && stats.total > 0 && (
        <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg border border-blue-200">
          <p className="text-gray-700 font-medium">Attendance Rate</p>
          <div className="mt-2 flex items-center gap-4">
            <div className="flex-1 bg-gray-200 rounded-full h-3 max-w-xs">
              <div
                className="bg-blue-500 h-3 rounded-full transition-all"
                style={{ width: `${(stats.present / stats.total) * 100}%` }}
              ></div>
            </div>
            <span className="text-xl font-bold text-blue-600">
              {((stats.present / stats.total) * 100).toFixed(2)}%
            </span>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
        <h3 className="font-semibold text-gray-800 mb-3">Filter Records</h3>
        <div className="flex gap-4 flex-wrap">
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
            <Input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            />
          </div>
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
            <Input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            />
          </div>
          <div className="flex items-end">
            <Button
              onClick={handleApplyFilters}
              className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
            >
              Apply Filters
            </Button>
          </div>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-100 text-red-800 rounded-lg border border-red-300">
          {error}
        </div>
      )}

      {/* Attendance Records */}
      {loading ? (
        <div className="text-center py-8">
          <p className="text-gray-600">Loading attendance records...</p>
        </div>
      ) : attendance.length === 0 ? (
        <div className="text-center py-8 bg-gray-50 rounded-lg border border-gray-200">
          <p className="text-gray-600">No attendance records found</p>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-100 border-b-2 border-gray-300">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold text-gray-800">Event/Schedule</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-800">Date</th>
                  <th className="px-4 py-3 text-center font-semibold text-gray-800">Status</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-800">Marked By</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-800">Marked At</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-800">Comments</th>
                </tr>
              </thead>
              <tbody>
                {attendance.map((record) => (
                  <tr
                    key={record._id}
                    className="border-b border-gray-200 hover:bg-gray-50 transition"
                  >
                    <td className="px-4 py-3 font-medium text-gray-800">{getEventTitle(record)}</td>
                    <td className="px-4 py-3 text-gray-600">{getEventDate(record)}</td>
                    <td className="px-4 py-3 text-center">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusBadge(
                          record.status
                        )}`}
                      >
                        {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {record.markedBy
                        ? `${record.markedBy.firstName} ${record.markedBy.lastName}`
                        : 'N/A'}
                    </td>
                    <td className="px-4 py-3 text-gray-600 text-xs">
                      {new Date(record.markedAt).toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-gray-600 text-xs">{record.comments || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-6 flex justify-center gap-2">
              <Button
                onClick={() => loadAttendanceHistory(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg disabled:opacity-50"
              >
                Previous
              </Button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <Button
                  key={page}
                  onClick={() => loadAttendanceHistory(page)}
                  className={`px-3 py-2 rounded-lg ${
                    page === currentPage
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-300 text-gray-700 hover:bg-gray-400'
                  }`}
                >
                  {page}
                </Button>
              ))}
              <Button
                onClick={() => loadAttendanceHistory(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg disabled:opacity-50"
              >
                Next
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default MemberAttendanceReport;

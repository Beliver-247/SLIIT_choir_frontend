import React, { useState, useEffect } from 'react';
import { api } from '../utils/api';
import { Button } from './ui/button';
import { Input } from './ui/input';

interface AttendanceStats {
  totalRecords: number;
  byStatus: {
    present: number;
    absent: number;
    excused: number;
    late: number;
  };
  attendanceRate: string;
}

interface MemberAnalytic {
  memberId: string;
  name: string;
  total: number;
  present: number;
  absent: number;
  excused: number;
  late: number;
  attendancePercentage: string;
}

interface DailyAnalytic {
  date: string;
  total: number;
  present: number;
  absent: number;
  excused: number;
  late: number;
}

const AttendanceAnalytics: React.FC = () => {
  const [stats, setStats] = useState<AttendanceStats | null>(null);
  const [memberAnalytics, setMemberAnalytics] = useState<MemberAnalytic[]>([]);
  const [dailyAnalytics, setDailyAnalytics] = useState<DailyAnalytic[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selectedTab, setSelectedTab] = useState<'summary' | 'members' | 'daily'>('summary');

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      setError(null);

      const filters: Record<string, string> = {};
      if (startDate) filters.startDate = startDate;
      if (endDate) filters.endDate = endDate;

      const response = await api.attendance.getAnalytics(filters);

      if (response.success && response.data) {
        setStats(response.data.summary);
        setMemberAnalytics(response.data.memberAnalytics);
        setDailyAnalytics(response.data.dailyAnalytics);
      } else {
        setError(response.error || 'Failed to load analytics');
      }
    } catch (err) {
      setError('Error loading analytics');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAnalytics();
  }, []);

  const handleExportExcel = async () => {
    try {
      setLoading(true);
      const filters: Record<string, string> = {};
      if (startDate) filters.startDate = startDate;
      if (endDate) filters.endDate = endDate;

      await api.attendance.exportToExcel(filters);
      // Success - file will be downloaded automatically
    } catch (err) {
      setError('Failed to export attendance');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const StatCard: React.FC<{ title: string; value: number | string; color: string }> = ({
    title,
    value,
    color,
  }) => (
    <div className={`${color} p-6 rounded-lg shadow-md`}>
      <p className="text-gray-600 text-sm font-medium">{title}</p>
      <p className="text-3xl font-bold text-gray-800 mt-2">{value}</p>
    </div>
  );

  return (
    <div className="w-full max-w-6xl mx-auto p-4 sm:p-6 bg-white rounded-lg shadow-lg">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Attendance Analytics</h2>

        {/* Date Filters */}
        <div className="flex flex-col lg:flex-row gap-4 mb-4">
          <div className="flex-1 w-full">
            <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
            <Input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            />
          </div>
          <div className="flex-1 w-full">
            <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
            <Input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            />
          </div>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-end gap-2 w-full lg:w-auto">
            <Button
              onClick={loadAnalytics}
              className="w-full sm:w-auto px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
            >
              Apply Filters
            </Button>
            <Button
              onClick={handleExportExcel}
              className="w-full sm:w-auto px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
            >
              Export to Excel
            </Button>
          </div>
        </div>
      </div>

      {error && <div className="mb-4 p-4 bg-red-100 text-red-800 rounded-lg border border-red-300">{error}</div>}

      {loading ? (
        <div className="text-center py-8">
          <p className="text-gray-600">Loading analytics data...</p>
        </div>
      ) : (
        <>
          {/* Tabs */}
          <div className="mb-6 border-b border-gray-200 overflow-x-auto">
            <div className="flex gap-0 min-w-max">
              {['summary', 'members', 'daily'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setSelectedTab(tab as typeof selectedTab)}
                  className={`px-4 py-3 font-medium border-b-2 transition ${
                    selectedTab === tab
                      ? 'text-blue-600 border-blue-600'
                      : 'text-gray-600 border-transparent hover:text-gray-800'
                  }`}
                >
                  {tab === 'summary' && 'Summary'}
                  {tab === 'members' && 'Member Analytics'}
                  {tab === 'daily' && 'Daily Trends'}
                </button>
              ))}
            </div>
          </div>

          {/* Summary Tab */}
          {selectedTab === 'summary' && stats && (
            <div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
                <StatCard
                  title="Total Records"
                  value={stats.totalRecords}
                  color="bg-blue-50"
                />
                <StatCard
                  title="Present"
                  value={stats.byStatus.present}
                  color="bg-green-50"
                />
                <StatCard
                  title="Absent"
                  value={stats.byStatus.absent}
                  color="bg-red-50"
                />
                <StatCard
                  title="Excused"
                  value={stats.byStatus.excused}
                  color="bg-yellow-50"
                />
                <StatCard
                  title="Late"
                  value={stats.byStatus.late}
                  color="bg-purple-50"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-lg shadow">
                  <p className="text-gray-700 text-sm font-medium">Overall Attendance Rate</p>
                  <p className="text-5xl font-bold text-blue-600 mt-2">{stats.attendanceRate}%</p>
                </div>

                <div className="bg-white border border-gray-200 p-6 rounded-lg shadow">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Status Distribution</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-700">Present:</span>
                      <div className="w-32 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-green-500 h-2 rounded-full"
                          style={{
                            width: `${
                              stats.totalRecords > 0
                                ? (stats.byStatus.present / stats.totalRecords) * 100
                                : 0
                            }%`,
                          }}
                        ></div>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-700">Absent:</span>
                      <div className="w-32 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-red-500 h-2 rounded-full"
                          style={{
                            width: `${
                              stats.totalRecords > 0
                                ? (stats.byStatus.absent / stats.totalRecords) * 100
                                : 0
                            }%`,
                          }}
                        ></div>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-700">Excused:</span>
                      <div className="w-32 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-yellow-500 h-2 rounded-full"
                          style={{
                            width: `${
                              stats.totalRecords > 0
                                ? (stats.byStatus.excused / stats.totalRecords) * 100
                                : 0
                            }%`,
                          }}
                        ></div>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-700">Late:</span>
                      <div className="w-32 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-purple-500 h-2 rounded-full"
                          style={{
                            width: `${
                              stats.totalRecords > 0
                                ? (stats.byStatus.late / stats.totalRecords) * 100
                                : 0
                            }%`,
                          }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Member Analytics Tab */}
          {selectedTab === 'members' && (
            <div className="overflow-x-auto">
              <table className="w-full text-sm min-w-[600px]">
                <thead className="bg-gray-100 border-b-2 border-gray-300">
                  <tr>
                    <th className="px-4 py-3 text-left font-semibold text-gray-800">Member Name</th>
                    <th className="px-4 py-3 text-center font-semibold text-gray-800">Total</th>
                    <th className="px-4 py-3 text-center font-semibold text-gray-800">Present</th>
                    <th className="px-4 py-3 text-center font-semibold text-gray-800">Absent</th>
                    <th className="px-4 py-3 text-center font-semibold text-gray-800">Excused</th>
                    <th className="px-4 py-3 text-center font-semibold text-gray-800">Late</th>
                    <th className="px-4 py-3 text-center font-semibold text-gray-800">Attendance %</th>
                  </tr>
                </thead>
                <tbody>
                  {memberAnalytics.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-4 py-4 text-center text-gray-600">
                        No member data available
                      </td>
                    </tr>
                  ) : (
                    memberAnalytics.map((member) => (
                      <tr
                        key={member.memberId}
                        className="border-b border-gray-200 hover:bg-gray-50 transition"
                      >
                        <td className="px-4 py-3 font-medium text-gray-800">{member.name}</td>
                        <td className="px-4 py-3 text-center text-gray-600">{member.total}</td>
                        <td className="px-4 py-3 text-center text-green-600 font-medium">
                          {member.present}
                        </td>
                        <td className="px-4 py-3 text-center text-red-600 font-medium">
                          {member.absent}
                        </td>
                        <td className="px-4 py-3 text-center text-yellow-600 font-medium">
                          {member.excused}
                        </td>
                        <td className="px-4 py-3 text-center text-purple-600 font-medium">
                          {member.late}
                        </td>
                        <td className="px-4 py-3 text-center">
                          <span
                            className={`px-2 py-1 rounded-full text-white text-xs font-semibold ${
                              parseFloat(member.attendancePercentage) >= 80
                                ? 'bg-green-500'
                                : parseFloat(member.attendancePercentage) >= 60
                                ? 'bg-yellow-500'
                                : 'bg-red-500'
                            }`}
                          >
                            {member.attendancePercentage}%
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}

          {/* Daily Trends Tab */}
          {selectedTab === 'daily' && (
            <div className="overflow-x-auto">
              <table className="w-full text-sm min-w-[500px]">
                <thead className="bg-gray-100 border-b-2 border-gray-300">
                  <tr>
                    <th className="px-4 py-3 text-left font-semibold text-gray-800">Date</th>
                    <th className="px-4 py-3 text-center font-semibold text-gray-800">Total</th>
                    <th className="px-4 py-3 text-center font-semibold text-gray-800">Present</th>
                    <th className="px-4 py-3 text-center font-semibold text-gray-800">Absent</th>
                    <th className="px-4 py-3 text-center font-semibold text-gray-800">Excused</th>
                    <th className="px-4 py-3 text-center font-semibold text-gray-800">Late</th>
                  </tr>
                </thead>
                <tbody>
                  {dailyAnalytics.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-4 py-4 text-center text-gray-600">
                        No daily data available
                      </td>
                    </tr>
                  ) : (
                    dailyAnalytics.map((daily) => (
                      <tr
                        key={daily.date}
                        className="border-b border-gray-200 hover:bg-gray-50 transition"
                      >
                        <td className="px-4 py-3 font-medium text-gray-800">{daily.date}</td>
                        <td className="px-4 py-3 text-center text-gray-600">{daily.total}</td>
                        <td className="px-4 py-3 text-center text-green-600 font-medium">
                          {daily.present}
                        </td>
                        <td className="px-4 py-3 text-center text-red-600 font-medium">
                          {daily.absent}
                        </td>
                        <td className="px-4 py-3 text-center text-yellow-600 font-medium">
                          {daily.excused}
                        </td>
                        <td className="px-4 py-3 text-center text-purple-600 font-medium">
                          {daily.late}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default AttendanceAnalytics;

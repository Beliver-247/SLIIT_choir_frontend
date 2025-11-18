import React, { useState, useEffect } from 'react';
import { api } from '../utils/api';
import { Button } from './ui/button';
import { Input } from './ui/input';

interface Member {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  studentId: string;
}

interface AttendanceRecord {
  _id: string;
  memberId: Member;
  status: 'present' | 'absent' | 'excused' | 'late';
  comments?: string;
  markedAt: string;
}

interface AttendanceTakingProps {
  eventId?: string;
  scheduleId?: string;
  registeredMembers?: Member[];
  onClose?: () => void;
}

const AttendanceTaking: React.FC<AttendanceTakingProps> = ({
  eventId,
  scheduleId,
  registeredMembers = [],
  onClose,
}) => {
  const [members, setMembers] = useState<Member[]>(registeredMembers);
  const [attendance, setAttendance] = useState<Record<string, AttendanceRecord>>({});
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [comments, setComments] = useState('');
  const [saveMessage, setSaveMessage] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const filteredMembers = members.filter(
    (member) =>
      member.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.studentId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const loadAttendance = async () => {
    try {
      setLoading(true);
      let response;
      if (eventId) {
        response = await api.attendance.getEventAttendance(eventId);
      } else if (scheduleId) {
        response = await api.attendance.getScheduleAttendance(scheduleId);
      }

      if (response && response.success && response.data) {
        const attendanceMap: Record<string, AttendanceRecord> = {};
        const membersList: Member[] = [];

        response.data.forEach((item: any) => {
          if (item.memberId) {
            membersList.push(item.memberId);
            if (item.attendance) {
              attendanceMap[item.memberId._id] = item.attendance;
            }
          }
        });

        if (membersList.length > 0) {
          setMembers(membersList);
        }
        setAttendance(attendanceMap);
      }
    } catch (error) {
      console.error('Error loading attendance:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if ((eventId || scheduleId) && members.length === 0) {
      loadAttendance();
    }
  }, [eventId, scheduleId]);

  const handleMarkAttendance = async (memberId: string, status: string) => {
    try {
      setSaveMessage(null);
      const response = await api.attendance.markAttendance({
        memberId,
        eventId,
        scheduleId,
        status: status as 'present' | 'absent' | 'excused' | 'late',
        comments: comments || undefined,
      });

      if (response.success) {
        setAttendance((prev) => ({
          ...prev,
          [memberId]: response.data as AttendanceRecord,
        }));
        setSaveMessage({ type: 'success', message: 'Attendance marked successfully' });
        setComments('');
      } else {
        setSaveMessage({ type: 'error', message: response.error || 'Failed to mark attendance' });
      }
    } catch (error) {
      setSaveMessage({ type: 'error', message: 'Error marking attendance' });
    }
  };

  const StatusButton: React.FC<{
    status: 'present' | 'absent' | 'excused' | 'late';
    memberId: string;
    isActive: boolean;
  }> = ({ status, memberId, isActive }) => (
    <Button
      onClick={() => handleMarkAttendance(memberId, status)}
      className={`text-xs px-2 py-1 ${
        isActive
          ? status === 'present'
            ? 'bg-green-500 text-white'
            : status === 'absent'
            ? 'bg-red-500 text-white'
            : status === 'excused'
            ? 'bg-yellow-500 text-white'
            : 'bg-blue-500 text-white'
          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
      }`}
    >
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </Button>
  );

  return (
    <div className="w-full max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Mark Attendance</h2>
        {eventId && <p className="text-sm text-gray-600">Event ID: {eventId}</p>}
        {scheduleId && <p className="text-sm text-gray-600">Schedule ID: {scheduleId}</p>}
      </div>

      {saveMessage && (
        <div
          className={`mb-4 p-4 rounded-lg ${
            saveMessage.type === 'success'
              ? 'bg-green-100 text-green-800 border border-green-300'
              : 'bg-red-100 text-red-800 border border-red-300'
          }`}
        >
          {saveMessage.message}
        </div>
      )}

      <div className="mb-6">
        <Input
          type="text"
          placeholder="Search members (name, email, student ID)..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {loading ? (
        <div className="text-center py-8">
          <p className="text-gray-600">Loading attendance data...</p>
        </div>
      ) : (
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {filteredMembers.length === 0 ? (
            <p className="text-center text-gray-600 py-8">
              {members.length === 0
                ? 'No members found. Make sure members are registered.'
                : 'No members match your search.'}
            </p>
          ) : (
            filteredMembers.map((member) => {
              const memberAttendance = attendance[member._id];
              const currentStatus = memberAttendance?.status || null;

              return (
                <div
                  key={member._id}
                  className="flex items-center justify-between p-4 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 transition"
                >
                  <div className="flex-1">
                    <p className="font-semibold text-gray-800">
                      {member.firstName} {member.lastName}
                    </p>
                    <p className="text-sm text-gray-600">{member.studentId}</p>
                    <p className="text-sm text-gray-600">{member.email}</p>
                    {memberAttendance && (
                      <p className="text-xs text-gray-500 mt-1">
                        Last marked: {new Date(memberAttendance.markedAt).toLocaleString()}
                      </p>
                    )}
                  </div>

                  <div className="flex gap-2 ml-4">
                    <StatusButton
                      status="present"
                      memberId={member._id}
                      isActive={currentStatus === 'present'}
                    />
                    <StatusButton
                      status="absent"
                      memberId={member._id}
                      isActive={currentStatus === 'absent'}
                    />
                    <StatusButton
                      status="excused"
                      memberId={member._id}
                      isActive={currentStatus === 'excused'}
                    />
                    <StatusButton
                      status="late"
                      memberId={member._id}
                      isActive={currentStatus === 'late'}
                    />
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {onClose && (
        <div className="mt-6 flex justify-end">
          <Button
            onClick={onClose}
            className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition"
          >
            Close
          </Button>
        </div>
      )}
    </div>
  );
};

export default AttendanceTaking;

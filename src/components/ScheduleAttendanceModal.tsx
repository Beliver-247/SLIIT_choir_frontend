import React, { useState, useEffect } from 'react';
import { api } from '../utils/api';
import { Button } from './ui/button';
import { Input } from './ui/input';
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
} from './ui/alert-dialog';

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

interface ScheduleAttendanceModalProps {
  isOpen: boolean;
  scheduleId: string;
  scheduleTitle: string;
  onClose: () => void;
}

const ScheduleAttendanceModal: React.FC<ScheduleAttendanceModalProps> = ({
  isOpen,
  scheduleId,
  scheduleTitle,
  onClose,
}) => {
  const [members, setMembers] = useState<Member[]>([]);
  const [attendance, setAttendance] = useState<Record<string, AttendanceRecord>>({});
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [saveMessage, setSaveMessage] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const loadScheduleData = async () => {
    try {
      setLoading(true);

      // Get all members
      const membersResponse = await api.members.getAll();
      if (membersResponse.success && membersResponse.data) {
        setMembers(membersResponse.data);
      }

      // Get attendance for this schedule
      const attendanceResponse = await api.attendance.getScheduleAttendance(scheduleId);
      if (attendanceResponse.success && attendanceResponse.data) {
        const attendanceMap: Record<string, AttendanceRecord> = {};
        attendanceResponse.data.forEach((record: AttendanceRecord) => {
          attendanceMap[record.memberId._id] = record;
        });
        setAttendance(attendanceMap);
      }
    } catch (error) {
      console.error('Error loading schedule data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && scheduleId) {
      loadScheduleData();
    }
  }, [isOpen, scheduleId]);

  const filteredMembers = members.filter(
    (member) =>
      member.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.studentId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleMarkAttendance = async (memberId: string, status: string) => {
    try {
      setSaveMessage(null);
      const response = await api.attendance.markAttendance({
        memberId,
        scheduleId,
        status: status as 'present' | 'absent' | 'excused' | 'late',
      });

      if (response.success) {
        setAttendance((prev) => ({
          ...prev,
          [memberId]: response.data as AttendanceRecord,
        }));
        setSaveMessage({ type: 'success', message: `Marked as ${status}` });
        setTimeout(() => setSaveMessage(null), 2000);
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

  if (!isOpen) return null;

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-white border border-gray-300 shadow-lg z-50">
        <AlertDialogTitle className="text-2xl font-bold text-gray-900">Take Attendance - {scheduleTitle}</AlertDialogTitle>
        <AlertDialogDescription className="text-gray-700">Mark attendance for members in this practice schedule</AlertDialogDescription>

        <div className="py-4 space-y-4">
          {saveMessage && (
            <div
              className={`p-3 rounded-lg text-sm ${
                saveMessage.type === 'success'
                  ? 'bg-green-100 text-green-800 border border-green-300'
                  : 'bg-red-100 text-red-800 border border-red-300'
              }`}
            >
              {saveMessage.message}
            </div>
          )}

          <Input
            type="text"
            placeholder="Search members (name, email, student ID)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />

          {loading ? (
            <div className="text-center py-8">
              <p className="text-gray-600">Loading members...</p>
            </div>
          ) : (
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {filteredMembers.length === 0 ? (
                <p className="text-center text-gray-600 py-8">
                  {members.length === 0 ? 'No members found' : 'No members match your search'}
                </p>
              ) : (
                filteredMembers.map((member) => {
                  const memberAttendance = attendance[member._id];
                  const currentStatus = memberAttendance?.status || null;

                  return (
                    <div
                      key={member._id}
                      className="flex items-center justify-between p-3 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 transition"
                    >
                      <div className="flex-1">
                        <p className="font-semibold text-gray-800">
                          {member.firstName} {member.lastName}
                        </p>
                        <p className="text-sm text-gray-600">{member.studentId}</p>
                      </div>

                      <div className="flex gap-2">
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
        </div>

        <div className="flex gap-3 justify-end">
          <AlertDialogCancel>Close</AlertDialogCancel>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default ScheduleAttendanceModal;

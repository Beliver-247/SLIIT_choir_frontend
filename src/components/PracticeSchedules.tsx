import { useState, useEffect } from 'react';
import { api } from '../utils/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Alert, AlertDescription } from './ui/alert';
import { Clock, MapPin, AlertCircle } from 'lucide-react';

interface TimePeriod {
  startTime: string;
  endTime: string;
}

interface Location {
  lectureHallId: string;
}

interface PracticeSchedule {
  _id: string;
  title: string;
  description?: string;
  date: string;
  timePeriod: TimePeriod;
  location: Location;
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
  createdBy: {
    firstName: string;
    lastName: string;
    email: string;
  };
  createdAt: string;
}

interface PracticeSchedulesProps {
  onScheduleSelect?: (schedule: PracticeSchedule) => void;
  showCreateButton?: boolean;
  onCreateClick?: () => void;
}

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

const getStatusColor = (status: string): string => {
  switch (status) {
    case 'upcoming':
      return 'bg-blue-100 text-blue-800';
    case 'ongoing':
      return 'bg-yellow-100 text-yellow-800';
    case 'completed':
      return 'bg-green-100 text-green-800';
    case 'cancelled':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

export default function PracticeSchedules({
  onScheduleSelect,
  showCreateButton = false,
  onCreateClick,
}: PracticeSchedulesProps) {
  const [schedules, setSchedules] = useState<PracticeSchedule[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSchedules = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await api.schedules.getAll({ status: 'upcoming' });
        setSchedules(data.data || []);
      } catch (err: any) {
        console.error('Failed to fetch schedules:', err);
        setError('Failed to load practice schedules');
      } finally {
        setIsLoading(false);
      }
    };

    fetchSchedules();
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="w-8 h-8 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <Alert className="border-red-500 bg-red-50 m-4">
        <AlertCircle className="h-4 w-4 text-red-600" />
        <AlertDescription className="text-red-800">{error}</AlertDescription>
      </Alert>
    );
  }

  if (schedules.length === 0) {
    return (
      <div className="text-center p-8">
        <Clock className="w-12 h-12 text-gray-300 mx-auto mb-3" />
        <p className="text-gray-600">No upcoming practice schedules at the moment.</p>
        <p className="text-sm text-gray-500 mt-2">Check back later for new schedules!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {showCreateButton && (
        <div className="flex justify-end mb-4">
          <Button
            onClick={onCreateClick}
            className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white"
          >
            + Create Schedule
          </Button>
        </div>
      )}

      <div className="grid gap-4">
        {schedules.map((schedule) => (
          <Card
            key={schedule._id}
            className="hover:shadow-lg transition-shadow duration-200 cursor-pointer"
            onClick={() => onScheduleSelect?.(schedule)}
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <CardTitle className="text-lg text-gray-900">
                    {schedule.title}
                  </CardTitle>
                  {schedule.description && (
                    <CardDescription className="mt-1 text-gray-600">
                      {schedule.description}
                    </CardDescription>
                  )}
                </div>
                <Badge className={`whitespace-nowrap ${getStatusColor(schedule.status)}`}>
                  {schedule.status.charAt(0).toUpperCase() + schedule.status.slice(1)}
                </Badge>
              </div>
            </CardHeader>

            <CardContent className="space-y-3">
              {/* Date and Time */}
              <div className="flex items-center gap-3 text-sm">
                <Clock className="w-4 h-4 text-purple-600 flex-shrink-0" />
                <div>
                  <p className="font-medium text-gray-900">
                    {formatDate(schedule.date)}
                  </p>
                  <p className="text-gray-600">
                    {schedule.timePeriod.startTime} - {schedule.timePeriod.endTime}
                  </p>
                </div>
              </div>

              {/* Location */}
              <div className="flex items-center gap-3 text-sm">
                <MapPin className="w-4 h-4 text-purple-600 flex-shrink-0" />
                <p className="text-gray-700 font-medium">
                  Hall {schedule.location.lectureHallId}
                </p>
              </div>

              {/* Created By */}
              <div className="text-xs text-gray-500 pt-2 border-t border-gray-200">
                <p>
                  Created by {schedule.createdBy.firstName} {schedule.createdBy.lastName}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

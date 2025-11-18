import React, { useState } from 'react';
import { api } from '../utils/api';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Alert, AlertDescription } from './ui/alert';
import { Clock, AlertCircle, CheckCircle } from 'lucide-react';

interface CreateScheduleFormData {
  title: string;
  description: string;
  date: string;
  startTime: string;
  endTime: string;
  lectureHallId: string;
}

interface PracticeScheduleCreationProps {
  onScheduleCreated?: () => void;
}

export default function PracticeScheduleCreation({ onScheduleCreated }: PracticeScheduleCreationProps) {
  const [formData, setFormData] = useState<CreateScheduleFormData>({
    title: '',
    description: '',
    date: '',
    startTime: '',
    endTime: '',
    lectureHallId: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = (): boolean => {
    if (!formData.title.trim()) {
      setError('Title is required');
      return false;
    }
    if (!formData.date) {
      setError('Date is required');
      return false;
    }
    if (!formData.startTime) {
      setError('Start time is required');
      return false;
    }
    if (!formData.endTime) {
      setError('End time is required');
      return false;
    }
    if (formData.startTime >= formData.endTime) {
      setError('Start time must be before end time');
      return false;
    }
    if (!formData.lectureHallId.trim()) {
      setError('Lecture hall ID is required');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const payload = {
        title: formData.title.trim(),
        description: formData.description.trim() || null,
        date: new Date(formData.date).toISOString(),
        timePeriod: {
          startTime: formData.startTime,
          endTime: formData.endTime,
        },
        location: {
          lectureHallId: formData.lectureHallId.trim().toUpperCase(),
        },
      };

      const response = await api.schedules.create(payload);

      if (response.success) {
        setSuccess('Practice schedule created successfully!');
        setFormData({
          title: '',
          description: '',
          date: '',
          startTime: '',
          endTime: '',
          lectureHallId: '',
        });

        // Trigger callback after 1.5 seconds
        setTimeout(() => {
          onScheduleCreated?.();
        }, 1500);
      } else {
        setError(response.error || 'Failed to create practice schedule');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred while creating the practice schedule');
    } finally {
      setLoading(false);
    }
  };

  return (
<div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-50 pt-24 pb-12">
  <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <Card className="shadow-lg">
          <CardHeader className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-t-lg">
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Create Practice Schedule
            </CardTitle>
            <CardDescription className="text-purple-100">
              Set up a new practice session for the choir
            </CardDescription>
          </CardHeader>

          <CardContent className="pt-6">
            {error && (
              <Alert className="mb-4 border-red-500 bg-red-50">
                <AlertCircle className="h-4 w-4 text-red-600" />
                <AlertDescription className="text-red-800">{error}</AlertDescription>
              </Alert>
            )}

            {success && (
              <Alert className="mb-4 border-green-500 bg-green-50">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-800">{success}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Title */}
              <div className="space-y-2">
                <Label htmlFor="title" className="text-sm font-semibold">
                  Practice Title <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="title"
                  name="title"
                  type="text"
                  placeholder="e.g., Weekly Choir Practice, Voice Training Session"
                  value={formData.title}
                  onChange={handleInputChange}
                  disabled={loading}
                  className="border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                />
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description" className="text-sm font-semibold">
                  Description <span className="text-gray-400 text-xs">(Optional)</span>
                </Label>
                <textarea
                  id="description"
                  name="description"
                  placeholder="Add any additional details about this practice session..."
                  value={formData.description}
                  onChange={handleInputChange}
                  disabled={loading}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 text-sm"
                />
              </div>

              {/* Date */}
              <div className="space-y-2">
                <Label htmlFor="date" className="text-sm font-semibold">
                  Date <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="date"
                  name="date"
                  type="date"
                  value={formData.date}
                  onChange={handleInputChange}
                  disabled={loading}
                  className="border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                />
              </div>

              {/* Time Period */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="startTime" className="text-sm font-semibold">
                    Start Time <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="startTime"
                    name="startTime"
                    type="time"
                    value={formData.startTime}
                    onChange={handleInputChange}
                    disabled={loading}
                    className="border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="endTime" className="text-sm font-semibold">
                    End Time <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="endTime"
                    name="endTime"
                    type="time"
                    value={formData.endTime}
                    onChange={handleInputChange}
                    disabled={loading}
                    className="border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                  />
                </div>
              </div>

              {/* Lecture Hall ID */}
              <div className="space-y-2">
                <Label htmlFor="lectureHallId" className="text-sm font-semibold">
                  Lecture Hall ID <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="lectureHallId"
                  name="lectureHallId"
                  type="text"
                  placeholder="e.g., A503, B403, G1307, F1401"
                  value={formData.lectureHallId}
                  onChange={handleInputChange}
                  disabled={loading}
                  className="border-gray-300 focus:border-purple-500 focus:ring-purple-500 uppercase"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Format: Building letter + hall number (e.g., A503, B403)
                </p>
              </div>

              {/* Submit Button */}
              <div className="pt-4 space-y-3">
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-semibold py-2 rounded-lg transition-all duration-200"
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Creating Schedule...
                    </span>
                  ) : (
                    'Create Practice Schedule'
                  )}
                </Button>
              </div>

              {/* Helper Text */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-xs text-blue-800">
                <p className="font-semibold mb-1">📝 Tips:</p>
                <ul className="space-y-1 list-disc list-inside">
                  <li>Enter the practice title and select a date</li>
                  <li>Specify the time period (start and end times)</li>
                  <li>Enter the lecture hall ID (e.g., A503, B403)</li>
                  <li>Add an optional description with details</li>
                </ul>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

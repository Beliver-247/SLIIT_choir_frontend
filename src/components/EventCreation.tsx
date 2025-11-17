import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "./ui/select";
import { AlertCircle, CheckCircle, Loader } from "lucide-react";

interface EventCreationProps {
  onEventCreated: () => void;
  onCancel: () => void;
}

type EventType = 'performance' | 'practice' | 'charity' | 'competition' | 'other';

interface EventFormData {
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  eventType: EventType;
  capacity: number;
  image: string;
}

export function EventCreation({ onEventCreated, onCancel }: EventCreationProps) {
  const [formData, setFormData] = useState<EventFormData>({
    title: '',
    description: '',
    date: '',
    time: '',
    location: '',
    eventType: 'performance',
    capacity: 100,
    image: ''
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'capacity' ? parseInt(value) || 0 : value
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = (): boolean => {
    if (!formData.title.trim()) {
      setError('Event title is required');
      return false;
    }
    if (!formData.date) {
      setError('Event date is required');
      return false;
    }
    if (!formData.location.trim()) {
      setError('Event location is required');
      return false;
    }
    if (formData.capacity < 1) {
      setError('Event capacity must be at least 1');
      return false;
    }
    
    // Check if date is not in the past
    const eventDateTime = new Date(`${formData.date}T${formData.time}`);
    if (eventDateTime < new Date()) {
      setError('Event date and time cannot be in the past');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        throw new Error('Authentication token not found. Please log in again.');
      }

      const response = await fetch('http://localhost:5000/api/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          title: formData.title.trim(),
          description: formData.description.trim(),
          date: formData.date,
          time: formData.time,
          location: formData.location.trim(),
          eventType: formData.eventType,
          capacity: formData.capacity,
          image: formData.image.trim() || null
        })
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to create event');
      }

      setSuccess(true);
      setFormData({
        title: '',
        description: '',
        date: '',
        time: '',
        location: '',
        eventType: 'performance',
        capacity: 100,
        image: ''
      });

      // Notify parent component and redirect after a brief delay
      setTimeout(() => {
        onEventCreated();
      }, 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create event');
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="flex items-center justify-center min-h-[500px]">
        <Card className="w-full max-w-md border-green-200 bg-green-50">
          <CardContent className="pt-6 text-center">
            <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-green-900 mb-2">Event Created Successfully!</h2>
            <p className="text-green-700 mb-4">Your event has been created and is now visible to all members.</p>
            <p className="text-sm text-gray-600">Redirecting you back...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <Card>
          <CardHeader>
            <CardTitle>Create New Event</CardTitle>
            <CardDescription>
              Fill in the details below to create a new event for the SLIIT Choir
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex gap-3">
                  <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <p className="text-red-700">{error}</p>
                </div>
              )}

              {/* Title */}
              <div className="space-y-2">
                <Label htmlFor="title">Event Title *</Label>
                <Input
                  id="title"
                  name="title"
                  type="text"
                  placeholder="e.g., Annual Concert 2025"
                  value={formData.title}
                  onChange={handleInputChange}
                  disabled={isLoading}
                  required
                />
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <textarea
                  id="description"
                  name="description"
                  placeholder="Enter event description..."
                  value={formData.description}
                  onChange={handleInputChange}
                  disabled={isLoading}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                />
              </div>

              {/* Date and Time */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="date">Event Date *</Label>
                  <Input
                    id="date"
                    name="date"
                    type="date"
                    value={formData.date}
                    onChange={handleInputChange}
                    disabled={isLoading}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="time">Event Time</Label>
                  <Input
                    id="time"
                    name="time"
                    type="time"
                    value={formData.time}
                    onChange={handleInputChange}
                    disabled={isLoading}
                  />
                </div>
              </div>

              {/* Location */}
              <div className="space-y-2">
                <Label htmlFor="location">Location *</Label>
                <Input
                  id="location"
                  name="location"
                  type="text"
                  placeholder="e.g., SLIIT Auditorium, Malabe"
                  value={formData.location}
                  onChange={handleInputChange}
                  disabled={isLoading}
                  required
                />
              </div>

              {/* Event Type and Capacity */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="eventType">Event Type *</Label>
                  <Select 
                    value={formData.eventType} 
                    onValueChange={(value) => handleSelectChange('eventType', value)}
                    disabled={isLoading}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="performance">Performance</SelectItem>
                      <SelectItem value="practice">Practice</SelectItem>
                      <SelectItem value="charity">Charity</SelectItem>
                      <SelectItem value="competition">Competition</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="capacity">Capacity</Label>
                  <Input
                    id="capacity"
                    name="capacity"
                    type="number"
                    placeholder="100"
                    value={formData.capacity}
                    onChange={handleInputChange}
                    disabled={isLoading}
                    min="1"
                  />
                </div>
              </div>

              {/* Image URL */}
              <div className="space-y-2">
                <Label htmlFor="image">Image URL</Label>
                <Input
                  id="image"
                  name="image"
                  type="url"
                  placeholder="https://example.com/image.jpg"
                  value={formData.image}
                  onChange={handleInputChange}
                  disabled={isLoading}
                />
                <p className="text-xs text-gray-500">Optional: Add a URL to an event image</p>
              </div>

              {/* Form Actions */}
              <div className="flex gap-3 pt-4">
                <Button
                  type="submit"
                  className="flex-1 bg-blue-600 hover:bg-blue-700"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <Loader className="h-4 w-4 animate-spin" />
                      Creating...
                    </div>
                  ) : (
                    'Create Event'
                  )}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={onCancel}
                  disabled={isLoading}
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

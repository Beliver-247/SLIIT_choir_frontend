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
import { Alert, AlertDescription } from "./ui/alert";
import { AlertCircle, CheckCircle, Calendar, MapPin, Users, Image } from "lucide-react";
import { api } from "../utils/api";

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
      const result = await api.events.create({
        title: formData.title.trim(),
        description: formData.description.trim(),
        date: formData.date,
        time: formData.time,
        location: formData.location.trim(),
        eventType: formData.eventType,
        capacity: formData.capacity,
        image: formData.image.trim() || null
      });

      if (!result.success) {
        throw new Error(result.error || 'Failed to create event');
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
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 pt-24 pb-12">
        <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="shadow-lg border-green-200">
            <CardHeader className="bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-t-lg">
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5" />
                Event Created Successfully!
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6 text-center">
              <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
              <p className="text-green-700 mb-4">Your event has been created and is now visible to all members.</p>
              <p className="text-sm text-gray-600">Redirecting you back...</p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 pt-24 pb-12">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <Card className="shadow-lg">
          <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-t-lg">
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Create New Event
            </CardTitle>
            <CardDescription className="text-blue-100">
              Fill in the details below to create a new event for the SLIIT Choir
            </CardDescription>
          </CardHeader>

          <CardContent className="pt-6">
            {error && (
              <Alert className="mb-4 border-red-500 bg-red-50">
                <AlertCircle className="h-4 w-4 text-red-600" />
                <AlertDescription className="text-red-800">{error}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Title */}
              <div className="space-y-2">
                <Label htmlFor="title" className="text-sm font-semibold">
                  Event Title <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="title"
                  name="title"
                  type="text"
                  placeholder="e.g., Annual Concert 2025, Christmas Carol Service"
                  value={formData.title}
                  onChange={handleInputChange}
                  disabled={isLoading}
                  className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  required
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
                  placeholder="Enter event description, special instructions, or additional details..."
                  value={formData.description}
                  onChange={handleInputChange}
                  disabled={isLoading}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
                />
              </div>

              {/* Date and Time */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="date" className="text-sm font-semibold">
                    Event Date <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="date"
                    name="date"
                    type="date"
                    value={formData.date}
                    onChange={handleInputChange}
                    disabled={isLoading}
                    className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="time" className="text-sm font-semibold">
                    Event Time
                  </Label>
                  <Input
                    id="time"
                    name="time"
                    type="time"
                    value={formData.time}
                    onChange={handleInputChange}
                    disabled={isLoading}
                    className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Location */}
              <div className="space-y-2">
                <Label htmlFor="location" className="text-sm font-semibold">
                  Location <span className="text-red-500">*</span>
                </Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="location"
                    name="location"
                    type="text"
                    placeholder="e.g., SLIIT Auditorium, Main Hall A503, Outdoor Amphitheater"
                    value={formData.location}
                    onChange={handleInputChange}
                    disabled={isLoading}
                    className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 pl-10"
                    required
                  />
                </div>
              </div>

              {/* Event Type and Capacity */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="eventType" className="text-sm font-semibold">
                    Event Type <span className="text-red-500">*</span>
                  </Label>
                  <Select 
                    value={formData.eventType} 
                    onValueChange={(value) => handleSelectChange('eventType', value)}
                    disabled={isLoading}
                  >
                    <SelectTrigger className="border-gray-300 focus:border-blue-500 focus:ring-blue-500">
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
                  <Label htmlFor="capacity" className="text-sm font-semibold">
                    Capacity
                  </Label>
                  <div className="relative">
                    <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="capacity"
                      name="capacity"
                      type="number"
                      placeholder="100"
                      value={formData.capacity}
                      onChange={handleInputChange}
                      disabled={isLoading}
                      className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 pl-10"
                      min="1"
                    />
                  </div>
                </div>
              </div>

              {/* Image URL */}
              <div className="space-y-2">
                <Label htmlFor="image" className="text-sm font-semibold">
                  Image URL <span className="text-gray-400 text-xs">(Optional)</span>
                </Label>
                <div className="relative">
                  <Image className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="image"
                    name="image"
                    type="url"
                    placeholder="https://example.com/event-image.jpg"
                    value={formData.image}
                    onChange={handleInputChange}
                    disabled={isLoading}
                    className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 pl-10"
                  />
                </div>
                <p className="text-xs text-gray-500">Add a URL to an event image or poster</p>
              </div>

              {/* Form Actions */}
              <div className="flex gap-3 pt-4">
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-2 rounded-lg transition-all duration-200"
                >
                  {isLoading ? (
                    <span className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Creating Event...
                    </span>
                  ) : (
                    'Create Event'
                  )}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={onCancel}
                  disabled={isLoading}
                  className="flex-1 border-gray-300 hover:bg-gray-50"
                >
                  Cancel
                </Button>
              </div>

              {/* Helper Text */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-xs text-blue-800">
                <p className="font-semibold mb-1">📝 Event Creation Tips:</p>
                <ul className="space-y-1 list-disc list-inside">
                  <li>Provide a clear and descriptive event title</li>
                  <li>Select the appropriate event type for categorization</li>
                  <li>Include detailed location information for easy navigation</li>
                  <li>Set a realistic capacity based on venue size</li>
                  <li>Add an image URL to make your event more engaging</li>
                </ul>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
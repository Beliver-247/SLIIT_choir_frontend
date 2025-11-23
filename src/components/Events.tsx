import { useState, useEffect } from "react";
import { Card, CardContent } from "./ui/card";
import { Calendar, MapPin, Clock } from "lucide-react";
// import { Button } from "./ui/button";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { api } from "../utils/api";
import { motion } from "framer-motion";

interface Event {
  _id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  image?: string;
  description?: string;
}

export function Events() {
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // Try without status filter first to debug
        const result = await api.events.getAll();
        
        console.log('[Events] API Response:', result);
        
        if (!result.success) {
          console.error('[Events] API returned success: false', result.error);
          setError(result.error || 'Failed to load events');
          setEvents([]);
          return;
        }

        // The API returns the events array directly in the response
        const eventsData = result.data || [];
        console.log('[Events] Events data:', eventsData);
        console.log('[Events] Is array?', Array.isArray(eventsData));
        console.log('[Events] Events count:', eventsData.length);
        
        // Filter for upcoming events on the frontend if needed
        const upcomingEvents = Array.isArray(eventsData) 
          ? eventsData.filter(e => e.status === 'upcoming' || !e.status)
          : [];
        
        console.log('[Events] Filtered upcoming events:', upcomingEvents.length);
        setEvents(upcomingEvents);
      } catch (err) {
        console.error('Failed to fetch events:', err);
        setError('Failed to load events');
        setEvents([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const formatTime = (timeString: string) => {
    if (!timeString) return 'Time TBA';
    return timeString;
  };

  return (
    <section id="events" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div className="text-center mb-16" initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4 }}>
          <h2 className="text-brand-navy mb-4">Upcoming Events</h2>
          <p className="text-brand-navy/80 text-xl max-w-3xl mx-auto">
            Join us at our performances and events throughout the year. 
            Every event is an opportunity to experience beautiful music and support worthy causes.
          </p>
        </motion.div>

        {isLoading && (
          <div className="flex justify-center items-center py-12">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-brand-orange mb-4"></div>
              <p className="text-brand-navy/70">Loading events...</p>
            </div>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {!isLoading && events.length === 0 && !error && (
          <div className="text-center py-12">
            <p className="text-brand-navy/70">No upcoming events at the moment. Please check back later!</p>
          </div>
        )}

        <motion.div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8" initial="hidden" whileInView="show" viewport={{ once: true }} variants={{ hidden: {}, show: { transition: { staggerChildren: 0.08 }}}}>
          {events.map((event) => (
            <motion.div key={event._id} variants={{ hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 }}}>
            <Card className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="relative h-48 bg-gray-200">
                {event.image ? (
                  <ImageWithFallback
                    src={event.image}
                    alt={event.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-300">
                    <span className="text-gray-500">No image available</span>
                  </div>
                )}
              </div>
              <CardContent className="p-6">
                <h3 className="text-brand-navy mb-3 line-clamp-2">{event.title}</h3>
                <p className="text-brand-navy/70 mb-4 line-clamp-2">{event.description || 'Event details coming soon...'}</p>
                
                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-brand-navy/70">
                    <Calendar className="h-4 w-4 flex-shrink-0" />
                    <span className="text-sm">{formatDate(event.date)}</span>
                  </div>
                  {event.time && (
                    <div className="flex items-center gap-2 text-brand-navy/70">
                      <Clock className="h-4 w-4 flex-shrink-0" />
                      <span className="text-sm">{formatTime(event.time)}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-brand-navy/70">
                    <MapPin className="h-4 w-4 flex-shrink-0" />
                    <span className="text-sm line-clamp-1">{event.location}</span>
                  </div>
                </div>

                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                {/* <Button className="w-full bg-blue-600 hover:bg-blue-700">
                  Register
                </Button> */}
                </motion.div>
              </CardContent>
            </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

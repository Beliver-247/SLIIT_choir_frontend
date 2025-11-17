import { Card, CardContent } from "./ui/card";
import { Calendar, MapPin, Clock } from "lucide-react";
import { Button } from "./ui/button";
import { ImageWithFallback } from "./figma/ImageWithFallback";

export function Events() {
  const upcomingEvents = [
    {
      title: "University Foundation Day Performance",
      date: "December 15, 2025",
      time: "6:00 PM",
      location: "SLIIT Main Auditorium",
      image: "https://images.unsplash.com/photo-1762158007643-666f303d91d0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx1bml2ZXJzaXR5JTIwc3R1ZGVudHMlMjBzaW5naW5nfGVufDF8fHx8MTc2MzM1MTEwNHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      description: "Join us as we celebrate SLIIT's foundation with a special musical performance."
    },
    {
      title: "Annual Christmas Carol Service",
      date: "December 20, 2025",
      time: "7:00 PM",
      location: "Cathedral of Christ the Living Saviour",
      image: "https://images.unsplash.com/photo-1667933579786-6753a3dc4bd9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaHJpc3RtYXMlMjBjYXJvbCUyMHNlcnZpY2V8ZW58MXx8fHwxNzYzMzUxMTA0fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      description: "Our biggest event of the year – a beautiful carol service for charity. All proceeds go to support underprivileged children."
    },
    {
      title: "Inter-University Music Festival",
      date: "January 25, 2026",
      time: "5:00 PM",
      location: "Nelum Pokuna Theatre",
      image: "https://images.unsplash.com/photo-1660248771425-76ee4182c257?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtdXNpY2FsJTIwY29uY2VydCUyMGF1ZGllbmNlfGVufDF8fHx8MTc2MzM1MTEwNXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      description: "Representing SLIIT at the prestigious inter-university music competition."
    }
  ];

  return (
    <section id="events" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-blue-900 mb-4">Upcoming Events</h2>
          <p className="text-gray-600 text-xl max-w-3xl mx-auto">
            Join us at our performances and events throughout the year. 
            Every event is an opportunity to experience beautiful music and support worthy causes.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {upcomingEvents.map((event, index) => (
            <Card key={index} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="relative h-48">
                <ImageWithFallback
                  src={event.image}
                  alt={event.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <CardContent className="p-6">
                <h3 className="text-blue-900 mb-3">{event.title}</h3>
                <p className="text-gray-600 mb-4">{event.description}</p>
                
                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Calendar className="h-4 w-4" />
                    <span>{event.date}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Clock className="h-4 w-4" />
                    <span>{event.time}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <MapPin className="h-4 w-4" />
                    <span>{event.location}</span>
                  </div>
                </div>

                <Button className="w-full bg-blue-600 hover:bg-blue-700">
                  Learn More
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

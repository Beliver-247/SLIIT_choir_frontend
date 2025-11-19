import { Button } from "./ui/button";
import { Calendar, Heart, Music, Users } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { motion } from "framer-motion";

export function CarolService() {
  return (
    <section id="carol-service" className="py-20 bg-gradient-to-br from-blue-900 to-blue-800 text-white relative overflow-hidden">
      {/* Decorative background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10">
          <Music className="h-32 w-32" />
        </div>
        <div className="absolute bottom-10 right-10">
          <Music className="h-32 w-32" />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.45 }}>
            <div className="inline-block bg-blue-700 px-4 py-2 rounded-full mb-6">
              <span className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Annual Event - Every December
              </span>
            </div>

            <h2 className="text-white mb-6">
              Christmas Carol Service
            </h2>
            
            <p className="text-blue-100 text-xl mb-8">
              Our flagship event of the year – a magical evening of traditional and contemporary 
              Christmas carols, bringing the community together to celebrate the season and support 
              those in need.
            </p>

            <div className="space-y-4 mb-8">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-blue-700 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Heart className="h-5 w-5" />
                </div>
                <div>
                  <div className="mb-1">Charity Fundraiser</div>
                  <p className="text-blue-200">
                    All proceeds from ticket sales and donations go directly to supporting underprivileged 
                    children and families during the holiday season.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-blue-700 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Music className="h-5 w-5" />
                </div>
                <div>
                  <div className="mb-1">Beautiful Repertoire</div>
                  <p className="text-blue-200">
                    Experience timeless Christmas classics and modern arrangements performed by our 
                    talented choir members.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-blue-700 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Users className="h-5 w-5" />
                </div>
                <div>
                  <div className="mb-1">Community Event</div>
                  <p className="text-blue-200">
                    Join hundreds of attendees for an evening that brings together the SLIIT community 
                    and music lovers from across the city.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-4">
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
                <Button size="lg" className="bg-white text-blue-900 hover:bg-blue-50">
                  Get Tickets
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
                <Button size="lg" variant="outline" className="text-white border-white hover:bg-white/10">
                  Learn More
                </Button>
              </motion.div>
            </div>
          </motion.div>

          <motion.div className="relative" initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}>
            <div className="relative rounded-lg overflow-hidden shadow-2xl">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1667933579786-6753a3dc4bd9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaHJpc3RtYXMlMjBjYXJvbCUyMHNlcnZpY2V8ZW58MXx8fHwxNzYzMzUxMTA0fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                alt="Christmas Carol Service"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-blue-900/50 to-transparent"></div>
            </div>

            {/* Stats overlay */}
            <div className="absolute -bottom-6 left-6 right-6 bg-white text-blue-900 p-6 rounded-lg shadow-xl">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-2xl mb-1">1000+</div>
                  <div className="text-gray-600 text-sm">Attendees</div>
                </div>
                <div>
                  <div className="text-2xl mb-1">$50K+</div>
                  <div className="text-gray-600 text-sm">Raised</div>
                </div>
                <div>
                  <div className="text-2xl mb-1">10th</div>
                  <div className="text-gray-600 text-sm">Year</div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

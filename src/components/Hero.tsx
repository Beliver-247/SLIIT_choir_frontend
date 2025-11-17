import { Button } from "./ui/button";
import { Music2, Heart } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

export function Hero() {
  return (
    <div className="relative pt-16 min-h-screen flex items-center">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <ImageWithFallback
          src="https://images.unsplash.com/photo-1610254449353-5698372fa83b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaG9pciUyMHBlcmZvcm1hbmNlfGVufDF8fHx8MTc2MzM1MTEwNHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
          alt="Choir Performance"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/90 to-blue-900/70"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="max-w-3xl">
          <div className="flex items-center gap-2 mb-6">
            <Music2 className="h-8 w-8 text-blue-300" />
            <span className="text-blue-200">SLIIT Official Choir</span>
          </div>
          
          <h1 className="text-white mb-6">
            Voices United in Harmony & Service
          </h1>
          
          <p className="text-blue-100 text-xl mb-8 max-w-2xl">
            We are the official choir of SLIIT, bringing music to life while making a difference 
            through our performances and charitable initiatives.
          </p>

          <div className="flex flex-wrap gap-4">
            <Button size="lg" className="bg-white text-blue-900 hover:bg-blue-50">
              <Heart className="mr-2 h-5 w-5" />
              Support Our Cause
            </Button>
            <Button size="lg" variant="outline" className="text-white border-white hover:bg-white/10">
              Learn More
            </Button>
          </div>

          <div className="grid grid-cols-3 gap-8 mt-12 pt-12 border-t border-blue-300/30">
            <div>
              <div className="text-white text-3xl mb-2">500+</div>
              <div className="text-blue-200">Performances</div>
            </div>
            <div>
              <div className="text-white text-3xl mb-2">50+</div>
              <div className="text-blue-200">Events Annually</div>
            </div>
            <div>
              <div className="text-white text-3xl mb-2">10+</div>
              <div className="text-blue-200">Years of Service</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

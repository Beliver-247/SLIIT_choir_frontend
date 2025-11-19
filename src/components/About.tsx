import { Music, Users, Heart, Award } from "lucide-react";
import { motion } from "framer-motion";

export function About() {
  const features = [
    {
      icon: Music,
      title: "Musical Excellence",
      description: "We deliver outstanding vocal performances at events throughout the year, representing SLIIT with pride."
    },
    {
      icon: Users,
      title: "Community Building",
      description: "Bringing together talented students who share a passion for music and community service."
    },
    {
      icon: Heart,
      title: "Charitable Impact",
      description: "Running donation campaigns and fundraising events to support worthy causes and communities in need."
    },
    {
      icon: Award,
      title: "Representing SLIIT",
      description: "Proudly showcasing our university's talent at local and national events as official ambassadors."
    }
  ];

  return (
    <section id="about" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div className="text-center mb-16" initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4 }}>
          <h2 className="text-blue-900 mb-4">About SLIIT Choir</h2>
          <p className="text-gray-600 text-xl max-w-3xl mx-auto">
            We are more than just a choir – we're a community dedicated to spreading joy 
            through music while making a positive impact through our charitable initiatives.
          </p>
        </motion.div>

        <motion.div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8" initial="hidden" whileInView="show" viewport={{ once: true }} variants={{ hidden: {}, show: { transition: { staggerChildren: 0.08 }}}}>
          {features.map((feature, index) => (
            <motion.div 
              key={index}
              className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow"
              variants={{ hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 }}}
            >
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <feature.icon className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-blue-900 mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

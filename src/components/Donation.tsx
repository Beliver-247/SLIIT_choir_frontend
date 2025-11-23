import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Heart, HandHeart, Gift, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

export function Donation() {
  const donationTiers = [
    {
      icon: Heart,
      name: "Supporter",
      amount: "$25",
      description: "Help us cover basic operational costs and music supplies.",
      benefits: ["Recognition on our website", "Monthly newsletter updates"]
    },
    {
      icon: HandHeart,
      name: "Patron",
      amount: "$100",
      description: "Support our community outreach and charitable programs.",
      benefits: ["All Supporter benefits", "Invitations to exclusive events", "Annual report"],
      popular: true
    },
    {
      icon: Gift,
      name: "Benefactor",
      amount: "$500",
      description: "Make a significant impact on our charity initiatives.",
      benefits: ["All Patron benefits", "VIP seating at carol service", "Personal thank you from the choir"]
    }
  ];

  return (
    <section id="donate" className="py-20 bg-brand-blue/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div className="text-center mb-16" initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4 }}>
          <div className="inline-flex items-center gap-2 bg-brand-yellow/20 text-brand-navy px-4 py-2 rounded-full mb-4">
            <Sparkles className="h-4 w-4" />
            <span>Make a Difference</span>
          </div>
          <h2 className="text-brand-navy mb-4">Support Our Mission</h2>
          <p className="text-brand-navy/80 text-xl max-w-3xl mx-auto">
            Your generous donations help us continue our musical journey and support 
            communities in need. Every contribution makes a real difference.
          </p>
        </motion.div>

        <motion.div className="grid md:grid-cols-3 gap-8 mb-12" initial="hidden" whileInView="show" viewport={{ once: true }} variants={{ hidden: {}, show: { transition: { staggerChildren: 0.08 }}}}>
          {donationTiers.map((tier, index) => (
            <motion.div key={index} variants={{ hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 }}}>
            <Card 
              className={`relative border border-brand-navy/10 ${tier.popular ? 'shadow-lg ring-1 ring-brand-orange/40' : 'shadow-sm'}`}
            >
              {tier.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-brand-orange text-white px-4 py-1 rounded-full">
                  Most Popular
                </div>
              )}
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-brand-orange/10 rounded-lg flex items-center justify-center mb-4">
                  <tier.icon className="h-6 w-6 text-brand-orange" />
                </div>
                
                <h3 className="text-brand-navy mb-2">{tier.name}</h3>
                <div className="text-3xl text-brand-navy mb-4">{tier.amount}</div>
                
                <p className="text-brand-navy mb-6">{tier.description}</p>
                
                <div className="space-y-2 mb-6">
                  {tier.benefits.map((benefit, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-brand-navy">
                      <div className="w-1.5 h-1.5 bg-brand-orange rounded-full mt-2 flex-shrink-0"></div>
                      <span>{benefit}</span>
                    </div>
                  ))}
                </div>

                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button 
                    className={`w-full text-white ${tier.popular ? 'bg-brand-orange hover:bg-brand-orange/90' : 'bg-brand-navy hover:bg-brand-navy/90'}`}
                  >
                    Donate {tier.amount}
                  </Button>
                </motion.div>
              </CardContent>
            </Card>
            </motion.div>
          ))}
        </motion.div>

        <motion.div className="bg-brand-navy text-white rounded-2xl p-8 md:p-12" initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.45 }}>
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-white mb-4">Custom Donation</h3>
              <p className="text-brand-yellow/90 mb-6">
                Want to contribute a different amount? Every donation, big or small, 
                helps us continue our mission of spreading joy through music and supporting those in need.
              </p>
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
                <Button size="lg" className="bg-white text-brand-navy hover:bg-brand-yellow/10">
                  Make a Custom Donation
                </Button>
              </motion.div>
            </div>
            
            <div className="bg-brand-indigo rounded-lg p-6">
              <h4 className="text-white mb-4">Where Your Money Goes</h4>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-brand-yellow/80 mb-2">
                    <span>Charity Programs</span>
                    <span>60%</span>
                  </div>
                  <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                    <div className="h-full bg-brand-yellow w-[60%]"></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-brand-yellow/80 mb-2">
                    <span>Music & Equipment</span>
                    <span>25%</span>
                  </div>
                  <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                    <div className="h-full bg-brand-orange w-[25%]"></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-brand-yellow/80 mb-2">
                    <span>Operations</span>
                    <span>15%</span>
                  </div>
                  <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                    <div className="h-full bg-brand-green w-[15%]"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

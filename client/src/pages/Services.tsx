import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Heart, 
  Sparkles, 
  Shield, 
  Smile, 
  CheckCircle, 
  Clock, 
  Star,
  ArrowRight,
  Calendar
} from "lucide-react";
import { Link } from "wouter";

const services = [
  {
    id: 1,
    title: "General Dentistry",
    icon: Heart,
    description: "Comprehensive oral healthcare for the whole family",
    fullDescription: "Our general dentistry services provide the foundation for optimal oral health. We focus on preventing, diagnosing, and treating common dental conditions to keep your smile healthy and beautiful.",
    features: [
      "Routine cleanings and examinations",
      "Cavity detection and fillings",
      "Gum disease treatment",
      "Oral cancer screenings",
      "Dental X-rays and diagnostics",
      "Emergency dental care"
    ],
    benefits: [
      "Prevent serious dental problems",
      "Maintain fresh breath and healthy gums",
      "Early detection of oral health issues",
      "Personalized treatment plans"
    ],
    duration: "30-60 minutes",
    frequency: "Every 6 months",
    color: "from-blue-500 to-blue-700"
  },
  {
    id: 2,
    title: "Cosmetic Dentistry",
    icon: Sparkles,
    description: "Transform your smile with advanced aesthetic treatments",
    fullDescription: "Our cosmetic dentistry services are designed to enhance the appearance of your teeth and give you the confident smile you've always wanted. Using the latest techniques and materials, we create beautiful, natural-looking results.",
    features: [
      "Professional teeth whitening",
      "Porcelain veneers",
      "Dental bonding",
      "Smile makeovers",
      "Gum contouring",
      "Tooth-colored fillings"
    ],
    benefits: [
      "Boost your confidence",
      "Improve facial aesthetics",
      "Long-lasting results",
      "Natural-looking appearance"
    ],
    duration: "1-3 hours",
    frequency: "As needed",
    color: "from-purple-500 to-pink-500"
  },
  {
    id: 3,
    title: "Restorative Care",
    icon: Shield,
    description: "Repair and restore damaged teeth to full function",
    fullDescription: "Our restorative care services focus on repairing damaged, decayed, or missing teeth to restore both function and aesthetics. We use advanced materials and techniques to ensure durable, comfortable results.",
    features: [
      "Dental crowns and bridges",
      "Dental implants",
      "Root canal therapy",
      "Dentures and partials",
      "Inlays and onlays",
      "Tooth extractions"
    ],
    benefits: [
      "Restore proper chewing function",
      "Prevent further dental problems",
      "Maintain facial structure",
      "Improve speech clarity"
    ],
    duration: "1-2 hours",
    frequency: "As needed",
    color: "from-green-500 to-emerald-600"
  },
  {
    id: 4,
    title: "Preventive Care",
    icon: Smile,
    description: "Proactive treatments to maintain optimal oral health",
    fullDescription: "Prevention is the key to maintaining excellent oral health throughout your life. Our preventive care services help you avoid dental problems before they start, saving you time, money, and discomfort.",
    features: [
      "Professional cleanings",
      "Fluoride treatments",
      "Dental sealants",
      "Oral health education",
      "Custom mouthguards",
      "Nutritional counseling"
    ],
    benefits: [
      "Prevent cavities and gum disease",
      "Save money on future treatments",
      "Maintain overall health",
      "Keep teeth for life"
    ],
    duration: "30-45 minutes",
    frequency: "Every 6 months",
    color: "from-orange-500 to-red-500"
  }
];

export default function Services() {
  return (
    <div className="min-h-screen bg-dark-grey text-white relative overflow-hidden">
      {/* Video Background */}
      <div className="fixed inset-0 z-0">
        <video
          autoPlay
          muted
          loop
          className="w-full h-full object-cover opacity-15 brightness-75"
        >
          <source src="public/attached_assets/20250708_1235_Surreal Floating Teeth_simple_compose_01jzmjtaxje1xrch7sj4tcvrjh_1751968458677.mp4" type="video/mp4" />
        </video>
      </div>

      {/* Gradient Overlay */}
      <div className="fixed inset-0 bg-gradient-to-br from-dark-charcoal/80 via-dark-grey/90 to-dark-charcoal/80 z-10" />

      {/* Content */}
      <div className="relative z-20 pb-20">
        {/* Hero Section */}
        <section className="py-20 bg-gradient-to-r from-dark-charcoal/95 via-dark-grey/95 to-dark-charcoal/95">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-4xl mx-auto">
              <h1 className="text-5xl md:text-6xl font-bold mb-6">
                Our <span className="text-gold">Services</span>
              </h1>
              <p className="text-xl md:text-2xl text-gray-300 mb-8">
                Comprehensive dental care tailored to your unique needs
              </p>
              <div className="flex flex-wrap justify-center gap-4 mb-12">
                <Badge className="bg-gold text-dark-charcoal px-4 py-2 text-sm font-medium">
                  <Star className="w-4 h-4 mr-2" />
                  Expert Care
                </Badge>
                <Badge className="bg-gold text-dark-charcoal px-4 py-2 text-sm font-medium">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Advanced Technology
                </Badge>
                <Badge className="bg-gold text-dark-charcoal px-4 py-2 text-sm font-medium">
                  <Heart className="w-4 h-4 mr-2" />
                  Personalized Treatment
                </Badge>
              </div>
            </div>
          </div>
        </section>

        {/* Services Grid */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-8">
              {services.map((service, index) => {
                const IconComponent = service.icon;
                return (
                  <Card 
                    key={service.id} 
                    className="bg-dark-charcoal/90 backdrop-blur-sm border-gray-600 shadow-2xl hover:shadow-3xl transition-all duration-500 group hover:scale-105"
                  >
                    <CardHeader className="pb-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="p-4 rounded-2xl bg-dark-grey/50 border border-gold/30 shadow-lg">
                          <IconComponent className="w-8 h-8 text-gold" />
                        </div>
                        <Badge className="bg-gold/20 text-gold border-gold/30 px-3 py-1">
                          {service.frequency}
                        </Badge>
                      </div>
                      <CardTitle className="text-2xl font-bold text-white mb-2">
                        {service.title}
                      </CardTitle>
                      <p className="text-gray-300 text-lg">
                        {service.description}
                      </p>
                    </CardHeader>
                    
                    <CardContent className="space-y-6">
                      <p className="text-gray-400 leading-relaxed">
                        {service.fullDescription}
                      </p>
                      
                      {/* Features */}
                      <div>
                        <h4 className="font-semibold text-gold mb-3 flex items-center">
                          <CheckCircle className="w-4 h-4 mr-2" />
                          What We Offer
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          {service.features.map((feature, idx) => (
                            <div key={idx} className="flex items-center text-sm text-gray-300">
                              <div className="w-2 h-2 bg-gold rounded-full mr-3 flex-shrink-0"></div>
                              {feature}
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Benefits */}
                      <div>
                        <h4 className="font-semibold text-gold mb-3 flex items-center">
                          <Heart className="w-4 h-4 mr-2" />
                          Benefits
                        </h4>
                        <div className="space-y-2">
                          {service.benefits.map((benefit, idx) => (
                            <div key={idx} className="flex items-center text-sm text-gray-300">
                              <Star className="w-4 h-4 text-gold mr-3 flex-shrink-0" />
                              {benefit}
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Duration */}
                      <div className="flex items-center justify-between pt-4 border-t border-gray-700">
                        <div className="flex items-center text-sm text-gray-400">
                          <Clock className="w-4 h-4 mr-2" />
                          Duration: {service.duration}
                        </div>
                        <Link href="/booking">
                          <Button 
                            className="bg-gold text-dark-charcoal hover:bg-warm-gold transition-all duration-300 group-hover:scale-105"
                          >
                            Book Now
                            <ArrowRight className="w-4 h-4 ml-2" />
                          </Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-20 bg-gradient-to-r from-dark-charcoal/95 via-dark-grey/95 to-dark-charcoal/95">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Ready to Transform Your <span className="text-gold">Smile</span>?
            </h2>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Schedule your consultation today and discover how our comprehensive dental services can improve your oral health and confidence.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/booking">
                <Button 
                  size="lg" 
                  className="bg-gold text-dark-charcoal hover:bg-warm-gold text-lg px-8 py-6 transition-all duration-300 hover:scale-105"
                >
                  <Calendar className="w-5 h-5 mr-2" />
                  Schedule Appointment
                </Button>
              </Link>
              <Link href="/contact">
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="border-gold text-gold hover:bg-gold hover:text-dark-charcoal text-lg px-8 py-6 transition-all duration-300"
                >
                  Ask a Question
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
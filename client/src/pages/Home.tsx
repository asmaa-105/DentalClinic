import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "wouter";
import { Award, Heart, Cog, Stethoscope, Smile, Wrench, Phone, Mail, Clock } from "lucide-react";
import type { Doctor } from "@shared/schema";

export default function Home() {
  const { data: doctors, isLoading } = useQuery<Doctor[]>({
    queryKey: ["/api/doctors"],
  });

  const doctor = doctors?.[0];

  return (
    <div className="bg-dark-charcoal text-white">
      {/* Hero Section */}
      <section className="relative bg-dark-charcoal">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url('https://images.unsplash.com/photo-1631815587646-b85a1bb027e1?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1920&h=1080')`
          }}
        />
        <div className="relative container mx-auto px-4 py-20 md:py-32">
          <div className="max-w-3xl">
            <h2 className="text-4xl md:text-6xl font-bold mb-6 text-white">
              Your Smile, <span className="text-gold">Our Priority</span>
            </h2>
            <p className="text-xl md:text-2xl mb-8 text-gray-200">
              Experience exceptional dental care in a modern, comfortable environment with state-of-the-art technology.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button asChild className="bg-gold hover:bg-warm-gold text-dark-charcoal px-8 py-4 text-lg font-semibold">
                <Link href="/booking">Book Appointment</Link>
              </Button>
              <Button asChild variant="outline" className="border-2 border-gold text-gold hover:bg-gold hover:text-dark-charcoal px-8 py-4 text-lg font-semibold">
                <Link href="/doctor">Learn More</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* About Us Section */}
      <section className="py-20 bg-dark-grey">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h3 className="text-3xl md:text-4xl font-bold mb-8 text-white">
              About <span className="text-gold">Elite Dental Care</span>
            </h3>
            <p className="text-lg text-gray-300 mb-12">
              We are dedicated to providing comprehensive dental care in a warm, welcoming environment. Our mission is to help you achieve optimal oral health through personalized treatment plans and the latest dental technologies.
            </p>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="bg-gold w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Award className="text-dark-charcoal" size={32} />
                </div>
                <h4 className="text-xl font-semibold mb-3 text-white">Excellence</h4>
                <p className="text-gray-300">
                  Committed to the highest standards of dental care and patient satisfaction.
                </p>
              </div>
              <div className="text-center">
                <div className="bg-gold w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Heart className="text-dark-charcoal" size={32} />
                </div>
                <h4 className="text-xl font-semibold mb-3 text-white">Compassion</h4>
                <p className="text-gray-300">
                  We understand dental anxiety and provide gentle, caring treatment.
                </p>
              </div>
              <div className="text-center">
                <div className="bg-gold w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Cog className="text-dark-charcoal" size={32} />
                </div>
                <h4 className="text-xl font-semibold mb-3 text-white">Innovation</h4>
                <p className="text-gray-300">
                  State-of-the-art technology for precise, efficient treatments.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Doctor Preview Section */}
      <section className="py-20 bg-dark-charcoal">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h3 className="text-3xl md:text-4xl font-bold mb-12 text-center text-white">
              Meet Our <span className="text-gold">Expert</span>
            </h3>
            
            {isLoading ? (
              <div className="bg-dark-grey rounded-2xl p-8 md:p-12 shadow-xl">
                <div className="grid md:grid-cols-2 gap-8 items-center">
                  <div className="bg-gray-600 rounded-xl h-96 animate-pulse" />
                  <div className="space-y-4">
                    <div className="h-8 bg-gray-600 rounded animate-pulse" />
                    <div className="h-6 bg-gray-600 rounded animate-pulse w-3/4" />
                    <div className="h-20 bg-gray-600 rounded animate-pulse" />
                    <div className="h-10 bg-gray-600 rounded animate-pulse w-1/2" />
                  </div>
                </div>
              </div>
            ) : doctor ? (
              <Card className="bg-dark-grey border-gray-600 shadow-xl">
                <CardContent className="p-8 md:p-12">
                  <div className="grid md:grid-cols-2 gap-8 items-center">
                    <div>
                      <img 
                        src={doctor.image || "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=600&h=600"} 
                        alt={doctor.name} 
                        className="rounded-xl shadow-lg w-full h-auto"
                      />
                    </div>
                    <div>
                      <h4 className="text-2xl md:text-3xl font-bold mb-4 text-white">{doctor.name}</h4>
                      <p className="text-gold text-lg mb-4">{doctor.specialty}</p>
                      <p className="text-gray-300 mb-6">
                        {doctor.bio.substring(0, 200)}...
                      </p>
                      <div className="flex items-center gap-4 mb-6">
                        <div className="flex items-center">
                          <Award className="text-gold mr-2" size={20} />
                          <span className="text-gray-300">{doctor.experience} years experience</span>
                        </div>
                      </div>
                      <Button asChild className="bg-gold hover:bg-warm-gold text-dark-charcoal font-semibold">
                        <Link href="/doctor">View Full Profile</Link>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : null}
          </div>
        </div>
      </section>

      {/* Services Preview */}
      <section className="py-20 bg-dark-grey">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h3 className="text-3xl md:text-4xl font-bold mb-12 text-center text-white">
              Our <span className="text-gold">Services</span>
            </h3>
            
            <div className="grid md:grid-cols-3 gap-8">
              <Card className="bg-dark-charcoal border-gray-600 shadow-lg">
                <CardContent className="p-6">
                  <div className="mb-4">
                    <Stethoscope className="text-gold" size={48} />
                  </div>
                  <h4 className="text-xl font-semibold mb-3 text-white">General Dentistry</h4>
                  <p className="text-gray-300">
                    Comprehensive oral health care including cleanings, fillings, and preventive treatments.
                  </p>
                </CardContent>
              </Card>
              
              <Card className="bg-dark-charcoal border-gray-600 shadow-lg">
                <CardContent className="p-6">
                  <div className="mb-4">
                    <Smile className="text-gold" size={48} />
                  </div>
                  <h4 className="text-xl font-semibold mb-3 text-white">Cosmetic Dentistry</h4>
                  <p className="text-gray-300">
                    Enhance your smile with veneers, whitening, and aesthetic treatments.
                  </p>
                </CardContent>
              </Card>
              
              <Card className="bg-dark-charcoal border-gray-600 shadow-lg">
                <CardContent className="p-6">
                  <div className="mb-4">
                    <Wrench className="text-gold" size={48} />
                  </div>
                  <h4 className="text-xl font-semibold mb-3 text-white">Restorative Care</h4>
                  <p className="text-gray-300">
                    Restore damaged teeth with crowns, bridges, and advanced procedures.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Info Section */}
      <section className="py-20 bg-dark-charcoal">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h3 className="text-3xl md:text-4xl font-bold mb-12 text-white">
              Get in <span className="text-gold">Touch</span>
            </h3>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="bg-gold w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Phone className="text-dark-charcoal" size={32} />
                </div>
                <h4 className="text-xl font-semibold mb-2 text-white">Call Us</h4>
                <p className="text-gray-300">(555) 123-4567</p>
              </div>
              <div className="text-center">
                <div className="bg-gold w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Mail className="text-dark-charcoal" size={32} />
                </div>
                <h4 className="text-xl font-semibold mb-2 text-white">Email</h4>
                <p className="text-gray-300">info@elitedentalcare.com</p>
              </div>
              <div className="text-center">
                <div className="bg-gold w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Clock className="text-dark-charcoal" size={32} />
                </div>
                <h4 className="text-xl font-semibold mb-2 text-white">Hours</h4>
                <p className="text-gray-300">
                  Mon-Fri: 8AM-6PM<br />
                  Sat: 9AM-3PM
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

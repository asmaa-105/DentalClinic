import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "wouter";
import { CheckCircle, GraduationCap, Hospital, Award } from "lucide-react";
import type { Doctor } from "@shared/types";

export default function Doctor() {
  const { data: doctors, isLoading } = useQuery<Doctor[]>({
    queryKey: ["/api/doctors"],
  });

  const doctor = doctors?.[0];

  if (isLoading) {
    return (
      <div className="bg-dark-charcoal text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-start">
              <div className="bg-gray-600 rounded-xl h-96 animate-pulse" />
              <div className="space-y-4">
                <div className="h-12 bg-gray-600 rounded animate-pulse" />
                <div className="h-6 bg-gray-600 rounded animate-pulse w-3/4" />
                <div className="h-32 bg-gray-600 rounded animate-pulse" />
                <div className="h-10 bg-gray-600 rounded animate-pulse w-1/2" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!doctor) {
    return (
      <div className="bg-dark-charcoal text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto text-center">
            <h1 className="text-4xl font-bold mb-4">Doctor Not Found</h1>
            <p className="text-gray-300">Unable to load doctor information.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-dark-charcoal text-white">
      <section className="py-20 bg-dark-charcoal">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-start">
              <div>
                <img 
                  src={doctor.image || "client/public/attached_assets/3.jpg"} 
                  alt={doctor.name} 
                  className="rounded-xl shadow-lg w-full h-auto"
                />
              </div>
              <div>
                <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white">{doctor.name}</h1>
                <p className="text-gold text-xl mb-6">{doctor.specialty}</p>
                
                <div className="mb-8">
                  <h3 className="text-2xl font-semibold mb-4 text-white">About</h3>
                  <p className="text-gray-300 mb-6">{doctor.bio}</p>
                </div>

                <div className="mb-8">
                  <h3 className="text-2xl font-semibold mb-4 text-white">Specializations</h3>
                  <div className="grid grid-cols-1 gap-3">
                    <div className="flex items-center">
                      <CheckCircle className="text-gold mr-3" size={20} />
                      <span className="text-gray-300">Cosmetic Dentistry</span>
                    </div>
                    <div className="flex items-center">
                      <CheckCircle className="text-gold mr-3" size={20} />
                      <span className="text-gray-300">Restorative Dentistry</span>
                    </div>
                    <div className="flex items-center">
                      <CheckCircle className="text-gold mr-3" size={20} />
                      <span className="text-gray-300">Preventive Care</span>
                    </div>
                    <div className="flex items-center">
                      <CheckCircle className="text-gold mr-3" size={20} />
                      <span className="text-gray-300">Pediatric Dentistry</span>
                    </div>
                  </div>
                </div>

                <div className="mb-8">
                  <h3 className="text-2xl font-semibold mb-4 text-white">Education & Certifications</h3>
                  <div className="space-y-4">
                    <div className="flex items-start">
                      <GraduationCap className="text-gold mr-3 mt-1" size={20} />
                      <div>
                        <p className="text-white font-semibold">ELrazi university</p>
                        <p className="text-gray-300">Doctor of Dental Surgery (DDS)</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <Hospital className="text-gold mr-3 mt-1" size={20} />
                      <div>
                        <p className="text-white font-semibold">Master Endo Professional</p>
                        <p className="text-gray-300">Program of 180 credit hours</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <Award className="text-gold mr-3 mt-1" size={20} />
                      <div>
                        <p className="text-white font-semibold">Cosmetic Dentistry Professional</p>
                        <p className="text-gray-300">Program of 220 credit hours</p>
                      </div>
                    </div>
                  </div>
                </div>

                <Button asChild className="bg-gold hover:bg-warm-gold text-dark-charcoal px-8 py-4 font-semibold">
                  <Link href="/booking">Book Appointment with {doctor.name.split(' ')[1]}</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Office Gallery */}
      <section className="py-20 bg-dark-grey">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h3 className="text-3xl md:text-4xl font-bold mb-12 text-center text-white">
              Our Modern <span className="text-gold">Facility</span>
            </h3>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <img 
                src="https://images.unsplash.com/photo-1629909613654-28e377c37b09?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=600&h=400" 
                alt="Modern reception area" 
                className="rounded-xl shadow-lg w-full h-60 object-cover"
              />
              <img 
                src="https://images.unsplash.com/photo-1579684385127-1ef15d508118?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=600&h=400" 
                alt="Treatment room equipment" 
                className="rounded-xl shadow-lg w-full h-60 object-cover"
              />
              <img 
                src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=600&h=400" 
                alt="Digital imaging equipment" 
                className="rounded-xl shadow-lg w-full h-60 object-cover"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

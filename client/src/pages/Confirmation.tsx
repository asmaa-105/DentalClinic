import { useQuery } from "@tanstack/react-query";
import { useLocation, useRoute } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Check, Calendar, Clock, User, MapPin } from "lucide-react";
import type { Appointment } from "@shared/schema";

export default function Confirmation() {
  const [, setLocation] = useLocation();
  const [match, params] = useRoute("/confirmation/:id");
  const appointmentId = params?.id;

  const { data: appointment, isLoading } = useQuery<Appointment>({
    queryKey: [`/api/appointments/${appointmentId}`],
    enabled: !!appointmentId,
  });

  if (isLoading) {
    return (
      <div className="bg-dark-charcoal text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <div className="animate-pulse">
              <div className="h-20 w-20 bg-gray-600 rounded-full mx-auto mb-6" />
              <div className="h-8 bg-gray-600 rounded mb-4" />
              <div className="h-6 bg-gray-600 rounded w-3/4 mx-auto" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!appointment) {
    return (
      <div className="bg-dark-charcoal text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <h1 className="text-4xl font-bold mb-4">Appointment Not Found</h1>
            <p className="text-gray-300 mb-8">
              We couldn't find the appointment you're looking for.
            </p>
            <Button
              onClick={() => setLocation("/")}
              className="bg-gold hover:bg-warm-gold text-dark-charcoal font-semibold"
            >
              Go to Home
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="bg-dark-charcoal text-white">
      <section className="py-20 bg-dark-charcoal">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <Card className="bg-dark-grey border-gray-600 shadow-xl">
              <CardContent className="p-8 md:p-12">
                <div className="mb-8">
                  <div className="bg-gold w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Check className="text-dark-charcoal" size={48} />
                  </div>
                  <h1 className="text-3xl md:text-4xl font-bold mb-4 text-white">
                    Appointment Confirmed!
                  </h1>
                  <p className="text-gray-300 text-lg">
                    Your appointment has been successfully scheduled.
                  </p>
                </div>

                <Card className="bg-dark-charcoal border-gray-600 mb-8 text-left">
                  <CardContent className="p-6">
                    <h3 className="text-xl font-semibold mb-4 text-white">
                      Appointment Details
                    </h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <Calendar className="text-gold mr-2" size={20} />
                          <span className="text-gray-300">Date:</span>
                        </div>
                        <span className="text-white font-medium">
                          {formatDate(appointment.appointmentDate)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <Clock className="text-gold mr-2" size={20} />
                          <span className="text-gray-300">Time:</span>
                        </div>
                        <span className="text-white font-medium">
                          {appointment.appointmentTime}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <User className="text-gold mr-2" size={20} />
                          <span className="text-gray-300">Doctor:</span>
                        </div>
                        <span className="text-white font-medium">Dr. Sarah Johnson</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <span className="text-gold mr-2">⚕️</span>
                          <span className="text-gray-300">Type:</span>
                        </div>
                        <span className="text-white font-medium">
                          {appointment.reasonForVisit}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <MapPin className="text-gold mr-2" size={20} />
                          <span className="text-gray-300">Location:</span>
                        </div>
                        <span className="text-white font-medium">Elite Dental Care</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gold/10 border border-gold mb-8">
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold mb-2 text-gold">
                      Important Information
                    </h3>
                    <ul className="text-gray-300 text-sm space-y-1">
                      <li>• A confirmation email has been sent to {appointment.patientEmail}</li>
                      <li>• You will receive a reminder 24 hours before your appointment</li>
                      <li>• Please arrive 15 minutes early for check-in</li>
                      <li>• Bring your insurance card and valid ID</li>
                    </ul>
                  </CardContent>
                </Card>

                <div className="flex flex-col sm:flex-row gap-4">
                  <Button
                    onClick={() => {
                      // Add to calendar functionality would go here
                      alert("Add to calendar functionality would be implemented here");
                    }}
                    className="flex-1 bg-gold hover:bg-warm-gold text-dark-charcoal font-semibold"
                  >
                    Add to Calendar
                  </Button>
                  <Button
                    onClick={() => setLocation("/")}
                    variant="outline"
                    className="flex-1 border-gold text-gold hover:bg-gold hover:text-dark-charcoal font-semibold"
                  >
                    Back to Home
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}

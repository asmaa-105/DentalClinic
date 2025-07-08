import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CalendarDays, Clock, User } from "lucide-react";
import { format } from "date-fns";
import { Link } from "wouter";
import type { Appointment } from "@shared/schema";

export default function CalendarPage() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());

  const { data: appointments, isLoading: appointmentsLoading } = useQuery({
    queryKey: ['/api/appointments'],
  });

  const { data: availability, isLoading: availabilityLoading } = useQuery({
    queryKey: [`/api/availability/1/${selectedDate ? format(selectedDate, 'yyyy-MM-dd') : ''}`],
    enabled: !!selectedDate,
  });

  const selectedDateString = selectedDate ? format(selectedDate, 'yyyy-MM-dd') : '';
  const selectedAppointments = appointments?.filter(
    (apt: Appointment) => apt.appointmentDate === selectedDateString
  ) || [];

  const getAppointmentDates = () => {
    if (!appointments) return [];
    return appointments.map((apt: Appointment) => new Date(apt.appointmentDate));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-500';
      case 'pending':
        return 'bg-yellow-500';
      case 'cancelled':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <div className="min-h-screen bg-dark-grey text-white relative overflow-hidden">
      {/* Video Background */}
      <div className="fixed inset-0 z-0">
        <video
          autoPlay
          muted
          loop
          className="w-full h-full object-cover opacity-20 brightness-125 contrast-125"
        >
          <source src="/attached_assets/20250708_1235_Surreal Floating Teeth_simple_compose_01jzmjtaxje1xrch7sj4tcvrjh_1751968458677.mp4" type="video/mp4" />
        </video>
      </div>

      {/* Gradient Overlay */}
      <div className="fixed inset-0 bg-gradient-to-br from-dark-charcoal/60 via-dark-grey/70 to-dark-charcoal/60 z-10" />

      {/* Content */}
      <div className="relative z-20 container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold">
              Appointment <span className="text-gold">Calendar</span>
            </h1>
            <p className="text-gray-300 mt-2">
              View appointments and doctor availability
            </p>
          </div>
          <Link href="/booking">
            <Button className="bg-gold text-dark-charcoal hover:bg-warm-gold">
              Book New Appointment
            </Button>
          </Link>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Calendar */}
          <Card className="bg-dark-charcoal/80 backdrop-blur-sm border-gray-600 shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-gold">
                <CalendarDays className="w-5 h-5" />
                Calendar
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                className="rounded-md border-0"
                modifiers={{
                  hasAppointment: getAppointmentDates(),
                }}
                modifiersStyles={{
                  hasAppointment: {
                    backgroundColor: '#B89B4E',
                    color: '#333333',
                    fontWeight: 'bold',
                  },
                }}
              />
            </CardContent>
          </Card>

          {/* Daily View */}
          <Card className="lg:col-span-2 bg-dark-charcoal/80 backdrop-blur-sm border-gray-600 shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-gold">
                <Clock className="w-5 h-5" />
                {selectedDate ? format(selectedDate, 'MMMM d, yyyy') : 'Select a Date'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {appointmentsLoading ? (
                <div className="space-y-4">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="animate-pulse">
                      <div className="h-20 bg-gray-600 rounded-lg"></div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {selectedAppointments.length > 0 ? (
                    selectedAppointments.map((appointment: Appointment) => (
                      <div
                        key={appointment.id}
                        className="p-4 bg-dark-grey/50 rounded-lg border border-gray-600"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <User className="w-4 h-4 text-gold" />
                            <span className="font-semibold text-white">
                              {appointment.patientName}
                            </span>
                          </div>
                          <Badge className={getStatusColor(appointment.status)}>
                            {appointment.status}
                          </Badge>
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-sm text-gray-300">
                          <div>
                            <span className="font-medium">Time:</span> {appointment.appointmentTime}
                          </div>
                          <div>
                            <span className="font-medium">Type:</span> {appointment.reasonForVisit}
                          </div>
                          <div>
                            <span className="font-medium">Email:</span> {appointment.patientEmail}
                          </div>
                          <div>
                            <span className="font-medium">Phone:</span> {appointment.patientPhone}
                          </div>
                        </div>
                        {appointment.notes && (
                          <div className="mt-2 text-sm text-gray-300">
                            <span className="font-medium">Notes:</span> {appointment.notes}
                          </div>
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-gray-400">
                      <CalendarDays className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>No appointments scheduled for this day</p>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Doctor Availability */}
        <Card className="mt-8 bg-dark-charcoal/80 backdrop-blur-sm border-gray-600 shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-gold">
              <User className="w-5 h-5" />
              Doctor Availability
              {selectedDate && (
                <span className="text-sm text-gray-300 font-normal">
                  for {format(selectedDate, 'MMMM d, yyyy')}
                </span>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {availabilityLoading ? (
              <div className="animate-pulse">
                <div className="h-20 bg-gray-600 rounded-lg"></div>
              </div>
            ) : selectedDate ? (
              <div>
                <div className="mb-4">
                  <h3 className="font-semibold text-white mb-2">Dr. Sarah Johnson</h3>
                  <p className="text-sm text-gray-300">General Dentist</p>
                </div>
                {availability?.timeSlots && availability.timeSlots.length > 0 ? (
                  <div>
                    <p className="text-sm text-gray-300 mb-3">Available time slots:</p>
                    <div className="grid grid-cols-4 gap-2">
                      {availability.timeSlots.map((time: string) => (
                        <Badge
                          key={time}
                          variant="outline"
                          className="bg-green-500/20 text-green-300 border-green-500/50"
                        >
                          {time}
                        </Badge>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-4 text-gray-400">
                    <p>No available time slots for this date</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-4 text-gray-400">
                <p>Select a date to view availability</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
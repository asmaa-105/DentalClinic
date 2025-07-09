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
                className="rounded-md border-0 bg-dark-charcoal/90 text-white"
                modifiers={{
                  hasAppointment: getAppointmentDates(),
                }}
                modifiersStyles={{
                  hasAppointment: {
                    backgroundColor: '#B89B4E',
                    color: '#333333',
                    fontWeight: 'bold',
                    boxShadow: '0 0 10px rgba(184, 155, 78, 0.5)',
                    borderRadius: '8px',
                  },
                }}
                classNames={{
                  months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
                  month: "space-y-4",
                  caption: "flex justify-center pt-1 relative items-center text-lg font-semibold text-gold",
                  caption_label: "text-lg font-semibold text-gold",
                  nav: "space-x-1 flex items-center",
                  nav_button: "h-8 w-8 bg-transparent p-0 opacity-70 hover:opacity-100 border border-gray-500 rounded-md hover:bg-gray-700 text-white",
                  nav_button_previous: "absolute left-1",
                  nav_button_next: "absolute right-1",
                  table: "w-full border-collapse space-y-1",
                  head_row: "flex",
                  head_cell: "text-gray-400 rounded-md w-12 font-medium text-sm uppercase tracking-wider",
                  row: "flex w-full mt-2",
                  cell: "text-center text-sm p-0 relative first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
                  day: "h-12 w-12 p-0 font-normal text-gray-300 hover:bg-gray-700 rounded-md transition-all duration-200 border border-transparent hover:border-gray-500 relative",
                  day_selected: "bg-gold text-dark-charcoal hover:bg-warm-gold hover:text-dark-charcoal focus:bg-gold focus:text-dark-charcoal border-gold shadow-lg",
                  day_today: "bg-gray-700 text-white font-bold border-gray-400 ring-2 ring-gold ring-opacity-50",
                  day_outside: "text-gray-600 opacity-50",
                  day_disabled: "text-gray-600 opacity-30",
                  day_range_middle: "aria-selected:bg-accent aria-selected:text-accent-foreground",
                  day_hidden: "invisible",
                }}
              />
              
              {/* Calendar Legend */}
              <div className="mt-6 flex flex-wrap gap-4 justify-center text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-gold rounded-md shadow-sm"></div>
                  <span className="text-gray-300">Has Appointments</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-gray-700 ring-2 ring-gold ring-opacity-50 rounded-md"></div>
                  <span className="text-gray-300">Today</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-gray-800 border border-gray-500 rounded-md"></div>
                  <span className="text-gray-300">Available</span>
                </div>
              </div>
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
                        className="p-5 bg-gradient-to-r from-dark-grey/70 to-dark-charcoal/70 rounded-lg border border-gray-600 shadow-lg hover:shadow-xl transition-all duration-300 backdrop-blur-sm"
                      >
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gold rounded-full flex items-center justify-center">
                              <User className="w-5 h-5 text-dark-charcoal" />
                            </div>
                            <div>
                              <span className="font-semibold text-white text-lg">
                                {appointment.patientName}
                              </span>
                              <div className="text-sm text-gray-400">
                                {appointment.appointmentTime}
                              </div>
                            </div>
                          </div>
                          <Badge className={`${getStatusColor(appointment.status)} text-white px-3 py-1 text-sm font-medium`}>
                            {appointment.status}
                          </Badge>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <Clock className="w-4 h-4 text-gold" />
                              <span className="text-gray-300">
                                <span className="font-medium">Time:</span> {appointment.appointmentTime}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <User className="w-4 h-4 text-gold" />
                              <span className="text-gray-300">
                                <span className="font-medium">Type:</span> {appointment.reasonForVisit}
                              </span>
                            </div>
                          </div>
                          <div className="space-y-2">
                            <div className="text-gray-300">
                              <span className="font-medium">Email:</span> {appointment.patientEmail}
                            </div>
                            <div className="text-gray-300">
                              <span className="font-medium">Phone:</span> {appointment.patientPhone}
                            </div>
                          </div>
                        </div>
                        
                        {appointment.notes && (
                          <div className="mt-4 p-3 bg-dark-charcoal/80 rounded-md border border-gray-700">
                            <span className="font-medium text-gold">Notes:</span>
                            <p className="text-gray-300 mt-1">{appointment.notes}</p>
                          </div>
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-12">
                      <div className="bg-dark-charcoal/50 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                        <CalendarDays className="w-10 h-10 text-gold opacity-60" />
                      </div>
                      <p className="text-gray-400 text-lg">No appointments scheduled</p>
                      <p className="text-gray-500 text-sm mt-2">This day is available for new bookings</p>
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
                    <p className="text-sm text-gray-300 mb-4">Available time slots:</p>
                    <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                      {availability.timeSlots.map((time: string) => (
                        <div
                          key={time}
                          className="p-3 bg-green-500/20 text-green-300 border border-green-500/50 rounded-lg text-center hover:bg-green-500/30 transition-colors duration-200 cursor-pointer"
                        >
                          <Clock className="w-4 h-4 mx-auto mb-1" />
                          <span className="text-sm font-medium">{time}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="bg-red-500/20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                      <Clock className="w-8 h-8 text-red-400" />
                    </div>
                    <p className="text-gray-400">No available time slots</p>
                    <p className="text-gray-500 text-sm mt-1">Doctor is not available on this date</p>
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

        {/* Monthly Statistics */}
        <Card className="mt-8 bg-dark-charcoal/80 backdrop-blur-sm border-gray-600 shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-gold">
              <CalendarDays className="w-5 h-5" />
              Monthly Statistics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center p-6 bg-gradient-to-br from-blue-500/20 to-blue-600/20 rounded-lg border border-blue-500/30">
                <div className="text-3xl font-bold text-blue-300 mb-2">
                  {appointments?.length || 0}
                </div>
                <div className="text-sm text-blue-200">Total Appointments</div>
              </div>
              
              <div className="text-center p-6 bg-gradient-to-br from-green-500/20 to-green-600/20 rounded-lg border border-green-500/30">
                <div className="text-3xl font-bold text-green-300 mb-2">
                  {appointments?.filter((apt: Appointment) => apt.status === 'confirmed').length || 0}
                </div>
                <div className="text-sm text-green-200">Confirmed</div>
              </div>
              
              <div className="text-center p-6 bg-gradient-to-br from-gold/20 to-warm-gold/20 rounded-lg border border-gold/30">
                <div className="text-3xl font-bold text-gold mb-2">
                  {new Set(appointments?.map((apt: Appointment) => apt.appointmentDate)).size || 0}
                </div>
                <div className="text-sm text-gold">Busy Days</div>
              </div>
              
              <div className="text-center p-6 bg-gradient-to-br from-purple-500/20 to-purple-600/20 rounded-lg border border-purple-500/30">
                <div className="text-3xl font-bold text-purple-300 mb-2">
                  {selectedAppointments.length}
                </div>
                <div className="text-sm text-purple-200">Selected Day</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
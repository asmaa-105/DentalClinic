import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { insertAppointmentSchema } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { z } from "zod";

type BookingFormData = z.infer<typeof insertAppointmentSchema>;

export default function Booking() {
  const [, setLocation] = useLocation();
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const { toast } = useToast();

  const form = useForm<BookingFormData>({
    resolver: zodResolver(insertAppointmentSchema),
    defaultValues: {
      patientName: "",
      patientEmail: "",
      patientPhone: "",
      doctorId: 1,
      appointmentDate: "",
      appointmentTime: "",
      reasonForVisit: "",
      notes: "",
    },
  });

  const { data: availability, isLoading: availabilityLoading } = useQuery({
    queryKey: [`/api/availability/1/${selectedDate}`],
    enabled: !!selectedDate,
  });

  const createAppointmentMutation = useMutation({
    mutationFn: async (data: BookingFormData) => {
      const response = await apiRequest("POST", "/api/appointments", data);
      return response.json();
    },
    onSuccess: (appointment) => {
      toast({
        title: "Appointment Booked!",
        description: "Your appointment has been successfully scheduled.",
      });
      // Invalidate both appointments and availability queries to update the calendar
      queryClient.invalidateQueries({ queryKey: ['/api/appointments'] });
      queryClient.invalidateQueries({ queryKey: ['/api/availability'] });
      // Also invalidate the specific availability query for the selected date
      queryClient.invalidateQueries({ queryKey: [`/api/availability/1/${selectedDate}`] });
      setLocation(`/confirmation/${appointment.id}`);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to book appointment. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: BookingFormData) => {
    if (!selectedDate || !selectedTime) {
      toast({
        title: "Error",
        description: "Please select a date and time.",
        variant: "destructive",
      });
      return;
    }

    createAppointmentMutation.mutate({
      ...data,
      appointmentDate: selectedDate,
      appointmentTime: selectedTime,
    });
  };

  const generateCalendarDays = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());

    const days = [];
    for (let i = 0; i < 42; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      days.push(date);
    }

    return days;
  };

  const handleDateSelect = (date: Date) => {
    // Format date to avoid timezone issues
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const dateStr = `${year}-${month}-${day}`;
    setSelectedDate(dateStr);
    setSelectedTime("");
  };

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
  };

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  const prevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  const days = generateCalendarDays();
  const today = new Date();

  return (
    <div className="bg-dark-charcoal text-white">
      <section className="py-20 bg-dark-charcoal">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold mb-8 text-center text-white">
              Book Your <span className="text-gold">Appointment</span>
            </h1>
            <p className="text-xl text-center text-gray-300 mb-12">
              Schedule your visit with Dr. Johnson
            </p>
            
            <Card className="bg-dark-grey border-gray-600 shadow-xl">
              <CardContent className="p-8 md:p-12">
                <div className="grid md:grid-cols-2 gap-8">
                  {/* Calendar Section */}
                  <div>
                    <h3 className="text-2xl font-semibold mb-6 text-white">Select Date</h3>
                    <Card className="bg-dark-charcoal border-gray-600">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-4">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={prevMonth}
                            className="text-gold hover:text-warm-gold hover:bg-dark-grey"
                          >
                            <ChevronLeft size={20} />
                          </Button>
                          <h4 className="text-lg font-semibold text-white">
                            {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                          </h4>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={nextMonth}
                            className="text-gold hover:text-warm-gold hover:bg-dark-grey"
                          >
                            <ChevronRight size={20} />
                          </Button>
                        </div>
                        
                        <div className="grid grid-cols-7 gap-1 text-center">
                          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                            <div key={day} className="p-2 text-sm font-medium text-gray-400">
                              {day}
                            </div>
                          ))}
                          {days.map((date, index) => {
                            // Format date consistently
                            const year = date.getFullYear();
                            const month = String(date.getMonth() + 1).padStart(2, '0');
                            const day = String(date.getDate()).padStart(2, '0');
                            const dateStr = `${year}-${month}-${day}`;
                            const isCurrentMonth = date.getMonth() === currentMonth.getMonth();
                            const isToday = date.toDateString() === today.toDateString();
                            const isPast = date < today;
                            const isSelected = selectedDate === dateStr;
                            
                            return (
                              <button
                                key={index}
                                onClick={() => handleDateSelect(date)}
                                disabled={!isCurrentMonth || isPast}
                                className={`p-2 text-sm rounded transition-colors ${
                                  isSelected
                                    ? 'bg-gold text-dark-charcoal'
                                    : !isCurrentMonth || isPast
                                    ? 'text-gray-500 cursor-not-allowed'
                                    : 'text-white hover:bg-gold hover:text-dark-charcoal'
                                }`}
                              >
                                {date.getDate()}
                              </button>
                            );
                          })}
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Time Slots Section */}
                  <div>
                    <h3 className="text-2xl font-semibold mb-6 text-white">Available Times</h3>
                    <div className="space-y-3">
                      {selectedDate ? (
                        availabilityLoading ? (
                          <div className="text-gray-300">Loading available times...</div>
                        ) : availability?.timeSlots && availability.timeSlots.length > 0 ? (
                          <div className="grid grid-cols-2 gap-3">
                            {availability.timeSlots.map((time: string) => (
                              <Button
                                key={time}
                                variant={selectedTime === time ? "default" : "outline"}
                                onClick={() => handleTimeSelect(time)}
                                className={
                                  selectedTime === time
                                    ? "bg-gold text-dark-charcoal hover:bg-warm-gold"
                                    : "bg-dark-charcoal text-white border-gray-600 hover:bg-gold hover:text-dark-charcoal"
                                }
                              >
                                {time}
                              </Button>
                            ))}
                          </div>
                        ) : (
                          <div className="text-gray-300">No available time slots for this date</div>
                        )
                      ) : (
                        <div className="text-gray-300">Please select a date first</div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Booking Form */}
                <div className="mt-12">
                  <h3 className="text-2xl font-semibold mb-6 text-white">Patient Information</h3>
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                      <div className="grid md:grid-cols-2 gap-6">
                        <FormField
                          control={form.control}
                          name="patientName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-white">Full Name</FormLabel>
                              <FormControl>
                                <Input
                                  {...field}
                                  className="bg-dark-charcoal border-gray-600 text-white focus:border-gold"
                                  placeholder="Enter your full name"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="patientEmail"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-white">Email</FormLabel>
                              <FormControl>
                                <Input
                                  {...field}
                                  type="email"
                                  className="bg-dark-charcoal border-gray-600 text-white focus:border-gold"
                                  placeholder="Enter your email"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <div className="grid md:grid-cols-2 gap-6">
                        <FormField
                          control={form.control}
                          name="patientPhone"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-white">Phone</FormLabel>
                              <FormControl>
                                <Input
                                  {...field}
                                  type="tel"
                                  className="bg-dark-charcoal border-gray-600 text-white focus:border-gold"
                                  placeholder="Enter your phone number"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="reasonForVisit"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-white">Reason for Visit</FormLabel>
                              <FormControl>
                                <Select value={field.value} onValueChange={field.onChange}>
                                  <SelectTrigger className="bg-dark-charcoal border-gray-600 text-white focus:border-gold">
                                    <SelectValue placeholder="Select a reason" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="Routine Cleaning">Routine Cleaning</SelectItem>
                                    <SelectItem value="Consultation">Consultation</SelectItem>
                                    <SelectItem value="Cosmetic Procedure">Cosmetic Procedure</SelectItem>
                                    <SelectItem value="Emergency">Emergency</SelectItem>
                                    <SelectItem value="Other">Other</SelectItem>
                                  </SelectContent>
                                </Select>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <FormField
                        control={form.control}
                        name="notes"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-white">Additional Notes</FormLabel>
                            <FormControl>
                              <Textarea
                                {...field}
                                rows={4}
                                className="bg-dark-charcoal border-gray-600 text-white focus:border-gold"
                                placeholder="Any specific concerns or requests..."
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <Button
                        type="submit"
                        disabled={createAppointmentMutation.isPending}
                        className="w-full bg-gold hover:bg-warm-gold text-dark-charcoal py-4 font-semibold"
                      >
                        {createAppointmentMutation.isPending ? "Booking..." : "Confirm Appointment"}
                      </Button>
                    </form>
                  </Form>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}

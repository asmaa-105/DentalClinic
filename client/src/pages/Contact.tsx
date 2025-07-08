import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { apiRequest } from "@/lib/queryClient";
import { MapPin, Phone, Mail, Clock } from "lucide-react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const contactSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  subject: z.string().min(1, "Please select a subject"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

type ContactFormData = z.infer<typeof contactSchema>;

export default function Contact() {
  const { toast } = useToast();

  const form = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      subject: "",
      message: "",
    },
  });

  const sendMessageMutation = useMutation({
    mutationFn: async (data: ContactFormData) => {
      const response = await apiRequest("POST", "/api/contact", data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Message Sent!",
        description: "Thank you for your message. We'll get back to you soon.",
      });
      form.reset();
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: ContactFormData) => {
    sendMessageMutation.mutate(data);
  };

  return (
    <div className="bg-dark-charcoal text-white">
      <section className="py-20 bg-dark-charcoal">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold mb-8 text-center text-white">
              Contact <span className="text-gold">Us</span>
            </h1>
            <p className="text-xl text-center text-gray-300 mb-12">
              We're here to help and answer any questions you might have
            </p>
            
            <div className="grid md:grid-cols-2 gap-12">
              {/* Contact Information */}
              <div>
                <h3 className="text-2xl font-semibold mb-8 text-white">Get in Touch</h3>
                
                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <div className="bg-gold w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0">
                      <MapPin className="text-dark-charcoal" size={20} />
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold mb-1 text-white">Address</h4>
                      <p className="text-gray-300">
                        123 Dental Street<br />
                        Medical Plaza, Suite 456<br />
                        Healthville, HV 12345
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4">
                    <div className="bg-gold w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Phone className="text-dark-charcoal" size={20} />
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold mb-1 text-white">Phone</h4>
                      <p className="text-gray-300">(555) 123-4567</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4">
                    <div className="bg-gold w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Mail className="text-dark-charcoal" size={20} />
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold mb-1 text-white">Email</h4>
                      <p className="text-gray-300">info@elitedentalcare.com</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4">
                    <div className="bg-gold w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Clock className="text-dark-charcoal" size={20} />
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold mb-1 text-white">Office Hours</h4>
                      <div className="text-gray-300 space-y-1">
                        <p>Monday - Friday: 8:00 AM - 6:00 PM</p>
                        <p>Saturday: 9:00 AM - 3:00 PM</p>
                        <p>Sunday: Closed</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-8">
                  <h4 className="text-lg font-semibold mb-4 text-white">Emergency Contact</h4>
                  <p className="text-gray-300 mb-2">
                    For dental emergencies outside office hours:
                  </p>
                  <p className="text-gold font-semibold">(555) 123-URGENT</p>
                </div>
              </div>

              {/* Contact Form */}
              <div>
                <Card className="bg-dark-grey border-gray-600 shadow-xl">
                  <CardContent className="p-8">
                    <h3 className="text-2xl font-semibold mb-6 text-white">
                      Send us a Message
                    </h3>
                    
                    <Form {...form}>
                      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <div className="grid md:grid-cols-2 gap-6">
                          <FormField
                            control={form.control}
                            name="firstName"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-white">First Name</FormLabel>
                                <FormControl>
                                  <Input
                                    {...field}
                                    className="bg-dark-charcoal border-gray-600 text-white focus:border-gold"
                                    placeholder="Enter your first name"
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="lastName"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-white">Last Name</FormLabel>
                                <FormControl>
                                  <Input
                                    {...field}
                                    className="bg-dark-charcoal border-gray-600 text-white focus:border-gold"
                                    placeholder="Enter your last name"
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
                            name="email"
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
                          <FormField
                            control={form.control}
                            name="phone"
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
                        </div>
                        
                        <FormField
                          control={form.control}
                          name="subject"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-white">Subject</FormLabel>
                              <FormControl>
                                <Select value={field.value} onValueChange={field.onChange}>
                                  <SelectTrigger className="bg-dark-charcoal border-gray-600 text-white focus:border-gold">
                                    <SelectValue placeholder="Select a subject" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="General Inquiry">General Inquiry</SelectItem>
                                    <SelectItem value="Appointment Request">Appointment Request</SelectItem>
                                    <SelectItem value="Insurance Question">Insurance Question</SelectItem>
                                    <SelectItem value="Treatment Information">Treatment Information</SelectItem>
                                    <SelectItem value="Feedback">Feedback</SelectItem>
                                    <SelectItem value="Other">Other</SelectItem>
                                  </SelectContent>
                                </Select>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="message"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-white">Message</FormLabel>
                              <FormControl>
                                <Textarea
                                  {...field}
                                  rows={5}
                                  className="bg-dark-charcoal border-gray-600 text-white focus:border-gold"
                                  placeholder="Tell us how we can help you..."
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <Button
                          type="submit"
                          disabled={sendMessageMutation.isPending}
                          className="w-full bg-gold hover:bg-warm-gold text-dark-charcoal py-4 font-semibold"
                        >
                          {sendMessageMutation.isPending ? "Sending..." : "Send Message"}
                        </Button>
                      </form>
                    </Form>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-20 bg-dark-grey">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h3 className="text-3xl font-bold mb-8 text-center text-white">
              Find <span className="text-gold">Us</span>
            </h3>
            <Card className="bg-dark-charcoal border-gray-600">
              <CardContent className="p-8 text-center">
                <div className="bg-gray-600 h-96 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <MapPin className="text-gold mx-auto mb-4" size={64} />
                    <p className="text-white font-semibold">Interactive Map</p>
                    <p className="text-gray-300">Google Maps integration would be implemented here</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}

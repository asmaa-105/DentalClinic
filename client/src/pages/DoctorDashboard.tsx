import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Calendar,
  Clock,
  User,
  Phone,
  Mail,
  Edit,
  Trash2,
  LogOut,
  Search,
  Filter,
} from "lucide-react";
import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import type { Appointment } from "@shared/types";

const statusColors = {
  pending: "bg-yellow-500/20 text-yellow-500 border-yellow-500/30",
  confirmed: "bg-green-500/20 text-green-500 border-green-500/30",
  cancelled: "bg-red-500/20 text-red-500 border-red-500/30",
  completed: "bg-blue-500/20 text-blue-500 border-blue-500/30",
};

export default function DoctorDashboard() {
  const [, setLocation] = useLocation();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedAppointment, setSelectedAppointment] =
    useState<Appointment | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Check authentication
  useEffect(() => {
    const isAuthenticated = localStorage.getItem("doctorAuthenticated");
    if (!isAuthenticated) {
      setLocation("/doctor/login");
    }
  }, [setLocation]);

  const { data: appointments, isLoading } = useQuery<Appointment[]>({
    queryKey: ["/api/appointments"],
  });

  const updateAppointmentMutation = useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: number;
      data: Partial<Appointment>;
    }) => {
      const response = await fetch(`/api/appointments/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("Failed to update appointment");
      return response.json();
    },
    onSuccess: (updatedAppointment) => {
      queryClient.invalidateQueries({ queryKey: ["/api/appointments"] });
      queryClient.invalidateQueries({ queryKey: ["/api/availability"] });
      toast({
        title: "Appointment updated successfully",
        description: `Email notification sent to ${updatedAppointment.patientEmail}`,
      });
      setIsEditModalOpen(false);
    },
    onError: () => {
      toast({ title: "Failed to update appointment", variant: "destructive" });
    },
  });

  const deleteAppointmentMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await fetch(`/api/appointments/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete appointment");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/appointments"] });
      queryClient.invalidateQueries({ queryKey: ["/api/availability"] });
      toast({
        title: "Appointment deleted successfully",
        description: "Patient has been notified via email",
      });
    },
    onError: () => {
      toast({ title: "Failed to delete appointment", variant: "destructive" });
    },
  });

  const handleLogout = () => {
    localStorage.removeItem("doctorAuthenticated");
    setLocation("/");
  };

  const handleStatusChange = (appointment: Appointment, newStatus: string) => {
    updateAppointmentMutation.mutate({
      id: appointment.id,
      data: { status: newStatus },
    });

    // Show immediate feedback
    toast({
      title: "Status updated",
      description: `Appointment status changed to ${newStatus}. Email notification being sent...`,
    });
  };

  const handleEditAppointment = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setIsEditModalOpen(true);
  };

  const handleDeleteAppointment = (id: number) => {
    if (confirm("Are you sure you want to delete this appointment?")) {
      deleteAppointmentMutation.mutate(id);
    }
  };

  const filteredAppointments =
    appointments?.filter((apt) => {
      const matchesSearch =
        apt.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        apt.patientEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
        apt.reasonForVisit.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus =
        statusFilter === "all" || apt.status === statusFilter;
      return matchesSearch && matchesStatus;
    }) || [];

  const stats = {
    total: appointments?.length || 0,
    pending:
      appointments?.filter((apt) => apt.status === "pending").length || 0,
    confirmed:
      appointments?.filter((apt) => apt.status === "confirmed").length || 0,
    today:
      appointments?.filter(
        (apt) => apt.appointmentDate === format(new Date(), "yyyy-MM-dd")
      ).length || 0,
  };

  return (
    <div className="min-h-screen bg-dark-charcoal text-white">
      <div className="absolute inset-0">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="w-full h-full object-cover opacity-10"
        >
          <source
            src="client/public/attached_assets/20250708_1235_Surreal Floating Teeth_simple_compose_01jzmjtaxje1xrch7sj4tcvrjh_1751968458677.mp4"
            type="video/mp4"
          />
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-dark-charcoal/90 via-dark-charcoal/80 to-dark-charcoal/90" />
      </div>

      <div className="relative z-10">
        {/* Header */}
        <header className="bg-dark-grey/90 backdrop-blur-sm border-b border-gray-600 p-4">
          <div className="container mx-auto flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white">
                Doctor Dashboard
              </h1>
              <p className="text-gray-300">
                Manage your appointments and patients
              </p>
            </div>
            <Button
              onClick={handleLogout}
              variant="outline"
              className="border-gold text-gold hover:bg-gold hover:text-dark-charcoal"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </header>

        <div className="container mx-auto p-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card className="bg-dark-grey/80 border-gray-600">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Total Appointments</p>
                    <p className="text-2xl font-bold text-white">
                      {stats.total}
                    </p>
                  </div>
                  <Calendar className="text-gold" size={24} />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-dark-grey/80 border-gray-600">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Pending</p>
                    <p className="text-2xl font-bold text-yellow-500">
                      {stats.pending}
                    </p>
                  </div>
                  <Clock className="text-yellow-500" size={24} />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-dark-grey/80 border-gray-600">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Confirmed</p>
                    <p className="text-2xl font-bold text-green-500">
                      {stats.confirmed}
                    </p>
                  </div>
                  <User className="text-green-500" size={24} />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-dark-grey/80 border-gray-600">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Today</p>
                    <p className="text-2xl font-bold text-gold">
                      {stats.today}
                    </p>
                  </div>
                  <Calendar className="text-gold" size={24} />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Filters */}
          <Card className="bg-dark-grey/80 border-gray-600 mb-6">
            <CardHeader>
              <CardTitle className="text-white">Filters</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search appointments..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 bg-dark-charcoal border-gray-600 text-white"
                    />
                  </div>
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full md:w-48 bg-dark-charcoal border-gray-600 text-white">
                    <Filter className="w-4 h-4 mr-2" />
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="confirmed">Confirmed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Appointments List */}
          <Card className="bg-dark-grey/80 border-gray-600">
            <CardHeader>
              <CardTitle className="text-white">Appointments</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gold mx-auto"></div>
                  <p className="text-gray-400 mt-2">Loading appointments...</p>
                </div>
              ) : filteredAppointments.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-400">No appointments found</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredAppointments.map((appointment) => (
                    <div
                      key={appointment.id}
                      className="bg-dark-charcoal/50 border border-gray-600 rounded-lg p-4 hover:bg-dark-charcoal/70 transition-colors"
                    >
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-semibold text-white">
                              {appointment.patientName}
                            </h3>
                            <Badge
                              className={
                                statusColors[
                                  appointment.status as keyof typeof statusColors
                                ]
                              }
                            >
                              {appointment.status}
                            </Badge>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-300">
                            <div className="flex items-center gap-2">
                              <Calendar className="w-4 h-4 text-gold" />
                              {appointment.appointmentDate} at{" "}
                              {appointment.appointmentTime}
                            </div>
                            <div className="flex items-center gap-2">
                              <Phone className="w-4 h-4 text-gold" />
                              {appointment.patientPhone}
                            </div>
                            <div className="flex items-center gap-2">
                              <Mail className="w-4 h-4 text-gold" />
                              {appointment.patientEmail}
                            </div>
                            <div className="flex items-center gap-2">
                              <User className="w-4 h-4 text-gold" />
                              {appointment.reasonForVisit}
                            </div>
                          </div>
                          {appointment.notes && (
                            <div className="mt-2 text-sm text-gray-400">
                              <strong>Notes:</strong> {appointment.notes}
                            </div>
                          )}
                        </div>

                        <div className="flex flex-col md:flex-row gap-2">
                          <Select
                            value={appointment.status}
                            onValueChange={(value) =>
                              handleStatusChange(appointment, value)
                            }
                          >
                            <SelectTrigger className="w-full md:w-32 bg-dark-charcoal border-gray-600 text-white">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="pending">Pending</SelectItem>
                              <SelectItem value="confirmed">
                                Confirmed
                              </SelectItem>
                              <SelectItem value="cancelled">
                                Cancelled
                              </SelectItem>
                              <SelectItem value="completed">
                                Completed
                              </SelectItem>
                            </SelectContent>
                          </Select>

                          <Button
                            onClick={() => handleEditAppointment(appointment)}
                            variant="outline"
                            size="sm"
                            className="border-gold text-gold hover:bg-gold hover:text-dark-charcoal"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>

                          <Button
                            onClick={() =>
                              handleDeleteAppointment(appointment.id)
                            }
                            variant="outline"
                            size="sm"
                            className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Edit Appointment Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="bg-dark-grey border-gray-600 text-white">
          <DialogHeader>
            <DialogTitle>Edit Appointment</DialogTitle>
          </DialogHeader>
          {selectedAppointment && (
            <EditAppointmentForm
              appointment={selectedAppointment}
              onSave={(data) => {
                updateAppointmentMutation.mutate({
                  id: selectedAppointment.id,
                  data,
                });
              }}
              onCancel={() => setIsEditModalOpen(false)}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function EditAppointmentForm({
  appointment,
  onSave,
  onCancel,
}: {
  appointment: Appointment;
  onSave: (data: Partial<Appointment>) => void;
  onCancel: () => void;
}) {
  const [formData, setFormData] = useState({
    appointmentDate: appointment.appointmentDate,
    appointmentTime: appointment.appointmentTime,
    notes: appointment.notes || "",
    reasonForVisit: appointment.reasonForVisit,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">Date</label>
          <Input
            type="date"
            value={formData.appointmentDate}
            onChange={(e) =>
              setFormData({ ...formData, appointmentDate: e.target.value })
            }
            className="bg-dark-charcoal border-gray-600 text-white"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Time</label>
          <Input
            type="time"
            value={formData.appointmentTime}
            onChange={(e) =>
              setFormData({ ...formData, appointmentTime: e.target.value })
            }
            className="bg-dark-charcoal border-gray-600 text-white"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">
          Reason for Visit
        </label>
        <Select
          value={formData.reasonForVisit}
          onValueChange={(value) =>
            setFormData({ ...formData, reasonForVisit: value })
          }
        >
          <SelectTrigger className="bg-dark-charcoal border-gray-600 text-white">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="General Dentistry">General Dentistry</SelectItem>
            <SelectItem value="Cosmetic Dentistry">
              Cosmetic Dentistry
            </SelectItem>
            <SelectItem value="Restorative Care">Restorative Care</SelectItem>
            <SelectItem value="Preventive Care">Preventive Care</SelectItem>
            <SelectItem value="Routine Cleaning">Routine Cleaning</SelectItem>
            <SelectItem value="Consultation">Consultation</SelectItem>
            <SelectItem value="Emergency">Emergency</SelectItem>
            <SelectItem value="Other">Other</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Notes</label>
        <Textarea
          value={formData.notes}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          className="bg-dark-charcoal border-gray-600 text-white"
          rows={3}
        />
      </div>

      <div className="flex justify-end gap-2">
        <Button
          type="button"
          onClick={onCancel}
          variant="outline"
          className="border-gray-600 text-gray-300"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          className="bg-gold hover:bg-warm-gold text-dark-charcoal"
        >
          Save Changes
        </Button>
      </div>
    </form>
  );
}

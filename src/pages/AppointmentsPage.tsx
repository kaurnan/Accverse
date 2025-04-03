import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Calendar, Plus } from 'lucide-react';
import * as api from '../services/api';
import { 
  Table, 
  TableBody, 
  TableCaption, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '../components/ui/table';
import AppointmentCard from '../components/AppointmentCard';

interface Appointment {
  id: number;
  service_name: string;
  appointment_date: string;
  appointment_time: string;
  status: string;
  notes?: string;
}

const AppointmentsPage = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'table'>('table');
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await api.getAppointments();
        setAppointments(data.appointments || []);
      } catch (error) {
        console.error("Error fetching appointments:", error);
        setError("Unable to load your appointments. Please try again later.");
        toast.error("Failed to load your appointments");
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  const handleCancelAppointment = async (id: number) => {
    if (window.confirm("Are you sure you want to cancel this appointment?")) {
      try {
        await api.cancelAppointment(id);
        setAppointments(appointments.filter(appointment => appointment.id !== id));
        toast.success("Appointment cancelled successfully");
      } catch (error) {
        console.error("Error cancelling appointment:", error);
        toast.error("Failed to cancel appointment");
      }
    }
  };

  // Function to format date for better display
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const handleRetry = () => {
    setLoading(true);
    setError(null);
    // We'll try again after a short delay
    setTimeout(async () => {
      try {
        const data = await api.getAppointments();
        setAppointments(data.appointments || []);
      } catch (error) {
        console.error("Error retrying appointment fetch:", error);
        setError("Still unable to load your appointments. There might be a server issue.");
        toast.error("Failed to load your appointments");
      } finally {
        setLoading(false);
      }
    }, 1000);
  };

  return (
    <div className="bg-gray-50 min-h-screen py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">My Appointments</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            View and manage your upcoming appointments
          </p>
        </div>

        <div className="flex justify-between items-center mb-8">
          <div className="flex space-x-4">
            <button
              onClick={() => setViewMode('table')}
              className={`px-4 py-2 rounded-md transition-colors ${
                viewMode === 'table' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Table View
            </button>
            {/* <button
              onClick={() => setViewMode('cards')}
              className={`px-4 py-2 rounded-md transition-colors ${
                viewMode === 'cards' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Card View
            </button> */}
          </div>
          <button
            onClick={() => navigate('/booking')}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors flex items-center"
          >
            <Plus className="h-4 w-4 mr-2" />
            Book New Appointment
          </button>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-4"></div>
            <p className="text-gray-600">Loading your appointments...</p>
          </div>
        ) : error ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <div className="text-red-500 mb-4">
              <Calendar className="inline-block h-12 w-12" />
            </div>
            <h2 className="text-2xl font-medium text-gray-900 mb-2">Error Loading Appointments</h2>
            <p className="text-gray-600 mb-6">
              {error}
            </p>
            <button
              onClick={handleRetry}
              className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        ) : appointments.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <div className="text-gray-400 mb-4">
              <Calendar className="inline-block h-12 w-12" />
            </div>
            <h2 className="text-2xl font-medium text-gray-900 mb-2">No appointments yet</h2>
            <p className="text-gray-600 mb-6">
              You don't have any scheduled appointments at the moment.
            </p>
            <button
              onClick={() => navigate('/booking')}
              className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
            >
              Book Your First Appointment
            </button>
          </div>
        ) : viewMode === 'table' ? (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <Table>
              <TableCaption>A list of your appointments.</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>Service</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Time</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Notes</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {appointments.map((appointment) => (
                  <TableRow key={appointment.id}>
                    <TableCell className="font-medium">{appointment.service_name}</TableCell>
                    <TableCell>{formatDate(appointment.appointment_date)}</TableCell>
                    <TableCell>{appointment.appointment_time}</TableCell>
                    <TableCell>
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                          ${
                            appointment.status === 'confirmed'
                              ? 'bg-green-100 text-green-800'
                              : appointment.status === 'pending'
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-red-100 text-red-800'
                          }
                        `}
                      >
                        {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                      </span>
                    </TableCell>
                    <TableCell className="max-w-xs truncate">
                      {appointment.notes || "-"}
                    </TableCell>
                    <TableCell className="text-right space-x-2">
                      <button
                        onClick={() => navigate(`/appointments/${appointment.id}`)}
                        className="text-blue-600 hover:text-blue-800 font-medium"
                      >
                        View
                      </button>
                      {appointment.status !== 'cancelled' && (
                        <button
                          onClick={() => handleCancelAppointment(appointment.id)}
                          className="text-red-600 hover:text-red-800 font-medium ml-4"
                        >
                          Cancel
                        </button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {appointments.map((appointment) => (
              <AppointmentCard 
                key={appointment.id}
                appointment={appointment}
                onCancel={() => handleCancelAppointment(appointment.id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AppointmentsPage;

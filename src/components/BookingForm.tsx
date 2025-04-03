// import { useState, useEffect } from 'react';
// import { Calendar, Clock, User, Mail, Phone } from 'lucide-react';
// import { useForm } from 'react-hook-form';
// import { toast } from 'react-toastify';
// import { appointmentService, serviceService } from '../api';
// import { useSearchParams, useNavigate } from 'react-router-dom';

// interface BookingFormData {
//   name: string;
//   email: string;
//   phone: string;
//   service_id: string;
//   date: string;
//   time: string;
//   notes: string;
// }

// interface Service {
//   id: number;
//   name: string;
//   description: string;
//   price: number;
//   duration: number;
//   category_id: number;
//   category_name?: string;
// }

// interface AvailableSlot {
//   date: string;
//   available_slots: string[];
// }

// const BookingForm = () => {
//   const [searchParams] = useSearchParams();
//   const navigate = useNavigate();
//   const [services, setServices] = useState<Service[]>([]);
//   const [availableSlots, setAvailableSlots] = useState<string[]>([]);
//   const [loading, setLoading] = useState(false);
//   const [userInfo, setUserInfo] = useState({
//     name: '',
//     email: '',
//     phone: ''
//   });
//   const [isAuthenticated, setIsAuthenticated] = useState(false);

//   const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<BookingFormData>();
  
//   const selectedDate = watch('date');
//   const selectedService = watch('service_id');

//   useEffect(() => {
//     const fetchServices = async () => {
//       try {
//         const response = await serviceService.getServices();
//         setServices(response.services || []);
        
//         // If a service ID is provided in the URL, select it
//         const serviceFromUrl = searchParams.get('service');
//         if (serviceFromUrl) {
//           setValue('service_id', serviceFromUrl);
//         }
//       } catch (error) {
//         console.error('Error fetching services:', error);
//         toast.error('Unable to load services. Please try again later.');
//       }
//     };

//     const checkAuthentication = () => {
//       const token = localStorage.getItem('token');
//       const user = localStorage.getItem('user');
      
//       if (token && user) {
//         setIsAuthenticated(true);
//         try {
//           const userData = JSON.parse(user);
//           setUserInfo({
//             name: userData.name || '',
//             email: userData.email || '',
//             phone: userData.phone || ''
//           });
          
//           // Prefill form with user data
//           setValue('name', userData.name || '');
//           setValue('email', userData.email || '');
//           if (userData.phone) {
//             setValue('phone', userData.phone);
//           }
//         } catch (e) {
//           console.error('Error parsing user data:', e);
//         }
//       }
//     };

//     fetchServices();
//     checkAuthentication();
//   }, [setValue, searchParams]);

//   useEffect(() => {
//     const fetchAvailableSlots = async () => {
//       if (selectedDate) {
//         setLoading(true);
//         try {
//           const serviceId = selectedService ? parseInt(selectedService) : undefined;
//           const response = await appointmentService.getAvailableSlots(selectedDate, serviceId);
//           setAvailableSlots(response.available_slots || []);
//         } catch (error) {
//           console.error('Error fetching available slots:', error);
//           toast.error('Unable to load available time slots.');
//           setAvailableSlots([]);
//         } finally {
//           setLoading(false);
//         }
//       }
//     };

//     if (selectedDate) {
//       fetchAvailableSlots();
//     }
//   }, [selectedDate, selectedService]);

//   const onSubmit = async (data: BookingFormData) => {
//     setLoading(true);
//     try {
//       // If user is not authenticated, they need to login or register first
//       if (!isAuthenticated) {
//         // Store booking details in localStorage for after login/registration
//         localStorage.setItem('pendingBooking', JSON.stringify(data));
//         toast.info('Please log in or register to complete your booking');
//         navigate('/login?redirect=booking');
//         return;
//       }

//       // Submit the booking
//       const bookingData = {
//         service_id: parseInt(data.service_id),
//         date: data.date,
//         time: data.time,
//         notes: data.notes || ''
//       };

//       await appointmentService.createAppointment(bookingData);
//       toast.success('Appointment booked successfully!');
      
//       // Redirect to appointments page
//       navigate('/appointments');
//     } catch (error: any) {
//       console.error('Error booking appointment:', error);
//       toast.error(error.message || 'Failed to book your appointment. Please try again.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
//       <div>
//         <label htmlFor="service_id" className="block text-sm font-medium text-gray-700">
//           Service Type
//         </label>
//         <select
//           id="service_id"
//           className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${
//             errors.service_id ? 'border-red-500' : ''
//           }`}
//           {...register('service_id', { required: 'Please select a service' })}
//         >
//           <option value="">Select a service</option>
//           {services.map((service) => (
//             <option key={service.id} value={service.id}>
//               {service.name} - ${service.price}
//             </option>
//           ))}
//         </select>
//         {errors.service_id && (
//           <p className="mt-1 text-sm text-red-600">{errors.service_id.message}</p>
//         )}
//       </div>

//       <div>
//         <label htmlFor="name" className="block text-sm font-medium text-gray-700">
//           Full Name
//         </label>
//         <div className="mt-1 relative rounded-md shadow-sm">
//           <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//             <User className="h-5 w-5 text-gray-400" />
//           </div>
//           <input
//             type="text"
//             id="name"
//             className={`pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${
//               errors.name ? 'border-red-500' : ''
//             }`}
//             placeholder="John Doe"
//             defaultValue={userInfo.name}
//             {...register('name', { required: 'Name is required' })}
//           />
//         </div>
//         {errors.name && (
//           <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
//         )}
//       </div>

//       <div>
//         <label htmlFor="email" className="block text-sm font-medium text-gray-700">
//           Email Address
//         </label>
//         <div className="mt-1 relative rounded-md shadow-sm">
//           <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//             <Mail className="h-5 w-5 text-gray-400" />
//           </div>
//           <input
//             type="email"
//             id="email"
//             className={`pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${
//               errors.email ? 'border-red-500' : ''
//             }`}
//             placeholder="john@example.com"
//             defaultValue={userInfo.email}
//             {...register('email', { 
//               required: 'Email is required',
//               pattern: {
//                 value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
//                 message: 'Invalid email address'
//               }
//             })}
//           />
//         </div>
//         {errors.email && (
//           <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
//         )}
//       </div>

//       <div>
//         <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
//           Phone Number
//         </label>
//         <div className="mt-1 relative rounded-md shadow-sm">
//           <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//             <Phone className="h-5 w-5 text-gray-400" />
//           </div>
//           <input
//             type="tel"
//             id="phone"
//             className={`pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${
//               errors.phone ? 'border-red-500' : ''
//             }`}
//             placeholder="+61 123 456 789"
//             defaultValue={userInfo.phone}
//             {...register('phone', { required: 'Phone number is required' })}
//           />
//         </div>
//         {errors.phone && (
//           <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>
//         )}
//       </div>

//       <div>
//         <label htmlFor="date" className="block text-sm font-medium text-gray-700">
//           Preferred Date
//         </label>
//         <div className="mt-1 relative rounded-md shadow-sm">
//           <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//             <Calendar className="h-5 w-5 text-gray-400" />
//           </div>
//           <input
//             type="date"
//             id="date"
//             className={`pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${
//               errors.date ? 'border-red-500' : ''
//             }`}
//             min={new Date().toISOString().split('T')[0]}
//             {...register('date', { required: 'Date is required' })}
//           />
//         </div>
//         {errors.date && (
//           <p className="mt-1 text-sm text-red-600">{errors.date.message}</p>
//         )}
//       </div>

//       <div>
//         <label htmlFor="time" className="block text-sm font-medium text-gray-700">
//           Preferred Time
//         </label>
//         <div className="mt-1 relative rounded-md shadow-sm">
//           <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//             <Clock className="h-5 w-5 text-gray-400" />
//           </div>
//           <select
//             id="time"
//             className={`pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${
//               errors.time ? 'border-red-500' : ''
//             }`}
//             disabled={!selectedDate || availableSlots.length === 0}
//             {...register('time', { required: 'Time is required' })}
//           >
//             <option value="">Select a time</option>
//             {availableSlots.map((slot) => (
//               <option key={slot} value={slot}>
//                 {slot}
//               </option>
//             ))}
//           </select>
//         </div>
//         {errors.time && (
//           <p className="mt-1 text-sm text-red-600">{errors.time.message}</p>
//         )}
//         {selectedDate && availableSlots.length === 0 && (
//           <p className="mt-1 text-sm text-yellow-600">No available slots for this date. Please select another date.</p>
//         )}
//       </div>

//       <div>
//         <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
//           Additional Notes (Optional)
//         </label>
//         <textarea
//           id="notes"
//           rows={3}
//           className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
//           placeholder="Any specific requirements or questions..."
//           {...register('notes')}
//         ></textarea>
//       </div>

//       <div>
//         <button
//           type="submit"
//           disabled={loading}
//           className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
//         >
//           {loading ? 'Processing...' : 'Schedule Consultation'}
//         </button>
//       </div>
//     </form>
//   );
// };

// export default BookingForm;

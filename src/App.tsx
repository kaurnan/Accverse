// import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
// import AccountingServicesPage from './pages/AccountingServicesPage';
// import TaxServicesPage from './pages/TaxServicesPage';
import TrainingPage from './pages/TrainingPage';
// import InsightsPage from './pages/InsightsPage';
import ContactPage from './pages/ContactPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import BookingPage from './pages/BookingPage';
import PricingPage from './pages/PricingPage';
// import ClientDashboard from './pages/ClientDashboard';
// import AdminDashboard from './pages/AdminDashboard';
import VerificationPage from './pages/VerificationPage';
import { AuthProvider } from './components/AuthContext';
import ForgotPasswordPage from "./pages/ForgotPasswordPage"

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/about" element={<AboutPage />} />
              {/* <Route path="/accounting-services" element={<AccountingServicesPage />} /> */}
              {/* <Route path="/tax-services" element={<TaxServicesPage />} /> */}
              <Route path="/training" element={<TrainingPage />} />
              {/* <Route path="/insights" element={<InsightsPage />} /> */}
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/verify" element={<VerificationPage />} />
              <Route path="/forgot-password" element={<ForgotPasswordPage />} />
              <Route path="/booking" element={<BookingPage />} />
              <Route path="/pricing" element={<PricingPage />} />
              {/* <Route path="/client-dashboard/*" element={<ClientDashboard />} /> */}
              {/* <Route path="/admin-dashboard/*" element={<AdminDashboard />} /> */}
            </Routes>
          </main>
          <Footer />
        </div>
        <ToastContainer position="top-right" autoClose={5000} />
      </Router>
    </AuthProvider>
  );
}

export default App;
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, ChevronDown, Calculator, User, LogOut } from 'lucide-react';
import { useAuth } from './AuthContext';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "./ui/alert-dialog";
import * as api from '../services/api';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState<string | null>(null);
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleDropdown = (menu: string) => {
    if (dropdownOpen === menu) {
      setDropdownOpen(null);
    } else {
      setDropdownOpen(menu);
    }
  };

  const closeDropdown = () => {
    setDropdownOpen(null);
  };

  const handleLogout = async () => {
    try {
      await api.logout();
      logout();
      navigate('/');
      setIsMenuOpen(false);
      setDropdownOpen(null);
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <Calculator className="h-8 w-8 text-blue-600" />
              <span className="ml-2 text-xl font-bold text-gray-800">TaxPro Solutions</span>
            </Link>
          </div>

          <div className="hidden md:flex md:items-center md:space-x-4">
            <div className="relative" onMouseLeave={closeDropdown}>
              <button
                className="px-3 py-2 text-gray-700 hover:text-blue-600 flex items-center"
                onMouseEnter={() => toggleDropdown('services')}
              >
                Services <ChevronDown className="ml-1 h-4 w-4" />
              </button>
              {dropdownOpen === 'services' && (
                <div className="absolute left-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                  <div className="py-1">
                    <Link to="/accounting-services" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      Accounting Solutions
                    </Link>
                    <Link to="/tax-services" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      Tax Solutions
                    </Link>
                    <Link to="/training" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      Online Training
                    </Link>
                  </div>
                </div>
              )}
            </div>

            <Link to="/pricing" className="px-3 py-2 text-gray-700 hover:text-blue-600">
              Pricing
            </Link>

            <div className="relative" onMouseLeave={closeDropdown}>
              <button
                className="px-3 py-2 text-gray-700 hover:text-blue-600 flex items-center"
                onMouseEnter={() => toggleDropdown('insights')}
              >
                Insights <ChevronDown className="ml-1 h-4 w-4" />
              </button>
              {dropdownOpen === 'insights' && (
                <div className="absolute left-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                  <div className="py-1">
                    <Link to="/insights?type=blogs" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      Blogs
                    </Link>
                    <Link to="/insights?type=newsletters" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      Newsletters
                    </Link>
                    <Link to="/insights?type=podcasts" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      Podcasts
                    </Link>
                    <Link to="/insights?type=webinars" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      Webinars
                    </Link>
                  </div>
                </div>
              )}
            </div>

            <Link to="/about" className="px-3 py-2 text-gray-700 hover:text-blue-600">
              About Us
            </Link>

            <Link to="/contact" className="px-3 py-2 text-gray-700 hover:text-blue-600">
              Contact
            </Link>
          </div>

          <div className="hidden md:flex md:items-center md:space-x-2">
            <Link to="/booking" className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700">
              Book Appointment
            </Link>
            
            {isAuthenticated ? (
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-700">
                  Hi, {user?.name?.split(' ')[0] || 'User'}
                </span>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <button className="px-4 py-2 text-sm font-medium text-blue-600 border border-blue-600 rounded-md hover:bg-blue-50 flex items-center">
                      <LogOut className="h-4 w-4 mr-1" />
                      Logout
                    </button>
                  </AlertDialogTrigger>
                  <AlertDialogContent className="bg-white">
                    <AlertDialogHeader>
                      <AlertDialogTitle>Confirm Logout</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to log out of your account?
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={handleLogout}>Logout</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            ) : (
              <Link to="/login" className="px-4 py-2 text-sm font-medium text-blue-600 border border-blue-600 rounded-md hover:bg-blue-50 flex items-center">
                <User className="h-4 w-4 mr-1" />
                Client Login
              </Link>
            )}
          </div>

          <div className="flex items-center md:hidden">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-blue-600 hover:bg-gray-100"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <button
              onClick={() => toggleDropdown('mobileServices')}
              className="w-full text-left px-3 py-2 text-gray-700 hover:text-blue-600 flex items-center justify-between"
            >
              Services <ChevronDown className="ml-1 h-4 w-4" />
            </button>
            {dropdownOpen === 'mobileServices' && (
              <div className="pl-4 space-y-1">
                <Link to="/accounting-services" className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-100">
                  Accounting Solutions
                </Link>
                <Link to="/tax-services" className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-100">
                  Tax Solutions
                </Link>
                <Link to="/training" className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-100">
                  Online Training
                </Link>
              </div>
            )}

            <Link to="/pricing" className="block px-3 py-2 text-gray-700 hover:text-blue-600">
              Pricing
            </Link>

            <button
              onClick={() => toggleDropdown('mobileInsights')}
              className="w-full text-left px-3 py-2 text-gray-700 hover:text-blue-600 flex items-center justify-between"
            >
              Insights <ChevronDown className="ml-1 h-4 w-4" />
            </button>
            {dropdownOpen === 'mobileInsights' && (
              <div className="pl-4 space-y-1">
                <Link to="/insights?type=blogs" className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-100">
                  Blogs
                </Link>
                <Link to="/insights?type=newsletters" className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-100">
                  Newsletters
                </Link>
                <Link to="/insights?type=podcasts" className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-100">
                  Podcasts
                </Link>
                <Link to="/insights?type=webinars" className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-100">
                  Webinars
                </Link>
              </div>
            )}

            <Link to="/about" className="block px-3 py-2 text-gray-700 hover:text-blue-600">
              About Us
            </Link>

            <Link to="/contact" className="block px-3 py-2 text-gray-700 hover:text-blue-600">
              Contact
            </Link>

            <div className="pt-4 pb-3 border-t border-gray-200">
              <Link to="/booking" className="block w-full px-4 py-2 text-center text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700">
                Book Appointment
              </Link>
              
              {isAuthenticated ? (
                <div className="mt-2 space-y-2">
                  <div className="px-3 py-2 text-sm text-gray-700">
                    Signed in as <span className="font-medium">{user?.name}</span>
                  </div>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <button className="block w-full px-4 py-2 text-center text-sm font-medium text-blue-600 border border-blue-600 rounded-md hover:bg-blue-50 flex items-center justify-center">
                        <LogOut className="h-4 w-4 mr-1" />
                        Logout
                      </button>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="bg-white">
                      <AlertDialogHeader>
                        <AlertDialogTitle>Confirm Logout</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to log out of your account?
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleLogout}>Logout</AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              ) : (
                <Link 
                  to="/login" 
                  className="block w-full mt-2 px-4 py-2 text-center text-sm font-medium text-blue-600 border border-blue-600 rounded-md hover:bg-blue-50 flex items-center justify-center"
                >
                  <User className="h-4 w-4 mr-1" />
                  Client Login
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;

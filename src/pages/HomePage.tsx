"use client"
import { Link } from "react-router-dom"
import { Calculator, FileText, BookOpen, BarChart4, ArrowRight, Play, CheckCircle } from "lucide-react"
import Hero from "../components/Hero"
import ServiceCard from "../components/ServiceCard"
import TestimonialCard from "../components/TestimonialCard"
import ChatWidget from "../components/ChatWidget"
// import { useAuth } from "../components/AuthContext"

const HomePage = () => {
  // const { isAuthenticated } = useAuth()

  const services = [
    {
      icon: <Calculator className="h-6 w-6" />,
      title: "Accounting Solutions",
      description: "Comprehensive accounting services for businesses of all sizes.",
      // features: ["Bookkeeping & Payroll", "Virtual CFO Services", "Financial Statements", "Bank Reconciliation"],
      features: ["Bookkeeping & Payroll", "Lorem ipsum dolor", "Lorem ipsum dolor", "Lorem ipsum dolor"],
      link: "/accounting-services",
      color: "blue",
    },
    {
      icon: <FileText className="h-6 w-6" />,
      title: "Tax Solutions",
      description: "Expert tax preparation and planning for individuals and businesses.",
      // features: ["Personal & Business Tax", "SMSF Tax Returns", "Tax Planning & Compliance", "ATO Audit Assistance"],
      features: ["Personal & Business Tax", "Lorem ipsum dolor", "Lorem ipsum dolor", "Lorem ipsum dolor"],
      link: "/tax-services",
      color: "green",
    },
    {
      icon: <BookOpen className="h-6 w-6" />,
      title: "Online Training",
      description: "Professional development and training for financial literacy.",
      // features: [
      //   "Tax Workshops",
      //   "Accounting Software Training",
      //   "Financial Management Courses",
      //   "Customized Business Training",
      // ],
      features: [
        "Lorem ipsum dolor",
        "Accounting Software Training",
        "Financial Management Courses",
        "Lorem ipsum dolor",
      ],
      link: "/training",
      color: "purple",
    },
    {
      icon: <BarChart4 className="h-6 w-6" />,
      title: "Business Advisory",
      description: "Strategic guidance to help your business thrive and grow.",
      features: ["Business Planning", "Cash Flow Management", "Growth Strategies", "Risk Assessment"],
      link: "/business-advisory",
      color: "orange",
    },
  ]

  const testimonials = [
    {
      quote:
        "Accverse transformed our financial management. Their Virtual CFO service gave us the insights we needed to make strategic decisions and grow our business.",
      author: "Sarah Johnson",
      role: "CEO",
      company: "Innovate Tech",
      rating: 5,
      image:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80",
    },
    {
      quote:
        "I've been using their tax services for 3 years now. They're thorough, professional, and have saved me thousands in deductions I would have missed.",
      author: "Michael Chen",
      role: "Small Business Owner",
      rating: 5,
    },
    {
      quote:
        "The team at Accverse helped us set up our SMSF and continue to manage our annual compliance. Their expertise has been invaluable.",
      author: "David Wilson",
      role: "Retiree",
      rating: 4,
    },
  ]

  return (
    <div>
      <Hero />

      {/* Services Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Services</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Comprehensive accounting and tax solutions tailored to your specific needs
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((service, index) => (
              <ServiceCard key={index} {...service} />
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Why Choose Accverse?</h2>
              <p className="text-lg text-gray-600 mb-8">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Excepturi animi in iusto earum. Pariatur vero provident nemo ab, commodi deserunt!
              </p>

              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <CheckCircle className="h-6 w-6 text-green-500" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-lg font-medium text-gray-900">Experienced Professionals</h3>
                    <p className="mt-1 text-gray-600">
                      Lorem ipsum dolor, sit amet consectetur adipisicing elit. Laboriosam magnam temporibus labore ea sint, aspernatur in consectetur?
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <CheckCircle className="h-6 w-6 text-green-500" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-lg font-medium text-gray-900">Personalized Approach</h3>
                    <p className="mt-1 text-gray-600">
                      Lorem ipsum dolor sit amet consectetur adipisicing elit. Soluta ducimus quidem pariatur.
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <CheckCircle className="h-6 w-6 text-green-500" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-lg font-medium text-gray-900">Cutting-Edge Technology</h3>
                    <p className="mt-1 text-gray-600">
                      Lorem ipsum dolor sit amet consectetur adipisicing elit. Illo magni iusto dolore enim eius obcaecati.
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <CheckCircle className="h-6 w-6 text-green-500" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-lg font-medium text-gray-900">Transparent Pricing</h3>
                    <p className="mt-1 text-gray-600">
                      Lorem ipsum dolor, sit amet consectetur adipisicing elit. Recusandae repellat ut earum officiis.
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-8">
                <Link to="/about" className="inline-flex items-center text-blue-600 font-medium hover:text-blue-800">
                  Learn more about our approach <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </div>
            </div>

            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1556761175-b413da4baf72?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80"
                alt="Professional team meeting"
                className="rounded-lg shadow-xl object-cover w-full h-[500px]"
              />
              <div className="absolute inset-0 bg-blue-900 opacity-20 rounded-lg"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <a
                  href="#"
                  className="bg-white rounded-full p-4 shadow-lg hover:bg-gray-100 transition-colors"
                  aria-label="Play video"
                >
                  <Play className="h-8 w-8 text-blue-600" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">What Our Clients Say</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Don't just take our word for it. Here's what our clients have to say about our services.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <TestimonialCard key={index} {...testimonial} />
            ))}
          </div>

          <div className="text-center mt-12">
            <Link
              to="/testimonials"
              className="inline-flex items-center px-6 py-3 border border-blue-600 text-blue-600 font-medium rounded-md hover:bg-blue-50 transition-colors"
            >
              View All Testimonials <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-blue-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">Ready to Take Control of Your Finances?</h2>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto mb-8">
            Schedule a free 30-minute consultation with one of our experts to discuss your accounting and tax needs.
          </p>

          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
          <Link
            to="/booking"
            className="px-8 py-3 bg-white text-blue-700 font-medium rounded-md hover:bg-blue-50 transition-colors"
          >
            Book a Consultation
          </Link>
          <Link
            to="/contact"
            className="px-8 py-3 bg-transparent border border-white text-white font-medium rounded-md hover:bg-blue-800 transition-colors"
          >
            Contact Us
          </Link>
            {/* {isAuthenticated ? (
              <>
                <Link
                  to="/dashboard"
                  className="px-8 py-3 bg-white text-blue-700 font-medium rounded-md hover:bg-blue-50 transition-colors"
                >
                  Go to Dashboard
                </Link>
                <Link
                  to="/booking"
                  className="px-8 py-3 bg-transparent border border-white text-white font-medium rounded-md hover:bg-blue-800 transition-colors"
                >
                  Book New Appointment
                </Link>
              </>
            ) : (
              <>
                <Link
                  to="/booking"
                  className="px-8 py-3 bg-white text-blue-700 font-medium rounded-md hover:bg-blue-50 transition-colors"
                >
                  Book a Consultation
                </Link>
                <Link
                  to="/contact"
                  className="px-8 py-3 bg-transparent border border-white text-white font-medium rounded-md hover:bg-blue-800 transition-colors"
                >
                  Contact Us
                </Link>
              </>
            )} */}
          </div>
        </div>
      </section>

      {/* Latest Insights Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-12">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Discover More</h2>
              <p className="text-xl text-gray-600">Stay informed with our latest blogs, webinars, and updates.</p>
            </div>
            <Link
              to="/insights"
              className="hidden md:inline-flex items-center text-blue-600 font-medium hover:text-blue-800"
            >
              Explore Videos <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg overflow-hidden shadow-md border border-gray-100">
              <img
                src="https://images.unsplash.com/photo-1554224155-6726b3ff858f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80"
                alt="Tax planning strategies"
                className="w-full h-48 object-cover"
              />
              <div className="p-5">
                <div className="mb-3">
                  <span className="inline-block px-3 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                    Tax Planning
                  </span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  lorem ipsum dolor sit amet . Quisquam, voluptatibus?
                </h3>
                <p className="text-gray-600 mb-4">
                  Lorem ipsum dolor sit, amet consectetur adipisicing elit. Aspernatur, cupiditate. A tempore quam vero officiis quae aliquid ducimus placeat laudantium?
                </p>
                <Link to="/insights/tax-planning-strategies" className="text-blue-600 font-medium hover:text-blue-800">
                  Read more →
                </Link>
              </div>
            </div>

            <div className="bg-white rounded-lg overflow-hidden shadow-md border border-gray-100">
              <img
                src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2426&q=80"
                alt="SMSF management"
                className="w-full h-48 object-cover"
              />
              <div className="p-5">
                <div className="mb-3">
                  <span className="inline-block px-3 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                    SMSF
                  </span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Lorem ipsum dolor sit amet. ducimus placeat?
                </h3>
                <p className="text-gray-600 mb-4">
                  Lorem ipsum dolor sit amet, consectetur adipisicing elit. Repellendus odit minus iusto laboriosam! Adipisci?
                </p>
                <Link to="/insights/smsf-guide" className="text-blue-600 font-medium hover:text-blue-800">
                  Read more →
                </Link>
              </div>
            </div>

            <div className="bg-white rounded-lg overflow-hidden shadow-md border border-gray-100">
              <img
                src="https://images.unsplash.com/photo-1450101499163-c8848c66ca85?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80"
                alt="Business growth"
                className="w-full h-48 object-cover"
              />
              <div className="p-5">
                <div className="mb-3">
                  <span className="inline-block px-3 py-1 text-xs font-medium bg-purple-100 text-purple-800 rounded-full">
                    Business Growth
                  </span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Lorem ipsum dolor sit amet consectetur.</h3>
                <p className="text-gray-600 mb-4">
                  Lorem ipsum dolor sit amet consectetur adipisicing elit. Repudiandae qui, provident ullam dolore eveniet eum ex velit dolor.
                </p>
                <Link to="/insights/virtual-cfo-benefits" className="text-blue-600 font-medium hover:text-blue-800">
                  Read more →
                </Link>
              </div>
            </div>
          </div>

          <div className="text-center mt-8 md:hidden">
            <Link to="/insights" className="inline-flex items-center text-blue-600 font-medium hover:text-blue-800">
              View all insights <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Clients Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Trusted by Businesses of All Sizes</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We've helped hundreds of businesses and individuals achieve their financial goals.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 items-center">
            {/* These would be replaced with actual client logos */}
            <div className="flex justify-center">
              <div className="h-12 w-32 bg-gray-200 rounded-md flex items-center justify-center text-gray-500 font-medium">
                Client 1
              </div>
            </div>
            <div className="flex justify-center">
              <div className="h-12 w-32 bg-gray-200 rounded-md flex items-center justify-center text-gray-500 font-medium">
                Client 2
              </div>
            </div>
            <div className="flex justify-center">
              <div className="h-12 w-32 bg-gray-200 rounded-md flex items-center justify-center text-gray-500 font-medium">
                Client 3
              </div>
            </div>
            <div className="flex justify-center">
              <div className="h-12 w-32 bg-gray-200 rounded-md flex items-center justify-center text-gray-500 font-medium">
                Client 4
              </div>
            </div>
            <div className="flex justify-center">
              <div className="h-12 w-32 bg-gray-200 rounded-md flex items-center justify-center text-gray-500 font-medium">
                Client 5
              </div>
            </div>
            <div className="flex justify-center">
              <div className="h-12 w-32 bg-gray-200 rounded-md flex items-center justify-center text-gray-500 font-medium">
                Client 6
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Chat Widget */}
      <ChatWidget />
    </div>
  )
}

export default HomePage


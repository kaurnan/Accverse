
-- Create database (if it doesn't exist)
CREATE DATABASE IF NOT EXISTS Accverse;
USE Accverse;

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    address TEXT,
    role ENUM('admin', 'client') NOT NULL DEFAULT 'client',
    verification_token VARCHAR(100),
    is_verified BOOLEAN DEFAULT FALSE,
    firebase_uid VARCHAR(128),
    provider VARCHAR(50),
    reset_token VARCHAR(100),
    reset_token_expiry DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Service Categories table
CREATE TABLE service_categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Services table
CREATE TABLE services (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    category_id INT NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    duration INT NOT NULL COMMENT 'Duration in minutes',
    is_active BOOLEAN DEFAULT TRUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES service_categories(id)
);

CREATE TABLE IF NOT EXISTS email_verification (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL,
    otp VARCHAR(6) NOT NULL,
    is_verified BOOLEAN DEFAULT FALSE,
    created_at DATETIME NOT NULL,
    UNIQUE KEY (email)
);

-- Appointments table
CREATE TABLE appointments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    service_id INT NOT NULL,
    appointment_date DATE NOT NULL,
    appointment_time TIME NOT NULL,
    notes TEXT,
    admin_notes TEXT,
    status ENUM('pending', 'confirmed', 'completed', 'cancelled') NOT NULL DEFAULT 'pending',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (service_id) REFERENCES services(id)
);

-- Invoices table
CREATE TABLE invoices (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    invoice_number VARCHAR(20) NOT NULL UNIQUE,
    appointment_id INT,
    issue_date DATE NOT NULL,
    due_date DATE NOT NULL,
    subtotal_amount DECIMAL(10, 2) NOT NULL,
    tax_amount DECIMAL(10, 2) NOT NULL,
    total_amount DECIMAL(10, 2) NOT NULL,
    notes TEXT,
    status ENUM('pending', 'paid', 'overdue', 'cancelled') NOT NULL DEFAULT 'pending',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (appointment_id) REFERENCES appointments(id) ON DELETE SET NULL
);

-- Invoice Items table
CREATE TABLE invoice_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    invoice_id INT NOT NULL,
    description VARCHAR(255) NOT NULL,
    quantity INT NOT NULL DEFAULT 1,
    unit_price DECIMAL(10, 2) NOT NULL,
    total_price DECIMAL(10, 2) NOT NULL,
    FOREIGN KEY (invoice_id) REFERENCES invoices(id) ON DELETE CASCADE
);

-- Payments table
CREATE TABLE payments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    invoice_id INT,
    amount DECIMAL(10, 2) NOT NULL,
    payment_method ENUM('credit_card', 'bank_transfer', 'paypal', 'cash', 'other') NOT NULL,
    reference VARCHAR(100),
    transaction_id VARCHAR(100),
    description TEXT,
    status ENUM('pending', 'completed', 'failed', 'refunded') NOT NULL DEFAULT 'pending',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (invoice_id) REFERENCES invoices(id) ON DELETE SET NULL
);

-- Notifications table
CREATE TABLE notifications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(50) NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Notification Preferences table
CREATE TABLE notification_preferences (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL UNIQUE,
    email_notifications BOOLEAN DEFAULT TRUE,
    sms_notifications BOOLEAN DEFAULT FALSE,
    appointment_reminders BOOLEAN DEFAULT TRUE,
    payment_notifications BOOLEAN DEFAULT TRUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Calendar Events table
CREATE TABLE calendar_events (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    event_date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    location VARCHAR(255),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Knowledge Articles table (for knowledge base)
CREATE TABLE knowledge_articles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    author_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    category VARCHAR(100) DEFAULT 'General',
    tags VARCHAR(255),
    is_published BOOLEAN DEFAULT TRUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (author_id) REFERENCES users(id)
);


-- Tax forms table for storing tax form submissions and progress
CREATE TABLE IF NOT EXISTS tax_forms (
    id VARCHAR(36) PRIMARY KEY,
    user_id INT,
    form_type VARCHAR(50) NOT NULL DEFAULT 'individual', -- 'individual', 'business', 'smsf', etc.
    form_data JSON NOT NULL,
    fiscal_year_end DATE,
    status ENUM('submitted', 'processing', 'completed', 'requires_info') NOT NULL DEFAULT 'submitted',
    notes TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Tax form files table for storing uploaded files
CREATE TABLE IF NOT EXISTS tax_form_files (
    id INT AUTO_INCREMENT PRIMARY KEY,
    tax_form_id VARCHAR(36) NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    file_path VARCHAR(255) NOT NULL,
    file_type VARCHAR(100),
    file_size INT,
    field_name VARCHAR(100) NOT NULL,
    upload_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (tax_form_id) REFERENCES tax_forms(id) ON DELETE CASCADE
);

-- Tax form templates table to store available form types
CREATE TABLE IF NOT EXISTS tax_form_templates (
    id VARCHAR(50) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    subtitle VARCHAR(255),
    description TEXT,
    steps INT NOT NULL DEFAULT 5,
    is_active BOOLEAN DEFAULT TRUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Insert predefined form templates
INSERT INTO tax_form_templates (id, title, subtitle, description, steps, is_active) VALUES 
('individual', 'NEW CLIENT TAX CHECKLIST', 'For Individuals & Sole Traders', 'Complete this form if you are an individual or sole trader requiring tax return services.', 5, TRUE),
('business', 'NEW BUSINESS CLIENT FORM', 'For Companies, Trusts & Partnerships', 'Complete this form if you have a business entity such as a company, trust, or partnership.', 4, TRUE),
('smsf', 'NEW SMSF CLIENT FORM', 'For Self-Managed Superannuation Funds', 'Complete this form if you have a self-managed superannuation fund requiring compliance services.', 5, TRUE),
('engagement', 'ENGAGEMENT LETTER', 'For All Business Clients', 'Required engagement letter for all business clients to formalize our services.', 1, TRUE),
('smsf-establishment', 'SMSF ESTABLISHMENT FORM', 'Set up a new Self-Managed Superannuation Fund', 'Complete this form to establish a new Self-Managed Superannuation Fund.', 1, TRUE),
('company-registration', 'COMPANY REGISTRATION CHECKLIST', 'Register a new company', 'Complete this checklist to register a new company.', 1, TRUE);

-- Insert sample data for service categories
INSERT INTO service_categories (name, description) VALUES 
('Tax Services', 'Professional tax preparation and planning services'),
('Accounting Services', 'Bookkeeping and accounting solutions for businesses'),
('Business Advisory', 'Strategic financial advice for business growth'),
('Training & Workshops', 'Educational sessions on financial management');

-- Insert sample services
INSERT INTO services (name, description, category_id, price, duration, is_active) VALUES 
('Personal Tax Return', 'Complete preparation and filing of personal income tax returns', 1, 250.00, 60, TRUE),
('Business Tax Return', 'Comprehensive tax preparation for businesses of all sizes', 1, 800.00, 120, TRUE),
('Monthly Bookkeeping', 'Regular bookkeeping services to maintain accurate financial records', 2, 350.00, 60, TRUE),
('Financial Statement Preparation', 'Creation of profit & loss statements, balance sheets, and cash flow reports', 2, 500.00, 90, TRUE),
('Business Growth Strategy', 'Custom strategic planning for business expansion and profitability', 3, 1200.00, 120, TRUE),
('Tax Planning Workshop', 'Group workshop on tax-saving strategies and planning', 4, 150.00, 180, TRUE);

-- Create an admin user (password: admin123)
INSERT INTO users (name, email, password, role, is_verified) VALUES 
('Admin User', 'admin@taxpro.com', '$2b$12$1Iy9SrBVXAAQLjKdQkgBZOnKRcYB5jJfI3ELqgjl5DoYMF/Wt/MR.', 'admin', TRUE);

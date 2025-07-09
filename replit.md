# Dental Clinic Website

## Overview

This is a modern, responsive dental clinic website built with React, TypeScript, and Express.js. The application provides a comprehensive platform for a dental practice, featuring doctor profiles, appointment booking, and a professional web presence. The system is designed to serve both patients seeking dental care and clinic staff managing appointments and operations.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Styling**: Tailwind CSS with custom dental-themed color scheme (dark charcoal, gold accents)
- **UI Components**: Radix UI primitives with shadcn/ui component library
- **State Management**: TanStack Query for server state management
- **Routing**: Wouter for client-side routing
- **Forms**: React Hook Form with Zod validation
- **Build Tool**: Vite for fast development and optimized builds

### Backend Architecture
- **Runtime**: Node.js with Express.js
- **Database**: PostgreSQL with Drizzle ORM
- **Database Provider**: Neon Database (serverless PostgreSQL)
- **API**: RESTful endpoints for doctors, appointments, and availability
- **Session Management**: connect-pg-simple for PostgreSQL session storage
- **Development**: Hot module replacement with Vite integration

### Data Layer
- **ORM**: Drizzle ORM with PostgreSQL dialect
- **Schema**: Type-safe database schema with Zod validation
- **Migrations**: Database migrations managed through Drizzle Kit
- **Storage**: Abstract storage interface with in-memory implementation for development

## Key Components

### Database Schema
- **Users**: Authentication and user management
- **Doctors**: Doctor profiles with specialties, bio, education, and experience
- **Appointments**: Patient appointments with scheduling and status tracking
- **Availability**: Doctor availability slots for appointment booking

### API Endpoints
- `GET /api/doctors` - Retrieve all doctors
- `GET /api/doctors/:id` - Get specific doctor details
- `GET /api/doctors/:id/availability` - Get doctor availability
- `GET /api/availability/:doctorId/:date` - Get availability for specific date
- `POST /api/appointments` - Create new appointment
- `GET /api/appointments` - Get all appointments
- `GET /api/appointments/:id` - Get specific appointment
- `PATCH /api/appointments/:id` - Update appointment with email notifications
- `DELETE /api/appointments/:id` - Cancel appointment
- `POST /api/doctor/login` - Doctor authentication
- `POST /api/contact` - Handle contact form submissions

### Frontend Pages
- **Home**: Hero section, about clinic, services, and doctor overview
- **Doctor Profile**: Detailed doctor information and availability
- **Services**: Comprehensive service listings with detailed descriptions
- **Booking**: Interactive appointment booking with calendar
- **Calendar**: Public appointment calendar view
- **Confirmation**: Appointment confirmation with details
- **Contact**: Contact form and clinic information
- **Doctor Login**: Secure authentication for doctor access
- **Doctor Dashboard**: Comprehensive appointment management interface

## Data Flow

1. **User Navigation**: Users browse clinic information and doctor profiles
2. **Appointment Booking**: 
   - User selects doctor and views availability
   - Interactive calendar shows available time slots
   - Form validation ensures complete booking information
   - Appointment creation with confirmation
3. **Data Persistence**: All appointments and availability stored in PostgreSQL
4. **Real-time Updates**: TanStack Query manages cache invalidation and updates

## External Dependencies

### Core Dependencies
- **@neondatabase/serverless**: Serverless PostgreSQL driver
- **drizzle-orm**: Type-safe database ORM
- **@tanstack/react-query**: Server state management
- **@hookform/resolvers**: Form validation integration
- **zod**: Runtime type validation
- **date-fns**: Date manipulation utilities

### UI Dependencies
- **@radix-ui/***: Accessible UI primitives
- **tailwindcss**: Utility-first CSS framework
- **class-variance-authority**: Component variant management
- **lucide-react**: Icon library

### Development Dependencies
- **vite**: Build tool and development server
- **typescript**: Type checking and development
- **tsx**: TypeScript execution for server
- **esbuild**: Fast bundling for production

## Deployment Strategy

### Development
- **Server**: Node.js with tsx for TypeScript execution
- **Client**: Vite development server with HMR
- **Database**: Neon Database with development environment
- **Environment**: `NODE_ENV=development`

### Production Build
- **Client**: Vite build with optimized bundles
- **Server**: esbuild compilation to ESM format
- **Database**: Production PostgreSQL with migrations
- **Serving**: Express serves static files and API routes

### Environment Configuration
- **DATABASE_URL**: PostgreSQL connection string
- **NODE_ENV**: Environment mode (development/production)
- **Email Service**: Gmail SMTP for appointment confirmations and notifications
- **Doctor Authentication**: Simple credential-based access (username: doctor, password: dental123)
- **Firebase**: Optional integration for enhanced features

## Changelog

- July 09, 2025. Added comprehensive doctor dashboard with appointment management, email notifications, and secure authentication
- July 08, 2025. Initial setup

## User Preferences

Preferred communication style: Simple, everyday language.
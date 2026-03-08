# Miniproject
IBENTO

A Triple-Tiered Event Management & Governance Ecosystem

Introduction

University campuses often struggle with fragmented event information spread across social media, emails, and physical posters. IBENTO is a centralized web ecosystem designed to bridge the gap between Student Clubs, College Administration, and the Student Body.

Unlike traditional listing sites, IBENTO provides a structured governance model where:

SuperAdmins oversee the platform integrity.

Club Leads manage dynamic event lifecycles.

Students discover and participate in campus activities through a seamless, logic-driven interface.

Problem Statement

Managing campus events is currently inefficient due to:

Data Fragmentation: Event details are scattered, leading to low student engagement.

Manual Administration: Club leads struggle with manual registration tracking and payment verification.

Security Risks: Lack of role-based access leads to unauthorized data modification and "fake" event listings.

No Central Resource Hub: Students lack a secure "Vault" to access official event rulebooks and schedules.

Gap Identified

Existing event platforms (like Eventbrite or Google Forms) lack:

Hierarchical Governance: No distinction between University Admin, Club Leads, and Students.

Dynamic Form Logic: Static forms that cannot adapt to "Free vs. Paid" event requirements.

Real-Time Synchronization: No instant seat-count updates across multiple devices.

Secure Document Vault: No authenticated storage for official administrative PDFs.

Proposed Solution

IBENTO is a Serverless 3-Tier Event Management system that:

Role-Based Access Control (RBAC): Uses JWT and Custom Claims to secure the 3-user hierarchy.

Dynamic Schema Engine: Renders registration forms based on specific club requirements.

Real-Time Database: Uses WebSockets for instant seat availability updates.

The Document Vault: A secure cloud storage system for event posters and official rulebooks.

Skip-Logic Pipeline: Automatically routes students through different registration paths based on event payment status.

Module Description

The system consists of the following major modules:

1. Identity & Access Module
Handles Google OAuth and Email/Password login.

Injects roles (SuperAdmin/Lead/Student) into the user session.

2. Event Orchestration Module (Club Lead)
Provides CRUD (Create, Read, Update, Delete) tools for events.

Allows custom form building for specialized registration data.

3. Registration & Skip-Logic Module
Evaluates isPaid flags to determine registration routing.

Manages Atomic Transactions for seat counting to prevent overbooking.

4. Document Vault Module
Securely hosts and serves official PDFs and rulebooks via Firebase Storage.

Generates tokenized URLs for authenticated student downloads.

5. SuperAdmin Governance Module
Verifies Club Lead credentials and manages platform-wide analytics.

Moderates content to ensure university compliance.

6. User Interface (Glass-morphism UI)
A responsive React.js frontend featuring modern translucent design elements.

Software Requirement Specification

User Interface

Student Dashboard: Event grid, "My Tickets" section, and Document Vault access.

Admin Command Center: Event analytics, participant list exports, and form configuration.

SuperAdmin Panel: Club verification queue and system-wide activity logs.

UI Characteristics

Glass-morphism Design: Translucent panels and backdrop blurs for a modern look.

Responsive Layout: Fully optimized for mobile and desktop viewing.

Software and Hardware Requirements

Software Requirements

Frontend: React.js (Component-based architecture)

Hosting: Vercel Edge Network

Backend-as-a-Service: Firebase (Auth, Firestore, Storage)

State Management: React Context API

Security: Firestore Declarative Security Rules

Hardware Requirements

Processor: Intel i3 or above

RAM: Minimum 4 GB

Storage: 5 GB free disk (Cloud-hosted)

Internet: High-speed connection for real-time data syncing

Functional Requirements

Triple-Tier Authentication: Secure login for 3 distinct roles.

Dynamic Form Generation: Forms that adapt based on the specific event.

Real-Time Seat Management: Instant decrementing of seats upon registration.

Resource Hosting: Uploading and downloading of official event PDFs.

Role-Based Route Protection: Preventing unauthorized access to Admin panels.

Data Export: Exporting participant lists in CSV/Excel format.

Database Requirements (NoSQL Schema)

Users Table: uid, email, role, displayName.

Events Table: eventId, clubId, title, seatsAvailable, isPaid, formSchema.

Registrations Table: regId, studentId, eventId, timestamp.

Clubs Table: clubId, leadId, isVerified, clubName.

Non-Functional Requirements

Performance: UI updates in <2 seconds using real-time listeners.

Security: Data access restricted via server-side Security Rules.

Scalability: Serverless architecture scales automatically during high-traffic fests.

Reliability: 99.9% uptime via Vercel/Firebase hosting.

Conclusion

IBENTO successfully centralizes campus event governance into a single, secure ecosystem. By utilizing a Serverless 3-Tier Architecture, the platform provides a scalable solution for clubs and students alike. The integration of Dynamic Form Logic, Real-Time Sync, and the Document Vault ensures that campus activities are managed with professional efficiency, reducing administrative overhead and increasing student participation.

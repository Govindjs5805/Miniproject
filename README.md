# Miniproject
# IBENTO

## Triple-Tier Event Management Ecosystem

IBENTO is a centralized web ecosystem designed to bridge the gap between Student Clubs, College Administration, and the Student Body by replacing fragmented social media announcements with a structured governance model.

### Problem & Solution

The Problem: Fragmented event info, manual registration tracking, unauthorized "fake" listings, and a lack of secure document sharing.

The Solution: A Serverless 3-Tier System featuring Role-Based Access Control (RBAC), real-time seat synchronization, and a secure "Document Vault" for official resources.

### Core Modules

Identity & Access: Secure Google/Email OAuth with SuperAdmin, Club Lead, and Student roles.

Event Orchestration: Full CRUD tools for Club Leads to manage event lifecycles and custom forms.

Skip-Logic Registration: Automated routing that adapts based on "Free vs. Paid" event status.

Document Vault: Secure Firebase Storage for authenticated PDF rulebook and poster downloads.

Governance Panel: SuperAdmin interface for club verification and platform-wide moderation.

### Tech Stack

Frontend: React.js (Glass-morphism UI) | Vercel Hosting

Backend-as-a-Service and Database: Firebase (Auth, Firestore, Storage)

Logic: React Context API | Firestore Security Rules

### Key Requirements

Functional: Triple-tier auth, dynamic form generation, real-time seat management, and CSV data export.

Non-Functional: <2s latency for sync, 99.9% uptime, and serverless auto-scaling.

Hardware: Intel i3+, 4GB RAM, and high-speed internet for real-time WebSockets.

### Conclusion

IBENTO streamlines campus governance into a secure, scalable ecosystem. By integrating Dynamic Form Logic and a Real-Time Sync Engine, it reduces administrative overhead while significantly increasing student engagement.

### Authors: 
Govind J.S

Ahlada A Adrija

Aswinraj

Sourav S

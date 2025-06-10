# Project & Proposal Module Implementation Plan

## Overview

This document outlines the step-by-step plan for implementing the Projects and Proposals module in the Vacancy.service platform. The plan is inspired by Upwork's project/proposal workflow and is tailored to the modular, pluggable architecture of the system. Each phase is incremental and testable, ensuring maintainability, scalability, and seamless integration with other modules.

---

## 1. Objectives
- Allow clients to post projects with detailed requirements
- Enable freelancers to search, filter, and apply to projects via proposals
- Support negotiation, messaging, and contract management between users
- Ensure all logic is encapsulated in a plug-in module, following the system's hooks/actions/filters pattern
- Integrate with authentication, messaging, payments, and notification modules

---

## 2. Functional Scope (Upwork-like Flow)

### 2.1 Project Posting (Client)
- Project creation form: title, description, category, budget, deadline, required skills, visibility (public/private)
- Option to invite specific freelancers
- Project listing and management (edit, archive, close)

### 2.2 Project Discovery (Freelancer)
- Search and filter projects by skills, category, budget, deadline, client rating
- Project detail view
- Save/favorite projects

### 2.3 Proposal Submission (Freelancer)
- Submit proposal: cover letter, bid amount, estimated delivery, portfolio links
- Attach files (optional)
- Track sent proposals and their status
- Daily credit system for proposal limits

### 2.4 Proposal Management (Client)
- View received proposals per project
- Filter/sort proposals (by price, rating, etc.)
- Accept, reject, or negotiate proposals
- Initiate chat/interview with freelancer

### 2.5 Contracting & Negotiation
- Move accepted proposal to contract
- Allow negotiation of terms before contract finalization
- Integrate with messaging module for communication
- Escrow/payment integration (future phase)

### 2.6 Notifications & Activity
- Notify users of new proposals, status changes, messages, etc.
- Activity log for project/proposal events

---

## 3. Technical Phases

### Phase 1: Module Scaffolding & Data Models
- Define TypeScript interfaces/entities for Project, Proposal, Contract
- Set up MongoDB collections (projects, proposals, contracts)
- Create module registration function (registerProjectHooks)
- Document all actions/filters/hooks

### Phase 2: Project CRUD (Client)
- Implement project creation, editing, listing, and archiving endpoints
- Integrate with authentication (only clients can post)
- Add actions/filters for extensibility (e.g., project.create, project.update)

### Phase 3: Project Discovery (Freelancer)
- Implement project search/filter endpoints
- Add filters for custom search logic
- Expose public project listing API

### Phase 4: Proposal Submission & Tracking
- Implement proposal submission endpoint (with credit check)
- Allow freelancers to view their proposals and statuses
- Add actions/filters for proposal events (proposal.submit, proposal.statusChange)

### Phase 5: Proposal Management (Client)
- Endpoints for clients to view/manage proposals per project
- Accept/reject/negotiate proposals
- Integrate with messaging module for communication

### Phase 6: Contracting & Negotiation
- Move accepted proposals to contract entity
- Allow contract negotiation before finalization
- Prepare for future escrow/payment integration

### Phase 7: Notifications & Activity Log
- Integrate with notification module for all key events
- Implement activity log for project/proposal/contract events

### Phase 8: UI Integration
- Expose services for Next.js front-end consumption
- Provide example API usage for dashboard integration

---

## 4. Deliverables
- Fully documented, plug-in Projects & Proposals module
- TypeScript interfaces and MongoDB schemas
- REST API endpoints for all flows
- Actions/filters/hooks for extensibility
- Example integration with dashboards (admin, freelancer, client)
- Test coverage for all endpoints and business logic

---

## 5. Next Steps & Validation
- Review and approve this plan
- Implement each phase incrementally, validating with tests and UI integration
- Refactor and split files/functions as needed to maintain code under 200-350 lines per file
- Document all hooks and API endpoints
- Plan for future integration with payments, escrow, and advanced features (AI, analytics, etc.)

---

## References
- Upwork project/proposal workflow
- Vacancy.service architecture docs
- Modular monolith best practices 
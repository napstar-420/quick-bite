# Quick Bite

**Version:** 0.0.1

## Table of Contents
1. [Project Overview](#1-project-overview)
2. [System Architecture](#2-system-architecture)
3. [Project Structure](#3-project-structure)
4. [Technical Stack](#4-technical-stack)
5. [Setup Instructions](#5-setup-instructions)
6. [Development Guidelines](#6-development-guidelines)
7. [API Documentation](#7-api-documentation)
8. [User Interfaces](#8-user-interfaces)
9. [Testing Strategy](#9-testing-strategy)
10. [Deployment Workflow](#10-deployment-workflow)
11. [Maintenance and Support](#11-maintenance-and-support)
12. [Appendix](#12-appendix)

## 1. Project Overview

### 1.1 Introduction
The "Quick Bite" is a web-based platform designed to connect customers with nearby restaurants for a seamless food ordering and delivery experience. The app allows users to browse menus, place orders, track deliveries, and leave reviews, while restaurant owners can manage their menus and orders. Delivery personnel can efficiently accept and track deliveries, ensuring timely service.

### 1.2 Objectives
- Streamline the food ordering and delivery process
- Connect users, restaurants, and delivery personnel in a seamless manner
- Provide tools for restaurants to manage menus and orders
- Offer features for delivery drivers to manage pickups and drop-offs
- Include an admin panel for user management and platform monitoring

### 1.3 Key Features
- Secure user authentication system
- Restaurant search with filtering capabilities
- Shopping cart functionality
- Real-time order tracking
- Multiple payment options
- Push notifications
- Rating and review system
- Loyalty rewards program

### 1.4 Stakeholders
- End Users (Customers)
- Restaurant Owners
- Delivery Personnel
- System Administrators
- Project Development Team

## 2. System Architecture

### 2.1 High-Level Architecture
The system follows a monorepo architecture with a clear separation between backend and frontend components. The architecture is designed to be scalable, maintainable, and responsive.

```
┌─────────────────────────────────────────────────────────────┐
│                   Quick Bite Architecture                   │
└───────────────────────────────┬─────────────────────────────┘
                                │
       ┌─────────────────────────────────────────────┐
       │                  Monorepo                    │
       └───────────┬───────────────────────┬─────────┘
                   │                       │
    ┌──────────────▼──────────────┐  ┌────▼────────────────────┐
    │        Shared Packages      │  │      Applications        │
    ├─────────────────────────────┤  ├─────────────────────────┤
    │ ● eslint-config             │  │ ● Backend (Node.js)      │
    │ ● app-config                │  │ ● Frontend (React)       │
    │ ● prettier-config           │  │                          │
    └─────────────────────────────┘  └─────────────────────────┘
```

### 2.2 Component Diagram
```
┌─────────────────────────────────────────────────────────────────────────┐
│                               Client Side                                │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  ┌───────────────┐    ┌───────────────┐    ┌───────────────────┐       │
│  │ Customer App  │    │ Restaurant App│    │ Delivery App      │       │
│  └───────┬───────┘    └───────┬───────┘    └──────────┬────────┘       │
│          │                    │                       │                 │
└──────────┼────────────────────┼───────────────────────┼─────────────────┘
           │                    │                       │
┌──────────▼────────────────────▼───────────────────────▼─────────────────┐
│                               API Gateway                                │
└──────────┬────────────────────┬───────────────────────┬─────────────────┘
           │                    │                       │
┌──────────▼──────┐  ┌──────────▼──────┐  ┌─────────────▼───────────────┐
│  User Service   │  │ Restaurant      │  │ Delivery Service            │
│                 │  │ Service         │  │                             │
└─────────────────┘  └─────────────────┘  └─────────────────────────────┘
```

### 2.3 Database Structure
MongoDB is used as the primary database with the following collections:

- Users
- Restaurants
- Menu Items
- Orders
- Reviews
- Delivery Personnel
- Admin

## 3. Project Structure

### 3.1 Monorepo Organization
```
quick-bite/
├── packages/
│   ├── eslint-config/     # Shared ESLint configuration
│   ├── app-config/        # Shared application configuration
│   └── prettier-config/   # Shared Prettier configuration
├── apps/
│   ├── api/           # Node.js API server
│   └── web/          # React web application
├── .gitignore
├── package.json           # Root package.json for monorepo management
└── .editorconfig          # Editor configuration
└── .env.example           # Example environment variables
└── .gitignore             # Git ignore file
└── .nvmrc                 # Node.js version file
└── eslint.config.mjs       # ESLint configuration
└── package.json           # Root package.json for monorepo management
└── pnpm-lock.yaml         # pnpm lock file
└── pnpm-workspace.yaml    # pnpm workspace configuration
└── tsconfig.json          # TypeScript configuration
└── README.md              # Project documentation
```

### 3.2 Backend Structure
```
backend/
├── src/
│   ├── config/            # Configuration files
│   ├── controllers/       # Route controllers
│   ├── middleware/        # Express middleware
│   ├── models/            # Mongoose models
│   ├── routes/            # API routes
│   ├── services/          # Business logic
│   ├── utils/             # Utility functions
│   └── app.js             # Express app setup
├── tests/                 # Test files
├── .env.example           # Example environment variables
└── package.json           # Backend dependencies
```

### 3.3 Frontend Structure
```
frontend/
├── public/                # Static files
├── src/
│   ├── assets/            # Images, fonts, etc.
│   ├── components/        # Reusable UI components
│   │   ├── common/        # Shared components
│   │   ├── customer/      # Customer-specific components
│   │   ├── restaurant/    # Restaurant-specific components
│   │   └── delivery/      # Delivery personnel components
│   ├── context/           # React context providers
│   ├── hooks/             # Custom React hooks
│   ├── pages/             # Page components
│   ├── services/          # API service calls
│   ├── utils/             # Utility functions
│   ├── App.js             # Main App component
│   └── index.js           # Entry point
├── package.json           # Frontend dependencies
└── .env.example           # Example environment variables
```

## 4. Technical Stack

### 4.1 Frontend
- **Framework**: React
- **State Management**: Context API / Redux
- **Styling**: CSS / Styled Components
- **UI Libraries**: Bootstrap
- **HTTP Client**: Axios
- **Testing**: N/A

### 4.2 Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB
- **ODM**: Mongoose
- **Authentication**: JWT
- **Validation**: Express Validator
- **Testing**: N/A

### 4.3 DevOps & Tools
- **Version Control**: Git
- **Package Manager**: pnpm
- **Linting**: ESLint
- **Formatting**: Prettier
- **CI/CD**: N/A
- **Deployment**: N/A

## 5. Setup Instructions

### 5.1 Prerequisites
- Node.js (v22 or later)
- pnpm (v10 or later)
- MongoDB (local or Atlas connection)
- Git

### 5.2 Installation Steps
1. Clone the repository:
   ```bash
   git clone git@github.com:napstar-420/quick-bite.git
   cd quick-bite
   ```

2. Install dependencies:
   ```bash
   pnpm install
   ```

3. Set up environment variables:
   - Copy `.env.example` to `.env` in root and both backend and frontend directories
   - Update variables as needed

4. Start development servers:
   ```bash
   pnpm run dev
   ```

### 5.3 Environment Variables
**Backend (.env)**
```
LOG_LEVEL=debug
ACCESS_TOKEN_SECRET=your-secret-key
REFRESH_TOKEN_SECRET=your-secret-key
```

**Frontend (.env)**

## 6. Development Guidelines

### 6.1 Coding Standards
- Follow the ESLint and Prettier configurations provided in the shared packages
- Use meaningful variable and function names
- Write comprehensive documentation for functions and components
- Implement proper error handling

### 6.2 Git Workflow
1. Create feature branches from `develop` branch
   ```bash
   git checkout -b feature/feature-name
   ```
2. Make changes and commit with descriptive messages
   ```bash
   git commit -m "feat: add user authentication functionality"
   ```
3. Submit pull requests to `develop` branch
4. After review, merge to `develop`
5. Periodically, merge `develop` to `main` for releases

### 6.3 Pull Request Guidelines
- Provide a clear description of changes
- Reference related issues
- Ensure all tests pass
- Obtain code review from at least one team member

## 7. User Interfaces

### 7.1 Customer Interface

#### 7.1.1 Home Page
- Restaurant search functionality
- Featured restaurants
- Special offers and promotions
- Navigation menu

#### 7.1.2 Restaurant Listing
- Restaurant cards with basic info
- Filter and sort options
- Search bar

#### 7.1.3 Restaurant Details
- Restaurant information
- Menu categories and items
- Reviews and ratings
- Add to cart functionality

#### 7.1.4 Cart & Checkout
- Order summary
- Address selection/entry
- Payment method selection
- Order confirmation

#### 7.1.5 Order Tracking
- Real-time order status
- Delivery ETA
- Delivery personnel details
- Map view of delivery route

### 7.2 Restaurant Interface

#### 7.2.1 Dashboard
- Order summary metrics
- Revenue statistics
- Recent reviews

#### 7.2.2 Menu Management
- Add/edit/remove menu items
- Update prices and availability
- Manage categories

#### 7.2.3 Order Management
- View incoming orders
- Update order status
- Order history

### 7.3 Delivery Personnel Interface

#### 7.3.1 Dashboard
- Available deliveries
- Earnings summary
- Performance metrics

#### 7.3.2 Delivery Management
- Accept/decline orders
- Navigation to pickup/delivery locations
- Update delivery status
- Delivery history

### 7.4 Admin Interface

#### 7.4.1 Dashboard
- Platform metrics
- User statistics
- Revenue reports

#### 7.4.2 User Management
- Manage customers, restaurants, and delivery personnel
- Verify restaurants
- Handle disputes

## 9. Testing Strategy

### 9.1 Unit Testing
- Test individual components and functions
- Focus on business logic and utility functions
- Use Jest for frontend and Mocha/Chai for backend

### 9.2 Integration Testing
- Test API endpoints
- Verify database operations
- Ensure proper communication between components

### 9.3 End-to-End Testing
- Test complete user flows
- Verify frontend-backend integration
- Use Cypress for automated E2E testing

### 9.4 Performance Testing
- Load testing for concurrent users
- Response time benchmarking
- Database query optimization

## 10. Deployment Workflow

### 10.1 Development Environment
- Local development with hot-reloading
- MongoDB running locally or on Atlas
- Feature branches for development

### 10.2 Staging Environment
- Automated deployment from `develop` branch
- Integration testing
- User acceptance testing (UAT)

### 10.3 Production Environment
- Deployment from `main` branch
- Performance monitoring
- Scalability considerations

### 10.4 CI/CD Pipeline
1. Code commit triggers tests
2. Successful tests trigger build
3. Build artifacts are deployed to the appropriate environment
4. Post-deployment health checks

## 11. Maintenance and Support

### 11.1 Monitoring
- Use logging services for error tracking
- Implement performance monitoring
- Set up alerts for critical issues

### 11.2 Backup Strategy
- Regular database backups
- Backup retention policy
- Restore procedures

### 11.3 Update Process
- Regular security updates
- Feature enhancements
- Bug fixes

## 12. Appendix

### 12.1 Glossary
- **COD**: Cash on Delivery
- **ETA**: Estimated Time of Arrival
- **UAT**: User Acceptance Testing
- **CI/CD**: Continuous Integration/Continuous Deployment
- **SRS**: Software Requirements Specification

### 12.2 SRS Document
[Link to original SRS document](https://drive.google.com/file/d/1dUtuR7rgA4Z5q9XSOxxnib2YaDZ-BqKk/view?usp=sharing)

### 12.3 External Resources
- [Node.js Documentation](https://nodejs.org/en/docs/)
- [React Documentation](https://reactjs.org/docs/getting-started.html)
- [MongoDB Documentation](https://docs.mongodb.com/)
- [Express.js Documentation](https://expressjs.com/en/api.html)
- [Mongoose Documentation](https://mongoosejs.com/docs/)

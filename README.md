🏠 Room Matching — Transparent Room Rental & Review Platform

A full-stack web platform for searching, listing, and reviewing rental rooms in Vietnam — built with Next.js, NestJS, and AI-powered features for transparent, trustworthy rental experiences.


📋 Table of Contents

Overview
Features
Tech Stack
System Architecture
Database Schema
Getting Started
Environment Variables
Project Structure
API Documentation
Deployment
Roadmap


Overview
Room Matching solves a real problem in the Vietnamese rental market: the lack of transparency and honest reviews. Unlike existing platforms (Phongtro123, Chotot) that focus only on listings, Room Matching puts verified reviews at the center — so renters can make informed decisions and landlords are incentivized to maintain quality.
Target users:

🧑‍🎓 Students and young professionals looking for rental rooms
🏘️ Landlords wanting to reach verified renters
👨‍💼 Admins managing platform quality and trust


Features
For Renters

🔍 Advanced search with filters (price, area, district, amenities, rating)
🗺️ Map-based search powered by Google Maps API
⭐ Read verified reviews across 5 categories (cleanliness, security, location, landlord, value)
💬 Real-time chat with landlords via WebSocket
❤️ Save favorite rooms
📝 Write reviews (only after verified contact with landlord)

For Landlords

📢 Create and manage room listings with photo upload
📊 Dashboard with views, contact stats, and review scores
💬 Real-time messaging inbox
🔔 Email notifications for new messages and reviews

AI-Powered Features

🤖 Sentiment analysis on reviews (positive / negative / neutral)
🚨 Fake listing and spam review detection
💡 Similar room recommendations based on browsing history
📝 AI-generated review summaries per room


Tech Stack
Frontend
TechnologyPurposeNext.js 14 (App Router)React framework with SSR/SSGTailwindCSSUtility-first stylingShadcnUIComponent libraryReact Query (TanStack)Server state managementZustandClient state managementSocket.io-clientReal-time chatGoogle Maps JS APIMap and geocoding
Backend
TechnologyPurposeNestJSNode.js framework (modular architecture)PostgreSQLPrimary relational databasePrisma ORMType-safe database accessRedisCaching and session storageSocket.ioWebSocket for real-time chatJWT + Refresh TokenAuthenticationPassport.jsAuth strategies
External Services
ServicePurposeGoogle Maps APIGeocoding + map displayCloudinaryImage upload and CDNGemini API (free tier)AI sentiment + recommendationsSendGridEmail notificationsVNPay / MoMoPayment gateway (future)
DevOps
TechnologyPurposeDocker + Docker ComposeLocal development environmentRailwayCloud deploymentGitHub ActionsCI/CD pipeline

System Architecture
┌─────────────────────────────────────────────────┐
│               Next.js Frontend (Vercel)          │
│   Search │ Room Detail │ Chat │ Dashboard        │
└────────────────────┬────────────────────────────┘
                     │ REST API + WebSocket
┌────────────────────▼────────────────────────────┐
│              NestJS Backend (Railway)            │
│  Auth │ Room │ Review │ Chat │ AI │ Notification │
└──┬──────────┬──────────┬──────────┬─────────────┘
   │          │          │          │
PostgreSQL  Redis    Cloudinary  Gemini API
(Prisma)  (Cache)   (Images)     (AI)

Database Schema
User ──────── Room ──────── RoomImage
  │             │
  ├── Review    ├── RoomAmenity ── Amenity
  │             │
  ├── Report    ├── Review
  │             │
  ├── SavedRoom ├── Conversation ── Message
  │             │
  └── Message   └── Report
Key tables:
TableDescriptionusersAll platform users (Admin / Landlord / Renter)roomsRoom listings with location, price, statusroom_imagesMultiple images per roomamenitiesMaster list of amenities (WiFi, AC, etc.)room_amenitiesMany-to-many: rooms ↔ amenitiesreviewsVerified reviews with 5-category ratingsconversationsChat threads between renter and landlordmessagesIndividual messages in a conversationsaved_roomsUser's saved/favorited roomsreportsUser reports on listings or reviews

Getting Started
Prerequisites

Node.js >= 18
PostgreSQL >= 15
Redis >= 7
Docker (recommended)

1. Clone the repository
bashgit clone https://github.com/yourusername/room-matching.git
cd room-matching
2. Start with Docker Compose (recommended)
bashdocker-compose up -d
This starts PostgreSQL, Redis, the NestJS backend, and the Next.js frontend automatically.
3. Manual setup (alternative)
Backend:
bashcd backend
npm install
npx prisma migrate dev
npx prisma db seed
npm run start:dev
Frontend:
bashcd frontend
npm install
npm run dev
4. Access the app
ServiceURLFrontendhttp://localhost:3000Backend APIhttp://localhost:4000API Docs (Swagger)http://localhost:4000/api/docsPrisma Studiohttp://localhost:5555

Environment Variables
Backend (/backend/.env)
env# App
NODE_ENV=development
PORT=4000

# Database
DATABASE_URL=postgresql://postgres:password@localhost:5432/room-matching

# Redis
REDIS_URL=redis://localhost:6379

# JWT
JWT_SECRET=your_jwt_secret_here
JWT_REFRESH_SECRET=your_refresh_secret_here
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Google Maps
GOOGLE_MAPS_API_KEY=your_google_maps_key

# Gemini AI
GEMINI_API_KEY=your_gemini_api_key

# SendGrid
SENDGRID_API_KEY=your_sendgrid_key
SENDGRID_FROM_EMAIL=noreply@room-matching.vn

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:3000
Frontend (/frontend/.env.local)
envNEXT_PUBLIC_API_URL=http://localhost:4000
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_key
NEXT_PUBLIC_SOCKET_URL=http://localhost:4000

Project Structure
room-matching/
├── frontend/                  # Next.js application
│   ├── app/                   # App Router pages
│   │   ├── (auth)/            # Login, Register pages
│   │   ├── (main)/            # Main layout pages
│   │   │   ├── page.tsx       # Homepage
│   │   │   ├── rooms/         # Search results
│   │   │   ├── rooms/[id]/    # Room detail
│   │   │   ├── post/          # Post a listing
│   │   │   ├── dashboard/     # Landlord dashboard
│   │   │   └── messages/      # Chat inbox
│   ├── components/
│   │   ├── ui/                # ShadcnUI base components
│   │   ├── room/              # Room-specific components
│   │   ├── review/            # Review components
│   │   ├── chat/              # Chat components
│   │   └── map/               # Map components
│   ├── hooks/                 # Custom React hooks
│   ├── lib/                   # Utilities, API client
│   ├── stores/                # Zustand stores
│   └── types/                 # TypeScript types
│
├── backend/                   # NestJS application
│   ├── src/
│   │   ├── auth/              # JWT auth, guards, strategies
│   │   ├── users/             # User management
│   │   ├── rooms/             # Room CRUD + search
│   │   ├── reviews/           # Review system
│   │   ├── chat/              # WebSocket chat gateway
│   │   ├── ai/                # Gemini AI integration
│   │   ├── notifications/     # Email notifications
│   │   ├── upload/            # Cloudinary upload
│   │   └── common/            # Shared decorators, filters, pipes
│   ├── prisma/
│   │   ├── schema.prisma      # Database schema
│   │   └── seed.ts            # Seed data (100+ rooms)
│   └── test/                  # E2E tests
│
├── docker-compose.yml
└── README.md

API Documentation
Full Swagger documentation available at /api/docs when running the backend.
Key Endpoints
Auth
POST   /auth/register          Register new user
POST   /auth/login             Login + get tokens
POST   /auth/refresh           Refresh access token
POST   /auth/logout            Revoke refresh token
Rooms
GET    /rooms                  Search rooms (with filters + pagination)
GET    /rooms/:id              Get room detail
POST   /rooms                  Create listing (Landlord only)
PUT    /rooms/:id              Update listing (Owner only)
DELETE /rooms/:id              Delete listing (Owner only)
POST   /rooms/:id/save         Save/unsave room
Reviews
GET    /rooms/:id/reviews      Get reviews for a room
POST   /rooms/:id/reviews      Submit a review (verified renters only)
DELETE /reviews/:id            Delete review (Admin only)
Chat
GET    /conversations          Get user's conversations
GET    /conversations/:id/messages   Get messages in conversation
WS     /chat                   WebSocket namespace for real-time chat
AI
GET    /rooms/:id/ai-summary   Get AI summary of room reviews
GET    /rooms/:id/similar      Get AI-recommended similar rooms

Deployment
Deploy to Railway (recommended)

Push code to GitHub
Connect Railway to your GitHub repo
Add environment variables in Railway dashboard
Railway auto-detects Dockerfile and deploys

Deploy with Docker
bash# Build and run production containers
docker-compose -f docker-compose.prod.yml up -d
CI/CD Pipeline (GitHub Actions)
The .github/workflows/deploy.yml file automatically:

Runs tests on every pull request
Builds Docker images on merge to main
Deploys to Railway on successful build
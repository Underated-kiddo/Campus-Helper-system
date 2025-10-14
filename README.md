# Helper Campus System

Empowering students to learn, find lost items, stay informed, and connect — all in one friendly app.

---

## What this project solves

Many students struggle with self-study and research, lose important items, miss school announcements sent by email, or rely on fragmented chat apps that don't serve the campus community well. Helper Campus System addresses these problems by bringing four complementary solutions into a single web app:

- Peer-to-peer tutoring to connect students who understand course material with those who need help.
- A centralized Lost & Found for posting found items and tracking claims.
- A searchable library of research materials and notes contributed by alumni and senior students.
- Event and announcement feeds presented in an engaging way so students actually notice them.

## Key features

- Peer-to-peer tutoring
	- Create tutoring offers and requests by subject, course code, or topic.
	- Book short sessions or ongoing study groups.
	- Reviews and ratings for tutors.

- Lost & Found
	- Post descriptions and images of found items with time and location.
	- Claim workflow and contact channels to reunite owners with belongings.

- Research materials
	- Upload and browse notes, past projects, and study guides categorized by course and term.
	- Tagging, search, and basic moderation for quality.

- Events and announcements
	- Club activities, events, and official notices shown in a timeline and calendar view.
	- RSVP and reminders so students don’t miss out.

- Community chat
	- Topic-based chat rooms for classes, clubs, and social groups.
	- Simple profiles and presence indicators.

- Client: React + Vite (see `/client`).
- Server: Node.js + Express (see `/Server`).
- Database: MongoDB (or another document DB) — adjust connection in `/Server/config/db.js`.
- Package manager: pnpm/npm (repo contains lockfiles for pnpm).


## Development — setup (PowerShell)

1. Clone the repo and open this workspace.

2. Create a `.env` file in the `Server` folder (example below).

Example `.env` (Server):

DATABASE_URL="mongodb://localhost:27017/helper-campus"
PORT=5000
JWT_SECRET=your_jwt_secret_here

3. Install dependencies and run client and server. Use either pnpm or npm depending on which you prefer.

Using pnpm:

```powershell
cd "client"; pnpm install
cd ..\Server; pnpm install
# Run both (in separate terminals)
cd ..\client; pnpm dev
cd ..\Server; pnpm start
```

Using npm:

```powershell
cd "client"; npm install
cd ..\Server; npm install
# Run both (in separate terminals)
cd ..\client; npm run dev
cd ..\Server; npm start
```

Note: Replace commands above with exact scripts in `client/package.json` and `Server/package.json` if they differ.

## Environment & configuration

- The server expects a MongoDB connection string in `DATABASE_URL` and a `JWT_SECRET` for authentication tokens.
- Optionally add SMTP credentials or third-party APIs for email, push notifications, or file storage.

.


# GreenFeed 🌱

> **An IoT-Enabled Gamified Platform for Smart Waste Management**

[![React](https://img.shields.io/badge/React-18-blue.svg)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-latest-646CFF.svg)](https://vitejs.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-latest-3178C6.svg)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38B2AC.svg)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-Database-3ECF8E.svg)](https://supabase.io/)

GreenFeed is a dual-layer socio-technical platform designed to address the challenge of passive citizenry in waste management and build accountability mechanisms for environmental actions. It combines community reporting, gamification, and IoT-enabled smart bins to incentivize sustainable habits.

---

## 🌟 Key Features

### 1. 🌍 Environmental Heatmap & Reporting
- Real-time heatmap overlay of waste-prone areas.
- Community-driven, geo-tagged reporting of environmental incidents (litter, illegal dumping, pollution).

### 2. 🎯 Task System & Civic Action
- Admin-published environmental cleanup tasks.
- Users can claim, complete, and upload proof-of-completion (geo-tagged images).
- Automated AI/ML relevance scoring, followed by manual verification.

### 3. 🏆 Gamification & Eco-Metrics
- Earn **Eco-Points** for completing tasks and interacting with smart bins.
- **Eco-Score** formula computing impact based on tasks, bin deposits, and social engagement.
- User levels (Bronze, Silver, Gold, Platinum, Elite), activity streaks, and achievement badges.
- Global and city-level leaderboards.

### 4. 🗑️ IoT Smart Bin Integration
- Custom hardware using **ESP32** microcontrollers.
- **QR-code based authentication:** Scan your unique app QR code at the bin to unlock the lid.
- **Automated Classification:** Moisture sensors identify Wet vs. Dry waste.
- **Automated Weighing:** Load cells (HX711) measure the deposited weight.
- **Seamless Rewards:** IoT data is transmitted via MQTT to the backend, automatically crediting the user's wallet with points.

### 5. 👥 Social Feed & User Experience
- **Dedicated Feeds**: Separate authenticated Home feed and personal Eco Dashboard.
- Share environmental actions, posts, and awareness content.
- Support for likes, threaded comments, and content moderation.
- Secure Auth flows, including password resets and magic links.

### 6. 📊 Admin Dashboard
- Centralized control plane for platform managers.
- Task management, content moderation, user management, and real-time smart bin health monitoring.

---

## 💻 Tech Stack

### Software (Client & Backend)
- **Frontend Framework:** React 18, Vite
- **Language:** TypeScript
- **Styling:** Tailwind CSS, shadcn/ui
- **Database & Backend:** Supabase (PostgreSQL, Auth, Edge Functions, Storage)
- **Mapping:** Leaflet / Google Maps API
- **State Management:** React Query

### Hardware (IoT Node)
- **Microcontroller:** ESP32 Development Board (NodeMCU ESP32S)
- **Sensors:** 
  - Capacitive Moisture Sensor v2.0
  - 5kg Load Cell + HX711 Amplifier
  - ESP32-CAM Module (OV2640)
  - QR Code Scanner Module (UART)
- **Actuators:** SG90 Servo Motor
- **Protocol:** MQTT over TLS 1.2 (AWS IoT Core / HiveMQ)

---

## 🚀 Getting Started

### Prerequisites
- Node.js & npm installed
- A Supabase Project (with URL and Anon Key)

### Installation

1. **Clone the repository:**
   ```sh
   git clone <YOUR_GIT_URL>
   cd greenfeed-eco-pulse-main
   ```

2. **Install dependencies:**
   ```sh
   npm install
   ```

3. **Configure Environment Variables:**
   Create a `.env` file in the root directory and add your Supabase credentials:
   ```env
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_anon_key
   ```

4. **Start the development server:**
   ```sh
   npm run dev
   ```
   *Note: The app will run on `http://localhost:5173` by default. Ensure your Supabase auth redirect settings match this port.*

---

## 📖 Documentation
For the complete technical specifications, data requirements, and architectural overview, refer to the **Software Requirements Specification (SRS v1.0)** provided in the project documentation.

## 👥 Contributors
- **Shanvith S Shetty** (4MT23CS184)
- **Kanvitha M S** (4MT23CS073)
- **Sathwik R Shetty** (4MT23CS175)
- **Namita Annappa Naik** (4MT23CS110)

*Under the Guidance of **Mr. Shreejith K B** (Senior Assistant Professor, Dept of CSE, MITE).*

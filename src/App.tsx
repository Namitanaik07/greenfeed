import { Toaster }        from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider }   from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate }     from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { TaskProvider } from "@/hooks/useTasks";
import Index            from "./pages/user/Index";
import Home             from "./pages/user/Home";
import HeatmapPage      from "./pages/user/HeatmapPage";
import FeedPage         from "./pages/user/FeedPage";
import ProfilePage      from "./pages/user/ProfilePage";
import PublicProfilePage from "./pages/user/PublicProfilePage";
import LeaderboardPage  from "./pages/user/LeaderboardPage";
import SpotIssuesPage   from "./pages/user/SpotIssuesPage";
import TakeActionPage   from "./pages/user/TakeActionPage";
import RewardsPage      from "./pages/user/RewardsPage";
import NotFound         from "./pages/NotFound";
import ResetPassword    from "./pages/ResetPassword";
import Footer           from "@/components/sections/Footer";

import { AdminLayout } from "./admin/layout/AdminLayout";
import { DashboardOverview } from "./admin/pages/DashboardOverview";
import { UserManagement } from "./admin/pages/UserManagement";
import { FeedModeration } from "./admin/pages/FeedModeration";
import { SpotIssues } from "./admin/pages/SpotIssues";
import { VerificationQueue } from "./admin/pages/VerificationQueue";
import { RewardsManagement } from "./admin/pages/RewardsManagement";
import { Analytics } from "./admin/pages/Analytics";
import { HardwareSync } from "./admin/pages/HardwareSync";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <TaskProvider>
            <div className="flex flex-col min-h-screen">
              <main className="flex-1">
              <Routes>
                <Route path="/"               element={<Index />} />
                <Route path="/home"           element={<Home />} />
                <Route path="/dashboard"      element={<ProfilePage />} />
                <Route path="/feed"           element={<FeedPage />} />
                <Route path="/spot-issues"    element={<SpotIssuesPage />} />
                <Route path="/take-action"    element={<TakeActionPage />} />
                <Route path="/rewards"        element={<RewardsPage />} />
                <Route path="/heatmap"        element={<HeatmapPage />} />
                <Route path="/profile"        element={<ProfilePage />} />
                <Route path="/user/:userId"   element={<PublicProfilePage />} />
                <Route path="/leaderboard"    element={<LeaderboardPage />} />
                <Route path="/admin"          element={<AdminLayout />}>
                  <Route index element={<Navigate to="dashboard" replace />} />
                  <Route path="dashboard" element={<DashboardOverview />} />
                  <Route path="hardware-sync" element={<HardwareSync />} />
                  <Route path="users"     element={<UserManagement />} />
                  <Route path="feed"      element={<FeedModeration />} />
                  <Route path="issues"    element={<SpotIssues />} />
                  <Route path="verify"    element={<VerificationQueue />} />
                  <Route path="rewards"   element={<RewardsManagement />} />
                  <Route path="analytics" element={<Analytics />} />
                </Route>
                <Route path="/reset-password" element={<ResetPassword />} />
                <Route path="*"               element={<NotFound />} />
              </Routes>
            </main>
            <Footer />
          </div>
          </TaskProvider>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
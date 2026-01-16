import React, { useContext } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster as HotToaster } from "react-hot-toast";
import { Toaster as SonnerToaster } from "sonner";
import * as Tooltip from '@radix-ui/react-tooltip';

import { AuthContext } from "./AuthContext";
import { NotificationProvider } from "./context/NotificationContext";
import { Web3Provider } from "./context/Web3Context";
import { ContractProvider } from "./context/ContractContext";

import './index.css';
import './App.css';

import Homepage from './components/Freelancer/Pages/Homepage';
import SignIn from "./components/SignIn";
import SignUp from "./components/SignUp";
import RoleSelection from "./components/RoleSelection";
import JobListPage from "./components/Freelancer/Pages/JobListPage";
import CreateProject from "./components/Freelancer/Pages/CreateProject";
import EditProject from "./components/Freelancer/Pages/EditProject";
import ProjectDetails from "./components/Freelancer/Pages/ProjectDetails";
import ProjectOverview from './components/Freelancer/Cards/projectOverview';
import ProjectDescription from "./components/Freelancer/Cards/projectDiscription";
import ProjectGallery from "./components/Freelancer/Cards/projectGallery";
import ProjectRequirements from "./components/Freelancer/Cards/projectRequirement";
import ProjectPricing from "./components/Freelancer/Cards/projectPricing";
import MyProjects from "./components/Freelancer/Pages/MyProjects";
import BrowseProjects from "./components/Freelancer/Pages/BrowseProjects";
import JobList from "./components/Freelancer/Pages/JobListPage";
import JobDetail from "./components/Freelancer/Pages/JobDetails";
import CreateJob from "./components/Client/Pages/JobCreationWizard";
import Index from "./components/Client/Pages/Chat";
import MyJobs from "./components/Client/Pages/MyJobs";
import BidForm from "./components/Freelancer/Pages/BidForm";
import MyProposals from "./components/Freelancer/Pages/MyProposals";
import Layout from './components/Layout'
import ContractView from "./components/SmartContracts/ContractView";
import ContractsList from "./components/SmartContracts/ContractsList";
import Profile from "./components/Client/Pages/Profile";
import PublicProfilePage from "./components/Client/Pages/PublicProfilePage";
import EditProfilePage from "./components/Client/Pages/EditProfilePage";
import SavedJobsPage from "./components/Freelancer/Pages/SavedJobsPage";
import BidDetails from "./components/Client/Pages/BidDetails";
import ProfileErrorBoundary from './components/ErrorBoundary';
import NotificationPage from "./components/Client/Pages/Notification";
import NotificationSettings from "./components/Client/Pages/NotificationSettings";
import AdminRoutes from './components/Admin/AdminRoutes';

const queryClient = new QueryClient();

// Protected Route component
const ProtectedRoute = ({ children }) => {
  const { currentUser, isLoading } = useContext(AuthContext);
  
  if (isLoading) {
    return <div className="flex items-center justify-center h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
    </div>;
  }

  if (!currentUser && !isLoading) {
    return <Navigate to="/signin" />;
  }

  return children;
};

const App = () => {
  const { currentUser, chatWithUser } = useContext(AuthContext);

  return (
    <QueryClientProvider client={queryClient}>
      <Tooltip.Provider>
        <Web3Provider>
          <NotificationProvider>
            <ContractProvider>
              {/* Notification systems */}
              <HotToaster position="top-right" />
              <SonnerToaster richColors closeButton position="bottom-right" />
              <Routes>
                {/* All routes are wrapped in Layout to show Navbar */}
                <Route element={<Layout />}>
                  {/* Public Routes */}
                  <Route path="/" element={<Homepage />} />
                  <Route path="/signin" element={<SignIn />} />
                  <Route path="/signup" element={<SignUp />} />
                  <Route path="/role-selection" element={<RoleSelection />} />
                  <Route path="/jobs" element={<JobListPage />} />
                  <Route path="/browse-projects" element={<BrowseProjects />} />
                  <Route path="/jobs/:id" element={<JobDetail />} />
                  <Route path="/projects/:id" element={<ProjectDetails />} />
                  <Route path="/profile/public/:userId" element={<PublicProfilePage />} />

                  {/* Protected Routes */}
                  <Route path="/createproject" element={
                    <ProtectedRoute>
                      <CreateProject />
                    </ProtectedRoute>
                  } />
                  <Route path="/editproject/:id" element={
                    <ProtectedRoute>
                      <EditProject />
                    </ProtectedRoute>
                  } />
                  <Route path="/projectOverview" element={
                    <ProtectedRoute>
                      <ProjectOverview />
                    </ProtectedRoute>
                  } />
                  <Route path="/projectDiscription" element={
                    <ProtectedRoute>
                      <ProjectDescription />
                    </ProtectedRoute>
                  } />
                  <Route path="/projectGallery" element={
                    <ProtectedRoute>
                      <ProjectGallery />
                    </ProtectedRoute>
                  } />
                  <Route path="/projectRequirement" element={
                    <ProtectedRoute>
                      <ProjectRequirements />
                    </ProtectedRoute>
                  } />
                  <Route path="/projectPricing" element={
                    <ProtectedRoute>
                      <ProjectPricing />
                    </ProtectedRoute>
                  } />
                  <Route path="/my-projects" element={
                    <ProtectedRoute>
                      <MyProjects />
                    </ProtectedRoute>
                  } />
                  <Route path="/job-list" element={
                    <ProtectedRoute>
                      <JobList />
                    </ProtectedRoute>
                  } />
                  <Route path="/create-job" element={
                    <ProtectedRoute>
                      <CreateJob />
                    </ProtectedRoute>
                  } />
                  <Route path="/my-jobs" element={
                    <ProtectedRoute>
                      <MyJobs />
                    </ProtectedRoute>
                  } />
                  <Route path="/saved-jobs" element={
                    <ProtectedRoute>
                      <SavedJobsPage />
                    </ProtectedRoute>
                  } />
                  <Route path="/bid-form" element={
                    <ProtectedRoute>
                      <BidForm />
                    </ProtectedRoute>
                  } />
                  <Route path="/myproposals" element={
                    <ProtectedRoute>
                      <MyProposals />
                    </ProtectedRoute>
                  } />
                  <Route path="/contracts" element={
                    <ProtectedRoute>
                      <ContractsList />
                    </ProtectedRoute>
                  } />
                  <Route path="/contracts/:contractId" element={
                    <ProtectedRoute>
                      <ContractView />
                    </ProtectedRoute>
                  } />
                  <Route path="/messages" element={
                    <ProtectedRoute>
                      <Index />
                    </ProtectedRoute>
                  } />
                  <Route path="/messages/new" element={
                    <ProtectedRoute>
                      <Index />
                    </ProtectedRoute>
                  } />
                  <Route path="/bids/:bidId" element={
                    <ProtectedRoute>
                      <BidDetails />
                    </ProtectedRoute>
                  } />
                  <Route path="/profile" element={
                    <ProtectedRoute>
                      <ProfileErrorBoundary>
                        <Profile />
                      </ProfileErrorBoundary>
                    </ProtectedRoute>
                  } />
                  <Route path="/profile/edit" element={
                    <ProtectedRoute>
                      <ProfileErrorBoundary>
                        <EditProfilePage />
                      </ProfileErrorBoundary>
                    </ProtectedRoute>
                  } />
                  <Route path="/notifications" element={
                    <ProtectedRoute>
                      <ProfileErrorBoundary>
                        <NotificationPage />
                      </ProfileErrorBoundary>
                    </ProtectedRoute>
                  } />
                  <Route path="/settings/notifications" element={
                    <ProtectedRoute>
                      <ProfileErrorBoundary>
                        <NotificationSettings />
                      </ProfileErrorBoundary>
                    </ProtectedRoute>
                  } />
                </Route>

                {/* Admin Routes */}
                <Route path="/admin/*" element={<AdminRoutes />} />
              </Routes>
            </ContractProvider>
          </NotificationProvider>
        </Web3Provider>
      </Tooltip.Provider>
    </QueryClientProvider>
  );
};

export default App;


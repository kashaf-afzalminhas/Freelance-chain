import React, { useContext } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster as HotToaster } from "react-hot-toast";
import { Toaster as SonnerToaster } from "sonner";
import * as Tooltip from '@radix-ui/react-tooltip';

//import { AuthContext, AuthProvider } from "./AuthContext";
import AuthProvider, { AuthContext } from "./AuthContext";
//import { UserProvider } from "./context/UserContext";

import './index.css';
import './App.css';

import Homepage from './components/Freelancer/Pages/Homepage';
import SignIn from "./components/SignIn";
import SignUp from "./components/SignUp";
import RoleSelection from "./components/RoleSelection";
import JobListPage from "./components/Freelancer/Pages/JobListPage";
import CreateProject from "./components/Freelancer/Pages/CreateProject";
import EditProject from "./components/Freelancer/Pages/EditProject";
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
//import ChatPage from './components/Freelancer/Pages/ChatPages';
import Index from "./components/Client/Pages/Chat";
//import NotFound from "./components/Client/Pages/NotFound";
import Profile from "./components/Client/Pages/Profile";
import PublicProfilePage from "./components/Client/Pages/PublicProfilePage";
import EditProfilePage from "./components/Client/Pages/EditProfilePage";
import ProfileErrorBoundary from './components/ErrorBoundary';

const queryClient = new QueryClient();

const App = () => {
  const { currentUser, chatWithUser } = useContext(AuthContext);

  return (
    <QueryClientProvider client={queryClient}>
      <Tooltip.Provider>
        <AuthProvider>
          {/* Notification systems */}
          <HotToaster position="top-right" />
          <SonnerToaster richColors closeButton position="bottom-right" />

          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Homepage />} />
              <Route path="/signin" element={<SignIn />} />
              <Route path="/signup" element={<SignUp />} />
              <Route path="/role-selection" element={<RoleSelection />} />
              <Route path="/jobs" element={<JobListPage />} />
              <Route path="/createproject" element={<CreateProject />} />
              <Route path="/editproject/:id" element={<EditProject />} />
              <Route path="/projectOverview" element={<ProjectOverview />} />
              <Route path="/projectDiscription" element={<ProjectDescription />} />
              <Route path="/projectGallery" element={<ProjectGallery />} />
              <Route path="/projectRequirement" element={<ProjectRequirements />} />
              <Route path="/projectPricing" element={<ProjectPricing />} />
              <Route path="/my-projects" element={<MyProjects />} />
              <Route path="/browse-projects" element={<BrowseProjects />} />
              <Route path="/job-list" element={<JobList />} />
              <Route path="/job-details/:id" element={<JobDetail />} />
              <Route path="/create-job" element={<CreateJob />} />
              {/* <Route
                path="/chat"
                element={
                  <ChatPage
                    currentUser={currentUser || { _id: 'defaultUserId', name: 'Default User' }}
                    chatWithUser={chatWithUser || { _id: 'chatUserId', name: 'Chat User' }}
                  />
                }
              /> */}
              
              <Route path="/messages" element={<Index />} />
              <Route
                path="/profile"
                element={
                  <ProfileErrorBoundary>
                    <Profile />
                  </ProfileErrorBoundary>
                }
              />
              <Route
                path="/profile/public/:userId"
                element={
                  <ProfileErrorBoundary>
                    <PublicProfilePage />
                  </ProfileErrorBoundary>
                }
              />
              <Route
                path="/profile/edit"
                element={
                  <ProfileErrorBoundary>
                    <EditProfilePage />
                  </ProfileErrorBoundary>
                }
              />
              {/* <Route path="*" element={<NotFound />} /> */}
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </Tooltip.Provider>
    </QueryClientProvider>
  );
};

export default App;


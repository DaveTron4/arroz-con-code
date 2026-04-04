import { createBrowserRouter } from "react-router";
import RootLayout from "./layouts/RootLayout";
import AppLayout from "./layouts/AppLayout";
import ProtectedRoute from "./components/ProtectedRoute";
import LandingPage from "./pages/LandingPage";
import SignUpPage from "./pages/SignUpPage";
import SignInPage from "./pages/SignInPage";
import ChatPage from "./pages/ChatPage";
import CommunityBoardPage from "./pages/CommunityBoardPage";
import PostDetailPage from "./pages/PostDetailPage";
import CreatePostPage from "./pages/CreatePostPage";
import SettingsPage from "./pages/SettingsPage";

export const router = createBrowserRouter([
  // Landing page — full navbar, marketing layout
  {
    element: <RootLayout />,
    children: [
      { path: "/", element: <LandingPage /> },
    ],
  },
  // App pages — slim top bar + bottom nav + FAB
  {
    element: <AppLayout />,
    children: [
      { path: "/signup", element: <SignUpPage /> },
      { path: "/signin", element: <SignInPage /> },
      { path: "/chat", element: <ChatPage /> },
      { path: "/community", element: <CommunityBoardPage /> },
      {
        path: "/community/new",
        element: (
          <ProtectedRoute>
            <CreatePostPage />
          </ProtectedRoute>
        ),
      },
      { path: "/community/:id", element: <PostDetailPage /> },
      {
        path: "/settings",
        element: (
          <ProtectedRoute>
            <SettingsPage />
          </ProtectedRoute>
        ),
      },
    ],
  },
]);

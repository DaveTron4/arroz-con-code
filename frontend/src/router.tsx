import { createBrowserRouter } from "react-router";
import RootLayout from "./layouts/RootLayout";
import ProtectedRoute from "./components/ProtectedRoute";
import FeedPage from "./pages/FeedPage";
import SignUpPage from "./pages/SignUpPage";
import SignInPage from "./pages/SignInPage";
import PostDetailPage from "./pages/PostDetailPage";
import CreatePostPage from "./pages/CreatePostPage";
import ArticleDetailPage from "./pages/ArticleDetailPage";
import CommunityBoardPage from "./pages/CommunityBoardPage";
import ProfilePage from "./pages/ProfilePage";
import SettingsPage from "./pages/SettingsPage";

export const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      { path: "/", element: <FeedPage /> },
      { path: "/community", element: <CommunityBoardPage /> },
      { path: "/signup", element: <SignUpPage /> },
      { path: "/signin", element: <SignInPage /> },
      { path: "/login", element: <SignInPage /> },
      { path: "/post/:id", element: <PostDetailPage /> },
      {
        path: "/post/new",
        element: (
          <ProtectedRoute>
            <CreatePostPage />
          </ProtectedRoute>
        ),
      },
      { path: "/article/:id", element: <ArticleDetailPage /> },
      { path: "/profile/:id", element: <ProfilePage /> },
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

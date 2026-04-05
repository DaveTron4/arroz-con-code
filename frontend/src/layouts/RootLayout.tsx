import { useState } from "react";
import { Outlet, useLocation, useMatch } from "react-router";
import TopToolbar from "../components/TopToolbar";
import BottomNav from "../components/BottomNav";
import Sidebar from "../components/Sidebar";
import FAB from "../components/FAB";
import AISearchModal from "../components/AISearchModal";

const FAB_ROUTES = ["/", "/post/", "/article/"];

function useShouldShowFAB() {
  const location = useLocation();
  const isFeed = useMatch("/");
  const isPostDetail = useMatch("/post/:id");
  const isArticleDetail = useMatch("/article/:id");
  // Suppress on creation pages, auth pages, profile, settings
  void FAB_ROUTES;
  return Boolean(isFeed || isPostDetail || isArticleDetail) &&
    !location.pathname.endsWith("/new");
}

export default function RootLayout() {
  const showFAB = useShouldShowFAB();
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white">
      {/* Mobile: top toolbar (sticky) */}
      <TopToolbar onOpenSearch={() => setSearchOpen(true)} />

      <div className="flex">
        {/* Tablet+: left sidebar */}
        <Sidebar onOpenSearch={() => setSearchOpen(true)} />

        {/* Main content — pb-16 reserves space for mobile bottom nav */}
        <main className="flex-1 pb-16 md:pb-0">
          <Outlet />
        </main>
      </div>

      {/* Floating action button — shown on feed and post/article detail pages */}
      {showFAB && <FAB />}

      {/* Mobile: bottom sticky nav */}
      <BottomNav />

      {/* AI Search Modal */}
      <AISearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </div>
  );
}

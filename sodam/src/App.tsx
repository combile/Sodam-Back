import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import Header from "./components/Header.tsx";
import Footer from "./components/Footer.tsx";
import ScrollToTop from "./components/ScrollToTop.tsx";
import Home from "./pages/home/Home.tsx";
import Login from "./pages/Login.tsx";
import Signup from "./pages/signUp/SignupPage.tsx";
import SplashScreen from "./components/SplashScreen.tsx";
import SodamIntro from "./pages/introduce/sodam.tsx";
import PolicyList from "./pages/policy/PolicyList.tsx";
import ConsultPage from "./pages/policy/consult/ConsultPage.tsx";
import CasesPage from "./pages/policy/cases/CasesPage.tsx";
import MarketAnalysisPage from "./pages/market-analysis/MarketAnalysisPage.tsx";
import MapVisualizationPage from "./pages/map-visualization/MapVisualizationPage.tsx";
import MyPage from "./pages/MyPage.tsx";
import DamsoPage from "./pages/damso/DamsoPage.tsx";
import PostDetailPage from "./pages/damso/PostDetailPage.tsx";
import TodayCeoPage from "./pages/today-ceo/TodayCeoPage.tsx";
import TomorrowCeoPage from "./pages/tomorrow-ceo/TomorrowCeoPage.tsx";

const AppContent = () => {
  const location = useLocation();
  const isMarketAnalysisPage = location.pathname === "/market-analysis";

  return (
    <>
      <ScrollToTop />
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/about" element={<SodamIntro />} />
          <Route path="/policy/list" element={<PolicyList />} />
          <Route path="/policy/consult" element={<ConsultPage />} />
          <Route path="/policy/cases" element={<CasesPage />} />
          <Route path="/market-analysis" element={<MarketAnalysisPage />} />
          <Route path="/map-visualization" element={<MapVisualizationPage />} />
          <Route path="/mypage" element={<MyPage />} />
          <Route path="/damso" element={<DamsoPage />} />
          <Route path="/damso/posts/:postId" element={<PostDetailPage />} />
          <Route path="/today-ceo" element={<TodayCeoPage />} />
          <Route path="/tomorrow-ceo" element={<TomorrowCeoPage />} />
          {/* 추가적으로 회원가입, 비밀번호 찾기 라우트도 연결 가능 */}
        </Routes>
      </main>
      {!isMarketAnalysisPage && <Footer />}
    </>
  );
};

const App = () => {
  const [showSplash, setShowSplash] = useState(true);

  if (showSplash) {
    return <SplashScreen duration={3000} onDone={() => setShowSplash(false)} />;
  }

  return (
    <Router>
      <AppContent />
    </Router>
  );
};

export default App;

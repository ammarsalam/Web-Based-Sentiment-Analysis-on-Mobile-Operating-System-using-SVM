/*import './App.css'
import phoneIcon from './assets/phone_icon1.png'
import phoneBackground from './assets/Phone Background.jpg'

function App() {
  return (
    <div className="app-container">
      <div className="background-image" style={{ backgroundImage: `url(${phoneBackground})` }}></div>
      <div className="content-section">
        <div className="text-section">
          <h1>
            Sentiment Analysis On <br />
            Security Concerns In Mobile <br />
            Operating System (OS) <br />
            Through Online Discussion
          </h1>
          <button className="home-button">
            <span className="play-icon">▶</span> Home Page
          </button>
        </div>
        <div className="image-section">
          <img src={phoneIcon} alt="Mobile phone with wallet" className="main-image" />
        </div>
      </div>
    </div>
  )
}

export default App
*/


import { Routes, Route, useNavigate } from 'react-router-dom';
import phoneIcon from './assets/phone_icon1.png'
import phoneBackground from './assets/Phone Background.jpg'
import OverviewBackground from './background/OverviewBackground';
import UsersBackground from './background/UsersBackground';
import OverviewTestBackground from './background/OverviewTestBackground';
import DashboardBackground from './background/DashboardBackground';
import AndroidBackground from './background/AndroidBackground';
import IosBackground from './background/IosBackground';
import HarmonyosBackground from './background/HarmonyosBackground';
import SingleAnalyzerBackground from './background/SingleAnalyzerBackground';
import MultiAnalyzerBackground from './background/MultiAnalyzerBackground';
import RealTimeAnalyzer from './pages/RealTimeAnalyzerPage';
import RealTimeAnalyzerBackground from './background/RealTimeAnalyzerBackground';

function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gray-100 overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center z-0"
        style={{ backgroundImage: `url(${phoneBackground})` }}
      ></div>

      <div className="relative z-10 flex flex-col md:flex-row items-center justify-between px-6 md:px-16 py-12 bg-white/10 rounded-2xl shadow-lg backdrop-blur-md max-w-6xl w-full">
        <div className="text-center md:text-left md:w-1/2 mb-8 md:mb-0">
          <h1 className="text-3xl md:text-5xl font-bold text-white leading-snug mb-6">
            Sentiment Analysis On <br />
            Security Concerns In  <br />
            Mobile Operating System (OS) Through<br />
            Online Discussion <br/>
            Using SVM
          </h1>
          <button
            onClick={() => navigate('/overview')}
            className="inline-flex items-center px-6 py-3 bg-blue-700 text-white rounded-2xl text-lg font-semibold hover:bg-blue-900 transition duration-300"
          >
            <span className="mr-2">▶</span> Get Started
          </button>
        </div>

        <div className="md:w-1/2 flex justify-center">
          <img
            src={phoneIcon}
            alt="Mobile phone with wallet"
            className="w-64 md:w-80 object-contain"
          />
        </div>
      </div>

      {/* Copyright */}
      <p className="absolute bottom-4 w-full text-center text-white text-lg z-10">
        © 2025 Muhammad Ammar Mirza Bin Salam. UiTM Jasin, Melaka.
      </p>
    </div>
  );
}

function App() {
  return (
    
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/overview" element={<div><OverviewTestBackground /> </div>} />
      <Route path="/dashboard" element={<div><DashboardBackground /> </div>} />
      <Route path="/android" element={<div><AndroidBackground /> </div>} />
      <Route path="/ios" element={<div><IosBackground /> </div>} />
      <Route path="/harmonyos" element={<div><HarmonyosBackground /> </div>} />
      <Route path="/single" element={<div><SingleAnalyzerBackground /> </div>} />
      <Route path="/multiple" element={<div><MultiAnalyzerBackground /> </div>} />
      <Route path="/realtime" element={<div><RealTimeAnalyzerBackground /> </div>} />
    </Routes>

  );
}

export default App;
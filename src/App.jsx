import { Routes, Route, Navigate } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import DashboardLayout from './pages/dashboard/DashboardLayout'
import OverviewPage from './pages/dashboard/OverviewPage'
import ListingsPage from './pages/dashboard/ListingsPage'
import ChatbotAnalyticsPage from './pages/dashboard/ChatbotAnalyticsPage'
import HeatmapPage from './pages/dashboard/HeatmapPage'
import SeoPage from './pages/dashboard/SeoPage'
import AnalyticsPage from './pages/dashboard/AnalyticsPage'
import TeamPage from './pages/dashboard/TeamPage'
import SettingsPage from './pages/dashboard/SettingsPage'

export default function App() {
  return (
    <HelmetProvider>
      <Routes>
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<OverviewPage />} />
          <Route path="listings" element={<ListingsPage />} />
          <Route path="chatbot" element={<ChatbotAnalyticsPage />} />
          <Route path="heatmap" element={<HeatmapPage />} />
          <Route path="seo" element={<SeoPage />} />
          <Route path="analytics" element={<AnalyticsPage />} />
          <Route path="team" element={<TeamPage />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </HelmetProvider>
  )
}

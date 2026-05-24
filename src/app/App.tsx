import { Navigate, Route, Routes } from 'react-router-dom';
import { AppShell } from '@/components/layout/AppShell';
import { AIPage } from '@/routes/AIPage';
import { AIProxyStatusPage } from '@/routes/AIProxyStatusPage';
import { AICreditsPage } from '@/routes/AICreditsPage';
import { AccountPreviewPage } from '@/routes/AccountPreviewPage';
import { AdminDashboardPage } from '@/routes/AdminDashboardPage';
import { AnalyzePage } from '@/routes/AnalyzePage';
import { AnalysisHistoryPage } from '@/routes/AnalysisHistoryPage';
import { AppHomePage } from '@/routes/AppHomePage';
import { ArticlesPage } from '@/routes/ArticlesPage';
import { AuthGooglePage } from '@/routes/AuthProviderMockPage';
import { AuthLinePage } from '@/routes/AuthLinePage';
import { AuthLinkingPage } from '@/routes/AuthLinkingPage';
import { AuthPage } from '@/routes/AuthPage';
import { AuthPhonePage } from '@/routes/AuthPhonePage';
import { AuthPhoneStagingPage } from '@/routes/AuthPhoneStagingPage';
import { AuthStatusPage } from '@/routes/AuthStatusPage';
import { AuthSyncPreviewPage } from '@/routes/AuthSyncPreviewPage';
import { CalculatorExportPreviewPage } from '@/routes/CalculatorExportPreviewPage';
import { CalculatorQAPage } from '@/routes/CalculatorQAPage';
import { CalculatorSafetyPage } from '@/routes/CalculatorSafetyPage';
import { CalculatorSavedResultsPage } from '@/routes/CalculatorSavedResultsPage';
import { CalculatorsPage } from '@/routes/CalculatorsPage';
import { CommunityPage } from '@/routes/CommunityPage';
import { CommunityRulesPage } from '@/routes/CommunityRulesPage';
import { ArticleDetailPage } from '@/routes/ArticleDetailPage';
import { CostCalculatorPage } from '@/routes/CostCalculatorPage';
import { GuestSyncEdgePage } from '@/routes/GuestSyncEdgePage';
import { GuestSyncStatusPage } from '@/routes/GuestSyncStatusPage';
import { FarmAreaGuidePage } from '@/routes/FarmAreaGuidePage';
import { FarmAreaPage } from '@/routes/FarmAreaPage';
import { FertilizerCalculatorPage } from '@/routes/FertilizerCalculatorPage';
import { ImagePrivacyPage } from '@/routes/ImagePrivacyPage';
import { ImagePreflightPage } from '@/routes/ImagePreflightPage';
import { LandingPage } from '@/routes/LandingPage';
import { MemoryPage } from '@/routes/MemoryPage';
import { ModerationCenterPage } from '@/routes/ModerationCenterPage';
import { MvpSnapshotPage } from '@/routes/MvpSnapshotPage';
import { MyFarmPage } from '@/routes/MyFarmPage';
import { MyFarmSettingsPage } from '@/routes/MyFarmSettingsPage';
import { NextPhasePage } from '@/routes/NextPhasePage';
import { NotificationSettingsPage } from '@/routes/NotificationSettingsPage';
import { NotificationsPage } from '@/routes/NotificationsPage';
import { PlantSpacingCalculatorPage } from '@/routes/PlantSpacingCalculatorPage';
import { PriceDetailPage } from '@/routes/PriceDetailPage';
import { PricesPage } from '@/routes/PricesPage';
import { ProfilePage } from '@/routes/ProfilePage';
import { QAPage } from '@/routes/QAPage';
import { SavedArticlesPage } from '@/routes/SavedArticlesPage';
import { SavedVideosPage } from '@/routes/SavedVideosPage';
import { SprayMixCalculatorPage } from '@/routes/SprayMixCalculatorPage';
import { SupabaseConnectionPage } from '@/routes/SupabaseConnectionPage';
import { SupabaseReadinessPage } from '@/routes/SupabaseReadinessPage';
import { SupabaseReadonlyProbePage } from '@/routes/SupabaseReadonlyProbePage';
import { SupabaseSetupGuidePage } from '@/routes/SupabaseSetupGuidePage';
import { SupabaseSqlChecklistPage } from '@/routes/SupabaseSqlChecklistPage';
import { WeatherPage } from '@/routes/WeatherPage';
import { YoutubeVideoDetailPage } from '@/routes/YoutubeVideoDetailPage';
import { YoutubePage } from '@/routes/YoutubePage';
import { ContentAdminPreviewPage } from '@/routes/ContentAdminPreviewPage';
import { CropWatchPage } from '@/routes/CropWatchPage';
import { EnvSafetyPage } from '@/routes/EnvSafetyPage';
import { YieldEstimateCalculatorPage } from '@/routes/YieldEstimateCalculatorPage';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/app" element={<AppShell />}>
        <Route index element={<AppHomePage />} />
        <Route path="youtube" element={<YoutubePage />} />
        <Route path="admin" element={<AdminDashboardPage />} />
        <Route path="supabase-readiness" element={<SupabaseReadinessPage />} />
        <Route path="supabase-connection" element={<SupabaseConnectionPage />} />
        <Route path="supabase-readonly-probe" element={<SupabaseReadonlyProbePage />} />
        <Route path="supabase-setup-guide" element={<SupabaseSetupGuidePage />} />
        <Route path="supabase-sql-checklist" element={<SupabaseSqlChecklistPage />} />
        <Route path="env-safety" element={<EnvSafetyPage />} />
        <Route path="youtube/:videoId" element={<YoutubeVideoDetailPage />} />
        <Route path="ai" element={<AIPage />} />
        <Route path="ai-proxy-status" element={<AIProxyStatusPage />} />
        <Route path="ai-credits" element={<AICreditsPage />} />
        <Route path="qa" element={<QAPage />} />
        <Route path="mvp-snapshot" element={<MvpSnapshotPage />} />
        <Route path="next-phase" element={<NextPhasePage />} />
        <Route path="weather" element={<WeatherPage />} />
        <Route path="calculators" element={<CalculatorsPage />} />
        <Route path="calculators/safety" element={<CalculatorSafetyPage />} />
        <Route path="calculators/qa" element={<CalculatorQAPage />} />
        <Route path="calculators/saved-results" element={<CalculatorSavedResultsPage />} />
        <Route path="calculators/export-preview" element={<CalculatorExportPreviewPage />} />
        <Route path="calculators/spray-mix" element={<SprayMixCalculatorPage />} />
        <Route path="calculators/plant-spacing" element={<PlantSpacingCalculatorPage />} />
        <Route path="calculators/fertilizer" element={<FertilizerCalculatorPage />} />
        <Route path="calculators/yield-estimate" element={<YieldEstimateCalculatorPage />} />
        <Route path="calculators/cost" element={<CostCalculatorPage />} />
        <Route path="farm-area" element={<FarmAreaPage />} />
        <Route path="farm-area-guide" element={<FarmAreaGuidePage />} />
        <Route path="analyze" element={<AnalyzePage />} />
        <Route path="analysis-history" element={<AnalysisHistoryPage />} />
        <Route path="image-privacy" element={<ImagePrivacyPage />} />
        <Route path="image-preflight" element={<ImagePreflightPage />} />
        <Route path="community" element={<CommunityPage />} />
        <Route path="community-rules" element={<CommunityRulesPage />} />
        <Route path="moderation-center" element={<ModerationCenterPage />} />
        <Route path="prices" element={<PricesPage />} />
        <Route path="prices/:priceId" element={<PriceDetailPage />} />
        <Route path="crop-watch" element={<CropWatchPage />} />
        <Route path="articles" element={<ArticlesPage />} />
        <Route path="articles/:articleId" element={<ArticleDetailPage />} />
        <Route path="content-admin-preview" element={<ContentAdminPreviewPage />} />
        <Route path="notifications" element={<NotificationsPage />} />
        <Route path="notification-settings" element={<NotificationSettingsPage />} />
        <Route path="profile" element={<ProfilePage />} />
        <Route path="account-preview" element={<AccountPreviewPage />} />
        <Route path="guest-sync-edge" element={<GuestSyncEdgePage />} />
        <Route path="guest-sync-status" element={<GuestSyncStatusPage />} />
        <Route path="auth" element={<AuthPage />} />
        <Route path="auth/status" element={<AuthStatusPage />} />
        <Route path="auth/linking" element={<AuthLinkingPage />} />
        <Route path="auth/phone" element={<AuthPhonePage />} />
        <Route path="auth/phone-staging" element={<AuthPhoneStagingPage />} />
        <Route path="auth/line" element={<AuthLinePage />} />
        <Route path="auth/google" element={<AuthGooglePage />} />
        <Route path="auth/sync-preview" element={<AuthSyncPreviewPage />} />
        <Route path="memory" element={<MemoryPage />} />
        <Route path="my-farm" element={<MyFarmPage />} />
        <Route path="my-farm/settings" element={<MyFarmSettingsPage />} />
        <Route path="saved-articles" element={<SavedArticlesPage />} />
        <Route path="saved-videos" element={<SavedVideosPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

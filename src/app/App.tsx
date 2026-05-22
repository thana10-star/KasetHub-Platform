import { Navigate, Route, Routes } from 'react-router-dom';
import { AppShell } from '@/components/layout/AppShell';
import { AIPage } from '@/routes/AIPage';
import { AIProxyStatusPage } from '@/routes/AIProxyStatusPage';
import { AICreditsPage } from '@/routes/AICreditsPage';
import { AccountPreviewPage } from '@/routes/AccountPreviewPage';
import { AnalyzePage } from '@/routes/AnalyzePage';
import { AnalysisHistoryPage } from '@/routes/AnalysisHistoryPage';
import { AppHomePage } from '@/routes/AppHomePage';
import { ArticlesPage } from '@/routes/ArticlesPage';
import { AuthGooglePage } from '@/routes/AuthProviderMockPage';
import { AuthLinePage } from '@/routes/AuthLinePage';
import { AuthLinkingPage } from '@/routes/AuthLinkingPage';
import { AuthPage } from '@/routes/AuthPage';
import { AuthPhonePage } from '@/routes/AuthPhonePage';
import { AuthStatusPage } from '@/routes/AuthStatusPage';
import { AuthSyncPreviewPage } from '@/routes/AuthSyncPreviewPage';
import { CommunityPage } from '@/routes/CommunityPage';
import { ArticleDetailPage } from '@/routes/ArticleDetailPage';
import { GuestSyncStatusPage } from '@/routes/GuestSyncStatusPage';
import { ImagePrivacyPage } from '@/routes/ImagePrivacyPage';
import { LandingPage } from '@/routes/LandingPage';
import { MemoryPage } from '@/routes/MemoryPage';
import { MyFarmPage } from '@/routes/MyFarmPage';
import { NotificationsPage } from '@/routes/NotificationsPage';
import { PriceDetailPage } from '@/routes/PriceDetailPage';
import { PricesPage } from '@/routes/PricesPage';
import { ProfilePage } from '@/routes/ProfilePage';
import { QAPage } from '@/routes/QAPage';
import { SavedArticlesPage } from '@/routes/SavedArticlesPage';
import { SavedVideosPage } from '@/routes/SavedVideosPage';
import { YoutubeVideoDetailPage } from '@/routes/YoutubeVideoDetailPage';
import { YoutubePage } from '@/routes/YoutubePage';
import { ContentAdminPreviewPage } from '@/routes/ContentAdminPreviewPage';
import { CropWatchPage } from '@/routes/CropWatchPage';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/app" element={<AppShell />}>
        <Route index element={<AppHomePage />} />
        <Route path="youtube" element={<YoutubePage />} />
        <Route path="youtube/:videoId" element={<YoutubeVideoDetailPage />} />
        <Route path="ai" element={<AIPage />} />
        <Route path="ai-proxy-status" element={<AIProxyStatusPage />} />
        <Route path="ai-credits" element={<AICreditsPage />} />
        <Route path="qa" element={<QAPage />} />
        <Route path="analyze" element={<AnalyzePage />} />
        <Route path="analysis-history" element={<AnalysisHistoryPage />} />
        <Route path="image-privacy" element={<ImagePrivacyPage />} />
        <Route path="community" element={<CommunityPage />} />
        <Route path="prices" element={<PricesPage />} />
        <Route path="prices/:priceId" element={<PriceDetailPage />} />
        <Route path="crop-watch" element={<CropWatchPage />} />
        <Route path="articles" element={<ArticlesPage />} />
        <Route path="articles/:articleId" element={<ArticleDetailPage />} />
        <Route path="content-admin-preview" element={<ContentAdminPreviewPage />} />
        <Route path="notifications" element={<NotificationsPage />} />
        <Route path="profile" element={<ProfilePage />} />
        <Route path="account-preview" element={<AccountPreviewPage />} />
        <Route path="guest-sync-status" element={<GuestSyncStatusPage />} />
        <Route path="auth" element={<AuthPage />} />
        <Route path="auth/status" element={<AuthStatusPage />} />
        <Route path="auth/linking" element={<AuthLinkingPage />} />
        <Route path="auth/phone" element={<AuthPhonePage />} />
        <Route path="auth/line" element={<AuthLinePage />} />
        <Route path="auth/google" element={<AuthGooglePage />} />
        <Route path="auth/sync-preview" element={<AuthSyncPreviewPage />} />
        <Route path="memory" element={<MemoryPage />} />
        <Route path="my-farm" element={<MyFarmPage />} />
        <Route path="saved-articles" element={<SavedArticlesPage />} />
        <Route path="saved-videos" element={<SavedVideosPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

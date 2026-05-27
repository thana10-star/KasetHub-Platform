import {
  Bell,
  Camera,
  Copy,
  EyeOff,
  Flag,
  Heart,
  Link as LinkIcon,
  LogIn,
  MessageCircle,
  RefreshCw,
  Reply,
  Send,
  Share2,
  ShieldCheck,
  Trash2,
  UserCheck,
  UsersRound,
} from 'lucide-react';
import type { ChangeEvent, FormEvent } from 'react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { PageHeader } from '@/components/layout/PageHeader';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { NoticeBox } from '@/components/ui/NoticeBox';
import { publicEnv } from '@/config/env';
import {
  applyCommunityLikeUiState,
  applyCommunityCommentLikeUiState,
  canUseTopLevelCommunityCommentSubmit,
  communityCompactActionButtonClass,
  communityCompactActionIconClass,
  communityDisabledImageCopy,
  getCommunityCommentSubmitText,
  getCommunityComposerBadgeTone,
  getCommunityComposerStatusLabel,
  getCommunityComposerSubmitLabel,
  getCommunityDisabledInputCopy,
  getCommunityRepliesForComment,
  getCommunityTextInputValue,
  getCommunityWriteStatusCopy,
  getSafeCommunityComments,
  getTopLevelCommunityComments,
  formatCommunityTime,
  reconcileCommunityCommentsAfterLikeRefresh,
  reconcileCommunityPostsAfterLikeRefresh,
  updateCommunityCommentDraft,
} from '@/routes/community-page-helpers';
import {
  getCachedSupabaseAuthSessionSnapshot,
  getCurrentSupabaseAuthSession,
  subscribeToSupabaseAuthSession,
  type SupabaseAuthSessionSnapshot,
} from '@/services/auth/supabase-auth-session';
import {
  communitySignInGateMessage,
  createCommunityService,
  getCommunityReadiness,
} from '@/services/community/community-service';
import {
  communityImagePolicy,
  validateCommunityImageFile,
} from '@/services/community/community-storage-service';
import {
  communityPostCategories,
  communityReportReasonLabels,
  communityReportReasons,
  type CommunityActionResult,
  type CommunityComment,
  type CommunityPost,
  type CommunityPostCategory,
  type CommunityReadiness,
  type CommunityReportReason,
  type CommunityService,
} from '@/services/community/community.types';

const safetyNotes = [
  'อย่าใส่เบอร์โทร ที่อยู่ หรือข้อมูลส่วนตัวสำคัญ',
  'ข้อมูลจากชุมชนควรตรวจสอบก่อนนำไปใช้จริง',
  'เรื่องสารเคมีควรตรวจฉลากและคำแนะนำเจ้าหน้าที่ก่อนใช้',
];

const successReportMessage = 'ขอบคุณที่แจ้ง ทีมงานจะตรวจสอบ';

type CommunityPageProps = {
  readinessOverride?: CommunityReadiness;
  serviceOverride?: CommunityService;
  initialPosts?: CommunityPost[];
  initialCommentsByPost?: Record<string, CommunityComment[]>;
  initialOpenCommentsByPost?: Record<string, boolean>;
};

function getCommunityShareUrl() {
  if (typeof window === 'undefined') {
    return '/app/community';
  }

  return new URL('/app/community', window.location.origin).toString();
}

function getCommunityImagePublicUrl(imagePath?: string) {
  if (!imagePath || !publicEnv.supabaseUrl) {
    return '';
  }

  const encodedPath = imagePath.split('/').map(encodeURIComponent).join('/');
  return `${publicEnv.supabaseUrl.replace(/\/$/, '')}/storage/v1/object/public/${communityImagePolicy.bucketName}/${encodedPath}`;
}

function getActionMessage(result: CommunityActionResult, fallback: string) {
  return result.ok ? fallback : result.message;
}

export function CommunityPage({
  readinessOverride,
  serviceOverride,
  initialPosts = [],
  initialCommentsByPost = {},
  initialOpenCommentsByPost = {},
}: CommunityPageProps = {}) {
  const baseReadiness = useMemo(() => readinessOverride ?? getCommunityReadiness(), [readinessOverride]);
  const [authSession, setAuthSession] = useState<SupabaseAuthSessionSnapshot>(
    () => getCachedSupabaseAuthSessionSnapshot(),
  );
  const readiness = useMemo(() => {
    if (readinessOverride) return readinessOverride;

    const hasAuthenticatedUser = baseReadiness.hasAuthenticatedUser || authSession.isSignedIn;
    const canWrite =
      baseReadiness.writesFeatureFlagEnabled &&
      hasAuthenticatedUser &&
      baseReadiness.canReadPublishedPosts &&
      baseReadiness.backendServiceReady;

    return {
      ...baseReadiness,
      path: canWrite ? 'real' as const : 'gated' as const,
      canWrite,
      canUploadImage: canWrite,
      hasAuthenticatedUser,
      writeGateMessage: baseReadiness.writesFeatureFlagEnabled && !hasAuthenticatedUser
        ? communitySignInGateMessage
        : baseReadiness.writeGateMessage,
      blockers: hasAuthenticatedUser
        ? baseReadiness.blockers.filter((blocker) => blocker.code !== 'auth_session_required')
        : baseReadiness.blockers,
    };
  }, [authSession.isSignedIn, baseReadiness, readinessOverride]);
  const service = useMemo(
    () => serviceOverride ?? createCommunityService(readiness),
    [readiness, serviceOverride],
  );
  const canWrite = readiness.canWrite;
  const [posts, setPosts] = useState<CommunityPost[]>(() => initialPosts);
  const [commentsByPost, setCommentsByPost] = useState<Record<string, CommunityComment[]>>(
    () => initialCommentsByPost,
  );
  const [openCommentsByPost, setOpenCommentsByPost] = useState<Record<string, boolean>>(
    () => initialOpenCommentsByPost,
  );
  const [commentTextByPost, setCommentTextByPost] = useState<Record<string, string>>({});
  const [commentStatusByPost, setCommentStatusByPost] = useState<Record<string, string>>({});
  const [submittingCommentByPost, setSubmittingCommentByPost] = useState<Record<string, boolean>>({});
  const [replyTextByComment, setReplyTextByComment] = useState<Record<string, string>>({});
  const [replyingToByPost, setReplyingToByPost] = useState<Record<string, string | undefined>>({});
  const [reportReasonByPost, setReportReasonByPost] = useState<Record<string, CommunityReportReason>>({});
  const [selectedCategory, setSelectedCategory] = useState<CommunityPostCategory>('ปัญหาพืช');
  const [activeFilter, setActiveFilter] = useState<CommunityPostCategory | 'ทั้งหมด'>('ทั้งหมด');
  const [postText, setPostText] = useState('');
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imageStatus, setImageStatus] = useState('');
  const [actionStatus, setActionStatus] = useState('');
  const [shareStatus, setShareStatus] = useState<string>('');
  const [isLoadingFeed, setIsLoadingFeed] = useState(false);
  const [isSubmittingPost, setIsSubmittingPost] = useState(false);

  const fetchPosts = useCallback(async () => {
    const result = await service.listPosts();
    return Array.isArray(result.posts) ? result.posts : [];
  }, [service]);

  const loadPosts = useCallback(async () => {
    setIsLoadingFeed(true);
    try {
      setPosts(await fetchPosts());
    } catch {
      setActionStatus('โหลดโพสต์ไม่สำเร็จ ลองรีเฟรชอีกครั้ง');
    } finally {
      setIsLoadingFeed(false);
    }
  }, [fetchPosts]);

  useEffect(() => {
    void loadPosts();
  }, [loadPosts]);

  useEffect(() => {
    if (readinessOverride) return undefined;

    let active = true;
    void getCurrentSupabaseAuthSession().then((snapshot) => {
      if (active) setAuthSession(snapshot);
    });
    const unsubscribe = subscribeToSupabaseAuthSession((snapshot) => {
      if (active) setAuthSession(snapshot);
    });

    return () => {
      active = false;
      unsubscribe();
    };
  }, [readinessOverride]);

  const filteredPosts = useMemo(
    () => (activeFilter === 'ทั้งหมด' ? posts : posts.filter((post) => post.category === activeFilter)),
    [activeFilter, posts],
  );

  const shareText = 'ชุมชนเกษตร KasetHub: อ่าน แบ่งปัน และถามปัญหาเกษตรกับคนทำเกษตร';
  const shareUrl = getCommunityShareUrl();
  const encodedShareText = encodeURIComponent(`${shareText} ${shareUrl}`);
  const encodedShareUrl = encodeURIComponent(shareUrl);
  const writeStatusCopy = getCommunityWriteStatusCopy(readiness);
  const writeStatusTitle = canWrite
    ? 'พร้อมเขียนโพสต์'
    : readiness.writesFeatureFlagEnabled && !readiness.hasAuthenticatedUser
      ? 'เข้าสู่ระบบเพื่อเขียนโพสต์'
      : 'ยังไม่เปิดเขียนโพสต์';
  const disabledInputCopy = getCommunityDisabledInputCopy(readiness);

  async function handleShare() {
    const payload = {
      title: 'ชุมชนเกษตร',
      text: shareText,
      url: shareUrl,
    };

    try {
      if (typeof navigator !== 'undefined' && navigator.share) {
        await navigator.share(payload);
        setShareStatus('เปิดหน้าต่างแชร์แล้ว');
        return;
      }

      if (typeof navigator !== 'undefined' && navigator.clipboard) {
        await navigator.clipboard.writeText(shareUrl);
        setShareStatus('คัดลอกลิงก์แล้ว');
        return;
      }

      setShareStatus('คัดลอกลิงก์จากช่องที่แสดงได้');
    } catch {
      setShareStatus('ยังแชร์ไม่ได้ในอุปกรณ์นี้');
    }
  }

  function handleImageChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.currentTarget.files?.[0];
    if (!file) {
      setSelectedImage(null);
      setImageStatus('');
      return;
    }

    const validation = validateCommunityImageFile(file);
    if (!validation.ok) {
      setSelectedImage(null);
      setImageStatus(validation.message);
      event.currentTarget.value = '';
      return;
    }

    setSelectedImage(file);
    setImageStatus(`เลือกแล้ว: ${file.name}`);
  }

  async function handleCreatePost(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!canWrite) {
      setActionStatus(writeStatusCopy);
      return;
    }

    setIsSubmittingPost(true);
    let result: Awaited<ReturnType<CommunityService['createPost']>>;
    try {
      result = await service.createPost({
        contentText: postText,
        category: selectedCategory,
        image: selectedImage ?? undefined,
      });
    } catch {
      setIsSubmittingPost(false);
      setActionStatus('โพสต์ไม่สำเร็จ ลองอีกครั้ง');
      return;
    }
    setIsSubmittingPost(false);

    if (result.ok) {
      setPostText('');
      setSelectedImage(null);
      setImageStatus('');
      setActionStatus('โพสต์แล้ว');
      setPosts((currentPosts) => [result.data, ...currentPosts]);
      return;
    }

    setActionStatus(result.message);
  }

  async function loadComments(postId: string) {
    if (!postId) {
      setActionStatus('เปิดคอมเมนต์ไม่สำเร็จ ลองรีเฟรชโพสต์อีกครั้ง');
      return;
    }

    try {
      const result = await service.listComments(postId);
      if (result.ok) {
        setCommentsByPost((current) => ({ ...current, [postId]: getSafeCommunityComments(result.data) }));
      } else {
        setCommentsByPost((current) => ({ ...current, [postId]: getSafeCommunityComments(current[postId]) }));
        setActionStatus(result.message);
      }
    } catch {
      setCommentsByPost((current) => ({ ...current, [postId]: getSafeCommunityComments(current[postId]) }));
      setActionStatus('โหลดคอมเมนต์ไม่สำเร็จ แต่หน้านี้ยังใช้งานได้');
    }
  }

  async function handleToggleComments(postId: string) {
    if (!postId) {
      setActionStatus('เปิดคอมเมนต์ไม่สำเร็จ ลองรีเฟรชโพสต์อีกครั้ง');
      return;
    }

    try {
      const willOpen = !openCommentsByPost[postId];
      setOpenCommentsByPost((current) => ({ ...current, [postId]: willOpen }));
      if (willOpen && !commentsByPost[postId]) {
        await loadComments(postId);
      }
    } catch {
      setOpenCommentsByPost((current) => ({ ...current, [postId]: true }));
      setCommentsByPost((current) => ({ ...current, [postId]: getSafeCommunityComments(current[postId]) }));
      setActionStatus('เปิดคอมเมนต์ไม่สำเร็จ แต่หน้านี้ยังใช้งานได้');
    }
  }

  async function handleCreateComment(postId: string) {
    if (!postId) {
      setActionStatus('ส่งคอมเมนต์ไม่สำเร็จ ลองรีเฟรชโพสต์อีกครั้ง');
      return;
    }

    if (!canWrite) {
      setActionStatus(writeStatusCopy);
      setCommentStatusByPost((current) => ({ ...current, [postId]: writeStatusCopy }));
      return;
    }

    const contentText = getCommunityCommentSubmitText(commentTextByPost, postId);
    if (!contentText) {
      setActionStatus('กรุณาเขียนคอมเมนต์');
      setCommentStatusByPost((current) => ({ ...current, [postId]: 'กรุณาเขียนคอมเมนต์' }));
      return;
    }

    setSubmittingCommentByPost((current) => ({ ...current, [postId]: true }));
    try {
      const result = await service.createComment(postId, {
        contentText,
      });
      if (result.ok) {
        setCommentTextByPost((current) => ({ ...current, [postId]: '' }));
        setCommentStatusByPost((current) => ({ ...current, [postId]: 'ส่งคอมเมนต์แล้ว' }));
        setCommentsByPost((current) => ({
          ...current,
          [postId]: [...getSafeCommunityComments(current[postId]), result.data],
        }));
        setPosts((currentPosts) =>
          currentPosts.map((post) =>
            post.id === postId
              ? { ...post, commentCount: Math.max(0, post.commentCount ?? 0) + 1 }
              : post,
          ),
        );
        setActionStatus('ส่งคอมเมนต์แล้ว');
        void loadPosts();
        return;
      }

      setActionStatus(result.message);
      setCommentStatusByPost((current) => ({ ...current, [postId]: result.message }));
    } catch {
      setActionStatus('ส่งคอมเมนต์ไม่สำเร็จ ลองอีกครั้ง');
      setCommentStatusByPost((current) => ({ ...current, [postId]: 'ส่งคอมเมนต์ไม่สำเร็จ ลองอีกครั้ง' }));
    } finally {
      setSubmittingCommentByPost((current) => ({ ...current, [postId]: false }));
    }
  }

  function handleSubmitTopLevelComment(event: FormEvent<HTMLFormElement>, postId: string) {
    event.preventDefault();
    void handleCreateComment(postId);
  }

  async function handleCreateReply(postId: string, parentComment: CommunityComment) {
    if (!postId || !parentComment.id) {
      setActionStatus('ส่งคำตอบไม่สำเร็จ ลองรีเฟรชโพสต์อีกครั้ง');
      return;
    }

    if (parentComment.parentCommentId) {
      setActionStatus('ตอบกลับได้เฉพาะคอมเมนต์หลักใน V1');
      return;
    }

    if (!canWrite) {
      setActionStatus(writeStatusCopy);
      return;
    }

    const contentText = getCommunityCommentSubmitText(replyTextByComment, parentComment.id);
    if (!contentText) {
      setActionStatus('กรุณาเขียนคำตอบ');
      return;
    }

    try {
      const result = await service.createReply(postId, parentComment.id, {
        contentText,
        parentCommentId: parentComment.id,
      });
      if (result.ok) {
        setReplyTextByComment((current) => ({ ...current, [parentComment.id]: '' }));
        setReplyingToByPost((current) => ({ ...current, [postId]: undefined }));
        setCommentsByPost((current) => ({
          ...current,
          [postId]: [
            ...getSafeCommunityComments(current[postId]).map((comment) =>
              comment.id === parentComment.id
                ? { ...comment, replyCount: Math.max(0, comment.replyCount ?? 0) + 1 }
                : comment,
            ),
            result.data,
          ],
        }));
        setPosts((currentPosts) =>
          currentPosts.map((post) =>
            post.id === postId
              ? { ...post, commentCount: Math.max(0, post.commentCount ?? 0) + 1 }
              : post,
          ),
        );
        setActionStatus('ส่งคำตอบแล้ว');
        void loadPosts();
        return;
      }

      setActionStatus(result.message);
    } catch {
      setActionStatus('ส่งคำตอบไม่สำเร็จ ลองอีกครั้ง');
    }
  }

  async function handleLike(post: CommunityPost) {
    if (!post.id) {
      setActionStatus('อัปเดตไลก์ไม่สำเร็จ ลองรีเฟรชโพสต์อีกครั้ง');
      return;
    }

    try {
      const nextLiked = !post.likedByCurrentUser;
      const result = post.likedByCurrentUser
        ? await service.unlikePost(post.id)
        : await service.likePost(post.id);
      setActionStatus(getActionMessage(result, post.likedByCurrentUser ? 'ยกเลิกถูกใจแล้ว' : 'ถูกใจแล้ว'));
      if (result.ok) {
        setPosts((currentPosts) => applyCommunityLikeUiState(currentPosts, post.id, nextLiked));
        void fetchPosts().then((refreshedPosts) => {
          setPosts((currentPosts) =>
            reconcileCommunityPostsAfterLikeRefresh(currentPosts, refreshedPosts, post.id, nextLiked),
          );
        }).catch(() => {
          setActionStatus(nextLiked ? 'ถูกใจแล้ว' : 'ยกเลิกถูกใจแล้ว');
        });
      }
    } catch {
      setActionStatus('อัปเดตไลก์ไม่สำเร็จ ลองอีกครั้ง');
    }
  }

  function handleCommentTextChange(postId: string, value: string) {
    if (!postId) {
      setActionStatus('เขียนคอมเมนต์ไม่ได้ ลองรีเฟรชโพสต์อีกครั้ง');
      return;
    }

    setCommentTextByPost((current) => updateCommunityCommentDraft(current, postId, value));
    setCommentStatusByPost((current) => ({ ...current, [postId]: '' }));
  }

  function handleReplyTextChange(commentId: string, value: string) {
    if (!commentId) {
      setActionStatus('เขียนคำตอบไม่ได้ ลองรีเฟรชโพสต์อีกครั้ง');
      return;
    }

    setReplyTextByComment((current) => updateCommunityCommentDraft(current, commentId, value));
  }

  function handleStartReply(postId: string, commentId: string) {
    if (!postId || !commentId) {
      setActionStatus('ตอบกลับไม่ได้ ลองรีเฟรชโพสต์อีกครั้ง');
      return;
    }

    setReplyingToByPost((current) => ({ ...current, [postId]: commentId }));
  }

  function handleCancelReply(postId: string, commentId: string) {
    setReplyTextByComment((current) => ({ ...current, [commentId]: '' }));
    setReplyingToByPost((current) => ({ ...current, [postId]: undefined }));
  }

  async function handleLikeComment(postId: string, comment: CommunityComment) {
    if (!postId || !comment.id) {
      setActionStatus('ถูกใจคอมเมนต์ไม่สำเร็จ ลองรีเฟรชโพสต์อีกครั้ง');
      return;
    }

    if (!canWrite) {
      setActionStatus(writeStatusCopy);
      return;
    }

    try {
      const nextLiked = !comment.likedByCurrentUser;
      const result = comment.likedByCurrentUser
        ? await service.unlikeComment(comment.id)
        : await service.likeComment(comment.id);
      setActionStatus(getActionMessage(result, comment.likedByCurrentUser ? 'ยกเลิกถูกใจแล้ว' : 'ถูกใจแล้ว'));
      if (result.ok) {
        setCommentsByPost((current) => ({
          ...current,
          [postId]: applyCommunityCommentLikeUiState(
            getSafeCommunityComments(current[postId]),
            comment.id,
            nextLiked,
          ),
        }));
        void service.listComments(postId).then((refreshed) => {
          if (!refreshed.ok) {
            setActionStatus(refreshed.message);
            return;
          }

          setCommentsByPost((current) => ({
            ...current,
            [postId]: reconcileCommunityCommentsAfterLikeRefresh(
              getSafeCommunityComments(current[postId]),
              getSafeCommunityComments(refreshed.data),
              comment.id,
              nextLiked,
            ),
          }));
        }).catch(() => {
          setActionStatus(nextLiked ? 'ถูกใจแล้ว' : 'ยกเลิกถูกใจแล้ว');
        });
      }
    } catch {
      setActionStatus('ถูกใจคอมเมนต์ไม่สำเร็จ ลองอีกครั้ง');
    }
  }

  async function handleReportPost(postId: string) {
    const reason = reportReasonByPost[postId] ?? 'spam';
    const result = await service.reportPost(postId, { reason });
    setActionStatus(getActionMessage(result, successReportMessage));
  }

  async function handleHidePost(postId: string) {
    const result = await service.hideOwnPost(postId);
    setActionStatus(getActionMessage(result, 'ซ่อนโพสต์แล้ว'));
    if (result.ok) {
      setPosts((currentPosts) => currentPosts.filter((post) => post.id !== postId));
    }
  }

  async function handleDeletePost(postId: string) {
    const result = await service.deleteOwnPost(postId);
    setActionStatus(getActionMessage(result, 'ลบโพสต์แล้ว'));
    if (result.ok) {
      setPosts((currentPosts) => currentPosts.filter((post) => post.id !== postId));
    }
  }

  async function handleHideComment(postId: string, commentId: string) {
    const result = await service.hideOwnComment(commentId);
    setActionStatus(getActionMessage(result, 'ซ่อนคอมเมนต์แล้ว'));
    if (result.ok) {
      setCommentsByPost((current) => ({
        ...current,
        [postId]: getSafeCommunityComments(current[postId]).filter((comment) => comment.id !== commentId),
      }));
    }
  }

  return (
    <div>
      <PageHeader
        title="ชุมชนเกษตร"
        subtitle="อ่าน แบ่งปัน และถามปัญหาเกษตรกับคนทำเกษตร"
        showBack
      />

      <div className="grid gap-5 px-5 pb-24">
        <NoticeBox
          tone={canWrite ? 'success' : 'info'}
          title={writeStatusTitle}
        >
          {writeStatusCopy}
        </NoticeBox>

        {readiness.writesFeatureFlagEnabled && !readiness.hasAuthenticatedUser ? (
          <Card className="p-4" aria-labelledby="community-login-title">
            <div className="flex gap-3">
              <span className="grid h-12 w-12 shrink-0 place-items-center rounded-lg bg-kaset-mint text-kaset-deep">
                <LogIn aria-hidden="true" className="h-6 w-6" />
              </span>
              <div className="min-w-0 flex-1">
                <h2 id="community-login-title" className="text-lg font-extrabold leading-7 text-kaset-ink">
                  เข้าสู่ระบบก่อนใช้งานชุมชน
                </h2>
                <p className="mt-1 text-sm leading-6 text-slate-600">
                  เข้าสู่ระบบเพื่อเขียนโพสต์ คอมเมนต์ กดถูกใจ หรือรายงานเนื้อหา
                </p>
                <Link
                  className="mt-3 inline-flex min-h-12 w-full items-center justify-center gap-2.5 rounded-full bg-kaset-deep px-5 text-[15px] font-bold leading-5 text-white"
                  to="/app/login?next=/app/community"
                >
                  <LogIn aria-hidden="true" className="h-4 w-4" />
                  เข้าสู่ระบบ
                </Link>
              </div>
            </div>
          </Card>
        ) : null}

        {readiness.hasAuthenticatedUser ? (
          <Card className="p-4" aria-label="สถานะเข้าสู่ระบบชุมชน">
            <div className="flex items-center gap-3">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-kaset-mint text-kaset-deep">
                <UserCheck aria-hidden="true" className="h-5 w-5" />
              </span>
              <div className="min-w-0">
                <p className="font-extrabold text-kaset-ink">เข้าสู่ระบบแล้ว</p>
                <p className="mt-1 text-sm leading-6 text-slate-600">
                  {authSession.email ?? 'พร้อมเขียนโพสต์ คอมเมนต์ และกดถูกใจในชุมชน'}
                </p>
              </div>
            </div>
          </Card>
        ) : null}

        <Card className="p-4" aria-labelledby="community-composer-title">
          <form onSubmit={handleCreatePost}>
            <div className="flex gap-3">
              <span className="grid h-12 w-12 shrink-0 place-items-center rounded-lg bg-kaset-mint text-kaset-deep">
                <UsersRound aria-hidden="true" className="h-6 w-6" />
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 id="community-composer-title" className="text-lg font-extrabold leading-7 text-kaset-ink">
                    เขียนโพสต์
                  </h2>
                  <Badge tone={getCommunityComposerBadgeTone(readiness)}>
                    {getCommunityComposerStatusLabel(readiness)}
                  </Badge>
                </div>
                <p className="mt-1 text-sm leading-6 text-slate-600">
                  เล่าเรื่องฟาร์ม ถามปัญหาพืช หรือแชร์ประสบการณ์
                </p>
                <p className="mt-1 text-xs font-semibold leading-5 text-slate-500">
                  {canWrite ? 'เลือกหมวดหมู่ แนบรูปได้ 1 รูป แล้วส่งโพสต์' : writeStatusCopy}
                </p>
              </div>
            </div>

            <label className="mt-4 block text-sm font-extrabold text-kaset-ink" htmlFor="community-post-text">
              ข้อความโพสต์
            </label>
            <textarea
              className="mt-2 min-h-28 w-full rounded-lg border border-kaset-deep/10 bg-slate-50 p-3 text-sm leading-6 text-kaset-ink outline-none disabled:text-slate-500"
              disabled={!canWrite}
              id="community-post-text"
              onChange={(event) => setPostText(event.currentTarget.value)}
              placeholder={canWrite ? 'เล่าเรื่องฟาร์ม ถามปัญหาพืช หรือแชร์ประสบการณ์' : disabledInputCopy}
              value={postText}
            />

            <div className="mt-4">
              <p className="text-sm font-extrabold text-kaset-ink">หมวดหมู่</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {communityPostCategories.map((category) => (
                  <button
                    className={
                      selectedCategory === category
                        ? 'min-h-10 rounded-full bg-kaset-deep px-3 text-sm font-extrabold text-white'
                        : 'min-h-10 rounded-full bg-white px-3 text-sm font-extrabold text-kaset-deep ring-1 ring-kaset-deep/10'
                    }
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    type="button"
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-4 grid gap-2 sm:grid-cols-2">
              <label
                className={
                  canWrite
                    ? 'inline-flex min-h-12 cursor-pointer items-center justify-center gap-2.5 rounded-full bg-white px-5 text-[15px] font-bold leading-5 text-kaset-deep ring-1 ring-kaset-deep/12'
                    : 'inline-flex min-h-12 cursor-not-allowed items-center justify-center gap-2.5 rounded-full bg-white px-5 text-[15px] font-bold leading-5 text-kaset-deep opacity-60 ring-1 ring-kaset-deep/12'
                }
                htmlFor="community-image-input"
              >
                <Camera aria-hidden="true" className="h-4 w-4" />
                {canWrite ? 'แนบรูป 1 รูป' : communityDisabledImageCopy}
              </label>
              <input
                accept={communityImagePolicy.acceptedMimeTypes.join(',')}
                className="sr-only"
                disabled={!canWrite}
                id="community-image-input"
                onChange={handleImageChange}
                type="file"
              />
              <Button disabled={!canWrite || isSubmittingPost} type="submit">
                <Send aria-hidden="true" className="h-4 w-4" />
                {getCommunityComposerSubmitLabel(readiness, isSubmittingPost)}
              </Button>
            </div>

            {imageStatus ? (
              <p className="mt-3 rounded-lg bg-slate-50 p-3 text-xs font-semibold leading-5 text-slate-600">
                {imageStatus}
              </p>
            ) : null}
            {actionStatus ? (
              <p className="mt-3 rounded-lg bg-kaset-mist p-3 text-xs font-semibold leading-5 text-kaset-ink">
                {actionStatus}
              </p>
            ) : null}

            <p className="mt-3 rounded-lg bg-amber-50 p-3 text-xs font-semibold leading-5 text-amber-950">
              อย่าใส่เบอร์โทร ที่อยู่ หรือข้อมูลส่วนตัวสำคัญ
            </p>
          </form>
        </Card>

        <section aria-labelledby="community-feed-title" className="grid gap-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 id="community-feed-title" className="text-lg font-extrabold text-kaset-ink">
                โพสต์ล่าสุด
              </h2>
              <p className="mt-1 text-sm leading-6 text-slate-600">
                แสดงเฉพาะโพสต์ published จากฐานข้อมูลจริงเมื่อ Supabase พร้อม
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Badge tone="neutral">ไม่ใช้โพสต์ปลอม</Badge>
              <Button className="min-h-10 px-4 text-sm" onClick={loadPosts} variant="secondary">
                <RefreshCw aria-hidden="true" className="h-4 w-4" />
                รีเฟรช
              </Button>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {(['ทั้งหมด', ...communityPostCategories] as const).map((category) => (
              <button
                className={
                  activeFilter === category
                    ? 'min-h-10 rounded-full bg-kaset-deep px-4 text-sm font-extrabold text-white'
                    : 'min-h-10 rounded-full bg-white px-4 text-sm font-extrabold text-kaset-deep ring-1 ring-kaset-deep/10'
                }
                key={category}
                onClick={() => setActiveFilter(category)}
                type="button"
              >
                {category}
              </button>
            ))}
          </div>

          {isLoadingFeed ? (
            <Card className="border-dashed border-slate-300 bg-slate-50 p-5 text-center">
              <p className="text-sm font-extrabold text-kaset-ink">กำลังโหลดโพสต์จริง</p>
            </Card>
          ) : null}

          {!isLoadingFeed && filteredPosts.length === 0 ? (
            <Card className="border-dashed border-slate-300 bg-slate-50 p-5 text-center">
              <span className="mx-auto grid h-14 w-14 place-items-center rounded-lg bg-white text-kaset-deep shadow-soft">
                <MessageCircle aria-hidden="true" className="h-7 w-7" />
              </span>
              <h3 className="mt-3 text-lg font-extrabold text-kaset-ink">ยังไม่มีโพสต์ชุมชนจริง</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                เมื่อมีโพสต์จริง หน้านี้จะแสดงข้อมูลจากฐานข้อมูลเท่านั้น ไม่ใช้ชื่อคน ถูกใจ หรือคอมเมนต์ปลอม
              </p>
            </Card>
          ) : null}

          {filteredPosts.map((post) => {
            const comments = getSafeCommunityComments(commentsByPost[post.id]);
            const topLevelComments = getTopLevelCommunityComments(comments);
            const imageUrl = getCommunityImagePublicUrl(post.image?.imagePath);

            return (
              <Card className="p-4" key={post.id}>
                <article className="grid gap-3">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="min-w-0">
                      <Badge tone="green">{post.category}</Badge>
                      <h3 className="mt-2 text-base font-extrabold text-kaset-ink">
                        {post.authorDisplayName || 'ผู้ใช้ KasetHub'}
                      </h3>
                      <p className="text-xs font-semibold text-slate-500">{formatCommunityTime(post.createdAt)}</p>
                    </div>
                    {post.ownedByCurrentUser ? (
                      <div className="flex flex-wrap gap-2">
                        <Button className={communityCompactActionButtonClass} onClick={() => handleHidePost(post.id)} variant="secondary">
                          <EyeOff aria-hidden="true" className={communityCompactActionIconClass} />
                          ซ่อน
                        </Button>
                        <Button className={communityCompactActionButtonClass} onClick={() => handleDeletePost(post.id)} variant="secondary">
                          <Trash2 aria-hidden="true" className={communityCompactActionIconClass} />
                          ลบ
                        </Button>
                      </div>
                    ) : null}
                  </div>

                  <p className="whitespace-pre-wrap text-sm leading-6 text-kaset-ink">{post.contentText}</p>

                  {post.image ? (
                    imageUrl ? (
                      <img
                        alt="รูปประกอบโพสต์ชุมชน"
                        className="max-h-64 w-full rounded-lg object-cover sm:max-h-80"
                        src={imageUrl}
                      />
                    ) : (
                      <div className="rounded-lg bg-kaset-mist p-3 text-xs font-semibold leading-5 text-kaset-ink">
                        รูปประกอบ: {post.image.imagePath}
                      </div>
                    )
                  ) : null}

                  <div className="flex flex-wrap gap-1.5" data-testid="community-post-actions">
                    <Button
                      className={communityCompactActionButtonClass}
                      disabled={!canWrite || !post.id}
                      onClick={() => handleLike(post)}
                      variant={post.likedByCurrentUser ? 'soft' : 'secondary'}
                    >
                      <Heart
                        aria-hidden="true"
                        className={post.likedByCurrentUser ? `${communityCompactActionIconClass} fill-current` : communityCompactActionIconClass}
                      />
                      ถูกใจ {post.likeCount ?? 0}
                    </Button>
                    <Button
                      className={communityCompactActionButtonClass}
                      disabled={!post.id}
                      onClick={() => handleToggleComments(post.id)}
                      variant="secondary"
                    >
                      <MessageCircle aria-hidden="true" className={communityCompactActionIconClass} />
                      คอมเมนต์ {post.commentCount ?? 0}
                    </Button>
                    <Button className={communityCompactActionButtonClass} onClick={handleShare} variant="secondary">
                      <Share2 aria-hidden="true" className={communityCompactActionIconClass} />
                      แชร์
                    </Button>
                    <Button
                      className={communityCompactActionButtonClass}
                      disabled={!canWrite || !post.id}
                      onClick={() => handleReportPost(post.id)}
                      variant="secondary"
                    >
                      <Flag aria-hidden="true" className={communityCompactActionIconClass} />
                      รายงาน
                    </Button>
                  </div>

                  <div className="grid max-w-sm gap-1">
                    <label className="text-xs font-extrabold text-slate-600" htmlFor={`report-${post.id}`}>
                      เหตุผลรายงาน
                    </label>
                    <select
                      className="min-h-10 rounded-lg border border-kaset-deep/10 bg-white px-3 text-xs font-semibold text-kaset-ink"
                      disabled={!canWrite || !post.id}
                      id={`report-${post.id}`}
                      onChange={(event) => {
                        const nextReason = event.currentTarget.value as CommunityReportReason;
                        setReportReasonByPost((current) => ({
                          ...current,
                          [post.id]: nextReason,
                        }));
                      }}
                      value={reportReasonByPost[post.id] ?? 'spam'}
                    >
                      {communityReportReasons.map((reason) => (
                        <option key={reason} value={reason}>
                          {communityReportReasonLabels[reason]}
                        </option>
                      ))}
                    </select>
                  </div>

                  {openCommentsByPost[post.id] ? (
                    <div className="grid gap-3 rounded-lg bg-slate-50 p-3">
                      {topLevelComments.length === 0 ? (
                        <p className="text-sm font-semibold text-slate-600">ยังไม่มีคอมเมนต์จริง</p>
                      ) : (
                        topLevelComments.map((comment) => {
                          const replies = getCommunityRepliesForComment(comments, comment.id);
                          const isReplying = replyingToByPost[post.id] === comment.id;
                          const replyTargetName = comment.authorDisplayName || 'ผู้ใช้ KasetHub';

                          return (
                            <div className="grid gap-2 rounded-lg bg-white p-3" key={comment.id}>
                              <div className="flex flex-wrap items-start justify-between gap-2">
                                <div>
                                  <p className="text-sm font-extrabold text-kaset-ink">
                                    {replyTargetName}
                                  </p>
                                  <p className="text-xs font-semibold text-slate-500">
                                    {formatCommunityTime(comment.createdAt)}
                                  </p>
                                </div>
                                {comment.ownedByCurrentUser ? (
                                  <Button
                                    className={communityCompactActionButtonClass}
                                    onClick={() => handleHideComment(post.id, comment.id)}
                                    variant="secondary"
                                  >
                                    <EyeOff aria-hidden="true" className={communityCompactActionIconClass} />
                                    ซ่อน
                                  </Button>
                                ) : null}
                              </div>
                              <p className="whitespace-pre-wrap text-sm leading-6 text-kaset-ink">{comment.contentText}</p>

                              <div className="flex flex-wrap gap-1.5">
                                <Button
                                  className={communityCompactActionButtonClass}
                                  disabled={!canWrite || !comment.id}
                                  onClick={() => handleLikeComment(post.id, comment)}
                                  variant={comment.likedByCurrentUser ? 'soft' : 'secondary'}
                                >
                                  <Heart
                                    aria-hidden="true"
                                    className={comment.likedByCurrentUser ? `${communityCompactActionIconClass} fill-current` : communityCompactActionIconClass}
                                  />
                                  ถูกใจ {comment.likeCount ?? 0}
                                </Button>
                                <Button
                                  className={communityCompactActionButtonClass}
                                  disabled={!canWrite || !comment.id}
                                  onClick={() => handleStartReply(post.id, comment.id)}
                                  variant="secondary"
                                >
                                  <Reply aria-hidden="true" className={communityCompactActionIconClass} />
                                  ตอบกลับ
                                </Button>
                              </div>

                              {replies.length === 0 && isReplying ? (
                                <p className="rounded-lg bg-slate-50 p-2 text-xs font-semibold text-slate-600">
                                  ยังไม่มีคำตอบ
                                </p>
                              ) : null}

                              {replies.length > 0 ? (
                                <div className="ml-2 grid gap-2 border-l-2 border-kaset-deep/10 pl-3">
                                  {replies.map((reply) => (
                                    <div className="rounded-lg bg-slate-50 p-3" key={reply.id}>
                                      <div className="flex flex-wrap items-start justify-between gap-2">
                                        <div>
                                          <p className="text-sm font-extrabold text-kaset-ink">
                                            {reply.authorDisplayName || 'ผู้ใช้ KasetHub'}
                                          </p>
                                          <p className="text-xs font-semibold text-slate-500">
                                            {formatCommunityTime(reply.createdAt)}
                                          </p>
                                        </div>
                                        {reply.ownedByCurrentUser ? (
                                          <Button
                                            className={communityCompactActionButtonClass}
                                            onClick={() => handleHideComment(post.id, reply.id)}
                                            variant="secondary"
                                          >
                                            <EyeOff aria-hidden="true" className={communityCompactActionIconClass} />
                                            ซ่อน
                                          </Button>
                                        ) : null}
                                      </div>
                                      <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-kaset-ink">
                                        {reply.contentText}
                                      </p>
                                      <Button
                                        className={`mt-2 ${communityCompactActionButtonClass}`}
                                        disabled={!canWrite || !reply.id}
                                        onClick={() => handleLikeComment(post.id, reply)}
                                        variant={reply.likedByCurrentUser ? 'soft' : 'secondary'}
                                      >
                                        <Heart
                                          aria-hidden="true"
                                          className={reply.likedByCurrentUser ? `${communityCompactActionIconClass} fill-current` : communityCompactActionIconClass}
                                        />
                                        ถูกใจ {reply.likeCount ?? 0}
                                      </Button>
                                    </div>
                                  ))}
                                </div>
                              ) : null}

                              {isReplying ? (
                                <div className="grid gap-2 rounded-lg bg-kaset-mist p-3">
                                  <p className="text-xs font-extrabold text-kaset-ink">
                                    กำลังตอบกลับ {replyTargetName}
                                  </p>
                                  <textarea
                                    className="min-h-16 w-full rounded-lg border border-kaset-deep/10 bg-white p-3 text-sm leading-6 text-kaset-ink outline-none disabled:text-slate-500"
                                    disabled={!canWrite}
                                    onChange={(event) => handleReplyTextChange(comment.id, getCommunityTextInputValue(event))}
                                    onInput={(event) => handleReplyTextChange(comment.id, getCommunityTextInputValue(event))}
                                    placeholder={canWrite ? 'เขียนคำตอบ...' : disabledInputCopy}
                                    value={replyTextByComment[comment.id] ?? ''}
                                  />
                                  <div className="flex flex-wrap gap-1.5">
                                    <Button
                                      className={communityCompactActionButtonClass}
                                      disabled={!canWrite}
                                      onClick={() => handleCreateReply(post.id, comment)}
                                    >
                                      <Send aria-hidden="true" className={communityCompactActionIconClass} />
                                      ส่งคำตอบ
                                    </Button>
                                    <Button
                                      className={communityCompactActionButtonClass}
                                      onClick={() => handleCancelReply(post.id, comment.id)}
                                      variant="secondary"
                                    >
                                      ยกเลิก
                                    </Button>
                                  </div>
                                </div>
                              ) : null}
                            </div>
                          );
                        })
                      )}

                      <form className="grid gap-2" onSubmit={(event) => handleSubmitTopLevelComment(event, post.id)}>
                        <textarea
                          className="min-h-20 w-full rounded-lg border border-kaset-deep/10 bg-white p-3 text-sm leading-6 text-kaset-ink outline-none disabled:text-slate-500"
                          disabled={!canWrite || !post.id}
                          onChange={(event) => handleCommentTextChange(post.id, getCommunityTextInputValue(event))}
                          onInput={(event) => handleCommentTextChange(post.id, getCommunityTextInputValue(event))}
                          placeholder={canWrite ? 'เขียนคอมเมนต์' : disabledInputCopy}
                          value={commentTextByPost[post.id] ?? ''}
                        />
                        {commentStatusByPost[post.id] ? (
                          <p className="rounded-lg bg-white p-2 text-xs font-semibold leading-5 text-kaset-ink">
                            {commentStatusByPost[post.id]}
                          </p>
                        ) : null}
                        <Button
                          className="min-h-10 gap-1.5 px-4 text-sm"
                          disabled={!canUseTopLevelCommunityCommentSubmit(
                            canWrite,
                            post.id,
                            submittingCommentByPost[post.id],
                          )}
                          type="submit"
                        >
                          <Send aria-hidden="true" className="h-4 w-4" />
                          {submittingCommentByPost[post.id] ? 'กำลังส่ง' : 'ส่งคอมเมนต์'}
                        </Button>
                      </form>
                    </div>
                  ) : null}
                </article>
              </Card>
            );
          })}
        </section>

        <Card className="p-4" aria-labelledby="community-actions-title">
          <div className="flex gap-3">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-kaset-mint text-kaset-deep">
              <Heart aria-hidden="true" className="h-5 w-5" />
            </span>
            <div className="min-w-0 flex-1">
              <h2 id="community-actions-title" className="font-extrabold text-kaset-ink">
                การโต้ตอบในชุมชน
              </h2>
              <p className="mt-1 text-sm leading-6 text-slate-600">
                ถูกใจ คอมเมนต์ รายงาน ซ่อน/ลบโพสต์ของตัวเอง และแนบรูป 1 รูป จะทำงานเมื่อบัญชีพร้อมเขียนโพสต์
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-4" aria-labelledby="community-share-title">
          <div className="flex gap-3">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-sky-100 text-sky-800">
              <Share2 aria-hidden="true" className="h-5 w-5" />
            </span>
            <div className="min-w-0 flex-1">
              <h2 id="community-share-title" className="font-extrabold text-kaset-ink">
                แชร์ชุมชน
              </h2>
              <p className="mt-1 text-sm leading-6 text-slate-600">
                ตอนนี้ยังไม่มี URL รายโพสต์ จึงแชร์ไปที่หน้า /app/community พร้อมข้อความสั้น
              </p>
              <div className="mt-3 grid gap-2 sm:grid-cols-3">
                <Button onClick={handleShare}>
                  <Share2 aria-hidden="true" className="h-4 w-4" />
                  แชร์
                </Button>
                <a
                  className="inline-flex min-h-12 items-center justify-center gap-2.5 rounded-full bg-white px-4 text-sm font-extrabold text-kaset-deep ring-1 ring-kaset-deep/12"
                  href={`https://social-plugins.line.me/lineit/share?url=${encodedShareUrl}&text=${encodedShareText}`}
                  rel="noreferrer"
                  target="_blank"
                >
                  <LinkIcon aria-hidden="true" className="h-4 w-4" />
                  LINE
                </a>
                <a
                  className="inline-flex min-h-12 items-center justify-center gap-2.5 rounded-full bg-white px-4 text-sm font-extrabold text-kaset-deep ring-1 ring-kaset-deep/12"
                  href={`https://www.facebook.com/sharer/sharer.php?u=${encodedShareUrl}`}
                  rel="noreferrer"
                  target="_blank"
                >
                  <Share2 aria-hidden="true" className="h-4 w-4" />
                  Facebook
                </a>
              </div>
              <div className="mt-3 flex items-center gap-2 rounded-lg bg-kaset-mist p-3 text-xs font-semibold leading-5 text-kaset-ink">
                <Copy aria-hidden="true" className="h-4 w-4 shrink-0" />
                <span className="break-all">{shareStatus || shareUrl}</span>
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-4" aria-labelledby="community-report-title">
          <div className="flex gap-3">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-rose-100 text-rose-800">
              <Flag aria-hidden="true" className="h-5 w-5" />
            </span>
            <div className="min-w-0 flex-1">
              <h2 id="community-report-title" className="font-extrabold text-kaset-ink">
                รายงานโพสต์หรือคอมเมนต์
              </h2>
              <p className="mt-1 text-sm leading-6 text-slate-600">
                เหตุผลรายงานแสดงเป็นภาษาไทย และส่งเป็นตัวเลือกที่ระบบรองรับ
              </p>
              <div className="mt-3 grid gap-2 sm:grid-cols-2">
                {communityReportReasons.map((reason) => (
                  <div className="rounded-lg bg-kaset-mist p-3 text-sm font-bold text-kaset-ink" key={reason}>
                    {communityReportReasonLabels[reason]}
                  </div>
                ))}
              </div>
              <p className="mt-2 text-xs font-semibold leading-5 text-slate-500">
                ข้อความยืนยันเมื่อเปิดใช้จริง: “{successReportMessage}”
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-4" aria-labelledby="community-notifications-title">
          <div className="flex gap-3">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-kaset-mint text-kaset-deep">
              <Bell aria-hidden="true" className="h-5 w-5" />
            </span>
            <div className="min-w-0 flex-1">
              <h2 id="community-notifications-title" className="font-extrabold text-kaset-ink">
                แจ้งเตือนในแอป
              </h2>
              <p className="mt-1 text-sm leading-6 text-slate-600">
                การแจ้งเตือนถูกใจและตอบกลับยังไม่เปิดส่งจริงใน V1 และไม่มี push notification
              </p>
              <Link
                className="mt-3 inline-flex min-h-11 w-full items-center justify-center rounded-lg bg-kaset-deep px-4 text-sm font-extrabold text-white"
                to="/app/notifications"
              >
                เปิดศูนย์แจ้งเตือน
              </Link>
            </div>
          </div>
        </Card>

        <NoticeBox tone="warning" title="Community safety note">
          <ul className="grid gap-1">
            {safetyNotes.map((note) => (
              <li key={note}>• {note}</li>
            ))}
          </ul>
        </NoticeBox>

        <Card className="p-4" aria-labelledby="community-readiness-title">
          <div className="flex gap-3">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-slate-100 text-slate-700">
              <ShieldCheck aria-hidden="true" className="h-5 w-5" />
            </span>
            <div className="min-w-0 flex-1">
              <h2 id="community-readiness-title" className="font-extrabold text-kaset-ink">
                สิ่งที่ต้องพร้อมก่อนเปิดโพสต์จริง
              </h2>
              <div className="mt-3 grid gap-2">
                {readiness.blockers.map((blocker) => (
                  <div className="rounded-lg bg-slate-50 p-3" key={blocker.code}>
                    <p className="text-sm font-extrabold text-kaset-ink">{blocker.label}</p>
                    <p className="mt-1 text-xs font-semibold leading-5 text-slate-600">{blocker.detail}</p>
                  </div>
                ))}
              </div>
              <p className="mt-3 rounded-lg bg-slate-50 p-3 text-xs font-semibold leading-5 text-slate-600">
                รูปโพสต์ V1 จำกัด 1 รูปต่อโพสต์, JPG/PNG/WebP, ไม่เกิน {communityImagePolicy.maxSizeBytes / 1024 / 1024}MB และเก็บเฉพาะ path/metadata ในฐานข้อมูล
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

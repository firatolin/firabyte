import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import prisma from '@/lib/prisma';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  FileText,
  Eye,
  Heart,
  Users,
  MessageSquare,
  UserCheck,
  PenLine,
  FileEdit,
  TrendingUp,
  BarChart3,
} from 'lucide-react';
import {
  ViewsLineChart,
  CategoryBarChart,
  SubscriberPieChart,
  TopPostsBarChart,
} from '@/components/dashboard/DashboardCharts';

const ADMIN_EMAIL = 'firatolesayas@gmail.com';

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/auth/signin');
  }

  if (session.user?.email !== ADMIN_EMAIL) {
    redirect('/');
  }

  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  // Run queries sequentially to avoid connection pool exhaustion with Neon cold starts
  const totalPosts = await prisma.post.count({});
  const publishedPosts = await prisma.post.count({ where: { status: 'PUBLISHED' } });
  const draftPosts = await prisma.post.count({ where: { status: 'DRAFT' } });
  const viewsAgg = await prisma.post.aggregate({ _sum: { viewCount: true, likes: true } });
  const totalComments = await prisma.comment.count({});
  const approvedComments = await prisma.comment.count({ where: { isApproved: true } });
  const pendingComments = await prisma.comment.count({ where: { isApproved: false } });
  const activeSubscribers = await prisma.subscriber.count({ where: { status: 'ACTIVE' } });
  const totalSubscribers = await prisma.subscriber.count({});
  const unsubscribedSubscribers = await prisma.subscriber.count({ where: { status: 'UNSUBSCRIBED' } });
  const newSubscribers30d = await prisma.subscriber.count({ where: { subscribedAt: { gte: thirtyDaysAgo } } });
  const totalUsers = await prisma.user.count({});
  const topByViews = await prisma.post.findMany({
    where: { status: 'PUBLISHED' },
    orderBy: { viewCount: 'desc' },
    take: 5,
    select: { title: true, slug: true, viewCount: true, likes: true },
  });
  const postsByCategory = await prisma.post.groupBy({
    by: ['category'],
    _count: { _all: true },
    orderBy: { _count: { category: 'desc' } },
  });
  const recentComments = await prisma.comment.findMany({
    orderBy: { createdAt: 'desc' },
    take: 5,
    select: {
      id: true,
      authorName: true,
      content: true,
      isApproved: true,
      createdAt: true,
      post: { select: { title: true, slug: true } },
    },
  });
  const recentViews = await prisma.postView.findMany({
    orderBy: { createdAt: 'desc' },
    take: 25,
    select: {
      id: true,
      postSlug: true,
      viewerIp: true,
      userAgent: true,
      referer: true,
      createdAt: true,
      post: { select: { title: true, slug: true } },
    },
  });
  const usersList = await prisma.user.findMany({
    orderBy: { createdAt: 'desc' },
    take: 50,
    select: { id: true, name: true, email: true, role: true, createdAt: true },
  });
  const subscribersList = await prisma.subscriber.findMany({
    orderBy: { subscribedAt: 'desc' },
    take: 50,
    select: { id: true, email: true, name: true, status: true, subscribedAt: true, token: true },
  });
  const viewsLast30d = await prisma.postView.findMany({
    where: { createdAt: { gte: thirtyDaysAgo } },
    select: { createdAt: true },
  });

  // All variables already fetched above in batches

  const totalViews = viewsAgg._sum.viewCount || 0;
  const totalLikes = viewsAgg._sum.likes || 0;

  // Aggregate views per day for the last 30 days
  const dayMap = new Map<string, number>();
  for (let i = 29; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    dayMap.set(d.toISOString().split('T')[0], 0);
  }
  for (const v of viewsLast30d) {
    const key = new Date(v.createdAt).toISOString().split('T')[0];
    if (dayMap.has(key)) dayMap.set(key, (dayMap.get(key) || 0) + 1);
  }
  const viewsByDay = Array.from(dayMap.entries()).map(([date, views]) => ({ date, views }));

  const subscriberStatusData = [
    { name: 'Active', value: activeSubscribers },
    { name: 'Unsubscribed', value: unsubscribedSubscribers },
  ];

  const categoryData = postsByCategory.map((c) => ({
    name: c.category.trim() || 'Uncategorized',
    value: c._count._all,
  }));

  const topPostsData = topByViews.map((p) => ({
    name: p.title.length > 24 ? p.title.slice(0, 24) + '…' : p.title,
    views: p.viewCount,
    likes: p.likes,
  }));

  return (
    <div className="max-w-7xl mx-auto py-12 px-4 space-y-8">
      <div className="flex flex-col gap-2 rounded-2xl border border-border bg-gradient-to-br from-primary/5 via-background to-primary/10 p-6 md:p-8">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <BarChart3 className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-3xl font-serif font-bold tracking-tight">Analytics Dashboard</h1>
            <p className="text-muted-foreground mt-1">
              Overview of your blog&apos;s content, audience, and engagement.
            </p>
          </div>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <div className="rounded-lg bg-background/60 px-3 py-2">
            <p className="text-xs text-muted-foreground">Posts</p>
            <p className="text-lg font-semibold">{totalPosts}</p>
          </div>
          <div className="rounded-lg bg-background/60 px-3 py-2">
            <p className="text-xs text-muted-foreground">Views</p>
            <p className="text-lg font-semibold">{totalViews.toLocaleString()}</p>
          </div>
          <div className="rounded-lg bg-background/60 px-3 py-2">
            <p className="text-xs text-muted-foreground">Subscribers</p>
            <p className="text-lg font-semibold">{activeSubscribers}</p>
          </div>
          <div className="rounded-lg bg-background/60 px-3 py-2">
            <p className="text-xs text-muted-foreground">Comments</p>
            <p className="text-lg font-semibold">{totalComments}</p>
          </div>
        </div>
      </div>

      {/* Top-level metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
  <FileText className="h-4 w-4" /> Total Posts
</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalPosts}</div>
            <p className="text-xs text-muted-foreground">
              {publishedPosts} published · {draftPosts} drafts
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
  <Eye className="h-4 w-4" /> Total Views
</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalViews.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Across all posts</p>
          </CardContent>
        </Card>

        <Card className="shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
  <Heart className="h-4 w-4" /> Total Likes
</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalLikes.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Across all posts</p>
          </CardContent>
        </Card>

        <Card className="shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
  <Users className="h-4 w-4" /> Subscribers
</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeSubscribers}</div>
            <p className="text-xs text-muted-foreground">
              {totalSubscribers} total · {unsubscribedSubscribers} unsubscribed · +{newSubscribers30d} (30d)
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Second row */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
  <MessageSquare className="h-4 w-4" /> Comments
</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalComments}</div>
            <p className="text-xs text-muted-foreground">
              {approvedComments} approved · {pendingComments} pending
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
  <UserCheck className="h-4 w-4" /> Users
</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalUsers}</div>
            <p className="text-xs text-muted-foreground">Registered accounts</p>
          </CardContent>
        </Card>

        <Card className="shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
  <PenLine className="h-4 w-4" /> Published
</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{publishedPosts}</div>
            <p className="text-xs text-muted-foreground">Live posts</p>
          </CardContent>
        </Card>

        <Card className="shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
  <FileEdit className="h-4 w-4" /> Drafts
</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{draftPosts}</div>
            <p className="text-xs text-muted-foreground">Unpublished posts</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent comments */}
      <Card className="shadow-sm hover:shadow-md transition-shadow">
        <CardHeader>
          <CardTitle className="text-lg">Recent Comments</CardTitle>
        </CardHeader>
        <CardContent>
          {recentComments.length === 0 ? (
            <p className="text-sm text-muted-foreground">No comments yet.</p>
          ) : (
            <ul className="space-y-4">
              {recentComments.map((c) => (
                <li key={c.id} className="border-b border-border pb-3 last:border-0 last:pb-0">
                  <div className="flex items-center justify-between gap-4 mb-1">
                    <span className="text-sm font-medium">
                      {c.authorName}
                      <span className="text-xs text-muted-foreground font-normal ml-2">
                        on{' '}
                        <a href={`/posts/${c.post.slug}`} className="hover:underline">
                          {c.post.title}
                        </a>
                      </span>
                    </span>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full ${
                        c.isApproved
                          ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                          : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                      }`}
                    >
                      {c.isApproved ? 'Approved' : 'Pending'}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-2">{c.content}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {new Date(c.createdAt).toLocaleString()}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      <div className="flex items-center gap-2">
        <TrendingUp className="h-5 w-5 text-primary" />
        <h2 className="text-xl font-semibold">Analytics & Charts</h2>
      </div>
      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="shadow-sm hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle className="text-lg">Views (Last 30 Days)</CardTitle>
          </CardHeader>
          <CardContent>
            <ViewsLineChart data={viewsByDay} />
          </CardContent>
        </Card>

        <Card className="shadow-sm hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle className="text-lg">Subscribers</CardTitle>
          </CardHeader>
          <CardContent>
            <SubscriberPieChart data={subscriberStatusData} />
          </CardContent>
        </Card>

        <Card className="shadow-sm hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle className="text-lg">Posts by Category</CardTitle>
          </CardHeader>
          <CardContent>
            <CategoryBarChart data={categoryData} />
          </CardContent>
        </Card>

        <Card className="shadow-sm hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle className="text-lg">Top Posts (Views vs Likes)</CardTitle>
          </CardHeader>
          <CardContent>
            <TopPostsBarChart data={topPostsData} />
          </CardContent>
        </Card>
      </div>

      <div className="flex items-center gap-2">
        <Eye className="h-5 w-5 text-primary" />
        <h2 className="text-xl font-semibold">Viewer Analytics</h2>
      </div>
      {/* Viewers */}
      <Card className="shadow-sm hover:shadow-md transition-shadow">
        <CardHeader>
          <CardTitle className="text-lg">Recent Viewers</CardTitle>
        </CardHeader>
        <CardContent>
          {recentViews.length === 0 ? (
            <p className="text-sm text-muted-foreground">No views tracked yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-muted-foreground border-b border-border">
                    <th className="py-2 pr-4">Post</th>
                    <th className="py-2 pr-4">IP Address</th>
                    <th className="py-2 pr-4">User Agent</th>
                    <th className="py-2 pr-4">When</th>
                  </tr>
                </thead>
                <tbody>
                  {recentViews.map((v) => (
                    <tr key={v.id} className="border-b border-border last:border-0">
                      <td className="py-2 pr-4 max-w-[200px] truncate">
                        <a href={`/posts/${v.postSlug}`} className="hover:underline">
                          {v.post?.title || v.postSlug}
                        </a>
                      </td>
                      <td className="py-2 pr-4 font-mono text-xs">{v.viewerIp || '—'}</td>
                      <td className="py-2 pr-4 text-xs text-muted-foreground max-w-[260px] truncate">
                        {v.userAgent || '—'}
                      </td>
                      <td className="py-2 pr-4 text-xs text-muted-foreground whitespace-nowrap">
                        {new Date(v.createdAt).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>


      <div className="flex items-center gap-2">
        <UserCheck className="h-5 w-5 text-primary" />
        <h2 className="text-xl font-semibold">User Management</h2>
      </div>
      {/* Users */}
      <Card className="shadow-sm hover:shadow-md transition-shadow">
        <CardHeader>
          <CardTitle className="text-lg">Users</CardTitle>
        </CardHeader>
        <CardContent>
          {usersList.length === 0 ? (
            <p className="text-sm text-muted-foreground">No users yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-muted-foreground border-b border-border">
                    <th className="py-2 pr-4">Name</th>
                    <th className="py-2 pr-4">Email</th>
                    <th className="py-2 pr-4">Role</th>
                    <th className="py-2 pr-4">Joined</th>
                  </tr>
                </thead>
                <tbody>
                  {usersList.map((u) => (
                    <tr key={u.id} className="border-b border-border last:border-0">
                      <td className="py-2 pr-4 font-medium">{u.name}</td>
                      <td className="py-2 pr-4 font-mono text-xs">{u.email}</td>
                      <td className="py-2 pr-4">
                        <span className="text-xs px-2 py-0.5 rounded-full bg-accent">
                          {u.role}
                        </span>
                      </td>
                      <td className="py-2 pr-4 text-xs text-muted-foreground whitespace-nowrap">
                        {new Date(u.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="flex items-center gap-2">
        <Users className="h-5 w-5 text-primary" />
        <h2 className="text-xl font-semibold">Subscribers</h2>
      </div>
      {/* Subscribers */}
      <Card className="shadow-sm hover:shadow-md transition-shadow">
        <CardHeader>
          <CardTitle className="text-lg">Subscribers</CardTitle>
        </CardHeader>
        <CardContent>
          {subscribersList.length === 0 ? (
            <p className="text-sm text-muted-foreground">No subscribers yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-muted-foreground border-b border-border">
                    <th className="py-2 pr-4">Email</th>
                    <th className="py-2 pr-4">Name</th>
                    <th className="py-2 pr-4">Status</th>
                    <th className="py-2 pr-4">Subscribed</th>
                    <th className="py-2 pr-4">Token</th>
                  </tr>
                </thead>
                <tbody>
                  {subscribersList.map((s) => (
                    <tr key={s.id} className="border-b border-border last:border-0">
                      <td className="py-2 pr-4 font-mono text-xs">{s.email}</td>
                      <td className="py-2 pr-4">{s.name || '—'}</td>
                      <td className="py-2 pr-4">
                        <span
                          className={`text-xs px-2 py-0.5 rounded-full ${
                            s.status === 'ACTIVE'
                              ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                              : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400'
                          }`}
                        >
                          {s.status}
                        </span>
                      </td>
                      <td className="py-2 pr-4 text-xs text-muted-foreground whitespace-nowrap">
                        {new Date(s.subscribedAt).toLocaleDateString()}
                      </td>
                      <td className="py-2 pr-4 font-mono text-xs text-muted-foreground max-w-[120px] truncate">
                        {s.token || '—'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="flex flex-wrap gap-4 pt-4">
        <a
          href="/manage-posts"
          className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
        >
          Manage Posts
        </a>
        <a
          href="/manage-posts/new"
          className="px-4 py-2 border border-border rounded-lg hover:bg-accent transition-colors"
        >
          New Post
        </a>
      </div>
    </div>
  );
}
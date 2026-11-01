import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import prisma from '@/lib/prisma';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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

  const [
    totalPosts,
    publishedPosts,
    draftPosts,
    viewsAgg,
    totalComments,
    approvedComments,
    pendingComments,
    activeSubscribers,
    totalSubscribers,
    unsubscribedSubscribers,
    newSubscribers30d,
    totalUsers,
    topByViews,
    topByLikes,
    recentPosts,
    postsByCategory,
    recentComments,
    recentViews,
    viewsByPost,
    usersList,
    subscribersList,
    viewsLast30d,
  ] = await Promise.all([
    prisma.post.count({}),
    prisma.post.count({ where: { status: 'PUBLISHED' } }),
    prisma.post.count({ where: { status: 'DRAFT' } }),
    prisma.post.aggregate({ _sum: { viewCount: true, likes: true } }),
    prisma.comment.count({}),
    prisma.comment.count({ where: { isApproved: true } }),
    prisma.comment.count({ where: { isApproved: false } }),
    prisma.subscriber.count({ where: { status: 'ACTIVE' } }),
    prisma.subscriber.count({}),
    prisma.subscriber.count({ where: { status: 'UNSUBSCRIBED' } }),
    prisma.subscriber.count({ where: { subscribedAt: { gte: thirtyDaysAgo } } }),
    prisma.user.count({}),
    prisma.post.findMany({
      where: { status: 'PUBLISHED' },
      orderBy: { viewCount: 'desc' },
      take: 5,
      select: { title: true, slug: true, viewCount: true, likes: true },
    }),
    prisma.post.findMany({
      where: { status: 'PUBLISHED' },
      orderBy: { likes: 'desc' },
      take: 5,
      select: { title: true, slug: true, viewCount: true, likes: true },
    }),
    prisma.post.findMany({
      where: { status: 'PUBLISHED' },
      orderBy: { publishedAt: 'desc' },
      take: 5,
      select: { title: true, slug: true, publishedAt: true, viewCount: true },
    }),
    prisma.post.groupBy({
      by: ['category'],
      _count: { _all: true },
      orderBy: { _count: { category: 'desc' } },
    }),
    prisma.comment.findMany({
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
    }),
    prisma.postView.findMany({
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
    }),
    prisma.post.findMany({
      orderBy: { views: { _count: 'desc' } },
      take: 10,
      select: {
        title: true,
        slug: true,
        viewCount: true,
        _count: { select: { views: true } },
      },
    }),
    prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
      take: 50,
      select: { id: true, name: true, email: true, role: true, createdAt: true },
    }),
    prisma.subscriber.findMany({
      orderBy: { subscribedAt: 'desc' },
      take: 50,
      select: { id: true, email: true, name: true, status: true, subscribedAt: true, token: true },
    }),
    prisma.postView.findMany({
      where: { createdAt: { gte: thirtyDaysAgo } },
      select: { createdAt: true },
    }),
  ]);

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
    <div className="max-w-6xl mx-auto py-12 px-4 space-y-8">
      <div>
        <h1 className="text-3xl font-serif font-bold">Analytics Dashboard</h1>
        <p className="text-muted-foreground mt-2">
          Overview of your blog&apos;s content, audience, and engagement.
        </p>
      </div>

      {/* Top-level metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Posts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalPosts}</div>
            <p className="text-xs text-muted-foreground">
              {publishedPosts} published · {draftPosts} drafts
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Views</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalViews.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Across all posts</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Likes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalLikes.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Across all posts</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Subscribers</CardTitle>
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
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Comments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalComments}</div>
            <p className="text-xs text-muted-foreground">
              {approvedComments} approved · {pendingComments} pending
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalUsers}</div>
            <p className="text-xs text-muted-foreground">Registered accounts</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Published</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{publishedPosts}</div>
            <p className="text-xs text-muted-foreground">Live posts</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Drafts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{draftPosts}</div>
            <p className="text-xs text-muted-foreground">Unpublished posts</p>
          </CardContent>
        </Card>
      </div>

      {/* Top posts + categories */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Top Posts by Views</CardTitle>
          </CardHeader>
          <CardContent>
            {topByViews.length === 0 ? (
              <p className="text-sm text-muted-foreground">No posts yet.</p>
            ) : (
              <ul className="space-y-3">
                {topByViews.map((post, i) => (
                  <li key={post.slug} className="flex items-center justify-between gap-4">
                    <div className="min-w-0">
                      <span className="text-xs text-muted-foreground mr-2">#{i + 1}</span>
                      <a href={`/posts/${post.slug}`} className="text-sm font-medium hover:underline truncate">
                        {post.title}
                      </a>
                    </div>
                    <span className="text-sm text-muted-foreground whitespace-nowrap">
                      {post.viewCount.toLocaleString()} views · {post.likes} likes
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Top Posts by Likes</CardTitle>
          </CardHeader>
          <CardContent>
            {topByLikes.length === 0 ? (
              <p className="text-sm text-muted-foreground">No posts yet.</p>
            ) : (
              <ul className="space-y-3">
                {topByLikes.map((post, i) => (
                  <li key={post.slug} className="flex items-center justify-between gap-4">
                    <div className="min-w-0">
                      <span className="text-xs text-muted-foreground mr-2">#{i + 1}</span>
                      <a href={`/posts/${post.slug}`} className="text-sm font-medium hover:underline truncate">
                        {post.title}
                      </a>
                    </div>
                    <span className="text-sm text-muted-foreground whitespace-nowrap">
                      {post.likes} likes · {post.viewCount.toLocaleString()} views
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Categories + recent posts */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Posts by Category</CardTitle>
          </CardHeader>
          <CardContent>
            {postsByCategory.length === 0 ? (
              <p className="text-sm text-muted-foreground">No categories yet.</p>
            ) : (
              <ul className="space-y-2">
                {postsByCategory.map((c) => (
                  <li key={c.category} className="flex items-center justify-between">
                    <span className="text-sm font-medium">{c.category}</span>
                    <span className="text-sm text-muted-foreground">{c._count._all} posts</span>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Recent Posts</CardTitle>
          </CardHeader>
          <CardContent>
            {recentPosts.length === 0 ? (
              <p className="text-sm text-muted-foreground">No posts yet.</p>
            ) : (
              <ul className="space-y-3">
                {recentPosts.map((post) => (
                  <li key={post.slug} className="flex items-center justify-between gap-4">
                    <a href={`/posts/${post.slug}`} className="text-sm font-medium hover:underline truncate">
                      {post.title}
                    </a>
                    <span className="text-xs text-muted-foreground whitespace-nowrap">
                      {post.publishedAt
                        ? new Date(post.publishedAt).toLocaleDateString()
                        : ''}
                      {' · '}
                      {post.viewCount.toLocaleString()} views
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent comments */}
      <Card>
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

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Views (Last 30 Days)</CardTitle>
          </CardHeader>
          <CardContent>
            <ViewsLineChart data={viewsByDay} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Subscribers</CardTitle>
          </CardHeader>
          <CardContent>
            <SubscriberPieChart data={subscriberStatusData} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Posts by Category</CardTitle>
          </CardHeader>
          <CardContent>
            <CategoryBarChart data={categoryData} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Top Posts (Views vs Likes)</CardTitle>
          </CardHeader>
          <CardContent>
            <TopPostsBarChart data={topPostsData} />
          </CardContent>
        </Card>
      </div>

      {/* Viewers */}
      <Card>
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

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Views by Post</CardTitle>
        </CardHeader>
        <CardContent>
          {viewsByPost.length === 0 ? (
            <p className="text-sm text-muted-foreground">No views tracked yet.</p>
          ) : (
            <ul className="space-y-2">
              {viewsByPost.map((p) => (
                <li key={p.slug} className="flex items-center justify-between">
                  <a href={`/posts/${p.slug}`} className="text-sm font-medium hover:underline truncate">
                    {p.title}
                  </a>
                  <span className="text-sm text-muted-foreground whitespace-nowrap">
                    {p._count.views} tracked · {p.viewCount.toLocaleString()} total
                  </span>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      {/* Users */}
      <Card>
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

      {/* Subscribers */}
      <Card>
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
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { categories } from "@/types/blog";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  PieChart, 
  Pie, 
  Cell,
  ResponsiveContainer,
  LineChart,
  Line,
  Legend,
  AreaChart,
  Area
} from 'recharts';
import { format, subDays, startOfDay, endOfDay } from 'date-fns';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

export function BlogAnalytics() {
  const { data: blogStats } = useQuery({
    queryKey: ['blog-stats'],
    queryFn: async () => {
      const thirtyDaysAgo = subDays(new Date(), 30);
      
      const { data: blogs } = await supabase
        .from('blogs')
        .select('*')
        .gte('created_at', thirtyDaysAgo.toISOString());

      // Category distribution
      const categoryStats = Object.keys(categories).reduce((acc, category) => {
        acc[category] = blogs?.filter(blog => blog.category === category).length || 0;
        return acc;
      }, {} as Record<string, number>);

      // Time-based metrics
      const dailyPostCounts = Array.from({ length: 30 }, (_, i) => {
        const date = subDays(new Date(), i);
        const start = startOfDay(date);
        const end = endOfDay(date);
        const count = blogs?.filter(blog => {
          const blogDate = new Date(blog.created_at);
          return blogDate >= start && blogDate <= end;
        }).length || 0;
        return {
          date: format(date, 'MMM dd'),
          posts: count
        };
      }).reverse();

      // View count trends
      const dailyViewCounts = Array.from({ length: 30 }, (_, i) => {
        const date = subDays(new Date(), i);
        const postsOnDay = blogs?.filter(blog => {
          const blogDate = new Date(blog.created_at);
          return format(blogDate, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd');
        }) || [];
        const views = postsOnDay.reduce((sum, blog) => sum + (blog.view_count || 0), 0);
        return {
          date: format(date, 'MMM dd'),
          views
        };
      }).reverse();

      // Most viewed articles
      const topViewed = blogs
        ?.sort((a, b) => (b.view_count || 0) - (a.view_count || 0))
        .slice(0, 5)
        .map(blog => ({
          name: blog.title.substring(0, 20) + '...',
          views: blog.view_count || 0
        }));

      // Most shared articles
      const topShared = blogs
        ?.sort((a, b) => (b.share_count || 0) - (a.share_count || 0))
        .slice(0, 5)
        .map(blog => ({
          name: blog.title.substring(0, 20) + '...',
          shares: blog.share_count || 0
        }));

      // Average rating per category
      const avgRatingByCategory = Object.keys(categories).reduce((acc, category) => {
        const categoryBlogs = blogs?.filter(blog => blog.category === category) || [];
        const avgRating = categoryBlogs.reduce((sum, blog) => sum + (blog.average_rating || 0), 0) / categoryBlogs.length;
        acc[category] = Number(avgRating.toFixed(2)) || 0;
        return acc;
      }, {} as Record<string, number>);

      // Format data for pie chart
      const pieData = Object.entries(categoryStats).map(([name, value]) => ({
        name,
        value
      }));

      return {
        categoryStats,
        topViewed,
        topShared,
        avgRatingByCategory,
        pieData,
        dailyPostCounts,
        dailyViewCounts
      };
    },
  });

  if (!blogStats) return <div>Loading analytics...</div>;

  return (
    <div className="space-y-8">
      {/* Time-based Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Daily Post Counts */}
        <Card>
          <CardHeader>
            <CardTitle>Posts per Day (Last 30 Days)</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={blogStats.dailyPostCounts}>
                <defs>
                  <linearGradient id="colorPosts" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#8884d8" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" angle={-45} textAnchor="end" height={100} />
                <YAxis />
                <Tooltip />
                <Area type="monotone" dataKey="posts" stroke="#8884d8" fillOpacity={1} fill="url(#colorPosts)" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* View Count Trends */}
        <Card>
          <CardHeader>
            <CardTitle>Daily Views (Last 30 Days)</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={blogStats.dailyViewCounts}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" angle={-45} textAnchor="end" height={100} />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="views" stroke="#82ca9d" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Category Distribution */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {Object.entries(blogStats.categoryStats).map(([category, count]) => (
          <Card key={category}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">{category}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{count}</div>
              <p className="text-xs text-muted-foreground">Total Posts</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Visual Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Category Distribution Pie Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Category Distribution</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={blogStats.pieData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label
                >
                  {blogStats.pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Most Viewed Articles */}
        <Card>
          <CardHeader>
            <CardTitle>Most Viewed Articles</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={blogStats.topViewed}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
                <YAxis />
                <Tooltip />
                <Bar dataKey="views" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Most Shared Articles */}
        <Card>
          <CardHeader>
            <CardTitle>Most Shared Articles</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={blogStats.topShared}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
                <YAxis />
                <Tooltip />
                <Bar dataKey="shares" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Average Rating by Category */}
        <Card>
          <CardHeader>
            <CardTitle>Average Rating by Category</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart 
                data={Object.entries(blogStats.avgRatingByCategory).map(([category, rating]) => ({
                  category,
                  rating
                }))}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="category" />
                <YAxis domain={[0, 5]} />
                <Tooltip />
                <Bar dataKey="rating" fill="#ffc658" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
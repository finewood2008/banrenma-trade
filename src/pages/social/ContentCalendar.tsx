/**
 * ContentCalendar - 内容日历
 * 日历视图 + 列表视图，显示已发布/待发布/草稿内容
 */
import { useState } from "react";
import {
  CalendarDays, List, Plus, Eye, Heart, MessageSquare, Share2,
  Clock, Edit3, Trash2, Copy, ChevronLeft, ChevronRight,
  Linkedin, Facebook, Instagram, Check, AlertCircle, FileText,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";

type PostStatus = "published" | "scheduled" | "draft" | "failed";

interface CalendarPost {
  id: number;
  title: string;
  platforms: string[];
  status: PostStatus;
  date: string;
  time?: string;
  content: string;
  analytics?: { views: number; likes: number; comments: number };
}

const statusConfig: Record<PostStatus, { label: string; emoji: string; className: string }> = {
  published: { label: "已发布", emoji: "✓", className: "bg-brand-green/15 text-brand-green" },
  scheduled: { label: "待发布", emoji: "⏰", className: "bg-brand-orange/15 text-brand-orange" },
  draft: { label: "草稿", emoji: "📝", className: "bg-secondary text-muted-foreground" },
  failed: { label: "发布失败", emoji: "❌", className: "bg-destructive/15 text-destructive" },
};

const platformIcons: Record<string, React.ReactNode> = {
  linkedin: <Linkedin className="w-3 h-3" />,
  facebook: <Facebook className="w-3 h-3" />,
  instagram: <Instagram className="w-3 h-3" />,
};

const mockPosts: CalendarPost[] = [
  { id: 1, title: "LED行业趋势分析", platforms: ["linkedin"], status: "published", date: "2026-03-25", time: "10:00", content: "2026年LED照明行业趋势...", analytics: { views: 245, likes: 18, comments: 5 } },
  { id: 2, title: "新品发布预告", platforms: ["linkedin", "facebook"], status: "published", date: "2026-03-25", time: "14:00", content: "新品即将上市...", analytics: { views: 180, likes: 12, comments: 3 } },
  { id: 3, title: "新品发布会直播", platforms: ["linkedin", "facebook"], status: "scheduled", date: "2026-03-26", time: "14:00", content: "诚邀参加我们的新品发布会..." },
  { id: 4, title: "工厂参观视频", platforms: ["instagram"], status: "draft", date: "2026-03-26", content: "带您走进我们的智能工厂..." },
  { id: 5, title: "客户案例分享", platforms: ["linkedin"], status: "scheduled", date: "2026-03-27", time: "09:00", content: "与TechCorp的合作案例..." },
  { id: 6, title: "节能对比测试", platforms: ["facebook", "instagram"], status: "failed", date: "2026-03-24", time: "16:00", content: "LED vs 传统灯泡能耗对比..." },
  { id: 7, title: "团队文化展示", platforms: ["instagram"], status: "published", date: "2026-03-23", time: "11:00", content: "我们的团队日常...", analytics: { views: 320, likes: 45, comments: 8 } },
  { id: 8, title: "行业展会预告", platforms: ["linkedin", "facebook"], status: "scheduled", date: "2026-03-28", time: "08:00", content: "我们将参加2026年广交会..." },
];

export default function ContentCalendar() {
  const [view, setView] = useState<"calendar" | "list">("list");
  const [posts] = useState(mockPosts);
  const [expandedDate, setExpandedDate] = useState<string | null>("2026-03-26");

  // Group posts by date for calendar
  const postsByDate: Record<string, CalendarPost[]> = {};
  posts.forEach((p) => {
    if (!postsByDate[p.date]) postsByDate[p.date] = [];
    postsByDate[p.date].push(p);
  });

  const sortedDates = Object.keys(postsByDate).sort((a, b) => b.localeCompare(a));

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    const weekdays = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"];
    return `${d.getMonth() + 1}月${d.getDate()}日 ${weekdays[d.getDay()]}`;
  };

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex items-center justify-between">
        <div className="flex gap-1 bg-secondary rounded-lg p-0.5">
          <button
            onClick={() => setView("calendar")}
            className={cn("text-xs px-3 py-1.5 rounded-md flex items-center gap-1 transition-colors",
              view === "calendar" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"
            )}
          ><CalendarDays className="w-3 h-3" /> 日历视图</button>
          <button
            onClick={() => setView("list")}
            className={cn("text-xs px-3 py-1.5 rounded-md flex items-center gap-1 transition-colors",
              view === "list" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"
            )}
          ><List className="w-3 h-3" /> 列表视图</button>
        </div>
        <button className="text-xs font-medium bg-primary text-primary-foreground px-3 py-2 rounded-lg flex items-center gap-1 hover:opacity-90 transition-opacity">
          <Plus className="w-3.5 h-3.5" /> 新建内容
        </button>
      </div>

      {/* List view */}
      {view === "list" && (
        <div className="space-y-3">
          {sortedDates.map((date) => {
            const dayPosts = postsByDate[date];
            const isExpanded = expandedDate === date;
            return (
              <div key={date} className="bg-card border border-border rounded-xl overflow-hidden">
                <button
                  onClick={() => setExpandedDate(isExpanded ? null : date)}
                  className="w-full flex items-center justify-between p-3 hover:bg-secondary/30 transition-colors text-left"
                >
                  <div className="flex items-center gap-2">
                    {isExpanded ? <ChevronDown className="w-4 h-4 text-muted-foreground" /> : <ChevronRight className="w-4 h-4 text-muted-foreground" />}
                    <span className="text-xs font-semibold">{formatDate(date)}</span>
                  </div>
                  <div className="flex gap-1.5">
                    {dayPosts.map((p) => {
                      const sc = statusConfig[p.status];
                      return (
                        <span key={p.id} className={cn("text-[9px] px-1.5 py-0.5 rounded", sc.className)}>
                          {sc.emoji}
                        </span>
                      );
                    })}
                  </div>
                </button>

                {isExpanded && (
                  <div className="border-t border-border divide-y divide-border/50">
                    {dayPosts.map((post) => {
                      const sc = statusConfig[post.status];
                      return (
                        <div key={post.id} className="p-3 hover:bg-secondary/20 transition-colors">
                          <div className="flex items-start justify-between mb-1.5">
                            <div className="flex items-center gap-2">
                              <span className={cn("text-[10px] px-1.5 py-0.5 rounded font-medium flex items-center gap-0.5", sc.className)}>
                                {sc.emoji} {sc.label}
                              </span>
                              <span className="text-xs font-medium">{post.title}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              {post.platforms.map((p) => (
                                <span key={p} className="text-muted-foreground">{platformIcons[p]}</span>
                              ))}
                              {post.time && (
                                <span className="text-[10px] text-muted-foreground ml-1 flex items-center gap-0.5">
                                  <Clock className="w-3 h-3" /> {post.time}
                                </span>
                              )}
                            </div>
                          </div>
                          <p className="text-[11px] text-muted-foreground mb-2 line-clamp-1">{post.content}</p>

                          {/* Analytics for published */}
                          {post.analytics && (
                            <div className="flex gap-4 mb-2 text-[10px] text-muted-foreground">
                              <span className="flex items-center gap-1"><Eye className="w-3 h-3" /> {post.analytics.views}</span>
                              <span className="flex items-center gap-1"><Heart className="w-3 h-3" /> {post.analytics.likes}</span>
                              <span className="flex items-center gap-1"><MessageSquare className="w-3 h-3" /> {post.analytics.comments}</span>
                            </div>
                          )}

                          {/* Actions */}
                          <div className="flex gap-2">
                            {post.status === "published" && (
                              <button className="text-[10px] text-muted-foreground hover:text-foreground flex items-center gap-1">
                                <Eye className="w-3 h-3" /> 查看详情
                              </button>
                            )}
                            {post.status === "scheduled" && (
                              <>
                                <button className="text-[10px] text-muted-foreground hover:text-foreground flex items-center gap-1">
                                  <Edit3 className="w-3 h-3" /> 编辑
                                </button>
                                <button
                                  onClick={() => toast({ title: "已取消发布" })}
                                  className="text-[10px] text-brand-orange hover:text-brand-orange/80 flex items-center gap-1"
                                >
                                  <AlertCircle className="w-3 h-3" /> 取消发布
                                </button>
                              </>
                            )}
                            {post.status === "draft" && (
                              <>
                                <button className="text-[10px] text-muted-foreground hover:text-foreground flex items-center gap-1">
                                  <Edit3 className="w-3 h-3" /> 继续编辑
                                </button>
                                <button className="text-[10px] text-destructive hover:text-destructive/80 flex items-center gap-1">
                                  <Trash2 className="w-3 h-3" /> 删除
                                </button>
                              </>
                            )}
                            {post.status === "failed" && (
                              <button className="text-[10px] text-primary hover:text-primary/80 flex items-center gap-1">
                                <Share2 className="w-3 h-3" /> 重新发布
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Calendar view (simplified month grid) */}
      {view === "calendar" && (
        <div className="bg-card border border-border rounded-xl p-4">
          <div className="flex items-center justify-between mb-4">
            <button className="text-muted-foreground hover:text-foreground"><ChevronLeft className="w-4 h-4" /></button>
            <span className="text-sm font-semibold">2026年3月</span>
            <button className="text-muted-foreground hover:text-foreground"><ChevronRight className="w-4 h-4" /></button>
          </div>
          <div className="grid grid-cols-7 gap-1 text-center">
            {["一", "二", "三", "四", "五", "六", "日"].map((d) => (
              <div key={d} className="text-[10px] text-muted-foreground py-1 font-medium">{d}</div>
            ))}
            {/* Simplified: show days 17-31 */}
            {Array.from({ length: 15 }, (_, i) => {
              const day = i + 17;
              const dateStr = `2026-03-${day.toString().padStart(2, "0")}`;
              const dayPosts = postsByDate[dateStr] || [];
              const isToday = day === 26;
              return (
                <button
                  key={day}
                  onClick={() => dayPosts.length > 0 && setExpandedDate(dateStr)}
                  className={cn(
                    "aspect-square rounded-lg flex flex-col items-center justify-center gap-0.5 text-xs transition-colors",
                    isToday ? "bg-primary/10 border border-primary/30" : "hover:bg-secondary",
                    dayPosts.length > 0 && "cursor-pointer"
                  )}
                >
                  <span className={cn("text-[11px]", isToday && "font-bold text-primary")}>{day}</span>
                  {dayPosts.length > 0 && (
                    <div className="flex gap-0.5">
                      {dayPosts.slice(0, 3).map((p) => (
                        <span
                          key={p.id}
                          className={cn("w-1.5 h-1.5 rounded-full",
                            p.status === "published" ? "bg-brand-green" :
                            p.status === "scheduled" ? "bg-brand-orange" :
                            p.status === "draft" ? "bg-muted-foreground" : "bg-destructive"
                          )}
                        />
                      ))}
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {/* Expanded day detail below calendar */}
          {expandedDate && postsByDate[expandedDate] && (
            <div className="mt-4 border-t border-border pt-3 space-y-2">
              <h4 className="text-xs font-semibold">{formatDate(expandedDate)}</h4>
              {postsByDate[expandedDate].map((post) => {
                const sc = statusConfig[post.status];
                return (
                  <div key={post.id} className="flex items-center gap-2 p-2 rounded-lg bg-secondary/30">
                    <span className={cn("text-[9px] px-1.5 py-0.5 rounded", sc.className)}>{sc.emoji} {sc.label}</span>
                    <span className="text-[11px] font-medium flex-1 truncate">{post.title}</span>
                    <div className="flex gap-0.5">{post.platforms.map((p) => <span key={p} className="text-muted-foreground">{platformIcons[p]}</span>)}</div>
                    {post.time && <span className="text-[10px] text-muted-foreground">{post.time}</span>}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function ChevronDown(props: React.SVGProps<SVGSVGElement> & { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="m6 9 6 6 6-6"/>
    </svg>
  );
}

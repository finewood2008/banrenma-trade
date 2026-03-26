/**
 * EmailCampaigns - 邮件活动管理
 */
import { useState } from "react";
import { Eye, Pause, Pencil, Copy, Archive, Trash2, ChevronDown, ChevronUp, Download, Send, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface Campaign {
  id: string; name: string; status: "active" | "completed" | "draft";
  sent: number; opened: number; openRate: number; clicked: number; clickRate: number;
  replied: number; replyRate: number; unsubscribed: number; createdAt: string;
  isSequence: boolean; sequenceCount?: number; targetCount?: number;
}

const initialCampaigns: Campaign[] = [
  { id: "1", name: "LED Buyers - North America Q1", status: "active", sent: 450, opened: 198, openRate: 44, clicked: 67, clickRate: 14.9, replied: 23, replyRate: 5.1, unsubscribed: 2, createdAt: "2026-03-20", isSequence: true, sequenceCount: 5 },
  { id: "2", name: "Solar Panel Follow-up Sequence", status: "active", sent: 120, opened: 78, openRate: 65, clicked: 34, clickRate: 28.3, replied: 15, replyRate: 12.5, unsubscribed: 0, createdAt: "2026-03-18", isSequence: true, sequenceCount: 3 },
  { id: "3", name: "Monthly Product Newsletter", status: "completed", sent: 850, opened: 340, openRate: 40, clicked: 89, clickRate: 10.5, replied: 5, replyRate: 0.6, unsubscribed: 8, createdAt: "2026-03-01", isSequence: false },
  { id: "4", name: "European Market Expansion", status: "draft", sent: 0, opened: 0, openRate: 0, clicked: 0, clickRate: 0, replied: 0, replyRate: 0, unsubscribed: 0, createdAt: "2026-03-25", isSequence: false, targetCount: 320 },
];

const statusConfig: Record<string, { label: string; className: string }> = {
  active: { label: "进行中", className: "bg-brand-green/15 text-brand-green" },
  completed: { label: "已完成", className: "bg-brand-cyan/15 text-brand-cyan" },
  draft: { label: "草稿", className: "bg-muted text-muted-foreground" },
};

const sequenceProgress = [
  { step: 1, name: "首次开发信", sent: 450, openRate: 44, replyRate: 5.1 },
  { step: 2, name: "价值跟进", sent: 198, openRate: 38, replyRate: 12.5 },
  { step: 3, name: "案例分享", sent: 75, openRate: null, replyRate: null },
  { step: 4, name: "限时优惠", sent: 0, openRate: null, replyRate: null },
  { step: 5, name: "最终跟进", sent: 0, openRate: null, replyRate: null },
];

const highIntentContacts = [
  { name: "John Smith", company: "ABC Corp", detail: "打开3次，点击2次" },
  { name: "Sarah Lee", company: "XYZ Ltd", detail: "已回复" },
  { name: "Mike Chen", company: "Tech Inc", detail: "打开2次，点击1次" },
];

export default function EmailCampaigns() {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  return (
    <div className="space-y-3">
      {initialCampaigns.map((c) => {
        const s = statusConfig[c.status];
        const isExpanded = expandedId === c.id;
        return (
          <div key={c.id} className="bg-card border border-border rounded-xl overflow-hidden">
            <div className="p-4">
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2">
                  <span className={cn("text-[10px] px-1.5 py-0.5 rounded", s.className)}>{s.label}</span>
                  <span className="text-sm font-semibold">{c.name}</span>
                </div>
                <div className="flex items-center gap-1">
                  {c.status !== "draft" ? (
                    <>
                      <Button size="sm" variant="ghost" className="h-7 text-xs" onClick={() => setExpandedId(isExpanded ? null : c.id)}>
                        <Eye className="w-3 h-3 mr-1" /> 详情
                        {isExpanded ? <ChevronUp className="w-3 h-3 ml-1" /> : <ChevronDown className="w-3 h-3 ml-1" />}
                      </Button>
                      {c.status === "active" && (
                        <Button size="sm" variant="ghost" className="h-7 text-xs" onClick={() => toast("活动已暂停")}><Pause className="w-3 h-3 mr-1" /> 暂停</Button>
                      )}
                      <Button size="sm" variant="ghost" className="h-7 text-xs" onClick={() => toast("编辑功能即将上线")}><Pencil className="w-3 h-3" /></Button>
                    </>
                  ) : (
                    <>
                      <Button size="sm" variant="ghost" className="h-7 text-xs" onClick={() => toast("继续编辑")}>继续编辑</Button>
                      <Button size="sm" variant="ghost" className="h-7 text-xs text-destructive" onClick={() => toast("已删除")}><Trash2 className="w-3 h-3" /></Button>
                    </>
                  )}
                </div>
              </div>
              {c.sent > 0 ? (
                <div className="flex gap-4 text-[10px] text-muted-foreground">
                  <span>{c.sent}发送</span>
                  <span>{c.openRate}%打开</span>
                  <span>{c.clicked}点击</span>
                  <span>{c.replied}回复({c.replyRate}%)</span>
                  {c.isSequence && <span>自动序列: {c.sequenceCount}封</span>}
                </div>
              ) : (
                <div className="text-[10px] text-muted-foreground">目标受众: {c.targetCount}人 | 创建时间: {c.createdAt}</div>
              )}
            </div>

            {isExpanded && c.id === "1" && (
              <div className="border-t border-border p-4 space-y-4">
                <div className="grid grid-cols-2 lg:grid-cols-5 gap-2">
                  {[
                    { label: "已发送", value: "450封" },
                    { label: "打开率", value: "44%" },
                    { label: "点击率", value: "14.9%" },
                    { label: "回复率", value: "5.1%" },
                    { label: "退订率", value: "0.4%" },
                  ].map((d) => (
                    <div key={d.label} className="bg-secondary/30 rounded-lg p-2.5 text-center">
                      <div className="text-[10px] text-muted-foreground">{d.label}</div>
                      <div className="text-sm font-bold">{d.value}</div>
                    </div>
                  ))}
                </div>
                <div>
                  <h4 className="text-xs font-semibold mb-2">序列进度</h4>
                  <div className="space-y-1.5">
                    {sequenceProgress.map((sp) => (
                      <div key={sp.step} className="flex items-center gap-3 text-xs">
                        <div className={cn("w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0",
                          sp.sent > 0 ? "bg-brand-green/15 text-brand-green" : "bg-secondary text-muted-foreground"
                        )}>{sp.step}</div>
                        <span className="w-20 font-medium">{sp.name}</span>
                        <span className="text-muted-foreground">{sp.sent > 0 ? `${sp.sent}发送` : "待发送"}</span>
                        {sp.openRate !== null && <span className="text-muted-foreground">{sp.openRate}%打开</span>}
                        {sp.replyRate !== null && <span className="text-muted-foreground">{sp.replyRate}%回复</span>}
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-xs font-semibold flex items-center gap-1"><Users className="w-3 h-3" /> 高意向客户（23人）</h4>
                    <Button size="sm" variant="outline" className="h-6 text-[10px]"><Download className="w-3 h-3 mr-1" /> 导出列表</Button>
                  </div>
                  <div className="space-y-1">
                    {highIntentContacts.map((hc, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs p-1.5 rounded bg-secondary/20">
                        <span className="font-medium">{hc.name}</span>
                        <span className="text-muted-foreground">({hc.company})</span>
                        <span className="text-muted-foreground ml-auto">{hc.detail}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

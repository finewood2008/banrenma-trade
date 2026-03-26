/**
 * EmailLists - 客户列表管理
 */
import { useState } from "react";
import { Users, Upload, Plus, Inbox, Eye, Pencil, Send, ChevronDown, ChevronUp, Download } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface Contact {
  name: string;
  company: string;
  email: string;
  status: "active" | "inactive" | "unopened";
}

interface CustomerList {
  id: string;
  name: string;
  count: number;
  activeRate: number;
  lastUpdated: string;
  contacts: Contact[];
}

const mockLists: CustomerList[] = [
  {
    id: "1", name: "北美LED采购商", count: 450, activeRate: 78, lastUpdated: "2026-03-20",
    contacts: [
      { name: "John Smith", company: "ABC Corp", email: "john@abccorp.com", status: "active" },
      { name: "Sarah Lee", company: "XYZ Ltd", email: "sarah@xyzltd.com", status: "active" },
      { name: "Mike Chen", company: "Tech Inc", email: "mike@techinc.com", status: "unopened" },
      { name: "Emily Davis", company: "Global Trade", email: "emily@globaltrade.com", status: "active" },
      { name: "Robert Wilson", company: "Pacific Lighting", email: "robert@pacific.com", status: "inactive" },
    ],
  },
  {
    id: "2", name: "欧洲分销商", count: 320, activeRate: 65, lastUpdated: "2026-03-18",
    contacts: [
      { name: "Hans Mueller", company: "Euro Dist GmbH", email: "hans@eurodist.de", status: "active" },
      { name: "Marie Dupont", company: "Lumière SA", email: "marie@lumiere.fr", status: "active" },
      { name: "Paolo Rossi", company: "Italia LED", email: "paolo@italialed.it", status: "unopened" },
    ],
  },
  {
    id: "3", name: "中东工程商", count: 180, activeRate: 82, lastUpdated: "2026-03-15",
    contacts: [
      { name: "Ahmed Hassan", company: "Gulf Engineering", email: "ahmed@gulfeng.ae", status: "active" },
      { name: "Khalid Al-Rashid", company: "Riyadh Projects", email: "khalid@riyadhp.sa", status: "active" },
    ],
  },
];

const statusLabels: Record<string, { label: string; className: string }> = {
  active: { label: "活跃", className: "bg-brand-green/15 text-brand-green" },
  inactive: { label: "不活跃", className: "bg-muted text-muted-foreground" },
  unopened: { label: "未打开", className: "bg-destructive/15 text-destructive" },
};

export default function EmailLists() {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Button size="sm" variant="outline" onClick={() => toast("导入功能即将上线")}>
          <Upload className="w-3.5 h-3.5 mr-1.5" /> 导入客户
        </Button>
        <Button size="sm" variant="outline" onClick={() => toast("新建列表功能即将上线")}>
          <Plus className="w-3.5 h-3.5 mr-1.5" /> 新建列表
        </Button>
        <Button size="sm" variant="outline" onClick={() => toast("从询盘导入功能即将上线")}>
          <Inbox className="w-3.5 h-3.5 mr-1.5" /> 从询盘导入
        </Button>
      </div>

      <div className="space-y-3">
        {mockLists.map((list) => {
          const isExpanded = expandedId === list.id;
          return (
            <div key={list.id} className="bg-card border border-border rounded-xl overflow-hidden">
              <div className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-primary" />
                    <span className="text-sm font-semibold">{list.name}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Button size="sm" variant="ghost" className="h-7 text-xs" onClick={() => setExpandedId(isExpanded ? null : list.id)}>
                      <Eye className="w-3 h-3 mr-1" /> 查看
                      {isExpanded ? <ChevronUp className="w-3 h-3 ml-1" /> : <ChevronDown className="w-3 h-3 ml-1" />}
                    </Button>
                    <Button size="sm" variant="ghost" className="h-7 text-xs" onClick={() => toast("编辑功能即将上线")}>
                      <Pencil className="w-3 h-3 mr-1" /> 编辑
                    </Button>
                    <Button size="sm" variant="ghost" className="h-7 text-xs" onClick={() => toast("跳转到创建邮件活动")}>
                      <Send className="w-3 h-3 mr-1" /> 发送邮件
                    </Button>
                  </div>
                </div>
                <div className="flex gap-4 text-[11px] text-muted-foreground">
                  <span>{list.count}人</span>
                  <span>活跃度 {list.activeRate}%</span>
                  <span>最后更新: {list.lastUpdated}</span>
                </div>
              </div>

              {isExpanded && (
                <div className="border-t border-border">
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs">
                      <thead>
                        <tr className="border-b border-border bg-secondary/30">
                          <th className="text-left p-2.5 font-medium text-muted-foreground">姓名</th>
                          <th className="text-left p-2.5 font-medium text-muted-foreground">公司</th>
                          <th className="text-left p-2.5 font-medium text-muted-foreground">邮箱</th>
                          <th className="text-left p-2.5 font-medium text-muted-foreground">状态</th>
                        </tr>
                      </thead>
                      <tbody>
                        {list.contacts.map((c, i) => {
                          const s = statusLabels[c.status];
                          return (
                            <tr key={i} className="border-b border-border last:border-0 hover:bg-secondary/20">
                              <td className="p-2.5">{c.name}</td>
                              <td className="p-2.5 text-muted-foreground">{c.company}</td>
                              <td className="p-2.5 text-muted-foreground">{c.email}</td>
                              <td className="p-2.5">
                                <span className={cn("text-[10px] px-1.5 py-0.5 rounded", s.className)}>{s.label}</span>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                  <div className="p-2.5 border-t border-border flex gap-2">
                    <Button size="sm" variant="outline" className="h-7 text-xs" onClick={() => toast("CSV导出功能即将上线")}>
                      <Download className="w-3 h-3 mr-1" /> 导出CSV
                    </Button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

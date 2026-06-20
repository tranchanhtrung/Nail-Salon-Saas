import { useState } from "react";
import { 
  Bot, 
  Sparkles, 
  Send, 
  RefreshCw, 
  TrendingUp, 
  HeartHandshake, 
  AlertTriangle,
  FileText,
  Lightbulb,
  Award
} from "lucide-react";
import { Service, Staff, Customer, Booking, InventoryItem } from "../types";

interface AiManagerViewProps {
  services: Service[];
  staff: Staff[];
  customers: Customer[];
  bookings: Booking[];
  inventory: InventoryItem[];
}

export default function AiManagerView({
  services,
  staff,
  customers,
  bookings,
  inventory
}: AiManagerViewProps) {
  const [customPrompt, setCustomPrompt] = useState("");
  const [aiResponse, setAiResponse] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const quickPromptsList = [
    {
      title: "Tăng doanh thu tuần này",
      desc: "Gợi ý chiến lược upsell dịch vụ móng, combo Mani-Pedi và soạn 1 tin nhắn SMS kích cầu.",
      prompt: "Hãy phân tích tình hình kinh doanh của tiệm dạo gần đây. Gợi ý 3 cách nâng hạng dịch vụ (Upsell) từ cắt móng cỏ lên Combo và viết 1 mẫu tin nhắn SMS khuyến mãi cực chất kích cầu khách hàng cũ quay lại."
    },
    {
      title: "SMS kéo nhóm Miss You (60 ngày chưa ghé)",
      desc: "Soạn chiến dịch SMS độc đáo gửi nhóm khách rụng lịch, tặng Voucher $10 off.",
      prompt: "Viết kịch bản tin nhắn SMS gửi cho nhóm khách hàng trong CRM đã hơn 60 ngày chưa quay lại tiệm (Miss You group). Tạo không khí nhớ nhung thân thiết, dùng code 'MISSYOU10' tặng $10 off cho hóa đơn từ $45 trở lên."
    },
    {
      title: "Giải quyết sơn tồn kho cạn",
      desc: "Lập giải pháp vận hành hiệu quả kho hàng sơn, gel & mẹo thương lượng nhà cung cấp.",
      prompt: "Tôi có vài loại sơn gel đang bị cảnh báo sắp cạn (Low Stock). Hãy viết 1 danh mục quy trình kiểm kê kho chặt chẽ hàng tuần dành cho quản lý tiệm nails và gợi ý cách phối hợp với đại lý cung cấp sỉ (Salon Centric hoặc Dallas Supply) để tránh đứt hàng."
    },
    {
      title: "Tối ưu hóa chia lương thợ (60/40)",
      desc: "Phân tích chế độ chia % thợ và tip móng, gợi ý cách giữ chân thợ giỏi.",
      prompt: "Phân tích mô hình chia % doanh thu 60/40 cho thợ dạo gần đây. Làm thế nào để động viên thợ tích cực upsell, giữ chất lượng phục vụ 5 sao và cơ chế thưởng thợ có lượt review cao nhất tuần?"
    }
  ];

  const handleTriggerAIAnalysis = async (promptOverride?: string) => {
    setLoading(true);
    setErrorMsg("");
    setAiResponse("");

    const selectedPrompt = promptOverride || customPrompt || "Hãy phân tích nhanh tiệm nails.";

    // Gather metrics to feed Gemini for rich context
    const lowStockItems = inventory.filter(i => i.stockLevel < i.minStockLevel);
    const dataForAnalysis = {
      services,
      staff,
      customers,
      bookings,
      lowStockItems
    };

    try {
      const response = await fetch("/api/gemini/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          dataForAnalysis,
          customPrompt: selectedPrompt
        })
      });

      const resData = await response.json();
      if (!response.ok) {
        throw new Error(resData.error || "Gặp sự cố khi phân tích dữ liệu.");
      }

      setAiResponse(resData.analysis);
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || "Lỗi bất ngờ xảy ra khi kết nối tới Trợ lý AI.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Visual Header Banner */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between bg-gradient-to-tr from-indigo-950 via-slate-900 to-indigo-950 rounded-3xl p-6 text-white shadow-lg">
        <div className="flex items-start gap-4">
          <div className="h-12 w-12 rounded-2xl bg-indigo-500 flex items-center justify-center text-white shadow-inner animate-pulse">
            <Bot className="h-6 w-6" />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="bg-indigo-500/25 border border-indigo-400/30 rounded-full px-2 py-0.5 text-[9px] font-bold tracking-widest text-indigo-300 uppercase">
                Powered by Gemini 3.5
              </span>
            </div>
            <h2 className="font-display text-2xl font-bold tracking-tight">AI Salon Manager Dashboard</h2>
            <p className="text-xs text-slate-350 mt-0.5">
              Trợ lý ảo phân tích sâu doanh số, soạn tin nhắn Marketing độc quyền và cố ý vận hành salon Nails
            </p>
          </div>
        </div>
      </div>

      {/* Roster state snapshots fed to AI */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div className="bg-white border rounded-xl p-3 shadow-2xs text-center">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Hồ sơ thợ nails</p>
          <p className="text-lg font-black text-slate-800 font-mono mt-0.5">{staff.length}</p>
        </div>
        <div className="bg-white border rounded-xl p-3 shadow-2xs text-center">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Khách hàng CRM</p>
          <p className="text-lg font-black text-slate-800 font-mono mt-0.5">{customers.length}</p>
        </div>
        <div className="bg-white border rounded-xl p-3 shadow-2xs text-center">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Nguyên liệu cạn</p>
          <p className="text-lg font-black text-rose-500 font-mono mt-0.5">
            {inventory.filter(i => i.stockLevel < i.minStockLevel).length} items
          </p>
        </div>
        <div className="bg-white border rounded-xl p-3 shadow-2xs text-center">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Lịch hẹn đã đặt</p>
          <p className="text-lg font-black text-brand-500 font-mono mt-0.5">{bookings.length}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 items-start">
        {/* Left column: Quick prompt select & Input */}
        <div className="space-y-6">
          {/* Quick template pick list */}
          <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-xs space-y-3.5">
            <h3 className="font-display font-bold text-sm text-slate-800 flex items-center gap-1">
              <Lightbulb className="h-4.5 w-4.5 text-amber-500" />
              Chọn nhanh Kịch Bản AI:
            </h3>

            <div className="space-y-2 max-h-[300px] overflow-y-auto">
              {quickPromptsList.map((qp, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setCustomPrompt(qp.prompt);
                    handleTriggerAIAnalysis(qp.prompt);
                  }}
                  disabled={loading}
                  className="w-full text-left p-3 border border-slate-50 hover:border-brand-100 hover:bg-brand-50/10 rounded-xl transition text-xs font-semibold text-slate-700 hover:text-brand-900 group"
                >
                  <p className="font-bold mb-0.5 text-slate-800 group-hover:text-brand-600 transition flex items-center gap-1">
                    <span>{qp.title}</span> ⚡
                  </p>
                  <p className="text-[10px] text-slate-550 font-normal">{qp.desc}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Custom text area input */}
          <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-xs space-y-3.5">
            <h3 className="font-display font-semibold text-sm text-slate-800">
              Yêu cầu tư vấn riêng biệt:
            </h3>

            <div className="space-y-3">
              <textarea
                value={customPrompt}
                onChange={e => setCustomPrompt(e.target.value)}
                placeholder="Ví dụ: Hãy phân tích hiệu quả hoạt động của thợ Amber Nguyen và gợi ý cách tối đa tips cho cô ấy..."
                rows={3}
                className="w-full text-xs p-3.5 border border-slate-200 focus:border-indigo-500 rounded-xl focus:outline-none"
              />
              <button
                onClick={() => handleTriggerAIAnalysis()}
                disabled={loading || !customPrompt.trim()}
                className="w-full bg-slate-900 disabled:bg-slate-200 border text-white font-extrabold rounded-xl py-3 text-xs transition flex items-center justify-center gap-1.5 shadow"
              >
                {loading ? (
                  <RefreshCw className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
                {loading ? "Đang xử lý dữ liệu..." : "Bắn truy vấn tư vấn"}
              </button>
            </div>
          </div>
        </div>

        {/* Right 2 columns: AI text response renderer */}
        <div className="lg:col-span-2 rounded-2xl border border-slate-100 bg-white p-6 shadow-xs min-h-[460px] flex flex-col">
          <div className="flex items-center justify-between border-b pb-4 mb-4">
            <div className="flex items-center gap-2">
              <Bot className="h-5.5 w-5.5 text-slate-400" />
              <div>
                <h3 className="font-display font-extrabold text-slate-800">Kết Quả Phân Tích Độc Quyền từ AI</h3>
                <p className="text-[11px] text-slate-400">Thời gian thực dựa theo hồ sơ dữ liệu thợ & khách trong tiệm</p>
              </div>
            </div>

            {loading && (
              <span className="flex items-center gap-1.5 text-xs text-brand-600 font-bold font-mono animate-pulse">
                <RefreshCw className="h-3.5 w-3.5 animate-spin" /> Đang tổng hợp số liệu...
              </span>
            )}
          </div>

          {errorMsg && (
            <div className="p-4 bg-rose-50 text-rose-800 font-bold border border-rose-100 rounded-2xl text-xs">
              ⚠️ {errorMsg}
            </div>
          )}

          {/* AI Response Text box formatted elegantly */}
          <div className="flex-1 overflow-y-auto max-h-[500px] text-xs leading-relaxed text-slate-700 whitespace-pre-line space-y-4">
            {aiResponse ? (
              <div className="font-sans antialiased bg-slate-50/50 rounded-2xl p-5 border shadow-2xs select-text">
                {aiResponse}
              </div>
            ) : !loading ? (
              <div className="flex flex-col items-center justify-center text-center py-24 text-slate-400 space-y-3 max-w-sm mx-auto">
                <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-orange-50 text-orange-500">
                  <Lightbulb className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-700">Chưa có kết quả tư vấn</h4>
                  <p className="text-[11px] font-medium text-slate-550 mt-1">
                    Nhấp chọn một chiến lược kịch bản nhanh ở cột trái hoặc gõ câu hỏi tư vấn Nails riêng rồi bấm gửi để AI tổng hợp báo cáo giải pháp cho bạn!
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center text-center py-24 space-y-4 text-slate-400">
                <RefreshCw className="h-8 w-8 animate-spin text-brand-500" />
                <div>
                  <h4 className="font-bold text-slate-800 animate-pulse">Trí Tuệ Nhân Tạo Đang Đọc Thẻ Khách Hàng...</h4>
                  <p className="text-[11px] text-slate-500 max-w-xs mx-auto mt-1 leading-normal">
                    AI đang đọc danh mục nguyên vật liệu sắp cạn, lịch làm việc của {staff.length} thợ nails để soạn báo cáo tối ưu hóa dòng tiền dứt điểm cho tiệm!
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

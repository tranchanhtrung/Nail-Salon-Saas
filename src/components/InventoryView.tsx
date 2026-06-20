import React, { useState } from "react";
import { 
  Package, 
  Plus, 
  Search, 
  AlertCircle, 
  Trash2, 
  Truck, 
  Check, 
  ShoppingBag,
  RotateCw
} from "lucide-react";
import { InventoryItem } from "../types";

interface InventoryViewProps {
  inventory: InventoryItem[];
  onAddInventoryItem: (item: Omit<InventoryItem, "id">) => void;
  onUpdateStock: (itemId: string, increment: number) => void;
  onDeleteInventoryItem: (itemId: string) => void;
}

export default function InventoryView({
  inventory,
  onAddInventoryItem,
  onUpdateStock,
  onDeleteInventoryItem
}: InventoryViewProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");

  // Form states
  const [modalOpen, setModalOpen] = useState(false);
  const [newItemName, setNewItemName] = useState("");
  const [newItemCategory, setNewItemCategory] = useState<InventoryItem["category"]>("Gel Color");
  const [newItemStock, setNewItemStock] = useState("");
  const [newItemMinStock, setNewItemMinStock] = useState("");
  const [newItemUnit, setNewItemUnit] = useState("bottles");
  const [newItemSupplier, setNewItemSupplier] = useState("");
  const [noticeMsg, setNoticeMsg] = useState("");

  const filteredItems = inventory.filter(i => {
    const matchesSearch = i.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      i.supplier.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === "all" || i.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const handleAddNewItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemName.trim() || !newItemStock || !newItemMinStock) return;

    onAddInventoryItem({
      name: newItemName.trim(),
      category: newItemCategory,
      stockLevel: parseInt(newItemStock) || 0,
      minStockLevel: parseInt(newItemMinStock) || 5,
      unit: newItemUnit,
      supplier: newItemSupplier.trim() || "Salon Centric wholesales",
    });

    // Reset Form
    setNewItemName("");
    setNewItemStock("");
    setNewItemMinStock("");
    setNewItemSupplier("");
    setModalOpen(false);

    setNoticeMsg("✔️ Đã thêm nguyên liệu mới vào danh mục kho!");
    setTimeout(() => setNoticeMsg(""), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Visual Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-display text-2xl font-extrabold text-slate-800">Kho Nguyên Liệu Nails</h2>
          <p className="text-sm text-slate-500">Giám sát lượng sơn phủ, bột đắp móng, thiết bị dũa, cảnh báo sắp cạn kiệt</p>
        </div>
        <button
          onClick={() => setModalOpen(true)}
          className="flex items-center gap-1.5 self-start sm:self-auto rounded-full bg-slate-900 hover:bg-slate-800 text-sm font-bold text-white px-5 py-3 transition shadow active:scale-95"
        >
          <Plus className="h-4 w-4" /> Thêm Nguyên Liệu mới
        </button>
      </div>

      {noticeMsg && (
        <div className="p-3 bg-emerald-50 border border-emerald-100 text-emerald-800 font-bold text-center rounded-xl text-xs">
          {noticeMsg}
        </div>
      )}

      {/* Roster & Controls Panel */}
      <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row gap-3.5">
          {/* Search bar */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-3 h-4.5 w-4.5 text-slate-400" />
            <input
              type="text"
              placeholder="Tìm kiếm nguyên liệu theo tên, nhà cung cấp..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-200 focus:outline-none focus:border-brand-500 rounded-xl text-sm font-medium"
            />
          </div>

          {/* Filter categor */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-bold text-slate-600 focus:outline-none"
          >
            <option value="all">Tất cả Nhóm hàng</option>
            <option value="Gel Color">Sơn màu Gell (Gel Color)</option>
            <option value="Acrylic Powder">Bột đắp Acrylic (Powder)</option>
            <option value="Chemicals">Hóa chất Acetone / Dung dịch</option>
            <option value="Tools">Dụng cụ kìm / Máy mài</option>
            <option value="Accessories">Phụ kiện đính đá Art</option>
          </select>
        </div>

        {/* Main inventory table list */}
        <div className="overflow-x-auto rounded-2xl border border-slate-50">
          <table className="w-full text-left text-xs font-medium border-collapse text-slate-700">
            <thead>
              <tr className="bg-slate-50 font-mono font-bold text-slate-400 uppercase text-[9px] tracking-widest border-b border-slate-100">
                <th className="p-4">Dòng sản phẩm nguyên liệu</th>
                <th className="p-4">Nhóm phân loại</th>
                <th className="p-4">Nhà phân phối</th>
                <th className="p-4 text-center">Lượng Hàng Kho</th>
                <th className="p-4 text-center">Hành động nhập thêm</th>
                <th className="p-4 text-right">Thao Tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredItems.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-400 font-bold">Chưa tìm thấy nguyên liệu nails nào.</td>
                </tr>
              ) : (
                filteredItems.map((item) => {
                  const isLow = item.stockLevel < item.minStockLevel;
                  return (
                    <tr key={item.id} className="hover:bg-slate-50/50 transition duration-150">
                      <td className="p-4">
                        <div className="flex items-center gap-2.5">
                          <div className={`h-8 w-8 rounded-lg flex items-center justify-center shrink-0 ${
                            isLow ? "bg-rose-50 text-rose-500" : "bg-brand-50 text-brand-500"
                          }`}>
                            <Package className="h-4.5 w-4.5" />
                          </div>
                          <div>
                            <p className="font-bold text-slate-800 text-sm">{item.name}</p>
                            <p className="text-[10px] text-slate-400 font-mono mt-0.5">ID: {item.id}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className="bg-slate-100 rounded-md px-1.5 py-0.5 text-[10px] whitespace-nowrap text-slate-600 font-bold font-sans uppercase tracking-wider">
                          {item.category}
                        </span>
                      </td>
                      <td className="p-4 text-slate-500 font-bold">{item.supplier}</td>
                      <td className="p-4 text-center">
                        <div className="flex flex-col items-center">
                          <span className={`font-mono text-sm font-black px-2 py-0.5 rounded-lg border ${
                            isLow 
                              ? "bg-rose-50 text-rose-600 border-rose-100 animate-pulse" 
                              : "bg-slate-50 text-slate-800 "
                          }`}>
                            {item.stockLevel} {item.unit}
                          </span>
                          {isLow && (
                            <span className="text-[9px] text-rose-600 font-bold flex items-center gap-0.5 mt-1">
                              <AlertCircle className="h-3 w-3" /> Cần nhập gấp! (mức min: {item.minStockLevel})
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="p-4 text-center">
                        <div className="inline-flex gap-1.5">
                          <button
                            onClick={() => onUpdateStock(item.id, 5)}
                            className="bg-brand-500 hover:bg-brand-600 text-white font-bold rounded-lg px-2.5 py-1 text-[10px] transition-all"
                          >
                            +5 {item.unit}
                          </button>
                          <button
                            onClick={() => onUpdateStock(item.id, 10)}
                            className="bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-lg px-2.5 py-1 text-[10px] transition-all"
                          >
                            +10 {item.unit}
                          </button>
                        </div>
                      </td>
                      <td className="p-4 text-right">
                        <button
                          onClick={() => {
                            if (confirm(`Bạn muốn hủy dòng sản phẩm ${item.name} khỏi danh mục kho?`)) {
                              onDeleteInventoryItem(item.id);
                            }
                          }}
                          className="text-slate-350 hover:text-rose-600 p-1.5 hover:bg-rose-50 rounded-lg transition"
                        >
                          <Trash2 className="h-4.5 w-4.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Supplier support cards integration */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
        {/* Supplier 1 card info */}
        <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-xs flex items-center gap-4">
          <div className="h-12 w-12 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500 shrink-0">
            <Truck className="h-6 w-6" />
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="font-bold text-slate-800 text-sm truncate">Nhà Buôn Sỉ Nails - Dallas Supply</h4>
            <p className="text-xs text-slate-400 font-mono mt-0.5">ĐT: +1 (214) 555-0182 • Email: ship@dallasnails.com</p>
          </div>
          <button 
            type="button" 
            onClick={() => alert("Đang kết nối điện thoại Hotline sỉ Dallas Nails (Mô phỏng)...")}
            className="bg-slate-150 hover:bg-slate-200 border rounded-xl px-3 py-2 text-xs font-bold text-slate-700 transition"
          >
            Liên Hệ Sỉ
          </button>
        </div>

        {/* Supplier 2 card info */}
        <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-xs flex items-center gap-4">
          <div className="h-12 w-12 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500 shrink-0">
            <Truck className="h-6 w-6" />
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="font-bold text-slate-800 text-sm truncate">Tổng Kho Sơn OPI Việt - Houston Distributor</h4>
            <p className="text-xs text-slate-400 font-mono mt-0.5">ĐT: +1 (713) 555-0111 • Email: wholesale@opi-houston.com</p>
          </div>
          <button 
            type="button" 
            onClick={() => alert("Đang soạn email đơn đặt sỉ OPI và DND (Mô phỏng)...")}
            className="bg-slate-150 hover:bg-slate-200 border rounded-xl px-3 py-2 text-xs font-bold text-slate-700 transition"
          >
            Liên Hệ Sỉ
          </button>
        </div>
      </div>

      {/* Create Inventory Item modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl border border-slate-100 space-y-5 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-slate-50 pb-3">
              <h3 className="font-display text-lg font-extrabold text-slate-800">Thêm Nguyên Liệu Mới</h3>
              <button 
                onClick={() => setModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddNewItem} className="space-y-4 text-xs font-medium text-slate-700">
              <div className="space-y-1.5">
                <label className="font-bold text-slate-500 uppercase">Tên Nguyên Liệu / Phụ Kiện:</label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: OPI Gel Base coat v2"
                  value={newItemName}
                  onChange={e => setNewItemName(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-sm focus:border-brand-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3.5">
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-500 uppercase">Nhóm Nguyên Liệu:</label>
                  <select
                    value={newItemCategory}
                    onChange={e => setNewItemCategory(e.target.value as any)}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm bg-white focus:outline-none"
                  >
                    <option value="Gel Color">Sơn màu Gel (Gel Color)</option>
                    <option value="Acrylic Powder">Bột đắp Acrylic</option>
                    <option value="Chemicals">Hóa chất Acetone</option>
                    <option value="Tools">Dụng cụ thợ mài</option>
                    <option value="Accessories">Phụ kiện đính đá</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-slate-500 uppercase">Đơn Vị Tính:</label>
                  <input
                    type="text"
                    required
                    placeholder="Ví dụ: bottles / jars / jugs"
                    value={newItemUnit}
                    onChange={e => setNewItemUnit(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-sm focus:border-brand-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3.5">
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-500 uppercase">Mức tồn kho ban đầu:</label>
                  <input
                    type="number"
                    required
                    placeholder="Ví dụ: 12"
                    value={newItemStock}
                    onChange={e => setNewItemStock(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-sm focus:border-brand-500 focus:outline-none font-mono"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-slate-500 uppercase">Mức tối thiểu cảnh báo:</label>
                  <input
                    type="number"
                    required
                    placeholder="Ví dụ: 4"
                    value={newItemMinStock}
                    onChange={e => setNewItemMinStock(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-sm focus:border-brand-500 focus:outline-none font-mono"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-slate-550 uppercase">Nhà Cung Cấp / Phân Phối sỉ:</label>
                <input
                  type="text"
                  placeholder="Ví dụ: Salon Centric Wholesaler"
                  value={newItemSupplier}
                  onChange={e => setNewItemSupplier(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-sm focus:border-brand-500 focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-slate-900 hover:bg-slate-800 text-white font-extrabold rounded-xl py-3 text-xs transition shadow"
              >
                Nhập kho Mặt Hàng
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

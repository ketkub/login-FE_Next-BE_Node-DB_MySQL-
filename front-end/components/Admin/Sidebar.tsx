"use client";

import { 
  LogOut, 
  LayoutDashboard, 
  ShoppingCart, 
  Package, 
  Menu, 
  X,
  Folder
} from "lucide-react";

import { Button } from "@/components/ui/button"; 
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"; 
import { cn } from "@/lib/utils"; 

type ActiveTab = "dashboard" | "products" | "view-orders" | "categories";

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  onLogout: () => void;
}

export function Sidebar({
  sidebarOpen,
  setSidebarOpen,
  activeTab,
  setActiveTab,
  onLogout,
}: SidebarProps) {

  const NavButton = ({
    tab,
    label,
    icon,
  }: {
    tab: ActiveTab;
    label: string;
    icon: React.ReactNode;
  }) => (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant={activeTab === tab ? "default" : "ghost"}
          onClick={() => setActiveTab(tab)}
          className={cn(
            "w-full gap-3",
            sidebarOpen ? "justify-start" : "justify-center"
          )}
        >
          {icon}
          <span className={!sidebarOpen ? "hidden" : ""}>{label}</span>
        </Button>
      </TooltipTrigger>
      {!sidebarOpen && (
        <TooltipContent side="right">
          <p>{label}</p>
        </TooltipContent>
      )}
    </Tooltip>
  );

  return (
    <TooltipProvider>
      <div
        className={cn(
          "bg-slate-900 dark:bg-slate-950 text-white transition-all duration-300 flex flex-col shadow-lg",
          sidebarOpen ? "w-64" : "w-20"
        )}
      >
        {/* Logo */}
        <div className="p-6 border-b border-slate-700">
          <div className="flex items-center justify-between">
            <h1 className={cn("font-bold text-xl", !sidebarOpen && "hidden")}>
              Admin
            </h1>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="hover:bg-slate-800"
            >
              {sidebarOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </Button>
          </div>
        </div>

        {/* Menu Items */}
        <nav className="flex-1 p-4 space-y-2">
          <NavButton
            tab="dashboard"
            label="Dashboard"
            icon={<LayoutDashboard className="w-5 h-5" />}
          />
          <NavButton
            tab="products"
            label="สินค้า"
            icon={<Package className="w-5 h-5" />}
          />
          <NavButton
            tab="categories"
            label="หมวดหมู่"
            icon={<Folder className="w-5 h-5" />}
          />
          <NavButton
            tab="view-orders"
            label="คำสั่งซื้อ"
            icon={<ShoppingCart className="w-5 h-5" />}
          />
        </nav>

        {/* Logout Button */}
        <div className="p-4 border-t border-slate-700">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                onClick={onLogout}
                className={cn(
                  "w-full gap-3",
                  sidebarOpen ? "justify-start" : "justify-center"
                )}
              >
                <LogOut className="w-5 h-5" />
                <span className={!sidebarOpen ? "hidden" : ""}>
                  ออกจากระบบ
                </span>
              </Button>
            </TooltipTrigger>
            {!sidebarOpen && (
              <TooltipContent side="right">
                <p>ออกจากระบบ</p>
              </TooltipContent>
            )}
          </Tooltip>
        </div>
      </div>
    </TooltipProvider>
  );
}

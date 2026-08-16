"use client"

import * as React from "react"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarGroup,
  SidebarGroupLabel,
} from "@/components/ui/sidebar"
import { NavUser } from "@/components/nav-user"
import { 
  Sparkles, 
  Flame, 
  Award, 
  Zap, 
  Image as ImageIcon, 
  Film, 
  Layout, 
  Heart, 
  Unlock, 
  CreditCard,
  Layers
} from "lucide-react"

export function AppSidebar({
  currentUser,
  userCredits = 0,
  userRole = "Starter Plan",
  activeCategory = "all",
  searchQuery = "",
  favoritePromptIds = [],
  purchasedPromptIds = [],
  onSearchChange = () => {},
  onOpenAuth,
  onOpenUpgrade,
  onOpenHistory,
  onSignOut,
  onSelectCategory,
  ...props
}) {
  const getRoleTitle = (role) => {
    if (!role) return "Starter Plan";
    const lower = String(role).toLowerCase();
    if (lower === 'enterprise' || lower.includes('enterprise')) return "Enterprise Plan";
    if (lower === 'pro' || lower.includes('pro')) return "Pro Plan";
    if (lower === 'admin' || lower.includes('admin')) return "Admin Plan";
    if (lower === 'starter' || lower.includes('starter')) return "Starter Plan";
    return String(role);
  };

  const planTier = getRoleTitle(userRole);

  const userData = {
    name: currentUser ? (currentUser.email?.split('@')[0] || "User") : "Tamu (Guest)",
    email: currentUser ? currentUser.email : "Belum Masuk",
    planCredit: `${planTier} • ${userCredits.toLocaleString()} Kredit`,
    planTier: planTier,
    avatar: currentUser?.user_metadata?.avatar_url || "",
  };

  // 1. Curated Discovery Feeds
  const discoveryItems = [
    {
      id: 'all',
      label: 'Semua Prompt',
      icon: Sparkles,
      isActive: (activeCategory === 'all' || activeCategory === 'image') && searchQuery === '',
      onClick: () => {
        onSearchChange('');
        onSelectCategory && onSelectCategory('all');
      }
    },
    {
      id: 'trending',
      label: 'Trending Sekarang',
      icon: Flame,
      isActive: activeCategory === 'trending',
      onClick: () => {
        onSearchChange('');
        onSelectCategory && onSelectCategory('trending');
      }
    },
    {
      id: 'editor',
      label: 'Pilihan Editor',
      icon: Award,
      isActive: activeCategory === 'editor',
      onClick: () => {
        onSearchChange('');
        onSelectCategory && onSelectCategory('editor');
      }
    },
    {
      id: 'new',
      label: 'Baru Dirilis',
      icon: Zap,
      isActive: activeCategory === 'new',
      onClick: () => {
        onSearchChange('');
        onSelectCategory && onSelectCategory('new');
      }
    }
  ];

  // 2. Visual Categories
  const categoryItems = [
    {
      id: 'image',
      label: 'Image & Graphic',
      icon: ImageIcon,
      isActive: activeCategory === 'image',
      onClick: () => {
        onSearchChange('');
        onSelectCategory && onSelectCategory('image');
      }
    },
    {
      id: 'video',
      label: 'Video & Motion',
      icon: Film,
      isActive: activeCategory === 'video',
      onClick: () => {
        onSearchChange('');
        onSelectCategory && onSelectCategory('video');
      }
    },
    {
      id: 'website',
      label: 'Website & UI',
      icon: Layout,
      isActive: activeCategory === 'website',
      onClick: () => {
        onSearchChange('');
        onSelectCategory && onSelectCategory('website');
      }
    }
  ];

  // 3. User Personal Library
  const libraryItems = [
    {
      id: 'favorite',
      label: 'Favorit Saya',
      icon: Heart,
      badge: favoritePromptIds.length > 0 ? favoritePromptIds.length : null,
      isActive: activeCategory === 'favorite',
      onClick: () => {
        onSelectCategory && onSelectCategory(activeCategory === 'favorite' ? 'all' : 'favorite');
      }
    },
    {
      id: 'unlocked',
      label: 'Prompt Terbuka',
      icon: Unlock,
      badge: purchasedPromptIds.length > 0 ? purchasedPromptIds.length : null,
      isActive: activeCategory === 'unlocked',
      onClick: () => {
        onSelectCategory && onSelectCategory(activeCategory === 'unlocked' ? 'all' : 'unlocked');
      }
    }
  ];

  return (
    <Sidebar collapsible="icon" className="border-r border-black/5 dark:border-white/10 !bg-white dark:!bg-zinc-950 font-sans" {...props}>
      {/* Brand Header */}
      <SidebarHeader className="p-3 pb-2 !bg-white dark:!bg-zinc-950 border-b border-black/5 dark:border-white/5">
        <div className="flex items-center gap-2.5 px-1 py-1">
          <div className="w-7 h-7 rounded-xl bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 flex items-center justify-center shadow-xs shrink-0">
            <Layers size={15} className="stroke-[2.2]" />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="font-bold text-zinc-900 dark:text-white text-sm tracking-tight truncate leading-tight">
              Prompt Hub
            </span>
            <span className="text-[10px] text-zinc-400 font-medium tracking-wide uppercase">
              Curated Discovery
            </span>
          </div>
        </div>
      </SidebarHeader>

      {/* Main Navigation Content */}
      <SidebarContent className="px-2 py-3 gap-4 !bg-white dark:!bg-zinc-950">
        
        {/* Section 1: Discovery Feeds */}
        <SidebarGroup className="py-0">
          <SidebarGroupLabel className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider px-2.5 pb-1">
            Discovery
          </SidebarGroupLabel>
          <SidebarMenu className="gap-0.5">
            {discoveryItems.map((item) => {
              const IconComp = item.icon;
              return (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton
                    onClick={item.onClick}
                    className={`w-full flex items-center justify-between h-8.5 px-2.5 rounded-lg text-xs transition-all cursor-pointer ${
                      item.isActive
                        ? 'bg-zinc-100 dark:bg-zinc-800 text-zinc-950 dark:text-white font-semibold border border-black/5 dark:border-white/10 shadow-2xs'
                        : 'text-zinc-600 dark:text-zinc-400 font-medium hover:text-zinc-950 dark:hover:text-white hover:bg-zinc-100/70 dark:hover:bg-zinc-900'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <IconComp size={15} className={item.isActive ? 'text-purple-600 dark:text-purple-400 stroke-[2.2]' : 'text-zinc-400'} />
                      <span className="truncate text-xs">{item.label}</span>
                    </div>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarGroup>

        {/* Section 2: Visual Categories */}
        <SidebarGroup className="py-0">
          <SidebarGroupLabel className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider px-2.5 pb-1">
            Kategori Visual
          </SidebarGroupLabel>
          <SidebarMenu className="gap-0.5">
            {categoryItems.map((item) => {
              const IconComp = item.icon;
              return (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton
                    onClick={item.onClick}
                    className={`w-full flex items-center justify-between h-8.5 px-2.5 rounded-lg text-xs transition-all cursor-pointer ${
                      item.isActive
                        ? 'bg-zinc-100 dark:bg-zinc-800 text-zinc-950 dark:text-white font-semibold border border-black/5 dark:border-white/10 shadow-2xs'
                        : 'text-zinc-600 dark:text-zinc-400 font-medium hover:text-zinc-950 dark:hover:text-white hover:bg-zinc-100/70 dark:hover:bg-zinc-900'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <IconComp size={15} className={item.isActive ? 'text-purple-600 dark:text-purple-400 stroke-[2.2]' : 'text-zinc-400'} />
                      <span className="truncate text-xs">{item.label}</span>
                    </div>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarGroup>

        {/* Section 3: User Personal Library */}
        <SidebarGroup className="py-0">
          <SidebarGroupLabel className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider px-2.5 pb-1">
            Koleksi Saya
          </SidebarGroupLabel>
          <SidebarMenu className="gap-0.5">
            {libraryItems.map((item) => {
              const IconComp = item.icon;
              return (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton
                    onClick={item.onClick}
                    className={`w-full flex items-center justify-between h-8.5 px-2.5 rounded-lg text-xs transition-all cursor-pointer ${
                      item.isActive
                        ? 'bg-zinc-100 dark:bg-zinc-800 text-zinc-950 dark:text-white font-semibold border border-black/5 dark:border-white/10 shadow-2xs'
                        : 'text-zinc-600 dark:text-zinc-400 font-medium hover:text-zinc-950 dark:hover:text-white hover:bg-zinc-100/70 dark:hover:bg-zinc-900'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <IconComp size={15} className={item.isActive ? 'text-purple-600 dark:text-purple-400 stroke-[2.2]' : 'text-zinc-400'} />
                      <span className="truncate text-xs">{item.label}</span>
                    </div>
                    {item.badge !== null && item.badge !== undefined && (
                      <span className="px-2 py-0.5 rounded-full bg-purple-100 dark:bg-purple-950/70 text-purple-700 dark:text-purple-300 text-[10px] font-bold shrink-0 border border-purple-200/60 dark:border-purple-800/60">
                        {item.badge}
                      </span>
                    )}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarGroup>

        {/* Section 4: Subscription & Billing */}
        <SidebarGroup className="py-0 mt-auto">
          <SidebarMenu className="gap-0.5">
            <SidebarMenuItem>
              <SidebarMenuButton
                onClick={() => onOpenUpgrade && onOpenUpgrade()}
                className="w-full flex items-center justify-between h-9 px-2.5 rounded-lg text-xs transition-all cursor-pointer text-zinc-700 dark:text-zinc-300 hover:text-purple-700 dark:hover:text-purple-300 hover:bg-purple-50/80 dark:hover:bg-purple-950/40 border border-transparent hover:border-purple-200 dark:hover:border-purple-800/60 font-semibold"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <CreditCard size={15} className="text-purple-600 dark:text-purple-400 stroke-[2.2]" />
                  <span className="truncate text-xs">Langganan & Top Up</span>
                </div>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>

      </SidebarContent>

      {/* Footer User */}
      <SidebarFooter className="p-2 border-t border-black/5 dark:border-white/5 !bg-white dark:!bg-zinc-950">
        <NavUser 
          user={userData} 
          currentUser={currentUser}
          onOpenAuth={onOpenAuth}
          onOpenUpgrade={onOpenUpgrade}
          onSignOut={onSignOut}
        />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}

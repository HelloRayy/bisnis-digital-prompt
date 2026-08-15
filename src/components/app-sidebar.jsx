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
} from "@/components/ui/sidebar"
import { NavUser } from "@/components/nav-user"
import { 
  Folder01Icon,
  Search01Icon,
  ArrowDown01Icon,
  ArrowRight01Icon,
  FavouriteIcon,
  CircleUnlock01Icon,
  Layout01Icon,
  SparklesIcon,
  Cancel01Icon,
  CreditCardIcon
} from "hugeicons-react"

export function AppSidebar({
  currentUser,
  userCredits = 0,
  userRole = "Starter Plan",
  activeCategory = "image",
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
  const [isCategoryOpen, setIsCategoryOpen] = React.useState(true);

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

  // Navigasi Utama: Menu Esensial & Subscription
  const mainNavLinks = [
    {
      id: 'all',
      label: 'Semua Prompt',
      icon: SparklesIcon,
      isActive: (activeCategory === 'image' || activeCategory === 'all') && searchQuery === '',
      onClick: () => {
        onSearchChange('');
        onSelectCategory && onSelectCategory('image');
      }
    },
    {
      id: 'favorite',
      label: 'Favorit Saya',
      icon: FavouriteIcon,
      badge: favoritePromptIds.length > 0 ? favoritePromptIds.length : null,
      isActive: activeCategory === 'favorite',
      onClick: () => {
        onSelectCategory && onSelectCategory(activeCategory === 'favorite' ? 'image' : 'favorite');
      }
    },
    {
      id: 'unlocked',
      label: 'Prompt Terbuka',
      icon: CircleUnlock01Icon,
      badge: purchasedPromptIds.length > 0 ? purchasedPromptIds.length : null,
      isActive: activeCategory === 'unlocked',
      onClick: () => {
        onSelectCategory && onSelectCategory(activeCategory === 'unlocked' ? 'image' : 'unlocked');
      }
    },
    {
      id: 'subscription',
      label: 'Subscription',
      icon: CreditCardIcon,
      onClick: () => onOpenUpgrade && onOpenUpgrade()
    }
  ];

  // Kategori Visual: Bersih & Terfokus
  const categoryFolders = [
    { id: 'image', name: 'Image & Graphic', icon: Folder01Icon },
    { id: 'video', name: 'Video & Motion', icon: Folder01Icon },
    { id: 'website', name: 'Website & UI', icon: Folder01Icon }
  ];

  return (
    <Sidebar collapsible="icon" className="border-r border-black/5 dark:border-white/10 !bg-white dark:!bg-zinc-950 font-sans" {...props}>
      {/* Brand Header */}
      <SidebarHeader className="p-2.5 pb-1 !bg-white dark:!bg-zinc-950">
        <div className="flex items-center gap-2 px-1.5 py-0.5">
          <div className="w-6.5 h-6.5 rounded-lg bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 flex items-center justify-center shadow-2xs shrink-0">
            <Layout01Icon size={14} />
          </div>
          <span className="font-bold text-zinc-900 dark:text-white text-sm tracking-tight truncate">
            Prompt Hub
          </span>
        </div>

        {/* Realtime Search Input */}
        <div className="mt-2 relative w-full">
          <div className="flex items-center gap-2 h-7.5 bg-zinc-100/80 dark:bg-zinc-900/90 rounded-lg px-2.5 text-xs border border-black/5 dark:border-white/10 transition-all focus-within:ring-1 focus-within:ring-purple-500/50">
            <Search01Icon size={13} className="text-zinc-400 shrink-0" />
            <input 
              type="text"
              placeholder="Cari prompt..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full bg-transparent text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none text-[11px] font-normal"
            />
            {searchQuery && (
              <button 
                onClick={() => onSearchChange('')}
                className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 cursor-pointer shrink-0"
              >
                <Cancel01Icon size={12} />
              </button>
            )}
          </div>
        </div>
      </SidebarHeader>

      {/* Main Navigation Content */}
      <SidebarContent className="px-2 py-1.5 gap-2 !bg-white dark:!bg-zinc-950">
        {/* Main Nav Links */}
        <SidebarGroup className="py-0">
          <SidebarMenu className="gap-0.5">
            {mainNavLinks.map((link) => {
              const IconComp = link.icon;
              return (
                <SidebarMenuItem key={link.id}>
                  <SidebarMenuButton
                    onClick={link.onClick}
                    className={`w-full flex items-center justify-between h-8 px-2.5 rounded-lg text-xs transition-all cursor-pointer ${
                      link.isActive
                        ? 'bg-zinc-100 dark:bg-zinc-800/90 text-zinc-950 dark:text-white font-medium border border-black/5 dark:border-white/10 shadow-2xs'
                        : 'text-zinc-600 dark:text-zinc-400 font-normal hover:text-zinc-950 dark:hover:text-white hover:bg-zinc-100/60 dark:hover:bg-zinc-900'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <IconComp size={15} className={link.isActive ? 'text-zinc-950 dark:text-white' : 'text-zinc-400'} />
                      <span className="truncate text-xs">{link.label}</span>
                    </div>
                    {link.badge !== null && link.badge !== undefined && (
                      <span className="px-1.5 py-0.2 rounded-md bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 text-[10px] font-semibold shrink-0">
                        {link.badge}
                      </span>
                    )}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarGroup>

        {/* Collapsible Categories */}
        <SidebarGroup className="py-0">
          <div className="flex items-center justify-between px-2.5 py-1 text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
            <button 
              onClick={() => setIsCategoryOpen(!isCategoryOpen)}
              className="flex items-center gap-1.5 hover:text-zinc-800 dark:hover:text-white transition-colors cursor-pointer"
            >
              {isCategoryOpen ? <ArrowDown01Icon size={12} /> : <ArrowRight01Icon size={12} />}
              <span>Kategori</span>
            </button>
          </div>

          {isCategoryOpen && (
            <SidebarMenu className="gap-0.5 mt-0.5">
              {categoryFolders.map((folder) => {
                const FolderIconComp = folder.icon;
                const isSelected = activeCategory === folder.id;
                return (
                  <SidebarMenuItem key={folder.id}>
                    <SidebarMenuButton
                      onClick={() => onSelectCategory && onSelectCategory(folder.id)}
                      className={`w-full flex items-center gap-2.5 h-7.5 px-2.5 rounded-lg text-xs transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-zinc-100/90 dark:bg-zinc-800/80 text-zinc-950 dark:text-white font-medium border border-black/5 dark:border-white/10'
                          : 'text-zinc-600 dark:text-zinc-400 font-normal hover:text-zinc-950 dark:hover:text-white hover:bg-zinc-100/60 dark:hover:bg-zinc-900'
                      }`}
                    >
                      <FolderIconComp size={14} className={isSelected ? 'text-purple-600' : 'text-zinc-400'} />
                      <span className="truncate text-xs">{folder.name}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          )}
        </SidebarGroup>
      </SidebarContent>

      {/* Footer User */}
      <SidebarFooter className="p-1.5 border-t border-black/5 dark:border-white/5 !bg-white dark:!bg-zinc-950">
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

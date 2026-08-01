"use client"

import * as React from "react"
import { NavMain } from "@/components/nav-main"
import { NavProjects } from "@/components/nav-projects"
import { NavUser } from "@/components/nav-user"
import { TeamSwitcher } from "@/components/team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"
import { 
  Sparkles, 
  ImageIcon, 
  VideoIcon, 
  GlobeIcon, 
  CameraIcon, 
  Palette, 
  BookmarkIcon, 
  CreditCardIcon, 
  HistoryIcon, 
  LayersIcon,
  FlameIcon,
  LockIcon,
  StarIcon
} from "lucide-react"

export function AppSidebar({
  currentUser,
  userCredits = 0,
  userRole = "Starter Plan",
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

  const platformTeams = [
    {
      name: "Prompt Hub",
      logo: <Sparkles className="size-4 text-purple-600" />,
      plan: "Bisnis Digital Platform",
    },
    {
      name: "Daniel Triendl",
      logo: <Palette className="size-4 text-amber-500" />,
      plan: "Featured Visual Artist",
    },
  ];

  const navMainItems = [
    {
      title: "Kategori Visual",
      url: "#",
      icon: <ImageIcon className="size-4" />,
      isActive: true,
      items: [
        {
          title: "Image & Graphic",
          onClick: () => onSelectCategory && onSelectCategory("image"),
        },
        {
          title: "Video & Motion",
          onClick: () => onSelectCategory && onSelectCategory("video"),
        },
        {
          title: "Website & UI",
          onClick: () => onSelectCategory && onSelectCategory("website"),
        },
        {
          title: "Photography",
          onClick: () => onSelectCategory && onSelectCategory("image"),
        },
        {
          title: "Illustration & 3D",
          onClick: () => onSelectCategory && onSelectCategory("image"),
        },
      ],
    },
    {
      title: "Koleksi & Filter",
      url: "#",
      icon: <BookmarkIcon className="size-4" />,
      isActive: true,
      items: [
        {
          title: "Semua Karya",
          onClick: () => onSelectCategory && onSelectCategory("image"),
        },
        {
          title: "Prompt Terbuka (Unlocked)",
          onClick: () => onSelectCategory && onSelectCategory("image"),
        },
        {
          title: "Favorit Saya",
          onClick: () => onSelectCategory && onSelectCategory("image"),
        },
        {
          title: "Prompt Premium (20 Kredit)",
          onClick: () => onSelectCategory && onSelectCategory("image"),
        },
      ],
    },
  ];

  const quickAccessProjects = [
    {
      name: "Isi / Top Up Kredit",
      url: "/subscription",
      icon: <CreditCardIcon className="size-4 text-amber-500" />,
      onClick: () => onOpenUpgrade && onOpenUpgrade(),
    },
    {
      name: "Riwayat Transaksi",
      url: "#",
      icon: <HistoryIcon className="size-4 text-purple-500" />,
      onClick: () => onOpenHistory ? onOpenHistory() : onOpenUpgrade && onOpenUpgrade(),
    },
    {
      name: "Galeri Utama (/)",
      url: "/",
      icon: <LayersIcon className="size-4 text-blue-500" />,
      onClick: () => onSelectCategory && onSelectCategory("image"),
    },
  ];

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={platformTeams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navMainItems} />
        <NavProjects projects={quickAccessProjects} label="Akses & Saldo" />
      </SidebarContent>
      <SidebarFooter>
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

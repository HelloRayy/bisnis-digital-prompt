import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar
} from "@/components/ui/sidebar"
import { ChevronsUpDownIcon, SparklesIcon, LogOutIcon } from "lucide-react"

export function NavUser({
  user,
  currentUser,
  onOpenAuth = () => {},
  onOpenUpgrade = () => {},
  onSignOut = () => {}
}) {
  const { isMobile } = useSidebar();

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <SidebarMenuButton className="h-13 px-2.5 py-2 rounded-xl aria-expanded:bg-zinc-100 hover:bg-zinc-100/80 dark:hover:bg-zinc-900 transition-colors gap-3" />
            }>
            <Avatar className="h-9.5 w-9.5 rounded-full shrink-0 shadow-2xs ring-1 ring-black/5 dark:ring-white/10">
              <AvatarImage src={user.avatar} alt={user.name} />
              <AvatarFallback className="text-xs font-bold bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300">
                {user.name ? user.name.slice(0, 2).toUpperCase() : 'US'}
              </AvatarFallback>
            </Avatar>
            <div className="grid flex-1 text-left text-xs leading-normal min-w-0">
              <span className="truncate font-bold text-zinc-950 dark:text-white text-[13px] tracking-tight">{user.name}</span>
              <span className="truncate text-xs font-semibold text-purple-600 dark:text-purple-400">{user.planCredit || user.email}</span>
            </div>
            <ChevronsUpDownIcon className="ml-auto size-4 text-zinc-400 shrink-0" />
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-64 rounded-2xl p-2 shadow-2xl border border-zinc-200/90 dark:border-zinc-800 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-md"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={16}
            alignOffset={-4}>
            <DropdownMenuGroup>
              <DropdownMenuLabel className="p-0 font-normal">
                <div className="flex items-center gap-2.5 px-2 py-2 text-left text-sm bg-zinc-50 dark:bg-zinc-850 rounded-xl mb-1 border border-black/5 dark:border-white/5">
                  <Avatar className="h-8.5 w-8.5 rounded-full shadow-xs">
                    <AvatarImage src={user.avatar} alt={user.name} />
                    <AvatarFallback className="text-xs font-bold bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300">
                      {user.name ? user.name.slice(0, 2).toUpperCase() : 'US'}
                    </AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-xs leading-tight min-w-0">
                    <span className="truncate font-bold text-zinc-950 dark:text-white">{user.name}</span>
                    <span className="truncate text-[11px] text-zinc-500 dark:text-zinc-400">{user.email}</span>
                  </div>
                </div>
              </DropdownMenuLabel>
            </DropdownMenuGroup>
            <DropdownMenuSeparator className="my-1 bg-zinc-100 dark:bg-zinc-800" />
            <DropdownMenuGroup>
              <DropdownMenuItem onClick={onOpenUpgrade} className="cursor-pointer text-xs font-semibold py-2 px-2.5 rounded-xl hover:bg-purple-50 dark:hover:bg-purple-950/40 text-zinc-800 dark:text-zinc-200 flex items-center gap-2">
                <SparklesIcon className="text-purple-600 dark:text-purple-400 size-4 shrink-0" />
                <span>Top Up Kredit</span>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator className="my-1 bg-zinc-100 dark:bg-zinc-800" />
            {currentUser ? (
              <DropdownMenuItem onClick={onSignOut} className="cursor-pointer text-xs font-semibold py-2 px-2.5 rounded-xl hover:bg-rose-50 dark:hover:bg-rose-950/40 text-rose-600 dark:text-rose-400 flex items-center gap-2">
                <LogOutIcon className="size-4 shrink-0" />
                <span>Keluar (Sign Out)</span>
              </DropdownMenuItem>
            ) : (
              <DropdownMenuItem onClick={onOpenAuth} className="cursor-pointer text-xs font-semibold py-2 px-2.5 rounded-xl hover:bg-purple-50 dark:hover:bg-purple-950/40 text-purple-600 dark:text-purple-400 flex items-center gap-2">
                <LogOutIcon className="size-4 shrink-0" />
                <span>Masuk / Daftar</span>
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}

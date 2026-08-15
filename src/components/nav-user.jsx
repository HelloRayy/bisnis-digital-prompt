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
} from "@/components/ui/sidebar"
import { ChevronsUpDownIcon, SparklesIcon, LogOutIcon } from "lucide-react"

export function NavUser({
  user,
  currentUser,
  onOpenAuth = () => {},
  onOpenUpgrade = () => {},
  onSignOut = () => {}
}) {
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <SidebarMenuButton className="h-9 px-2 py-1 rounded-lg aria-expanded:bg-zinc-100 hover:bg-zinc-100/70 dark:hover:bg-zinc-900 transition-colors" />
            }>
            <Avatar className="h-7 w-7 rounded-full shrink-0">
              <AvatarImage src={user.avatar} alt={user.name} />
              <AvatarFallback className="text-[10px] font-bold">{user.name ? user.name.slice(0, 2).toUpperCase() : 'US'}</AvatarFallback>
            </Avatar>
            <div className="grid flex-1 text-left text-xs leading-tight min-w-0">
              <span className="truncate font-semibold text-zinc-900 dark:text-white text-xs">{user.name}</span>
              <span className="truncate text-[10px] font-semibold text-purple-600 dark:text-purple-400">{user.planCredit || user.email}</span>
            </div>
            <ChevronsUpDownIcon className="ml-auto size-3.5 text-zinc-400 shrink-0" />
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-56"
            side="top"
            align="start"
            sideOffset={8}>
            <DropdownMenuGroup>
              <DropdownMenuLabel className="p-0 font-normal">
                <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user.avatar} alt={user.name} />
                    <AvatarFallback>{user.name ? user.name.slice(0, 2).toUpperCase() : 'US'}</AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-medium">{user.name}</span>
                    <span className="truncate text-xs text-muted-foreground">{user.email}</span>
                  </div>
                </div>
              </DropdownMenuLabel>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem onClick={onOpenUpgrade} className="cursor-pointer text-xs">
                <SparklesIcon className="text-amber-500 size-4" />
                Top Up Kredit
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            {currentUser ? (
              <DropdownMenuItem onClick={onSignOut} className="cursor-pointer text-xs text-red-600">
                <LogOutIcon className="size-4" />
                Keluar (Sign Out)
              </DropdownMenuItem>
            ) : (
              <DropdownMenuItem onClick={onOpenAuth} className="cursor-pointer text-xs text-purple-600">
                <LogOutIcon className="size-4" />
                Masuk / Daftar
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}

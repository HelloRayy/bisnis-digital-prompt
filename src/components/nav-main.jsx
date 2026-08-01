import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar"
import { ChevronRightIcon } from "lucide-react"

export function NavMain({
  items
}) {
  return (
    <SidebarGroup>
      <SidebarGroupLabel>Platform</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => (
          <Collapsible
            key={item.title}
            defaultOpen={item.isActive}
            className="group/collapsible"
            render={<SidebarMenuItem />}
          >
            <CollapsibleTrigger 
              className="group/trigger w-full cursor-pointer rounded-lg transition-all duration-200 hover:bg-purple-50/80 hover:text-purple-600 active:scale-[0.99]"
              render={<SidebarMenuButton tooltip={item.title} className="group-hover/trigger:translate-x-1 transition-transform" />}
            >
              <span className="shrink-0 transition-transform duration-200 group-hover/trigger:scale-110 group-hover/trigger:rotate-6 text-purple-600">
                {item.icon}
              </span>
              <span className="font-semibold transition-colors">{item.title}</span>
              <ChevronRightIcon
                className="ml-auto transition-transform duration-200 group-data-open/collapsible:rotate-90 group-hover/trigger:translate-x-0.5" 
              />
            </CollapsibleTrigger>
            <CollapsibleContent>
              <SidebarMenuSub>
                {item.items?.map((subItem) => (
                  <SidebarMenuSubItem key={subItem.title}>
                    <SidebarMenuSubButton 
                      className="group/subitem transition-all duration-200 hover:translate-x-1 hover:text-purple-600 hover:font-bold"
                      render={
                        <a 
                          href={subItem.url || "#"} 
                          onClick={(e) => {
                            if (subItem.onClick) {
                              e.preventDefault();
                              subItem.onClick();
                            }
                          }} 
                        />
                      }
                    >
                      <span className="transition-transform group-hover/subitem:translate-x-0.5">{subItem.title}</span>
                    </SidebarMenuSubButton>
                  </SidebarMenuSubItem>
                ))}
              </SidebarMenuSub>
            </CollapsibleContent>
          </Collapsible>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}

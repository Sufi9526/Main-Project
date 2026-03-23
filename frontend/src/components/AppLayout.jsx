import {
  Sidebar,
  SidebarProvider,
  SidebarInset,
} from "../components/ui/sidebar"

export default function AppLayout({ children }) {
  return (
    <SidebarProvider>
      {/* Sidebar venel ivide add cheyyam */}
      {/* <Sidebar>Sidebar content</Sidebar> */}

      <SidebarInset>
        {children}
      </SidebarInset>
    </SidebarProvider>
  )
}

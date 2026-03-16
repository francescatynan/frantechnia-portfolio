import { Outlet } from "@tanstack/react-router";
import LayoutShellTopNav from "../components/LayoutShellTopNav";

export default function RootLayout() {
  return (
    <LayoutShellTopNav>
      <Outlet />
    </LayoutShellTopNav>
  );
}

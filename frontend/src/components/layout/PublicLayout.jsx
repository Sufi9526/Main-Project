import { Outlet } from "react-router-dom";
import { Footer } from "./Footer";
import  Navbar  from "./Navbar";

export function PublicLayout() {
  return (
    <div >
      <Navbar />
      <main className="">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

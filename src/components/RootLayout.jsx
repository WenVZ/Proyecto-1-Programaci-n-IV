import { useState } from "react";
import { Outlet } from "@tanstack/react-router";
import Footer from "./Footer";
import Navbar from "./Navbar";
import { UserContext } from "../context/UserContext";
import { getSession } from "../services/authService";

function RootLayout() {
  const [user, setUser] = useState(getSession());

  return (
    <UserContext.Provider value={{ user, setUser }}>
      <div>
        <Navbar />
        <div className="flex">
          <main className="p-6 flex-1">
            <Outlet />
          </main>
        </div>
        <Footer />
      </div>
    </UserContext.Provider>
  );
}

export default RootLayout;

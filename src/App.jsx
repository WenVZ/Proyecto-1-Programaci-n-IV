import Navbar from "./components/Navbar"
import Sidebar from "./components/Sidebar"
import Footer from "./components/Footer"

import Home from "./pages/Home"

function App() {
  return (
    <div>

      <Navbar />

      <div className="flex">

        <Sidebar />

        <div className="p-6 flex-1">
          <Home />
        </div>

      </div>

      <Footer />

    </div>
  )
}

export default App
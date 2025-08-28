// App.jsx
import Navbar from "./components/Navbar";
import Home from "./pages/Home";


export default function App() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <Navbar />
      <main className="flex-1 flex items-center justify-center p-6">
        <Home />
      </main>
    </div>
  );
}

import { useState } from "react";
import { Outlet } from "react-router-dom"; 
import Navbar from "../components/Navbar"; 
// import Sidebar from "../components/Sidebar";

export default function MainLayout() { 
  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState("Semua Kategori");

  return ( 
    <div className="flex flex-col min-h-screen bg-stone-50"> 
      <Navbar />

      <header className="bg-emerald-50 p-4 border-b border-emerald-100 flex flex-col md:flex-row gap-2 justify-between items-center"> 
        <input 
          type="text" 
          placeholder="Cari produk kerajinan..." 
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
          className="w-full md:w-1/3 px-4 py-2 border border-emerald-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500" 
        /> 
        <select
          value={category}
          onChange={(event) => setCategory(event.target.value)}
          className="px-4 py-2 border border-emerald-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
        > 
          <option>Semua Kategori</option> 
          <option>Dekorasi</option> 
          <option>Aksesoris</option> 
          <option>Perabot</option> 
          <option>Taman</option> 
          <option>Hiasan</option> 
        </select> 
      </header> 
 
      <main className="flex-1 p-6"> 
        <Outlet context={{ searchTerm, category }} /> 
      </main> 
 
      <footer className="bg-gray-800 text-white text-center p-4"> 
        <p>© 2026 Langkah Lestari | Kerajinan dari Barang Bekas</p> 
      </footer> 
    </div> 
  ); 
} 

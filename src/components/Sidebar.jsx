import { Link } from "react-router-dom"; 
import logo from "../assets/products/logo.png";

export default function Sidebar({ sidebarOpen, setSidebarOpen }) { 
  return ( 
    <div className={`${ sidebarOpen ? "block" : "hidden" } md:block w-64 bg-white shadow-md`} > 
      <div className="p-4 flex items-center">
        <span className="w-14 h-14 overflow-hidden flex items-center justify-center">
          <img src={logo} alt="Logo Langkah Lestari" className="w-full h-full object-contain scale-150" />
        </span>
      </div> 
      <nav className="flex flex-col p-4 space-y-2"> 
        <Link to="/admin/dashboard" className="hover:bg-emerald-100 p-2 rounded font-medium text-gray-700"> 
          Dashboard 
        </Link> 
        <Link to="/admin/about" className="hover:bg-emerald-100 p-2 rounded font-medium text-gray-700"> 
          Produk 
        </Link> 

        <Link to="/admin/info" className="hover:bg-emerald-100 p-2 rounded font-medium text-gray-700"> 
          Barang Bekas 
        </Link>
      </nav> 
    </div> 
  ); 
}

import { Link } from "react-router-dom"; 
import { useCart } from "../context/CartContext";
import logo from "../assets/products/logo.png";

export default function Navbar(){
    const { totalQty } = useCart();

    return (
        <nav className="bg-emerald-700 text-white px-6 py-4 flex justify-between items-center shadow-sm"> 
            <Link to="/" aria-label="Langkah Lestari" className="flex items-center"> 
                <span className="w-12 h-12 overflow-hidden flex items-center justify-center">
                    <img src={logo} alt="Logo Langkah Lestari" className="w-full h-full object-contain scale-150" />
                </span>
            </Link> 

            <div className="flex gap-6 items-center flex-wrap"> 
                <Link to="/dashboard" className="hover:text-emerald-100"> 
                    Produk 
                </Link> 

                <Link to="/buyback" className="hover:text-emerald-100">
                    Beli Bekas
                </Link>

                <Link to="/cart" className="hover:text-emerald-100 flex items-center gap-2"> 
                    Keranjang
                    {totalQty > 0 && (
                        <span className="bg-red-500 text-xs px-2 py-0.5 rounded-full">
                            {totalQty}
                        </span>
                    )}
                </Link> 

                <Link to="/checkout" className="hover:text-emerald-100"> 
                    Checkout 
                </Link> 
            </div> 
        </nav> 
    );
}

import { useEffect, useState } from "react";
import { useFetch } from "../../hooks/useHttpRequest";
import { API_URL_ADMIN } from "../../lib/const";
import { formatDateFr } from "../../lib/utils";
import { Trash2Icon, PlusIcon, MinusIcon, ShoppingCart } from "lucide-react";
import { useClientCart } from "../../context/ClientCartContext";
import { Link } from "react-router-dom";

const ViewProducts = ({ product }) => {
    const { addProductToCart } = useClientCart();
    const [qtt, setQtt] = useState(0);

    const handleAddToCart = () => {
        addProductToCart(product, qtt)
    }

    return (
        <div className="flex flex-col gap-2 p-2 rounded-sm border border-neutral-200 w-62">
            <div className="flex items-center justify-center max-w-full h-62">
                <img
                    src={product?.images?.length > 0 && product?.images[0].medium_image_url}
                    alt={product.meta_description}
                    className="max-w-full max-h-full rounded-xs"
                />
            </div>
            <div className="flex items-center font-light text-neutral-800 text-sm">
                {product.name}
            </div>
            <div className="flex items-center justify-between gap-0">
                <div className="flex-1 flex items-center justify-between gap-2">
                    <button onClick={() => { setQtt((prev) => Number(prev) - 1) }} className="flex items-center justify-center hover:bg-neutral-100 active:bg-neutral-200 rounded px-2 py-1 cursor-pointer">
                        <MinusIcon className="w-5" />
                    </button>
                    <input onChange={(e) => setQtt(e.target.value)} value={qtt} type="number" className="w-20 border-b border-neutral-400 text-center rounded-none! focus:outline-0" />
                    <button onClick={() => { setQtt((prev) => Number(prev) + 1) }} className="flex items-center justify-center hover:bg-neutral-100 active:bg-neutral-200 rounded px-2 py-1 cursor-pointer">
                        <PlusIcon className="w-5" />
                    </button>
                    <button onClick={handleAddToCart} className="btn flex items-center justify-center w-8 h-8 bg-neutral-800 rounded text-white">
                        <ShoppingCart className="w-5 h-5" />
                    </button>
                </div>
            </div>
            <Link to={`/products/${product.id}`} className="btn btn-primary btn-sm mt-0">voir</Link>
        </div>
    )
}

export default ViewProducts;
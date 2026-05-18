import { useEffect, useState } from "react";
import { PlusIcon, MinusIcon, ShoppingCart, StarIcon } from "lucide-react";
import { useClientCart } from "../../context/ClientCartContext.jsx";
import { Link } from "react-router-dom";
import { useClientWishlist } from "../../context/ClientWishlistContext.jsx";

const ViewProducts = ({ product }) => {
    const { addProductToCart } = useClientCart();
    const { wishlistItemsData, addProductToWishList } = useClientWishlist();
    const [inWL, setInWL] = useState(false);
    const [qtt, setQtt] = useState(1);

    const handleAddToCart = () => {
        addProductToCart(product, qtt);
    }

    const handleAddToWishList = () => {
        addProductToWishList(product);
    }

    useEffect(() => {
        if (!wishlistItemsData) {
            return;
        }

        let found = false;
        wishlistItemsData.data.forEach(item => {

            if (item.product.id == product.id) {
                found = true;
                setInWL(true);
            }
        });

        if (!found) {
            setInWL(false);
        }

    }, [wishlistItemsData]);

    return (
        <div className="flex flex-col gap-2 p-2 rounded-sm border border-neutral-200 w-62 relative h-fit">

            <div onClick={handleAddToWishList} className="absolute top-0 right-2 bg-neutral-100 shadow border border-neutral-200 border-t-0 w-8 h-12 flex flex-col items-center justify-center text-netral-800 rounded-b-sm cursor-pointer hover:bg-neutral-200 transition-all active:bg-neutral-300">
                {inWL ?
                    <StarIcon fill="#fdc700" className="text-transparent" /> :
                    <StarIcon className="text-yellow-400" />
                }
            </div>

            <div className="flex items-center justify-center max-w-full h-48 bg-neutral-50 rounded-sm skeleton">
                <img
                    src={product?.images?.length > 0 && product?.images[0].medium_image_url}
                    alt={product.meta_description}
                    className="max-w-full max-h-full rounded-xs"
                />
            </div>
            <div className="flex items-center font-light text-neutral-800 text-sm">
                {product.name}
            </div>

            <div className="flex flex-col">
                <div className="flex items-center justify-between">
                    {product?.special_price ?
                        <>
                            <div className="flex">{product?.formatted_special_price}</div>
                            <div className="flex text-neutral-300">{product?.formatted_regular_price}</div>
                        </>
                        :
                        <>
                            <div className="flex">{product?.formatted_price}</div>
                        </>
                    }

                </div>
            </div>

            <div className="flex items-center justify-between">
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
            <Link to={`/products/${product.id}`} className="btn btn-primary btn-sm mt-0">voir</Link>
        </div>
    )
}

export default ViewProducts;
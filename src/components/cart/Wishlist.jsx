import { useState } from "react";
import { useClientWishlist } from "../../context/ClientWishlistContext.jsx";
import { formatDateTimeFr } from "../../lib/utils.js";
import { useClientCart } from "../../context/ClientCartContext.jsx";

const Wishlist = () => {
    const { wishlistItemsData } = useClientWishlist();

    return (
        <div className="flex flex-col w-full">

            <table className="table table-sm">
                <thead>
                    <tr>
                        <th>product</th>
                        <th>date</th>
                        <th></th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {wishlistItemsData?.data?.map(((item, i) => (
                        <WishlistRow key={item.id} item={item} />
                    )))}
                </tbody>
            </table>

        </div>
    )
}

export default Wishlist;

const WishlistRow = ({ item }) => {
    const { addProductToWishList, moveToCart } = useClientWishlist();
    const { refetchCartItem } = useClientCart();

    const handleRemove = () => {
        // console.log(item.product);
        addProductToWishList(item.product.id);
    }

    const [moveNb, setMoveNb] = useState(1);
    const handleMoveToCart = async () => {
        await moveToCart(item.product.id, moveNb);
        refetchCartItem();
    }

    return (
        <tr>
            <td>
                <div className="flex gap-4">
                    <div className="flex items-center">
                        <img src={item.product.base_image.small_image_url} className="mask mask-squircle w-20 h-20" />
                    </div>
                    <div className="flex flex-col gap-1">
                        <div className="flex text-xl">
                            {item.product.name}
                        </div>
                        <div className="flex text-sm text-neutral-500">
                            {item.product.formatted_price}
                        </div>
                    </div>
                </div>
            </td>
            <td>
                {formatDateTimeFr(item.created_at)}
            </td>
            <td>
                <button onClick={handleRemove} className="btn btn-xs btn-neutral">remove</button>
            </td>
            <td>
                <input value={moveNb} onChange={(e) => setMoveNb(e.target.value)} type="number" className="input input-sm w-32 mr-2" />
                <button onClick={handleMoveToCart} className="btn btn-xs btn-neutral">move</button>
            </td>
        </tr>
    )
}
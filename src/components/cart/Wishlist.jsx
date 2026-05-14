import { useClientWishlist } from "../../context/ClientWishlistContext.jsx";
import { formatDateTimeFr } from "../../lib/utils.js";

const Wishlist = () => {
    const { wishlistItemsData } = useClientWishlist();

    return (
        <div className="flex flex-col w-full">

            <table className="table table-sm">
                <thead>
                    <tr>
                        <th>product</th>
                        <th>date</th>
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
        </tr>
    )
}
import { useClientFetch } from "../../hooks/useHttpRequest.js";
import { API_URL_CLIENT } from "../../lib/const.js";
import Product from "./Product.jsx";

const ListProducts = () => {
    const { data: products } = useClientFetch(API_URL_CLIENT + "/catalog/products");

    return (
        <div className="flex gap-4 flex-wrap">
            {products && products?.data && products?.data.map((product, i) => (
                <Product key={product.id} product={product} />
            ))}
        </div>
    )
}

export default ListProducts;
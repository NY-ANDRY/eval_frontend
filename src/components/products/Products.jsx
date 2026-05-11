import { useFetch } from "../../hooks/useHttpRequest";
import { API_URL_ADMIN } from "../../lib/const";
import Product from "./Product";

const ListProducts = () => {
    const { data: products } = useFetch(API_URL_ADMIN + "/catalog/products");

    return (
        <div className="flex gap-4 flex-wrap">
            {products && products?.data && products?.data.map((product, i) => (
                <Product key={product.id} product={product} />
            ))}
        </div>
    )
}

export default ListProducts;
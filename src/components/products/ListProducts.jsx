import { useFetch } from "../../hooks/useHttpRequest";
import { API_URL } from "../../lib/const";
import ViewProducts from "./ViewProducts";

const ListProducts = () => {
    const { data: products } = useFetch(API_URL + "/catalog/products");

    return (
        <div className="flex gap-4 flex-wrap">
            {products && products?.data && products?.data.map((product, i) => (
                <ViewProducts key={product.id} product={product} />
            ))}
        </div>
    )
}

export default ListProducts;
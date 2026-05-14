import { useParams } from "react-router-dom";
import { useClientFetch } from "../../hooks/useHttpRequest";
import { API_URL_CLIENT } from "../../lib/const";
import Product from "../../components/products/Product";

const CategoryProducts = () => {
    const { id: categoryId } = useParams();
    const { data: category } = useClientFetch(`${API_URL_CLIENT}/categories/${categoryId}`);
    const { data: products } = useClientFetch(`${API_URL_CLIENT}/products?category_id=${categoryId}`);

    return (
        <div className="flex flex-col gap-4 p-2">
            <h1 className="mb-6">{category?.data?.name}</h1>
            <div className="flex flex-wrap gap-2">
            {products && products?.data && products?.data.map((product, i) => (
                <Product key={product.id} product={product} />
            ))}
            </div>
        </div>
    )
}

export default CategoryProducts;
import { Link } from "react-router-dom";
import { useAdminFetch } from "../../../hooks/useHttpRequest.js";
import { API_URL_ADMIN } from "../../../lib/const.js";

const Stock = () => {
    const { data: products } = useAdminFetch(`${API_URL_ADMIN}/catalog/products?limit=1000`);

    return (
        <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
                <div className="font-bold capitalize text-2xl">stock</div>
                <Link to={`/backoffice/stock/modif`}>
                    <button className="btn btn-neutral btn-sm">
                        modifier
                    </button>
                </Link>
            </div>
            <table className="table">
                <thead>
                    <tr>
                        <th>product</th>
                        <th>stock reel</th>
                        <th>stock disponible</th>
                    </tr>
                </thead>
                <tbody>
                    {products?.data?.map((product) => (
                        <tr key={product.id}>
                            <td>{product.name}</td>
                            <td>{product.inventories[0].qty}</td>
                            <td>{product.inventory_indices[0].qty}</td>
                        </tr>))}
                </tbody>
            </table>
        </div>
    )
}

export default Stock;
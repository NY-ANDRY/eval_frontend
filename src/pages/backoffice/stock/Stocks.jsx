import { tr } from "motion/react-client";
import { useAdminFetch } from "../../../hooks/useHttpRequest.js";
import { API_URL_ADMIN } from "../../../lib/const.js";
import StockQtt from "../../../components/stock/StockQtt.jsx";

const Stocks = () => {
    const { data: products } = useAdminFetch(`${API_URL_ADMIN}/catalog/products`);

    // useEffect()

    return (
        <div className="flex">
            <table className="table table-sm">
                <thead>
                    <tr>
                        <th>product</th>
                        <th>stock</th>
                        <th>ajout</th>
                    </tr>
                </thead>
                <tbody>
                    {products?.data?.map((product) => (
                        <StockRow key={product.id} product={product} />
                    ))}
                </tbody>
            </table>
        </div>
    )
}

export default Stocks;

const StockRow = ({ product }) => {


    return (
        <tr key={product.id}>
            <td>{product.name}</td>
            <td><StockQtt productId={product.id} /></td>
            <td>
                <div className="flex items-center gap-4">
                    <input type="text" className="input input-sm w-24" />
                    <button className="btn btn-xs">+</button>
                </div>
            </td>
        </tr>
    )
}
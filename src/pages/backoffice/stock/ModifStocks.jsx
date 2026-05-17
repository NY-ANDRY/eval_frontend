import { getAuthAdminHeader, useAdminFetch, useMutation } from "../../../hooks/useHttpRequest.js";
import { API_URL_ADMIN } from "../../../lib/const.js";
// import StockQtt from "../../../components/stock/StockQtt.jsx";
import { useState } from "react";
import { useNotification } from "../../../context/NotificationContext.jsx";
import { Link } from "react-router-dom";

const ModifStocks = () => {
    const { data: products } = useAdminFetch(`${API_URL_ADMIN}/catalog/products?limit=1000`);

    return (
        <div className="flex flex-col">
            <div className="px-4 py-2 font-bold capitalize text-2xl">stock</div>
            <table className="table table-sm">
                <thead>
                    <tr>
                        <th>product</th>
                        {/* <th>stock</th> */}
                        <th>modification stock</th>
                        <th>stock</th>
                    </tr>
                </thead>
                <tbody>
                    {products?.data?.map((product) => (
                        <ModifStockRow key={product.id} product={product} />
                    ))}
                </tbody>
            </table>
        </div>
    )
}

export default ModifStocks;

const ModifStockRow = ({ product }) => {

    const { notify } = useNotification();
    const [newStock, setNewStock] = useState(0);

    const handleUpdateStock = async () => {
        const res = await fetch(`${API_URL_ADMIN}/catalog/products/${product.id}/inventories`, {
            method: "POST",
            headers: getAuthAdminHeader(),
            body: JSON.stringify({
                "inventories": {
                    "1": newStock
                }
            })
        });
        const resData = await res.json();

        if (resData.message) {
            notify(resData.message, 3, "green");
        } else {
            notify(`stock mis a jour`, 3, "green");
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        await handleUpdateStock();
    }

    return (
        <tr key={product.id}>
            <td>{product.name}</td>
            {/* <td><StockQtt productId={product.id} /></td> */}
            <td>
                <div className="flex items-center gap-4">
                    <form onSubmit={(e) => { handleSubmit(e) }} className="flex items-center gap-2">
                        <input onChange={(e) => setNewStock(e.target.value)} value={newStock} type="number" className="input input-sm w-24" />
                        <button type="submit" className="btn btn-sm">modifier</button>
                    </form>
                </div>
            </td>
            <td>
                <Link to={`/backoffice/products/${product.id}/stock`} className="btn btn-sm btn-primary">voir</Link>
            </td>
        </tr>
    )
}
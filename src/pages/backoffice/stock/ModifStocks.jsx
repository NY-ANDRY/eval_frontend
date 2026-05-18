import { getAuthAdminHeader, useAdminFetch } from "../../../hooks/useHttpRequest.js";
import { API_URL_ADMIN } from "../../../lib/const.js";
import { useState } from "react";
import { useNotification } from "../../../context/NotificationContext.jsx";
import { Link } from "react-router-dom";
import { ArrowLeftIcon } from "lucide-react";

const ModifStocks = () => {
    const { data: products, refetch: refetchStock } = useAdminFetch(`${API_URL_ADMIN}/catalog/products?limit=1000`);

    return (
        <div className="flex flex-col">
            <div className="flex items-center gap-4 px-2 py-2">
                <Link to={`/backoffice/stock`}>
                    <button className="btn btn-sm">
                        <ArrowLeftIcon className="w-4 h-4" />
                    </button>
                </Link>
                <div className="font-bold capitalize text-2xl">modifier stock</div>
            </div>

            <table className="table table-sm">
                <thead>
                    <tr>
                        <th>product</th>
                        <th>stock reel</th>
                        <th>stock disponible</th>
                        <th>modification stock</th>
                        <th>stock</th>
                    </tr>
                </thead>
                <tbody>
                    {products?.data?.map((product) => (
                        <ModifStockRow key={product.id} product={product} onUpdate={refetchStock} />
                    ))}
                </tbody>
            </table>
        </div>
    )
}

export default ModifStocks;

const ModifStockRow = ({ product, onUpdate }) => {

    const { notify } = useNotification();
    const [newStock, setNewStock] = useState(0);

    const handleUpdateStock = async () => {
        let newStockValue = Number(newStock) + Number(product.inventories[0].qty);
        const res = await fetch(`${API_URL_ADMIN}/catalog/products/${product.id}/inventories`, {
            method: "POST",
            headers: getAuthAdminHeader(),
            body: JSON.stringify({
                "inventories": {
                    "1": newStockValue
                }
            })
        });
        const resData = await res.json();

        if (onUpdate) {
            onUpdate()
        }
        if (resData.message) {
            notify(resData.message, 3, "green");
        } else {
            notify(`stock mis a jour`, 3, "green");
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        await handleUpdateStock();
        setNewStock(0);
    }

    return (
        <tr key={product.id}>
            <td>{product.name}</td>
            <td>{product.inventories[0].qty}</td>
            <td>{product.inventory_indices[0].qty}</td>
            <td>
                <div className="flex items-center gap-4">
                    <form onSubmit={(e) => { handleSubmit(e) }} className="flex items-center gap-2">
                        <input onChange={(e) => setNewStock(e.target.value)} value={newStock} type="number" className="input input-sm w-24" />
                        <button type="submit" className="btn btn-sm">ajouter</button>
                    </form>
                </div>
            </td>
            <td>
                <Link to={`/backoffice/products/${product.id}/stock`} className="btn btn-sm btn-primary">voir</Link>
            </td>
        </tr>
    )
}
import { getAuthAdminHeader, useAdminFetch } from "../../../hooks/useHttpRequest.js";
import { API_URL_ADMIN } from "../../../lib/const.js";
import { useEffect, useState } from "react";
import { useNotification } from "../../../context/NotificationContext.jsx";
import { Link } from "react-router-dom";
import { ArrowLeftIcon } from "lucide-react";

const ModifStocks = () => {
    const { data: productsData, refetch: refetchStock } = useAdminFetch(`${API_URL_ADMIN}/catalog/products?limit=1000`);
    const [showProducts, setShowProducts] = useState([]);

    useEffect(() => {
        if (productsData?.data) {
            setShowProducts(productsData.data);
        }
    }, [productsData]);

    const handleSearch = (txt) => {
        if (!productsData) {
            return;
        }
        if (txt == "") {
            setShowProducts(productsData?.data);
            return;
        }

        const result = [];
        for (let i = 0; i < productsData.data.length; i++) {
            const prd = productsData.data[i];

            console.log(`${prd.name.toLowerCase()} include ${txt.toLowerCase()}`);
            if (prd.name.toLowerCase().includes(txt.toLowerCase())) {
                console.log("--");
                
                result.push(prd);
                continue;
            }
            if (prd.sku.toLowerCase().includes(txt.toLowerCase())) {
                console.log("--");
                
                result.push(prd);
                continue;
            }
        }
        console.log(result);
        
        setShowProducts(result);
    }

    return (
        <div className="flex flex-col">
            <div className="flex items-center gap-4">
                <Link to={`/backoffice/stock`}>
                    <button className="btn btn-sm">
                        <ArrowLeftIcon className="w-4 h-4" />
                    </button>
                </Link>
                <div className="font-bold capitalize text-2xl">modifier stock</div>
            </div>

            <div className="flex flex-col gap-4">

                <div className="p-4 pb-2 text-xs opacity-60 tracking-wide">Modifier le stock d'un produit</div>
                <input onChange={(e) => handleSearch(e.target.value)} type="text" className="input" />

                {showProducts?.map((product) => (
                    <ModifStockRow key={product.id} product={product} onUpdate={refetchStock} />
                ))}

            </div>

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
        <>
            <div class="flex flex-col gap-8 w-full border border-neutral-200 rounded-sm p-4">
                <div className="flex justify-between">

                    <div className="flex gap-4">
                        <div>
                            {product?.images[0]?.large_image_url ?
                                <img class="size-10 rounded-box" src={product?.images[0]?.large_image_url} />
                                :
                                <div class="size-10 rounded-box skeleton" />
                            }
                        </div>
                        <div>
                            <div>{product.name}</div>
                            <div class="text-xs uppercase font-semibold opacity-60">
                                {product?.categories?.map((category) => (
                                    <span>{category.name}</span>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-4">
                        <div class="flex items-center gap-2 relative">
                            <span className="text-neutral-400 font-thin text-xs relative top-1">
                                stock
                            </span>
                            <span className="font-bold text-xl">
                                {product?.inventories[0]?.qty}
                            </span>
                        </div>
                        <div class="flex items-center gap-2 relative">
                            <span className="text-neutral-400 font-thin text-xs relative top-1">
                                stock
                            </span>
                            <span className="font-bold text-xl">
                                {product.inventory_indices[0].qty}
                            </span>
                        </div>
                    </div>
                </div>


                <div class="flex items-end justify-between">
                    <div className="flex text-2xl font-medium">
                        {product.sku}
                    </div>
                    <form onSubmit={(e) => { handleSubmit(e) }} className="flex items-center gap-2">
                        <input onChange={(e) => setNewStock(e.target.value)} value={newStock} type="number" className="input input-sm w-48" />
                        <button type="submit" className="btn btn-sm">ajouter</button>
                    </form>
                </div>
            </div>

        </>
    )
}
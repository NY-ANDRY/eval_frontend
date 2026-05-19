import { useClientFetch } from "../../hooks/useHttpRequest";
import { API_URL_CLIENT } from "../../lib/const";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import JsonView from "@uiw/react-json-view";
import { tr } from "motion/react-client";

const Order = ({ }) => {
    const { id } = useParams();

    const { data: orderData } = useClientFetch(`${API_URL_CLIENT}/customer/orders/${id}`);

    const [nb, setNb] = useState(1);
    const [newOrder, setNewOrder] = useState({
        items: [],
        total: 0
    });

    const handleDuplicate = (nb) => {
        const result = {
            items: [],
            total: 0
        };

        let total = 0;
        for (let i = 0; i < orderData?.data?.items?.length; i++) {
            const it = orderData?.data?.items[i];

            let curRes = {
                id_produit: it.product_id,
                name: it.name,
                qty: Number(it.qty_ordered) * nb,
                total: Number(it.total) * nb,
            };

            total += Number(it.total) * nb;

            result.items.push(curRes);
        }
        result.total = total;
        setNewOrder(result);

        return result;
    }

    const getQtt = async (idProduct) => {
        const res = await fetch(`${API_URL_CLIENT}/products/${idProduct}`);
        
    }

    useEffect(() => {
        let duplOrder = handleDuplicate(nb);
        console.log(duplOrder);
    }, [nb]);

    return (
        <div className="flex flex-col p-2">

            <input onChange={(e) => setNb(e.target.value)} value={nb} type="number" className="input" />

            <table className="table table-sm w-96">
                <thead>
                    <tr>
                        <th>name</th>
                        <th>qtt</th>
                        <th>total</th>
                    </tr>
                </thead>

                {orderData?.data?.items?.map((it) => (
                    <tr>
                        <td>{it.name}</td>
                        <td>{it.qty_ordered}</td>
                        <td>{it.total}</td>
                    </tr>
                ))}
            </table>
            <div className="flex">{orderData?.data?.grand_total}</div>

            <table className="table table-sm w-96">
                <thead>
                    <tr>
                        <th>name</th>
                        <th>qtt</th>
                        <th>total</th>
                    </tr>
                </thead>

                {newOrder.items?.map((it) => (
                    <tr>
                        <td>{it.name}</td>
                        <td>{it.qty}</td>
                        <td>{it.total}</td>
                    </tr>
                ))}
            </table>
            <div className="flex">{newOrder.total}</div>

        </div>
    )
}

export default Order;
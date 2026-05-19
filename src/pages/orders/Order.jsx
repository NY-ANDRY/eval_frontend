import { useClientFetch } from "../../hooks/useHttpRequest";
import { API_URL_CLIENT } from "../../lib/const";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import JsonView from "@uiw/react-json-view";
import { tr } from "motion/react-client";
import { useClientCart } from "../../context/ClientCartContext.jsx";
import { useClientMutation } from "../../hooks/useHttpRequest.js";
import { useNotification } from "../../context/NotificationContext.jsx";

const Order = ({ }) => {
    const { id } = useParams();

    const { notify } = useNotification();

    const { data: orderData } = useClientFetch(`${API_URL_CLIENT}/customer/orders/${id}`);
    const { addProductToCart } = useClientCart();

    const [nb, setNb] = useState(1);
    const [newOrder, setNewOrder] = useState({
        items: [],
        total: 0
    });

    const handleDuplicate = async () => {
        const result = {
            items: [],
            total: 0
        };

        let total = 0;
        for (let i = 0; i < orderData?.data?.items?.length; i++) {
            const it = orderData?.data?.items[i];

            const curPrd = await fetch(`${API_URL_CLIENT}/products/${it.product_id}`);
            const curPrdData = await curPrd.json();

            let msg = "";

            if (Number(it.qty_ordered) * nb > curPrdData.data.inventory_indices[0].qty) {
                msg = "stock insuffisant";
            }

            let curRes = {
                id_produit: it.product_id,
                name: it.name,
                qty: Number(it.qty_ordered) * nb,
                total: Number(it.total) * nb,
                curStock: curPrdData.data.inventory_indices[0].qty,
                msg: msg,
            };

            total += Number(it.total) * nb;

            result.items.push(curRes);
        }
        result.total = total;
        setNewOrder(result);

        return result;
    }

    const handleTest = () => {
        newOrder.total = 11;
        const a = { ...newOrder };
        a.total = 32;
        setNewOrder(a);
    }

    const handleFix = () => {
        const result = { ...newOrder };

        for (let i = 0; i < result.items.length; i++) {
            const no = result.items[i];

            console.log(no);

            if (no.qty > no.curStock) {
                no.qty = no.curStock;
            }
        }

        setNewOrder(result);
    }

    const doDupl = async () => {
        for (let i = 0; i < newOrder.items.length; i++) {
            const no = newOrder.items[i];
            try {

                await addProductToCart(no.id_produit, no.qty);
            } catch (error) {

            }
        }

        await saveAll();
    }

    //

    const { mutate: mutateSaveAddress } = useClientMutation(`${API_URL_CLIENT}/customer/checkout/save-address`);
    const { mutate: mutateSaveShipping } = useClientMutation(`${API_URL_CLIENT}/customer/checkout/save-shipping`);
    const { mutate: mutateSavePayment } = useClientMutation(`${API_URL_CLIENT}/customer/checkout/save-payment`);
    const { mutate: mutateSaveOrder } = useClientMutation(`${API_URL_CLIENT}/customer/checkout/save-order`);
    const saveAddress = async () => {
        const dataAddress = {
            "billing": {
                "address": [
                    "andoharanofotsy"
                ],
                "save_as_address": false,
                "use_for_shipping": true,
                "first_name": "a",
                "last_name": "a",
                "email": "a",
                "company_name": "Gistoba",
                "city": "antananarivo",
                "state": "malagasy",
                "country": "UK",
                "postcode": 70072,
                "phone": 9871234560
            }
        };
        const addressResponse = await mutateSaveAddress(dataAddress);
        notify("address method saved");
    }

    const saveShipping = async () => {
        const dataShipping = {
            "shipping_method": "free_free"
        };
        const saveResponse = await mutateSaveShipping(dataShipping);
        notify("shipping method saved");
    }

    const savePayment = async () => {
        const dataPayment = {
            "payment": {
                "method": "cashondelivery"
            }
        };
        notify("payment method saved");
        await mutateSavePayment(dataPayment);
    }

    const saveOrder = async () => {
        await mutateSaveOrder();
        notify("order saved");
    }

    const saveAll = async () => {
        await saveAddress();
        await saveShipping();
        await savePayment();
        await saveOrder();
    }
    //


    return (
        <div className="flex flex-col p-2">

            <input onChange={(e) => setNb(e.target.value)} value={nb} type="number" className="input" />
            <button onClick={handleDuplicate} className="btn btn-sm w-xs">dupl</button>
            <button onClick={handleTest} className="btn btn-sm w-xs">test</button>

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
                        <th>stock</th>
                        <th>stock</th>
                    </tr>
                </thead>

                {newOrder.items?.map((it) => (
                    <tr>
                        <td>{it.name}</td>
                        <td>{it.qty}</td>
                        <td>{it.total}</td>
                        <td>{it.curStock}</td>
                        <td>{it.msg}</td>
                    </tr>
                ))}
            </table>
            <div className="flex">{newOrder.total}</div>

            <button onClick={handleFix} className="btn btn-sm w-xs">fix</button>
            <button onClick={doDupl} className="btn btn-sm w-xs">do dupl</button>

        </div>
    )
}

export default Order;
import { useEffect, useState } from "react";
import { getAuthHeaders, useAdminFetch } from "../../../hooks/useHttpRequest";
import { API_URL_ADMIN } from "../../../lib/const";

const Order = () => {
    const { data: ordersData, refetch: refechOrderData } = useAdminFetch(`${API_URL_ADMIN}/sales/orders`);

    return (
        <div className="fle flex-col">
            <h1 className="px-4 py-2">orders</h1>
            <table className="table table-sm">
                <thead>
                    <tr>
                        <th>id</th>
                        <th>formatted_grand_total</th>
                        <th>customer.email</th>
                        <th>status_label</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {ordersData?.data?.map((order, i) => (
                        <OrderRow order={order} onUpdate={refechOrderData} />
                    ))}
                </tbody>
            </table>
        </div>
    )
}

export default Order;

const OrderRow = ({ order, onUpdate }) => {

    const [statut, setStatut] = useState("");

    const handleShipment = async () => {
        let shipmentItems = {};
        for (let i = 0; i < order.items.length; i++) {
            const item = order.items[i];
            shipmentItems[item.id] = {
                "1": item.qty_ordered
            }
        }
        const shipmentBody = {
            "shipment": {
                "carrier_title": "DHL Shipment",
                "track_number": "12345",
                "source": 1,
                "total_qty": order.total_qty_ordered,
                "items": shipmentItems
            }
        };
        await fetch(`${API_URL_ADMIN}/sales/shipments/${order.id}`,
            {
                method: "POST",
                headers: getAuthHeaders("admin"),
                body: JSON.stringify(shipmentBody)
            }
        );

        if (onUpdate) { onUpdate(); }
    }

    const handlePay = async () => {
        let payItems = {};
        for (let i = 0; i < order.items.length; i++) {
            const item = order.items[i];
            payItems[item.id] = item.qty_ordered
        }
        const payBody = {
            "invoice": {
                "items": payItems
            },
            "can_create_transaction": 1
        };
        await fetch(`${API_URL_ADMIN}/sales/invoices/${order.id}`,
            {
                method: "POST",
                headers: getAuthHeaders("admin"),
                body: JSON.stringify(payBody)
            }
        );

        if (onUpdate) { onUpdate(); }
    }

    useEffect(() => {
        if (!order) { return; }

        if (order?.invoices?.length > 0 && order?.shipments?.length > 0 ) {
            setStatut("envoyé et payé");
        } else if (order?.invoices?.length > 0) {
            setStatut("payé");
        } else if (order?.shipments?.length > 0) {
            setStatut("envoyé");
        } else {
            // setStatut("");
        }
    }, [order]);

    return (
        <tr>
            <td>{order?.id}</td>
            <td>{order?.formatted_grand_total}</td>
            <td>{order?.customer?.email}</td>
            <td>{order?.status_label} - {statut}</td>
            <td>
                <div className="flex items-center gap-2">
                    <button onClick={handleShipment} className="btn btn-neutral btn-xs" >ship</button>
                    <button onClick={handlePay} className="btn btn-neutral btn-xs" >pay</button>
                </div>
            </td>
        </tr>
    )
}
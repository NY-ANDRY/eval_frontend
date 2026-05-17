import { useEffect, useState } from "react";
import { getAuthHeaders, useAdminFetch } from "../../../hooks/useHttpRequest.js";
import { API_URL_ADMIN } from "../../../lib/const";
import { getAuthAdminHeader } from "../../../hooks/useHttpRequest.js";
import { useNotification } from "../../../context/NotificationContext.jsx";
import { TableSkeletons } from "../../../components/skeleton/Skeletons.jsx";

const Order = () => {
    const { data: ordersData, refetch: refechOrderData, loading } = useAdminFetch(`${API_URL_ADMIN}/sales/orders?limit=1000`);

    return (
        <div className="flex flex-col">
            <h1 className="px-4 py-2">orders</h1>
            {loading && <TableSkeletons />}
            <table className="table table-sm">
                <thead>
                    <tr>
                        <th>id</th>
                        <th>formatted_grand_total</th>
                        <th>customer.email</th>
                        <th>status_label</th>
                        <th>envoye</th>
                        <th>paye</th>
                    </tr>
                </thead>
                <tbody>
                    {ordersData?.data?.map((order, i) => (
                        <OrderRow key={order.id} order={order} onUpdate={refechOrderData} />
                    ))}
                </tbody>
            </table>
        </div>
    )
}

export default Order;

const OrderRow = ({ order, onUpdate }) => {

    const { globalLoading, setGlobalLoading } = useNotification();
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
        setGlobalLoading(true);
        await fetch(`${API_URL_ADMIN}/sales/shipments/${order.id}`,
            {
                method: "POST",
                headers: getAuthAdminHeader(),
                body: JSON.stringify(shipmentBody)
            }
        );
        setGlobalLoading(false);
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
        setGlobalLoading(true);
        await fetch(`${API_URL_ADMIN}/sales/invoices/${order.id}`,
            {
                method: "POST",
                headers: getAuthHeaders("admin"),
                body: JSON.stringify(payBody)
            }
        );
        setGlobalLoading(false);

        if (onUpdate) { onUpdate(); }
    }

    useEffect(() => {
        if (!order) { return; }

        if (order?.invoices?.length > 0 && order?.shipments?.length > 0) {
            setStatut("envoyé et payé");
        } else if (order?.invoices?.length > 0) {
            setStatut("payé");
        } else if (order?.shipments?.length > 0) {
            setStatut("envoyé");
        } else {
            // setStatut("");
        }
    }, [order]);

    useEffect(() => {
        console.log(globalLoading);

    }, [globalLoading])

    return (
        <tr>
            <td>{order?.id}</td>
            <td>{order?.formatted_grand_total}</td>
            <td>{order?.customer?.email}</td>
            <td>{order?.status_label} - {statut}</td>
            <td>
                <div className="flex items-center gap-2">
                    {order?.shipments?.length > 0 ?
                        <p>envoyer</p>
                        :
                        <button disabled={globalLoading} onClick={handleShipment} className="btn btn-neutral btn-xs" >ship</button>
                    }
                </div>
            </td>
            <td>
                <div className="flex items-center gap-2">
                    {order?.invoices?.length > 0 ?
                        <p>payer</p>
                        :
                        <button disabled={globalLoading} onClick={handlePay} className="btn btn-neutral btn-xs" >pay</button>
                    }
                </div>
            </td>
        </tr>
    )
}
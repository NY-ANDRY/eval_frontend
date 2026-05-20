import { useEffect, useState } from "react";
import { useAdminFetch } from "../../../hooks/useHttpRequest.js";
import { API_URL_ADMIN } from "../../../lib/const";
import { useNotification } from "../../../context/NotificationContext.jsx";
import { TableSkeletons } from "../../../components/skeleton/Skeletons.jsx";
import { formatDate } from "../../../lib/utils.js";
import { doShipment, doPaiment } from "../../../services/orderService.jsx";

const Order = () => {
    const { data: ordersData, refetch: refechOrderData, loading } = useAdminFetch(`${API_URL_ADMIN}/sales/orders?limit=1000`);

    return (
        <div className="flex flex-col gap-2">
            <div className="font-bold capitalize text-2xl">orders</div>
            {loading && <TableSkeletons />}
            {!loading &&
                <table className="table">
                    <thead>
                        <tr>
                            <th>id</th>
                            <th>date</th>
                            <th>formatted_grand_total</th>
                            <th>email</th>
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
            }
        </div>
    )
}

export default Order;

const OrderRow = ({ order, onUpdate }) => {

    const { globalLoading, setGlobalLoading } = useNotification();
    const [statut, setStatut] = useState("");

    const handleShipment = async () => {

        setGlobalLoading(true);

        await doShipment(order);

        setGlobalLoading(false);
        if (onUpdate) { onUpdate(); }
    }

    const handlePay = async () => {

        setGlobalLoading(true);

        await doPaiment(order);

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
            <td>{formatDate(order?.created_at)}</td>
            <td>{order?.formatted_grand_total}</td>
            <td>{order?.customer?.email}</td>
            <td>{order?.status_label} - {statut}</td>
            <td>
                <div className="flex items-center gap-2">
                    {order?.shipments?.length > 0 ?
                        <p>envoyer</p>
                        :
                        <button disabled={globalLoading} onClick={handleShipment} className="btn btn-neutral btn-sm" >ship</button>
                    }
                </div>
            </td>
            <td>
                <div className="flex items-center gap-2">
                    {order?.invoices?.length > 0 ?
                        <p>payer</p>
                        :
                        <button disabled={globalLoading} onClick={handlePay} className="btn btn-neutral btn-sm" >pay</button>
                    }
                </div>
            </td>
        </tr>
    )
}
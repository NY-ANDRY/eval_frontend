import { tr } from "motion/react-client";
import { useClientFetch } from "../../hooks/useHttpRequest";
import { API_URL_CLIENT } from "../../lib/const";
import { formatDateFr } from "../../lib/utils";

const Order = ({ }) => {

    const { data: orders } = useClientFetch(`${API_URL_CLIENT}/customer/orders`);

    return (
        <div className="flex flex-col p-2">

            <table className="table table-sm">
                <thead>
                    <tr>
                        <th>id</th>
                        <th>statut</th>
                        <th>date</th>
                        <th>total</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {orders?.data?.map((order, i) => (
                        <tr>
                            <td>{order.id}</td>
                            <td>{order.status_label}</td>
                            <td>{formatDateFr(order.updated_at)}</td>
                            <td>{order.formatted_grand_total}</td>
                            <td>
                                <div className="flex w-fit">
                                    <button className="btn btn-xs btn-neutral">voir</button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

        </div>
    )
}

export default Order;
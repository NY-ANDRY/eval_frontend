import { useClientFetch } from "../../hooks/useHttpRequest";
import { API_URL_CLIENT } from "../../lib/const";
import { useParams } from "react-router-dom";
import JsonView from "@uiw/react-json-view";

const Order = ({ }) => {

    const { id } = useParams();
    const { data: orderData } = useClientFetch(`${API_URL_CLIENT}/customer/orders/${id}`);

    return (
        <div className="flex flex-col p-2">

            {orderData && <JsonView value={orderData} />}

        </div>
    )
}

export default Order;
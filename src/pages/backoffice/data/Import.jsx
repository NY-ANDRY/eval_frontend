import { useState } from "react";
import { data } from "react-router-dom";
import CsvReader from "../../../components/reader/CsvReader";
import JsonView from "@uiw/react-json-view";
import { useNotification } from "../../../context/NotificationContext";
import { getAuthHeaders } from "../../../hooks/useHttpRequest";

const Import = () => {
    const { notify } = useNotification();

    const [productData, setProductData] = useState(null);
    const [clientData, setClientData] = useState(null);
    const [orderData, setOrderData] = useState(null);

    const handleTest = () => {
        if (!productData || !clientData || !orderData) {
            notify("les 3 fichier sont requis")
            return;
        }
        console.log(productData);
        console.log(clientData);
        console.log(orderData);
        
    }

    return (
        <div className="flex flex-col gap-4 p-2">
            <div className="flex flex-col gap-1">
                <label htmlFor="">products</label>
                <CsvReader onRead={setProductData} />
            </div>
            <div className="flex flex-col gap-1">
                <label htmlFor="">clients</label>
                <CsvReader onRead={setClientData} />
            </div>
            <div className="flex flex-col gap-1">
                <label htmlFor="">orders</label>
                <CsvReader onRead={setOrderData} />
            </div>

            <button onClick={handleTest} className="btn btn-neutral btn-sm w-xs">import</button>
        </div>
    )
}

export default Import;
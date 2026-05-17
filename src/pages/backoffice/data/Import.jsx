import { useState } from "react";
import CsvReader from "../../../components/reader/CsvReader.jsx";
import { useNotification } from "../../../context/NotificationContext.jsx";
import { DataImport } from "../../../services/DataImport.js";
import JsonView from "@uiw/react-json-view";

const Import = () => {
    const { notify, setGlobalLoading } = useNotification();

    const [loading, setLoading] = useState(false);

    const [productData, setProductData] = useState(null);
    const [clientData, setClientData] = useState(null);
    const [orderData, setOrderData] = useState(null);

    const [importProducts, setImportProduct] = useState(true);
    const [importClients, setImportClients] = useState(true);
    const [importOrders, setImportOrder] = useState(true);

    const handleTest = async () => {
        if (!productData || !clientData || !orderData) {
            notify("les 3 fichier sont requis", 3, "yellow")
            return;
        }

        try {
            setLoading(true);
            setGlobalLoading(true);

            const di = new DataImport(productData, clientData, orderData);
            di.setNotify(notify);

            if (!importProducts) {
                di.importProduct = false;
            }
            if (!importClients) {
                di.importClient = false;
            }
            if (!importOrders) {
                di.importOrder = false;
            }

            await di.import();

        } catch (error) {
            notify(error.message, 3, "red")
            console.log(error);
        } finally {
            setGlobalLoading(false);
            setLoading(false);
        }
    }

    return (
        <div className="flex gap-12">
            <div className="flex flex-col gap-4 px-8 p-4">
                <div className="flex flex-col gap-1.5 relative">
                    <label htmlFor="">products</label>
                    <div className="flex gap-4 relative">
                        <input checked={importProducts} onChange={(e) => setImportProduct(e.target.checked)} type="checkbox" className="checkbox relative top-1" />
                        <CsvReader onRead={setProductData} />
                    </div>
                </div>
                <div className="flex flex-col gap-1.5 relative">
                    <label htmlFor="">clients</label>
                    <div className="flex gap-4 relative">
                        <input checked={importClients} onChange={(e) => setImportClients(e.target.checked)} type="checkbox" className="checkbox relative top-1" />
                        <CsvReader onRead={setClientData} />
                    </div>

                </div>
                <div className="flex flex-col gap-1.5 relative">
                    <label htmlFor="">orders</label>
                    <div className="flex gap-4 relative">
                        <input checked={importOrders} onChange={(e) => setImportOrder(e.target.checked)} type="checkbox" className="checkbox relative top-1" />
                        <CsvReader onRead={setOrderData} />
                    </div>
                </div>

                <button disabled={loading} onClick={handleTest} className="btn btn-neutral btn-sm w-xs">import</button>
            </div>

            <div className="flex gap-8">
                {productData && <JsonView value={productData.data} />}
                {clientData && <JsonView value={clientData.data} />}
                {orderData && <JsonView value={orderData.data} />}
            </div>
        </div>
    )
}

export default Import;
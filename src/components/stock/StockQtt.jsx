import { useEffect, useState } from "react";
import { GuestBro } from "../../services/GuestBro.js";

const StockQtt = ({ productId }) => {
    const [stockQtt, setStockQtt] = useState(0);
    const [isProcessing, setIsProcessing] = useState(false);

    const getQtt = async () => {
        if (isProcessing || productId == undefined || productId == null) {
            return;
        }
        setIsProcessing(true);
        const bro = new GuestBro();
        const broQTT = await bro.getAvailableStock(productId);
        // const broQTT = await bro.getStockPanierAdaptApi(productId);
        setStockQtt(broQTT);
        setIsProcessing(false);
    }

    useEffect(() => {
        getQtt();

    }, [productId]);

    return (
        <>
            {isProcessing ?
                <>
                    <span className="loading loading-ring loading-xs"></span>
                </>
                :
                <span>{stockQtt}</span>
            }
        </>
    )
}

export default StockQtt;
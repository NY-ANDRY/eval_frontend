import { useEffect, useRef, useState } from "react";
import { useAdminFetch, useFetch } from "../../../hooks/useHttpRequest.js";
import { API_URL_ADMIN } from "../../../lib/const.js";
import { useParams } from "react-router-dom";
import { GuestBro } from "../../../services/GuestBro.js";
import { span } from "motion/react-client";

const ProductStock = () => {
    const { id: productId } = useParams();
    const { data: productData } = useAdminFetch(`${API_URL_ADMIN}/catalog/products/${productId}`);
    const product = productData?.data;

    const [stockQtt, setStockQtt] = useState(0);
    const [isQttAvailableProcessing, setIsAvailableQttProcessing] = useState(false);
    const [isQttDetailsProcessing, setisQttDetailsProcessing] = useState(false);
    const [stockDetails, setStockDetails] = useState({});

    const stockBro = useRef(new GuestBro());
    const detailBro = useRef(new GuestBro());

    const getAvailableQtt = async () => {
        if (stockBro.current.isWorking) {
            return;
        }
        if (isQttAvailableProcessing || productId == undefined || productId == null) {
            return;
        }
        setIsAvailableQttProcessing(true);
        // const bro = new GuestBro();
        const broQTT = await stockBro.current.getAvailableStock(productId);
        setStockQtt(broQTT);
        setIsAvailableQttProcessing(false);
    }

    const getWaitingQtt = async () => {
        if (detailBro.current.isWorking) {
            return;
        }
        if (isQttAvailableProcessing || productId == undefined || productId == null) {
            return;
        }
        setisQttDetailsProcessing(true);
        // const bro = new GuestBro();
        const productStockDetails = await detailBro.current.getStockDetailsOfProduct(productId);
        setStockDetails(productStockDetails);
        setisQttDetailsProcessing(false);
    }

    useEffect(() => {
        getAvailableQtt();
        getWaitingQtt();

    }, [productId]);

    const stockReel = stockQtt + stockDetails?.waitingQtt;

    return (
        <div className="flex flex-col p-2">
            <div className="flex">{product?.name}</div>

            <div className="flex">
                stock reel:
                {isQttAvailableProcessing || isQttDetailsProcessing ? <span className="loading loading-ring loading-xs"></span> : <div className="span">{stockReel}</div>}
            </div>
            <div className="flex">
                stock disponible:
                {isQttAvailableProcessing ? <span className="loading loading-ring loading-xs"></span> : <div className="span">{stockQtt}</div>}
            </div>
            <div className="flex">
                stock total commander:
                {isQttDetailsProcessing ? <span className="loading loading-ring loading-xs"></span> : <div className="span">{stockDetails?.orderQtt}</div>}
            </div>
            <div className="flex">
                stock envoyer:
                {isQttDetailsProcessing ? <span className="loading loading-ring loading-xs"></span> : <div className="span">{stockDetails?.outQtt}</div>}
            </div>
            <div className="flex">
                stock commandee en attente:
                {isQttDetailsProcessing ? <span className="loading loading-ring loading-xs"></span> : <div className="span">{stockDetails?.waitingQtt}</div>}
            </div>
        </div>
    )
}

export default ProductStock;
import { getAuthAdminHeader, getAuthHeaders } from "../hooks/useHttpRequest.js";
import { API_URL_ADMIN } from "../lib/const.js";

export const doShipment = async (order) => {
    let shipmentItems = {};
    for (let i = 0; i < order.items.length; i++) {
        const item = order.items[i];
        shipmentItems[item.id] = {
            "1": item.qty_ordered
            // [1]: item.qty_ordered
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
            headers: getAuthAdminHeader(),
            body: JSON.stringify(shipmentBody)
        }
    );
}

export const doPaiment = async (order) => {
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

}
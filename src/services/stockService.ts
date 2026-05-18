import type { Order } from "./types.js";

export const getProductStockDetailFromOrders = async (productId: string, orders: Order[]) => {
    const result = {
        orderQtt: 0,
        paidQtt: 0,
        outQtt: 0,

        waitingQtt: 0
    };

    console.log(orders);

    for (let i = 0; i < orders.length; i++) {
        const order = orders[i];
        if (!order) {
            console.log("continue 1");
            continue;
        }

        for (let j = 0; j < order.items.length; j++) {
            const item = order.items[j];

            if (!item) {
                console.log("continue 2");
                continue;
            }

            if (item.product_id != productId) {
                continue;
            }

            result.orderQtt = result.orderQtt + item.qty_ordered;
            result.paidQtt = result.paidQtt + item.qty_invoiced;

            let outQtt = item.qty_shipped - item.qty_canceled;
            if (outQtt < 0) {
                outQtt = 0;
            }
            result.outQtt += outQtt;

            let waitingQtt = item.qty_ordered;
            waitingQtt = waitingQtt - item.qty_shipped;
            waitingQtt = waitingQtt - item.qty_canceled;
            if (waitingQtt < 0) {
                waitingQtt = 0;
            }
            result.waitingQtt = result.waitingQtt + waitingQtt;
        }
    }

    return result;
}
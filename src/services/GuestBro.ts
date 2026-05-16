import { getAuthAdminHeader, getAuthClientHeader } from "../hooks/useHttpRequest.js";
import { API_URL_ADMIN, API_URL_CLIENT, HOST_URL } from "../lib/const.js";
import type { Order } from "./types.js";


export class GuestBro {

    static Btoken_client: string = "";
    BtokenStorageName = "bagisto_guest_bro_token"; // tsy ovaina -> misoratra anaty fonction mamafa clients...

    static broCart: any = {};

    orders: Order[] = [];
    fetchPageLimit: number = 1000;

    constructor() {
    }

    async init() {
        if (GuestBro.Btoken_client == "") {
            let localStorageToken = localStorage.getItem(this.BtokenStorageName);
            if (localStorageToken != null) {
                GuestBro.Btoken_client = `Bearer ${localStorageToken}`;
            } else {
                this.connectBro();
            }
        }
    }

    async getAvailableStock(productId: string) {
        await this.init();
        await this.deleteFromBroCart(productId);

        let result = await this.getQttFromCart(productId);

        let again = true;
        while (again) {
            again = false;

            const res = await fetch(`${API_URL_CLIENT}/customer/cart/add/${productId}`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: GuestBro.Btoken_client,
                    },
                    body: JSON.stringify({
                        "product_id": productId,
                        "is_buy_now": 0,
                        "quantity": 1
                    })
                }
            );
            const resData = await res.json();

            if (!resData.data) {
                break;
            }

            const pQtt = this.getQtt(resData.data, productId);

            if (pQtt != undefined && pQtt > result) {
                result = pQtt;
                again = true;
            }
        }

        return result;
    }

    async getQttFromCart(productId: string): Promise<number> {

        let broCart = await this.getBroCart();
        let res = this.getQtt(broCart, productId);

        if (res) {
            return res;
        }

        return 0;
    }

    async deleteFromBroCart(productId: string): Promise<void> {
        let broCart = await this.getBroCart();
        let cartId = this.getCartItemId(broCart, productId);

        if (cartId == undefined) {
            return;
        }

        await fetch(`${API_URL_CLIENT}/customer/cart/remove/${cartId}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                Authorization: GuestBro.Btoken_client,
            },
            body: JSON.stringify({})
        });
    }

    async getBroCart(): Promise<any> {
        const res = await fetch(`${API_URL_CLIENT}/customer/cart`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: GuestBro.Btoken_client,
            }
        });

        if (res.status == 304) {
            return GuestBro.broCart;
        }

        const resData = await res.json();

        return resData.data;
    }

    getCartItemId(cartResponse: any, productId: string) {
        const items = cartResponse?.items;
        if (!items) {
            return undefined;
        }
        for (let i = 0; i < items.length; i++) {
            const item = items[i];
            if (item?.product?.id == productId) {
                return item?.id;
            }
        }
    }

    getQtt(cartResponse: any, productId: string): number | undefined {
        const items = cartResponse?.items;
        if (!items) {
            return undefined;
        }
        for (let i = 0; i < items.length; i++) {
            const item = items[i];
            if (item?.product?.id == productId) {
                return item?.quantity;
            }
        }
    }

    async resetOrders() {
        let page = 1;
        this.orders = [];

        let breakk = false;
        while (!breakk) {
            breakk = true;

            const res = await fetch(`${API_URL_ADMIN}/sales/orders?page=${page}&limit=${this.fetchPageLimit}`,
                {
                    headers: getAuthAdminHeader()
                }
            );
            const data = await res.json();

            for (let i = 0; i < data.data.length; i++) {
                this.orders.push(data.data[i]);
            }

            if (data.data && data.data.length >= this.fetchPageLimit) {
                breakk = false;
            };
            page++;
        }
    }

    async getStockDetailsOfProduct(productId: string) {
        await this.resetOrders();
        const result = {
            orderQtt: 0,
            paidQtt: 0,
            outQtt: 0,

            waitingQtt: 0
        };

        console.log(this.orders);

        for (let i = 0; i < this.orders.length; i++) {
            const order = this.orders[i];
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
                
                console.log(`${item.product_id} != ${productId}`);
                if (item.product_id != productId) {
                    continue;
                }
                console.log("here");

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

    async connectBro() {
        const res = await fetch(`${API_URL_CLIENT}/customer/login`, {
            method: "POST",
            headers: getAuthClientHeader(),
            body: JSON.stringify({
                email: "bro@gmail.com",
                password: "trust_me",
                device_name: "web"
            })
        });

        if (res.status != 200) {
            await this.registerAndConnectBro();
            return;
        }

        const resData = await res.json();
        let Btoken = `Bearer ${resData.token}`;
        GuestBro.Btoken_client = Btoken;
        localStorage.setItem(this.BtokenStorageName, resData.token);
    }

    async registerAndConnectBro() {
        await fetch(`${API_URL_CLIENT}/customer/register`, {
            method: "POST",
            body: JSON.stringify({
                first_name: "bro",
                last_name: "bro",
                email: "bro@gmail.com",
                password: "trust_me",
                password_confirmation: "trust_me",
            })
        });
        const res = await fetch(`${API_URL_CLIENT}/customer/login`, {
            method: "POST",
            body: JSON.stringify({
                email: "bro@gmail.com",
                password: "trust_me",
                device_name: "web"
            })
        });
        const resData = await res.json();
        let Btoken = `Bearer ${resData.token}`;
        GuestBro.Btoken_client = Btoken;
        localStorage.setItem(this.BtokenStorageName, resData.token);
    }

}

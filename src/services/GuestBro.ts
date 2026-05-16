import { getAuthClientHeader } from "../hooks/useHttpRequest.js";
import { API_URL_CLIENT, HOST_URL } from "../lib/const.js";


export class GuestBro {

    Btoken_client: string = "";
    BtokenStorageName = "bagisto_guest_bro_token";

    static broCart: any = {};

    constructor() {
    }

    async init() {
        let localStorageToken = localStorage.getItem(this.BtokenStorageName);
        if (localStorageToken) {
            this.Btoken_client = `Bearer ${localStorageToken}`;
        } else {
            this.connectBro();
        }
    }

    async getStock(
        productId: string,
    ) {
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
                        Authorization: this.Btoken_client,
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
        let cartId = this.getItemId(broCart, productId);

        if (cartId == undefined) {
            return;
        }

        await fetch(`${API_URL_CLIENT}/customer/cart/remove/${cartId}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                Authorization: this.Btoken_client,
            },
            body: JSON.stringify({})
        });
    }

    async getBroCart(): Promise<any> {
        const res = await fetch(`${API_URL_CLIENT}/customer/cart`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: this.Btoken_client,
            }
        });

        if (res.status == 304) {
            return GuestBro.broCart;
        }

        const resData = await res.json();

        return resData.data;
    }

    getItemId(cartResponse: any, productId: string) {
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
        this.Btoken_client = Btoken;
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
        this.Btoken_client = Btoken;
        localStorage.setItem(this.BtokenStorageName, resData.token);
    }

}

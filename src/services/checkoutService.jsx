import { API_URL_CLIENT } from "../lib/const.js";

export const saveAddress = async (Btoken) => {
    const dataAddress = {
        "billing": {
            "address": [
                "andoharanofotsy"
            ],
            "save_as_address": false,
            "use_for_shipping": true,
            "first_name": "a",
            "last_name": "a",
            "email": "a",
            "company_name": "Gistoba",
            "city": "antananarivo",
            "state": "malagasy",
            "country": "UK",
            "postcode": 70072,
            "phone": 9871234560
        }
    };

    const headers = {
        "Content-Type": "application/json",
        Authorization: Btoken,
    };

    await fetch(`${API_URL_CLIENT}/customer/checkout/save-address`, {
        method: "POST",
        headers: headers,
        body: JSON.stringify(dataAddress)
    })
}

export const saveShipping = async (Btoken) => {
    const dataShipping = {
        "shipping_method": "free_free"
    };

    const headers = {
        "Content-Type": "application/json",
        Authorization: Btoken,
    };

    await fetch(`${API_URL_CLIENT}/customer/checkout/save-shipping`, {
        method: "POST",
        headers: headers,
        body: JSON.stringify(dataShipping)
    })
}

export const savePayment = async (Btoken) => {
    const dataPayment = {
        "payment": {
            "method": "cashondelivery"
        }
    };

    const headers = {
        "Content-Type": "application/json",
        Authorization: Btoken,
    };

    await fetch(`${API_URL_CLIENT}/customer/checkout/save-payment`, {
        method: "POST",
        headers: headers,
        body: JSON.stringify(dataPayment)
    })
}

export const saveOrder = async (Btoken) => {

    const headers = {
        "Content-Type": "application/json",
        Authorization: Btoken,
    };

    await fetch(`${API_URL_CLIENT}/customer/checkout/save-order`, {
        method: "POST",
        headers: headers,
        body: JSON.stringify({})
    })
}

export const saveAll = async (Btoken) => {
    await saveAddress(Btoken);
    await saveShipping(Btoken);
    await savePayment(Btoken);
    await saveOrder(Btoken);
}
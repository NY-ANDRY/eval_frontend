import { API_URL_ADMIN } from "../lib/const";
import { useNotification } from "../context/NotificationContext";

// page 1 only
export const removeAllProducts = async (notify) => {
    let authToken = localStorage.getItem("bagisto_admin_token");
    if (!authToken) {
        alert("aucun token");
    }
    authToken = "Bearer " + authToken;
    const headers = {
        "Content-Type": "application/json",
        Authorization: authToken,
    };

    const productsResponse = await fetch(API_URL_ADMIN + "/catalog/products", { headers: headers });
    if (!productsResponse.ok) throw new Error(`Erreur ${productsResponse.status}`);
    const products = await productsResponse.json();

    for (let i = 0; i < products.data.length; i++) {
        const product = products.data[i];
        const delResponse = await fetch(API_URL_ADMIN + `/catalog/products/${product.id}`, { headers: headers, method: "DELETE" });
        if (delResponse.status == 200) {
            if (notify) {
                notify("delete product " + product.id + " : ok");
            }
        } else {
            if (notify) {
                notify("delete product " + product.id + " : not ok");
            }
        }
    }
}
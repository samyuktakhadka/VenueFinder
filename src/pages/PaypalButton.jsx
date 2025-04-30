import React, { useState } from "react";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import axios from "axios";
import { getToken } from "../utils/jwtUtils";

const PayPalButton = () => {
    const apiKey = import.meta.env["VITE_APP_BASE_URL"];
    const token=getToken();
    const [amount, setAmount] = useState("10.00"); // Example amount

    return (
        <PayPalScriptProvider options={{ "client-id": "AdBcUMj0jv1dr0IBOhmPgKiDuh1zPT2hs1WGfzrobWFjzg_URrmwXxOAVNchUo0Aux7TDzKlZn_yWa8U" }}>
            <div className="container mt-5">
                <h3>PayPal Checkout</h3>
                <p>Amount: ${amount}</p>
                <PayPalButtons
                    createOrder={async () => {
                        try {
                            const response = await axios.post(
                                `${apiKey}api/paypal`,
                                { amount },
                                {
                                    headers: {
                                        Authorization: `Bearer ${token}`,
                                    },
                                }
                            );
                            console.log(response.data.approvalUrl); // Redirect user to PayPal approval
                            return response.data.approvalUrl;
                        } catch (error) {
                            console.error("Error creating PayPal order:", error);
                            throw new Error("Failed to create PayPal order.");
                        }
                    }}
                    onApprove={(data) => {
                        console.log("Payment approved:", data);
                        alert("Payment Successful!");
                    }}
                    onError={(err) => {
                        console.error("Payment error:", err);
                        alert("Something went wrong. Please try again.");
                    }}
                />
            </div>
        </PayPalScriptProvider>
    );
};

export default PayPalButton;

import React, { useEffect } from 'react'
import Loader from '../common/Loader'
import axios from "axios";
import { useNavigate, useParams,useSearchParams } from "react-router-dom";
import toast from 'react-hot-toast';
const VenueSuccess = () => {
    const [searchParams] = useSearchParams();
    const apiKey = import.meta.env["VITE_APP_BASE_URL"];
     const paymentId = searchParams.get("paymentId");
     const PayerID = searchParams.get("PayerID");
     const navigate=useNavigate();
    useEffect(() => {
        const executePayment = async () => {
            await axios
                .get(`${apiKey}api/paypal/venue-payment-success`, {
                    params: {
                        paymentId,
                        PayerID,
                    }
                })
                .then(function (response) {
                    console.log(response.status)
                    console.log(response.data);
                    if(response.status==200)
                    {
                        toast.success("Payment Success!");
                        toast.success("Thank You for Booking! We will get back to you soon!");
                        navigate("/venues");
                    }
                })
                .catch(function (error) {
                    console.log(error);
                    var errorMessage = error.response.data.error;
                    if (errorMessage == "jwt expired") {
                        toast.error("Token Expired!")
                        logout(navigate)
                    }
                });
        };

        if (paymentId && PayerID) {
            executePayment();
        }
    }, []);
    return (
        <Loader />
    )
}

export default VenueSuccess
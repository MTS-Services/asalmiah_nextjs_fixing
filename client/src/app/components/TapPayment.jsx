
"use client"
import { useMutation } from "@tanstack/react-query";
import { GoSellElements } from "@tap-payments/gosell";
import useDetails from "../../../hooks/useDetails";
import { PAYMENT_CARD_TOKEN } from "../../../services/APIServices";
import { toastAlert } from "../../../utils/SweetAlert";

const TapPayment = () => {
  let detail = useDetails();
  const mutation = useMutation({
    mutationFn: (body) => PAYMENT_CARD_TOKEN(body),
    onSuccess: (res) => {
      toastAlert("success", res?.data?.message);
      // resetForm();
    },
  });

  function callbackFunc(response) {
    let body = {
      cardTokenId: response?.id,
      cardId: response?.payment?.id,
      userId: detail?._id,
    };
    mutation.mutate(body);
  }

  return (
    <>
    
      <GoSellElements
        gateway={{
          publicKey: "pk_test_h8yv1DTbMiHPaIxZ2gEOq4oR",
          language: "en",
          supportedCurrencies: "all",
          supportedPaymentMethods: "all",
          notifications: "msg",
          callback: callbackFunc,
          labels: {
            cardNumber: "Card Number",
            expirationDate: "MM/YY",
            cvv: "CVV",
            cardHolder: "Name on Card",
            actionButton: "Pay",
          },
          style: {
            base: {
              color: "#535353",
              lineHeight: "18px",
              fontFamily: "sans-serif",
              fontSmoothing: "antialiased",
              fontSize: "16px",
              "::placeholder": {
                color: "rgba(0, 0, 0, 0.26)",
                fontSize: "15px",
              },
              // Hide icons by setting display to none
              icon: {
                display: "none", // Hides the icons
              },
            },
            invalid: {
              color: "red",
              iconColor: "#fa755a ",
            },
          },
        }}
      />

      {/* Change color of the message to red */}
      <p id="msg" style={{ color: "red" }}></p>

      <button
        onClick={() => GoSellElements.submit()}
        className="btn btn-theme float-end"
      >
        Submit
      </button>
    </>
  );
};

export default TapPayment;
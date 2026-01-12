const PAYMENT_API = "http://localhost:8080/api/payment";

export const createPayment = async (data) => {
  const res = await fetch(`${PAYMENT_API}/create`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    throw new Error("Payment API error");
  }

  return res.json();
};

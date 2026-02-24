import { useState, useCallback } from "react";

const API = import.meta.env.VITE_API_URL || "http://localhost:8000";

export function useRazorpay() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadScript = useCallback(() => {
    return new Promise((resolve, reject) => {
      if (document.getElementById("rzp-script")) return resolve(true);
      const s = document.createElement("script");
      s.id = "rzp-script";
      s.src = "https://checkout.razorpay.com/v1/checkout.js";
      s.onload = () => resolve(true);
      s.onerror = () => reject(new Error("Failed to load Razorpay"));
      document.body.appendChild(s);
    });
  }, []);

  const payOnce = useCallback(
    async ({ amount, currency = "INR", planType = "lifetime", onSuccess, onFailure }) => {
      setLoading(true);
      setError(null);
      try {
        await loadScript();
        const res = await fetch(`${API}/payment/create-order`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ amount, currency, plan_type: planType }),
        });
        const order = await res.json();
        if (!res.ok) throw new Error(order.detail || "Order creation failed");

        const options = {
          key: order.key_id,
          amount: order.amount,
          currency: order.currency,
          name: "StudyQuizAI",
          description: "Pro Access",
          order_id: order.order_id,
          theme: { color: "#0f766e" },
          handler: async (response) => {
            const vRes = await fetch(`${API}/payment/verify-payment`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              }),
            });
            const result = await vRes.json();
            vRes.ok && result.status === "success" ? onSuccess?.(result) : onFailure?.(result);
          },
          modal: { ondismiss: () => setLoading(false) },
        };
        const rzp = new window.Razorpay(options);
        rzp.on("payment.failed", (r) => { setError(r.error.description); onFailure?.(r.error); });
        rzp.open();
      } catch (err) {
        setError(err.message);
        onFailure?.({ error: err.message });
      } finally {
        setLoading(false);
      }
    },
    [loadScript]
  );

  const subscribe = useCallback(
    async ({ planId, onSuccess, onFailure }) => {
      setLoading(true);
      setError(null);
      try {
        await loadScript();
        const res = await fetch(`${API}/payment/create-subscription`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ plan_id: planId }),
        });
        const sub = await res.json();
        if (!res.ok) throw new Error(sub.detail || "Subscription creation failed");

        const options = {
          key: sub.key_id,
          subscription_id: sub.subscription_id,
          name: "StudyQuizAI",
          description: "Pro Subscription",
          theme: { color: "#0f766e" },
          handler: async (response) => {
            const vRes = await fetch(`${API}/payment/verify-subscription`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                razorpay_subscription_id: response.razorpay_subscription_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              }),
            });
            const result = await vRes.json();
            vRes.ok && result.status === "success" ? onSuccess?.(result) : onFailure?.(result);
          },
          modal: { ondismiss: () => setLoading(false) },
        };
        const rzp = new window.Razorpay(options);
        rzp.on("payment.failed", (r) => { setError(r.error.description); onFailure?.(r.error); });
        rzp.open();
      } catch (err) {
        setError(err.message);
        onFailure?.({ error: err.message });
      } finally {
        setLoading(false);
      }
    },
    [loadScript]
  );

  return { payOnce, subscribe, loading, error };
}

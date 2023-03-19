import { StripeRoutes } from "./Stripe.Routes";
import { get, post, deleted } from "../index.js";

export const StripeServices = {
  paymentStripe: async (data) => {
    const result = await post(StripeRoutes.StripePriceRead, data);
    if (result.status === 200) return result.data;
    else throw result;
  },
};

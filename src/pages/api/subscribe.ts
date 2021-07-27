import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/client";
import { fauna } from "../../services/fauna";
import { query as q } from "faunadb";
import { stripe } from "../../services/stripe";

type User = {
  ref: {
    id: string;
  };
  data: {
    stripe_customer_id?: string;
  };
};

const subscribe = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "POST") {
    const session = await getSession({ req });

    if (!session) {
      throw new Error("You need to be logged in");
    }

    const { email } = session.user!;

    const faunaUser = await fauna.query<User>(
      q.Get(q.Match(q.Index("user_by_email"), q.Casefold(email)))
    );

    let stripeCustomerId = faunaUser.data.stripe_customer_id;
    if (!faunaUser.data?.stripe_customer_id) {
      const stripeCustomer = await stripe.customers.create({
        email,
      });

      await fauna.query(
        q.Update(q.Ref(q.Collection("users"), faunaUser.ref.id), {
          data: {
            stripe_customer_id: stripeCustomer.id,
          },
        })
      );

      stripeCustomerId = stripeCustomer.id;
    }

    const stripeCheckoutSession = await stripe.checkout.sessions.create({
      customer: stripeCustomerId,
      payment_method_types: ["card"],
      billing_address_collection: "required",
      line_items: [
        {
          price: process.env.STRIPE_PRODUCT_PRICE!,
          quantity: 1,
        },
      ],
      mode: "subscription",
      allow_promotion_codes: true,
      success_url: process.env.STRIPE_SUCCESS_URL!,
      cancel_url: process.env.STRIPE_CANCEL_URL!,
    });
    return res.status(200).json({ sessionId: stripeCheckoutSession.id });
  } else {
    res.setHeader("Allow", "POST");
    return res.status(405).end("Method not allowed!");
  }
};

export default subscribe;

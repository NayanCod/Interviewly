"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { toast } from "sonner";
import { userPurchasedSubscription } from "@/lib/actions/general.action";
import Link from "next/link";

const Subscription = ({ user }: { user: User }) => {
  const processPayment = async () => {
    // e.preventDefault();
    try {
      const orderData = await fetch("/api/order", { method: "POST" }).then(
        (t) => t.json()
      );
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: orderData.amount,
        currency: orderData.currency,
        name: "Interviewly",
        description: "Get unlimited voice interview with one time subscription",
        order_id: orderData.orderId,
        handler: async function (response: any) {
          const data = {
            orderCreationId: orderData.orderId,
            razorpayPaymentId: response.razorpay_payment_id,
            razorpayOrderId: response.razorpay_order_id,
            razorpaySignature: response.razorpay_signature,
          };

          const result = await fetch("/api/verify", {
            method: "POST",
            body: JSON.stringify(data),
            headers: { "Content-Type": "application/json" },
          });
          const res = await result.json();
          // if (res.isOk) toast("payment succeed");
          if (res.isOk) {
            const saveSubscription = await userPurchasedSubscription(user?.id);
            if (saveSubscription?.success) {
              toast.success("Payment successful and subscription activated!");
            } else {
              toast.error(
                "Payment successful but subscription activation failed!"
              );
            }
          } else {
            toast(res.message);
          }
        },
        prefill: {
          name: "Nayan",
          email: "nayannew9@gmail.com",
          contact: "1234567890",
        },
        theme: {
          color: "#cac5fe",
        },
      };
      const paymentObject = new (window as any).Razorpay(options);
      paymentObject.on("payment.failed", function (response: any) {
        toast.error(response.error.description);
      });
      paymentObject.open();
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <>
    {
      user?.subscription ? (
        <Button className="bg-secondary px-2 md:px-4 py-2 rounded-full md:rounded-lg flex flex-row gap-2 items-center hover:bg-secondary">
        <Image src="/crown.png" alt="pro-pack" width={20} height={20} className="md:block hidden"/>
        <div className="text-primary-100 text-sm font-semibold md:block hidden">
          Active
        </div>
      </Button>
      ) : (
        <Dialog open>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="mb-2">
              Upgrade to premium
            </DialogTitle>
            <DialogDescription>
              {/* <div className="flex flex-col gap-4"> */}
                <div className="text-sm text-muted-foreground">
                  Pro pack is a one time paid subscription that gives you access
                  to premium features and benefits for life time.
                </div>
                <h1 className="text-3xl text-center">
                  <span className="line-through text-sm text-gray-400">
                    ₹99
                  </span>
                  ₹49
                </h1>
                <div className="flex flex-row gap-2 items-center justify-between">
                  <div className="text-sm font-semibold">
                    Unlimited Voice Interviews
                  </div>
                  <div className="text-sm text-muted-foreground">✅</div>
                </div>
                <div className="flex flex-row gap-2 items-center justify-between">
                  <div className="text-sm font-semibold">Unlimited Feedback</div>
                  <div className="text-sm text-muted-foreground">✅</div>
                </div>
              {/* </div> */}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <div className="flex flex-col w-full gap-3">
            <Button className="btn-primary w-full" onClick={processPayment}>
              Buy Now ₹49
            </Button>
            <Button className="btn-secondary w-full" asChild>
            <Link href="/">
              Cancel
            </Link>
            </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      )
    }
    </>
  );
};

export default Subscription;

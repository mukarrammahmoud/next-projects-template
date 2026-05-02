"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { checkoutSchema, type CheckoutInput } from "@/lib/validations";
import { createOrder } from "@/services/order.actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "sonner";

export function CheckoutForm({ total }: { total: number }) {
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CheckoutInput>({
    resolver: zodResolver(checkoutSchema),
  });

  const onSubmit = async (values: CheckoutInput) => {
    setIsPending(true);
    try {
      const result = await createOrder(values);
      if (result.success) {
        toast.success("Order placed successfully!");
        router.push(`/checkout/success?orderId=${result.orderId}`);
      }
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to place order";
      toast.error(message);
    } finally {
      setIsPending(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Shipping Information</CardTitle>
        <CardDescription>
          Enter your delivery details to complete your order.
        </CardDescription>
      </CardHeader>

      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              placeholder="+1 (555) 000-0000"
              {...register("phone")}
            />
            {errors.phone && (
              <p className="text-destructive text-sm">{errors.phone.message}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="shippingAddress">Full Shipping Address</Label>
            <Textarea
              id="shippingAddress"
              placeholder="123 Main St, Apt 4B&#10;New York, NY 10001"
              rows={4}
              {...register("shippingAddress")}
            />
            {errors.shippingAddress && (
              <p className="text-destructive text-sm">
                {errors.shippingAddress.message}
              </p>
            )}
          </div>
        </CardContent>

        <CardFooter className="flex-col gap-4">
          <div className="flex w-full items-center justify-between border-t py-4">
            <span className="text-lg font-semibold">Total to Pay:</span>
            <span className="text-xl font-bold">${total.toFixed(2)}</span>
          </div>
          <Button
            type="submit"
            size="lg"
            className="w-full"
            disabled={isPending}
          >
            {isPending ? "Processing..." : "Place Order"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}

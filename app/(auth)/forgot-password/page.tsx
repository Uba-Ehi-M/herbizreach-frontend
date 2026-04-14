"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { AuthBackLink } from "@/components/auth/AuthLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

const schema = z.object({
  email: z.string().email("Enter a valid email"),
});

type FormValues = z.infer<typeof schema>;

export default function ForgotPasswordPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  return (
    <div className="w-full max-w-[440px]">
      <AuthBackLink href="/login" label="Back to sign in" />
      <Card className="w-full border-[var(--border-default)] shadow-[var(--shadow-lg)]">
        <CardHeader className="text-center">
          <CardTitle className="font-[family-name:var(--font-display)] text-2xl">Reset password</CardTitle>
          <CardDescription>
            Enter your email and we&apos;ll send reset instructions when this feature is connected to your
            account email.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            className="space-y-4"
            onSubmit={handleSubmit((data) => {
              toast.success("Request received", {
                description: `If ${data.email} is registered, you'll hear from us soon. Contact support if you need help immediately.`,
              });
            })}
          >
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                autoComplete="email"
                className={cn(errors.email && "border-[var(--danger)] ring-1 ring-[var(--danger)]")}
                {...register("email")}
              />
              {errors.email ? (
                <p className="text-xs text-[var(--danger)]">{errors.email.message}</p>
              ) : null}
            </div>
            <Button type="submit" className="min-h-11 w-full">
              Send reset link
            </Button>
          </form>
          <p className="mt-4 text-center text-sm text-[var(--text-muted)]">
            Remember your password?{" "}
            <Link href="/login" className="font-semibold text-[var(--brand-primary)]">
              Sign in
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

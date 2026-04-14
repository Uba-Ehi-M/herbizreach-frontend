"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLogin } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";

const schema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(1, "Password is required"),
});

type FormValues = z.infer<typeof schema>;

export default function LoginPage() {
  const login = useLogin();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  return (
    <div className="w-full max-w-[440px]">
      <Card className="w-full border-[var(--border-default)] shadow-[var(--shadow-lg)]">
        <CardHeader className="text-center">
          <CardTitle className="font-[family-name:var(--font-display)] text-2xl">
            Welcome back
          </CardTitle>
          <CardDescription>Sign in to manage your storefront</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={handleSubmit((d) => login.mutate(d))}>
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
            <div className="space-y-2">
              <div className="flex items-center justify-between gap-2">
                <Label htmlFor="password">Password</Label>
                <Link
                  href="/forgot-password"
                  className="text-xs font-medium text-[var(--brand-primary)] hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
              <Input
                id="password"
                type="password"
                autoComplete="current-password"
                className={cn(
                  errors.password && "border-[var(--danger)] ring-1 ring-[var(--danger)]",
                )}
                {...register("password")}
              />
              {errors.password ? (
                <p className="text-xs text-[var(--danger)]">{errors.password.message}</p>
              ) : null}
            </div>
            <Button type="submit" className="min-h-11 w-full" disabled={login.isPending}>
              {login.isPending ? "Signing in…" : "Sign in"}
            </Button>
          </form>
          <p className="mt-4 text-center text-sm text-[var(--text-muted)]">
            New here?{" "}
            <Link href="/register" className="font-semibold text-[var(--brand-primary)]">
              Create your store
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

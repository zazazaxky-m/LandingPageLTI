"use client";

import { useActionState } from "react";
import { LogIn } from "lucide-react";

import { buttonClasses } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { loginAction } from "@/features/auth-actions";

export function LoginForm() {
  const [state, formAction, isPending] = useActionState(loginAction, {});

  return (
    <Card className="w-full max-w-md p-6">
      <div>
        <p className="text-xs font-black uppercase tracking-[0.2em] text-lumen-400">Admin Login</p>
        <h1 className="mt-2 text-2xl font-black text-white">Lumiatech CMS</h1>
        <p className="mt-3 text-sm leading-6 text-zinc-400">Sign in with the seeded admin account from environment variables.</p>
      </div>

      <form action={formAction} className="mt-7 grid gap-4">
        {state.error ? (
          <div className="rounded-ui border border-red-400/30 bg-red-400/10 p-3 text-sm font-bold text-red-200">
            {state.error}
          </div>
        ) : null}
        <label className="grid gap-2 text-sm font-bold text-zinc-300">
          Email
          <Input autoComplete="email" name="email" type="email" />
        </label>
        <label className="grid gap-2 text-sm font-bold text-zinc-300">
          Password
          <Input autoComplete="current-password" name="password" type="password" />
        </label>
        <button className={buttonClasses("solid")} disabled={isPending} type="submit">
          <LogIn className="h-4 w-4" />
          {isPending ? "Signing in..." : "Sign in"}
        </button>
      </form>
    </Card>
  );
}

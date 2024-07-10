"use client";
import { useRouter } from "next/navigation";

import { useState } from "react";

import { TRPCClientError } from "@trpc/client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import type { z } from "zod";

import { Eye, EyeOff } from "lucide-react";

import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { api } from "@/trpc/react";

import { LoginSchema } from "@/types";
import ClipLoader from "react-spinners/ClipLoader";
// import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const loginRoute = api.login.useMutation();

  async function onSubmit(data: z.infer<typeof LoginSchema>) {
    try {
      const res = await loginRoute.mutateAsync(data);
      toast.success(res.message);
      router.push("/");
      router.refresh();
    } catch (err) {
      if (err instanceof TRPCClientError) {
        toast.error(err.message);
      }
    }
  }

  return (
    <div className="my-auto flex flex-col items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>Login</CardTitle>
          <CardDescription>Login to add and modify schedule.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input placeholder="Username" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={isPasswordVisible ? "text" : "password"}
                          placeholder="********"
                          {...field}
                        />
                        <Button
                          variant="ghost"
                          size="icon"
                          tabIndex={-1}
                          className="absolute right-0 top-0"
                          type="button"
                          onClick={() =>
                            setIsPasswordVisible(!isPasswordVisible)
                          }
                        >
                          {isPasswordVisible ? <EyeOff /> : <Eye />}
                        </Button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* <CardDescription>
                New User?{" "}
                <Link href="/signup" className="underline">
                  Sign Up
                </Link>
              </CardDescription> */}
              <Button
                type="submit"
                variant="outline"
                disabled={loginRoute.isPending}
                className="gap-2"
              >
                <ClipLoader
                  color="#ffffff"
                  loading={loginRoute.isPending}
                  size={20}
                  aria-label="Loading"
                />{" "}
                Submit
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}

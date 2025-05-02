import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useMutation, useQuery } from "@tanstack/react-query";
import { User } from "@shared/schema";
import { useState, useEffect } from "react";

const registerSchema = z
  .object({
    username: z.string().min(3, {
      message: "Username must be at least 3 characters.",
    }),
    email: z.string().email({
      message: "Please enter a valid email address.",
    }),
    password: z.string().min(6, {
      message: "Password must be at least 6 characters.",
    }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export default function Register() {
  const [, navigate] = useLocation();
  const { toast } = useToast();

  // Check if user is already logged in
  const { data: user, isLoading: isUserLoading } = useQuery<User | null>({
    queryKey: ["/api/user/me"],
    retry: false,
  });

  // Redirect if already logged in
  useEffect(() => {
    if (user && !isUserLoading) {
      if (user.role === "admin") {
        navigate("/admin/dashboard");
      } else {
        navigate("/dashboard");
      }
    }
  }, [user, isUserLoading, navigate]);

  const form = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const registerMutation = useMutation({
    mutationFn: async (data: z.infer<typeof registerSchema>) => {
      // Remove confirmPassword before sending to API
      const { confirmPassword, ...userData } = data;
      const response = await apiRequest("POST", "/api/register", {
        ...userData,
        role: "salonOwner" // Default role for new registrations
      });
      return await response.json();
    },
    onSuccess: (data: User) => {
      toast({
        title: "Registration successful",
        description: `Welcome, ${data.username}! You can now log in.`,
      });
      navigate("/dashboard");
    },
    onError: (error: Error) => {
      toast({
        title: "Registration failed",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
    },
  });

  function onSubmit(data: z.infer<typeof registerSchema>) {
    registerMutation.mutate(data);
  }

  // If already logged in, show loading indicator
  if (isUserLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex">
      {/* Left column - Registration form */}
      <div className="flex-1 flex flex-col justify-center px-4 py-12 sm:px-6 lg:px-20 xl:px-24">
        <div className="mx-auto w-full max-w-sm lg:w-96">
          <div>
            <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
              Create a new account
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Already have an account?{" "}
              <Link href="/login">
                <a className="font-medium text-primary hover:underline">
                  Sign in here
                </a>
              </Link>
            </p>
          </div>

          <div className="mt-8">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Username</FormLabel>
                      <FormControl>
                        <Input placeholder="username" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="you@example.com" {...field} />
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
                        <Input type="password" placeholder="••••••" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirm Password</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="••••••"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div>
                  <Button
                    type="submit"
                    className="w-full"
                    disabled={registerMutation.isPending}
                  >
                    {registerMutation.isPending ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : null}
                    Create Account
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        </div>
      </div>

      {/* Right column - Hero section */}
      <div className="hidden lg:block relative flex-1">
        <div className="absolute inset-0 bg-primary">
          <div className="absolute inset-0 bg-gradient-to-br from-primary to-purple-700 opacity-90"></div>
        </div>
        <div className="relative flex flex-col justify-center items-center h-full px-10 text-white">
          <h1 className="text-4xl font-bold mb-6">Get Started Today</h1>
          <p className="text-xl text-center mb-8">
            Create your salon website in minutes and start attracting more clients
          </p>
          <div className="space-y-6 max-w-md">
            <div className="bg-white/10 p-4 rounded-lg">
              <h3 className="font-bold text-lg mb-2">Free 14-Day Trial</h3>
              <p className="text-white/80">
                Try all features with no commitment. No credit card required to get started.
              </p>
            </div>
            <div className="bg-white/10 p-4 rounded-lg">
              <h3 className="font-bold text-lg mb-2">Easy Content Management</h3>
              <p className="text-white/80">
                Update your services, hours, and photos without any technical knowledge.
              </p>
            </div>
            <div className="bg-white/10 p-4 rounded-lg">
              <h3 className="font-bold text-lg mb-2">Mobile-Optimized</h3>
              <p className="text-white/80">
                Your site will look great and work perfectly on phones, tablets, and computers.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
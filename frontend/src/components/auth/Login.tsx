import { _on_login } from "@/api/users/userApiServices";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Eye, EyeOff, FacebookIcon, Github, PhoneIncomingIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card } from "../ui/card";
import LoadingButtion from "../Common/LoadingButton";

const Login = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: Yup.object({
      email: Yup.string().email("Invalid email address").required("Email is required"),
      password: Yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
    }),
    onSubmit: async (values) => {
      setIsLoading(true);
      const response = await _on_login(values);
      setIsLoading(false);
      if (response?.token) {
        window.localStorage.setItem("token", response.token);
        window.localStorage.setItem("user_info", JSON.stringify(response.user));
        toast.success("Logged in successfully");
        navigate("/dashboard");
      } else {
        toast.error(response?.response?.data?.message ?? "!Oops Something Went Wrong...");
      }
    },
  });

  return (
    <Card className='p-6'>
      <div className='flex flex-col space-y-2 text-left'>
        <h1 className='text-2xl font-semibold tracking-tight'>Login</h1>
        <p className='text-sm text-muted-foreground'>
          Enter your email and password below <br />
          to log into your account
        </p>
      </div>
      <div className={cn("grid gap-6")}>
        <form onSubmit={formik.handleSubmit} className="grid gap-2">
          {/* Email Field */}
          <div className="space-y-1">
            <label className="block text-sm font-medium">Email</label>
            <Input
              type="email"
              placeholder="name@example.com"
              {...formik.getFieldProps("email")}
              className={formik.touched.email && formik.errors.email ? "border-red-500" : ""}
            />
            {formik.touched.email && formik.errors.email && (
              <p className="text-sm text-red-500">{formik.errors.email}</p>
            )}
          </div>

          {/* Password Field */}
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <label className="block text-sm font-medium">Password</label>
              <Link
                to="/forgotpassword"
                className="text-sm font-medium text-muted-foreground hover:opacity-75"
              >
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="********"
                {...formik.getFieldProps("password")}
                className={formik.touched.password && formik.errors.password ? "border-red-500" : ""}
              />
              <button
                type="button"
                className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-500"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {formik.touched.password && formik.errors.password && (
              <p className="text-sm text-red-500">{formik.errors.password}</p>
            )}
          </div>

          {/* Submit Button */}
          <LoadingButtion isSubmitting={formik.isSubmitting} label="Login" />

          {/* Divider */}
          <div className="relative my-2">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
            </div>
          </div>

          {/* Social Login Buttons */}
          <div className="flex items-center gap-2">
            <Button variant="outline" className="w-full" type="button" disabled={isLoading}>
              <svg width="10px" height="10px" viewBox="-3 0 262 262" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid"><path d="M255.878 133.451c0-10.734-.871-18.567-2.756-26.69H130.55v48.448h71.947c-1.45 12.04-9.283 30.172-26.69 42.356l-.244 1.622 38.755 30.023 2.685.268c24.659-22.774 38.875-56.282 38.875-96.027" fill="#4285F4" /><path d="M130.55 261.1c35.248 0 64.839-11.605 86.453-31.622l-41.196-31.913c-11.024 7.688-25.82 13.055-45.257 13.055-34.523 0-63.824-22.773-74.269-54.25l-1.531.13-40.298 31.187-.527 1.465C35.393 231.798 79.49 261.1 130.55 261.1" fill="#34A853" /><path d="M56.281 156.37c-2.756-8.123-4.351-16.827-4.351-25.82 0-8.994 1.595-17.697 4.206-25.82l-.073-1.73L15.26 71.312l-1.335.635C5.077 89.644 0 109.517 0 130.55s5.077 40.905 13.925 58.602l42.356-32.782" fill="#FBBC05" /><path d="M130.55 50.479c24.514 0 41.05 10.589 50.479 19.438l36.844-35.974C195.245 12.91 165.798 0 130.55 0 79.49 0 35.393 29.301 13.925 71.947l42.211 32.783c10.59-31.477 39.891-54.251 74.414-54.251" fill="#EB4335" /></svg> Google
            </Button>
          </div>
        </form>
      </div>
      <div className="text-center text-sm text-gray-500 mt-3">
        Don’t have an account? <Link to="/signup" className="text-blue-600 hover:underline">Sign up</Link>
      </div>
    </Card>
  );
};

export default Login;

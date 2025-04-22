import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import { on_signup } from "@/api/users/userApiServices";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import LoadingButton from "../Common/LoadingButton";
import { Eye, EyeOff } from "lucide-react";

const Signup = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const formik = useFormik({
    initialValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
    },
    validationSchema: Yup.object({
      firstName: Yup.string().required("First name is required"),
      lastName: Yup.string().required("Last name is required"),
      email: Yup.string().email("Invalid email address").required("Email is required"),
      phone: Yup.string().matches(/^\+?[1-9]\d{1,14}$/, "Invalid phone number").required("Phone number is required"),
      password: Yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
      confirmPassword: Yup.string().oneOf([Yup.ref("password"), ""], "Passwords must match").required("Confirm Password is required"),
    }),
    onSubmit: async (values, { setSubmitting }) => {
      setSubmitting(true)
      const userData = {
        ...values,
        phone: values?.phone?.toString(),
        profile_image: "",
      };
      const response = await on_signup(userData);
      console.log(response, "responseresponse");

      if (response?.token) {
        localStorage.setItem("token", response.token);
        localStorage.setItem("user_info", JSON.stringify(response.user));
        toast.success(response?.message ?? "Signed up successfully");
        navigate("/dashboard");
      } else {
        toast.error(response?.response?.data?.message ?? "!Oops Something Went Wrong...");
        setSubmitting(false)
      }
    },
  });

  return (
    <Card className="shadow-lg">
      <CardContent>
        <div className='flex flex-col space-y-2 text-left'>
          <h1 className='text-2xl font-semibold tracking-tight'>Create an account</h1>
          <p className='text-sm text-muted-foreground'>
            Enter your email and password to create an account. <br />
            <div className="text-sm text-gray-500 pb-4">
              Already have an account? <Link to="/" className="text-blue-600 hover:underline">Sign in</Link>
            </div>
          </p>
        </div>
        <form onSubmit={formik.handleSubmit} className="space-y-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className="py-[5px]" htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                {...formik.getFieldProps("firstName")}
                className={formik.touched.firstName && formik.errors.firstName ? "border-red-500" : ""}
              />
              {formik.touched.firstName && formik.errors.firstName && (
                <p className="text-red-500 text-sm mt-1">{formik.errors.firstName}</p>
              )}
            </div>
            <div>
              <Label className="py-[5px]" htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                {...formik.getFieldProps("lastName")}
                className={formik.touched.lastName && formik.errors.lastName ? "border-red-500" : ""}
              />
              {formik.touched.lastName && formik.errors.lastName && (
                <p className="text-red-500 text-sm mt-1">{formik.errors.lastName}</p>
              )}
            </div>
          </div>
          <div>
            <Label className="py-[5px]" htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              {...formik.getFieldProps("email")}
              className={formik.touched.email && formik.errors.email ? "border-red-500" : ""}
            />
            {formik.touched.email && formik.errors.email && (
              <p className="text-red-500 text-sm mt-1">{formik.errors.email}</p>
            )}
          </div>
          <div>
            <Label className="py-[5px]" htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              type="number"
              {...formik.getFieldProps("phone")}
              className={formik.touched.phone && formik.errors.phone ? "border-red-500" : ""}
            />
            {formik.touched.phone && formik.errors.phone && (
              <p className="text-red-500 text-sm mt-1">{formik.errors.phone}</p>
            )}
          </div>
          <div className="flex gap-4">
            <div className="w-1/2">
              <Label className="py-[5px]" htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  {...formik.getFieldProps("password")}
                  className={formik.touched.password && formik.errors.password ? "border-red-500 pr-10" : "pr-10"}
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
                <p className="text-red-500 text-sm mt-1">{formik.errors.password}</p>
              )}
            </div>
            <div className="w-1/2">
              <Label className="py-[5px]" htmlFor="confirmPassword">Confirm Password</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showPassword ? "text" : "password"}
                  {...formik.getFieldProps("confirmPassword")}
                  className={formik.touched.confirmPassword && formik.errors.confirmPassword ? "border-red-500" : ""}
                />
                <button
                  type="button"
                  className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-500"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {formik.touched.confirmPassword && formik.errors.confirmPassword && (
                <p className="text-red-500 text-sm mt-1">{formik.errors.confirmPassword}</p>
              )}
            </div>
          </div>
          <LoadingButton isSubmitting={formik.isSubmitting} label="Sign up" />
        </form>
      </CardContent>
    </Card>
  );
};

export default Signup;

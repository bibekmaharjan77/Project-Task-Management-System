import { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import VerifyOTP from "./VerifyOTP";
import { toast } from "react-toastify";
import AXIOS_INSTANCE from "@/api/axios_instance";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Link } from "react-router-dom";

const ForgotPassword = () => {
  const [timer, setTimer] = useState(300);
  const [canResend, setCanResend] = useState(true);
  const [disableEmail, setdisableEmail] = useState(false);

  const formik = useFormik({
    initialValues: {
      email: "",
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email("Invalid email address")
        .required("Email is required"),
    }),
    onSubmit: async (values) => {
      setTimer(180);
      setCanResend(false);

      try {
        await AXIOS_INSTANCE.post("/users/forgotpassword", {
          email: values.email,
        });
        toast.success("OTP sent to your email");
        setdisableEmail(true);
      } catch (err) {
        console.error(err);
        toast.error("Failed to send OTP. Please try again.");
        setdisableEmail(false);
      }
    },
  });

  return (
    <Card className="w-full max-w-md rounded-2xl shadow-lg border">
      <CardContent>
        <div className='flex flex-col space-y-2 text-left'>
          <h1 className='text-2xl font-semibold tracking-tight'>Forgot Password</h1>
          <p className='text-sm text-muted-foreground'>
            Enter your registered email and
            we will send you a link to reset your password.
          </p>
        </div>

        <form onSubmit={formik.handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              name="email"
              type="email"
              disabled={disableEmail}
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="Enter your email"
            />
            {formik.touched.email && formik.errors.email && (
              <p className="text-red-500 text-sm">{formik.errors.email}</p>
            )}
          </div>

          {canResend && (
            <Button type="submit" className="w-full uppercase text-sm cursor-pointer" disabled={!canResend}>
              Send OTP
            </Button>
          )}
        </form>

        {!canResend && (
          <div className="mt-4">
            <VerifyOTP
              setTimer={setTimer}
              setCanResend={setCanResend}
              timer={timer}
              email={formik.values.email}
            />
          </div>
        )}
        <div className="text-sm text-gray-500 pb-4 pt-2">
          Don't have an account?? <Link to="/" className="text-blue-600 hover:underline">Sign up</Link>
        </div>
      </CardContent>
    </Card>
  );
};

export default ForgotPassword;

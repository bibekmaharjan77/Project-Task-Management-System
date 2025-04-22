import { useNavigate, useParams } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import AXIOS_INSTANCE from "@/api/axios_instance";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";

const ChangePassword = ({ email }: { email?: string }) => {
  const navigate = useNavigate();
  const params = useParams();

  const [showPassword, setShowPassword] = useState(false);


  const formik = useFormik({
    initialValues: {
      newPassword: "",
      confirmPassword: "",
    },
    validationSchema: Yup.object({
      newPassword: Yup.string()
        .min(6, "Password must be at least 6 characters")
        .required("New password is required"),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref("newPassword")], "Passwords must match")
        .required("Confirm password is required"),
    }),
    onSubmit: async () => {
      if (formik.values.newPassword === formik.values.confirmPassword) {
        try {
          if (email) {
            await AXIOS_INSTANCE.post("/users/resetpasswordwithoutOtp", {
              email: email,
              password: formik.values.newPassword,
            });
            window.localStorage.removeItem("user_info")
            window.localStorage.removeItem("token")
          } else {
            await AXIOS_INSTANCE.post("/users/resetpassword", {
              email: params.email,
              password: formik.values.newPassword,
              otp: params.otp
            });
          }
          toast.success("Password reset successfully");
          navigate("/");
        } catch (error) {
          console.error("Error resetting password:", error);
          toast.error("Failed to reset password. Please try again.");
        }
      } else {
        toast.error("Passwords do not match");
      }
    },
  });

  return (
    <Card className="w-full max-w-md  rounded-2xl shadow-lg border">
      <CardContent>
        <div className='flex flex-col space-y-2 text-left'>
          <h1 className='text-2xl font-semibold tracking-tight'>Change Password</h1>
        </div>

        <form onSubmit={formik.handleSubmit} className="space-y-4 py-4">
          {/* New Password */}
          <div className="space-y-2 relative">
            <Label htmlFor="newPassword">New Password</Label>
            <Input
              id="newPassword"
              name="newPassword"
              type={showPassword ? "text" : "password"}
              value={formik.values.newPassword}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="Enter new password"
            />
            <button
              type="button"
              className="absolute top-9 right-3 text-gray-500"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
            {formik.touched.newPassword && formik.errors.newPassword && (
              <p className="text-red-500 text-sm">
                {formik.errors.newPassword}
              </p>
            )}
          </div>

          {/* Confirm Password */}
          <div className="space-y-2 relative">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type={showPassword ? "text" : "password"}
              value={formik.values.confirmPassword}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="Re-enter password"
            />
            <button
              type="button"
              className="absolute top-9 right-3 text-gray-500"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
            {formik.touched.confirmPassword &&
              formik.errors.confirmPassword && (
                <p className="text-red-500 text-sm">
                  {formik.errors.confirmPassword}
                </p>
              )}
          </div>

          <Button type="submit" className="w-full uppercase text-sm cursor-pointer">
            Change Password
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default ChangePassword;

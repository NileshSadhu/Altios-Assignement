import { useState } from "react";
import { useNavigate } from "react-router-dom";

import CustomBtn from "../../components/CustomBtn";
import CustomInput from "../../components/CustomInput";

import api from "../../api/axios";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>(
    {},
  );

  async function apiLoginCall() {
    try {
      setLoading(true);
      setErrors({});

      const response = await api.post("/auth/login", {
        email,
        password,
      });

      const token = response.data.token;

      if (!token) {
        setErrors({ password: "Something went wrong. Please try again." });
        return;
      }

      localStorage.setItem("token", token);

      navigate("/");
    } catch (error: any) {
      console.log("Failed login API : ", error);

      const message = error?.response?.data?.message;

      if (message === "Invalid credentials") {
        setErrors({ email: "No account found with this email." });
      } else if (message === "Invalid password") {
        setErrors({ password: "Incorrect password." });
      } else if (message === "Validation error") {
        setErrors({ email: "Please check your email and password." });
      } else {
        setErrors({ password: "Login failed. Please try again." });
      }
    } finally {
      setLoading(false);
    }
  }

  function handleLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    apiLoginCall();
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-md p-8">
        <div className="mb-6 text-left">
          <h2 className="text-3xl font-bold">Welcome Back</h2>
          <p className="mt-2 text-gray-500">Please enter your details.</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="mb-2 block font-medium">Email</label>

            <CustomInput
              name="email"
              type="email"
              value={email}
              placeholder="xyz@example.com"
              onChange={(e) => setEmail(e.target.value)}
              error={errors.email}
            />
          </div>

          <div>
            <label className="mb-2 block font-medium">Password</label>

            <CustomInput
              name="password"
              type="password"
              value={password}
              placeholder="At least 8 characters"
              onChange={(e) => setPassword(e.target.value)}
              error={errors.password}
            />
          </div>

          <CustomBtn text={loading ? "loading..." : "Submit"} type="submit" />
          <p className="text-center text-xs ">
            Don't have an account ?{" "}
            <span
              className="text-blue-600 cursor-pointer"
              onClick={() => navigate("/register")}
            >
              Register here
            </span>
            .
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;

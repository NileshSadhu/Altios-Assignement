import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import CustomBtn from "../../components/CustomBtn";
import CustomInput from "../../components/CustomInput";

import api from "../../api/axios";

const Register = () => {
  const navigate = useNavigate();

  const [username, setUsername] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [errors, setErrors] = useState<{
    username?: string;
    email?: string;
    password?: string;
  }>({});

  async function apiRegisterCall() {
    try {
      setLoading(true);
      setErrors({});

      const response = await api.post("/auth/register", {
        username,
        email,
        password,
      });

      const token = response.data.token;
      if (!token) {
        setErrors({ password: "Something went wrong. Please try again." });
        return;
      }

      localStorage.setItem("token", token);
      localStorage.setItem("username", response.data.user.username);
      navigate("/");
    } catch (error) {
      console.log("Failed register API : ", error);

      let message: string | undefined;

      if (axios.isAxiosError(error)) {
        message = error.response?.data?.message;
      }

      if (message === "User already exists.") {
        setErrors({ email: "An account with this email already exists." });
      } else if (message === "Username already taken.") {
        setErrors({ username: "This username is already taken." });
      } else if (message === "Validation error") {
        setErrors({
          password: "Please check your username, email, and password.",
        });
      } else {
        setErrors({ password: "Registration failed. Please try again." });
      }
    } finally {
      setLoading(false);
    }
  }

  function handleRegister(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    apiRegisterCall();
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-md p-8">
        <div className="mb-6 text-left">
          <h2 className="text-3xl font-bold">Create an account.</h2>
          <p className="mt-2 text-gray-500">Increase you productivity.</p>
        </div>

        <form onSubmit={handleRegister} className="space-y-5">
          <div>
            <label className="mb-2 block font-medium">Username</label>

            <CustomInput
              name="username"
              type="text"
              value={username}
              placeholder="nilesh sadhu"
              onChange={(e) => setUsername(e.target.value)}
              error={errors.username}
            />
          </div>

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
            Already have an account ?{" "}
            <span
              className="text-black cursor-pointer"
              onClick={() => navigate("/login")}
            >
              Login here
            </span>
            .
          </p>
        </form>
      </div>
    </div>
  );
};

export default Register;

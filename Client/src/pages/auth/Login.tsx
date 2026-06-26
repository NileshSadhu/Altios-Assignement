import { useState } from "react";
import CustomBtn from "../../components/CustomBtn";
import CustomInput from "../../components/CustomInput";

const Login = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  function handleLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    console.log({
      email,
      password,
    });

    // API call here
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-lg">
        <div className="mb-6 text-center">
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
            />
          </div>

          <CustomBtn text="Login" type="submit" />
        </form>
      </div>
    </div>
  );
};

export default Login;

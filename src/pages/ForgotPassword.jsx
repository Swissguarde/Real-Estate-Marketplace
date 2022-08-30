import { useState } from "react";
import { Link } from "react-router-dom";
import { getAuth, sendPasswordResetEmail } from "firebase/auth";
import { toast } from "react-toastify";
const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const onChange = (e) => {
    setEmail(e.target.value);
  };

  const sendReset = async () => {
    try {
      const auth = getAuth();
      await sendPasswordResetEmail(auth, email);
      toast.success("Email sent");
    } catch (error) {
      toast.error("Could not send reset email");
    }
  };
  return (
    <div>
      <div className="text-3xl">Forgot your password?</div>
      <div className="mt-10 md:max-w-[550px]">
        <label>Email</label>
        <div>
          <input
            type="email"
            className="p-3 w-full my-2 rounded-lg bg-black/80 text-white dark:bg-black/50"
            placeholder="micheal@hotmail.com"
            id="email"
            value={email}
            onChange={onChange}
          />
          <div className="float-right">
            <Link className="text-blue-600 underline" to="/sign-in">
              Sign In
            </Link>
          </div>
        </div>

        <button
          onClick={sendReset}
          className="mt-6 p-2 rounded-lg w-full bg-blue-500"
        >
          Send Reset Link
        </button>
      </div>
    </div>
  );
};
export default ForgotPassword;

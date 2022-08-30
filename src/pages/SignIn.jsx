import { useState } from "react";
import { FaEye } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { toast } from "react-toastify";
import OAuth from "../components/OAuth";
const SignIn = () => {
  const [visible, setVisible] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const { email, password } = formData;

  const onChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const navigate = useNavigate();

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const auth = getAuth();
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;
      toast.success("Logged In Successfully");
      navigate("/");
    } catch (error) {
      toast.error("Wrong user credentials");
    }
  };
  return (
    <div className="sm:mt-16">
      <div>WELCOME BACK</div>
      <p className="mt-6">
        Don't have an account ?{" "}
        <Link className="text-blue-600" to="/sign-up">
          Sign Up
        </Link>
      </p>

      <form onSubmit={onSubmit} className="mt-10 md:max-w-[550px]">
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
        </div>
        <label>Password</label>
        <div className="relative">
          <input
            type={visible ? "text" : "password"}
            className="p-3 w-full my-2 rounded-lg bg-black/80 text-white dark:bg-black/50"
            id="password"
            value={password}
            onChange={onChange}
          />
          <FaEye
            className="absolute top-6 right-3 cursor-pointer"
            onClick={() => setVisible(!visible)}
          />
        </div>

        <button className="mt-6 p-2 rounded-lg w-full bg-blue-500">
          Sign In
        </button>
      </form>
      <div className="mt-10 md:max-w-[550px] md:mb-20">
        <div className="float-right">
          <Link className="text-blue-600 underline" to="/forgot-password">
            Forgot Password?
          </Link>
        </div>
      </div>

      <div className="pt-20 pb-32 md:max-w-[550px] flex items-center justify-center">
        <OAuth />
      </div>
    </div>
  );
};
export default SignIn;

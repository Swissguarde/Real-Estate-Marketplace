import { useState } from "react";
import { FaEye } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import {
  getAuth,
  createUserWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase.config";
import { toast } from "react-toastify";
import OAuth from "../components/OAuth";
const SignUp = () => {
  const [visible, setVisible] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const { name, email, password } = formData;

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
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;
      updateProfile(auth.currentUser, {
        displayName: name,
      });

      const formDataCopy = { ...formData };
      delete formDataCopy.password;
      formDataCopy.timestamp = serverTimestamp();

      await setDoc(doc(db, "users", user.uid), formDataCopy);
      navigate("/");
      toast.success("Account created");
    } catch (error) {
      toast.error("An error occured");
    }
  };
  return (
    <div className="sm:mt-16">
      <div>START FOR FREE</div>
      <div className="my-7 text-3xl font-semibold">Create new account</div>
      <p>
        Already have an account ?{" "}
        <Link className="text-blue-600" to="/sign-in">
          Log In
        </Link>
      </p>

      <form onSubmit={onSubmit} className="mt-10 md:max-w-[550px]">
        <label>Full Name</label>
        <div>
          <input
            type="text"
            className="p-3 w-full my-2 rounded-lg bg-black/80 text-white dark:bg-black/50"
            placeholder="micheal scott"
            id="name"
            value={name}
            onChange={onChange}
          />
        </div>
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

        <button className="mt-6 mb-10 p-2 rounded-lg w-full bg-blue-500">
          Sign Up
        </button>
      </form>
      <div className="pb-28 md:max-w-[550px] flex items-center justify-center">
        <OAuth />
      </div>
    </div>
  );
};
export default SignUp;

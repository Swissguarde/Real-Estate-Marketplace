import googleIcon from "../assets/svg/googleIcon.svg";
import { useLocation, useNavigate } from "react-router-dom";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { db } from "../firebase.config";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { toast } from "react-toastify";
const OAuth = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleClick = async () => {
    try {
      const auth = getAuth();
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      const docRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(docRef);
      if (!docSnap.exists()) {
        await setDoc(doc(db, "users", user.uid), {
          name: user.displayName,
          email: user.email,
          timestamp: serverTimestamp(),
        });
      }
      navigate("/");
    } catch (error) {
      console.log(error);
      toast.error("Google authorization failed");
    }
  };
  return (
    <div
      onClick={handleClick}
      className="flex items-center gap-3 cursor-pointer"
    >
      <p>Or sign {location.pathname === "/sign-in" ? "in" : "up"} with</p>
      <img
        className="bg-white p-3 rounded-[50%] w-[50px] h-[50px]"
        src={googleIcon}
        alt=""
      />
    </div>
  );
};
export default OAuth;

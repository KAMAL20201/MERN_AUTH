import { useCallback, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { useDispatch, useSelector } from "react-redux";
import { signInSuccess } from "./redux/user/userSlice";

export default function Container({ children }) {
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.user);

  const handleWindowLoad = useCallback(() => {
    google.accounts.id.initialize({
      client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
      callback: async (response) => {
        const decoded = jwtDecode(response.credential);

        const { name, picture, email } = decoded;
        const res = await fetch("/api/auth/google", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name,
            email,
            photo: picture,
          }),
        });
        const data = await res.json();
        dispatch(signInSuccess(data));
      },
    });
    google.accounts.id.prompt();
  }, []);

  useEffect(() => {
    if (currentUser) return;

    const timer = setTimeout(() => {
      handleWindowLoad();
    }, 1100);

    return () => clearTimeout(timer);
  }, [currentUser, handleWindowLoad]);

  return <div className="flex w-full h-full">{children}</div>;
}

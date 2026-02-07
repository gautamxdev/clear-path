import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const auth = localStorage.getItem("ca-auth");
    if (!auth) {
      navigate("/login", { replace: true });
    } else {
      navigate("/dashboard", { replace: true });
    }
  }, [navigate]);

  return null;
};

export default Index;

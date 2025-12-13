import { useNavigate } from "react-router-dom";
import CartTable from "../components/CartTable";

const CartPage = () => {
  const navigate = useNavigate();
  return <CartTable onCheckout={() => navigate("/checkout")} />;
};

export default CartPage;

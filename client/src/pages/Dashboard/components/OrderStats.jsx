import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import StatCard from "./StatCard";

function OrderStats({ value }) {
  return (
    <StatCard
      title="Orders"
      value={value}
      color="#22c55e"
      change="+8%"
      icon={<ShoppingCartIcon sx={{ color: "#22c55e" }} />}
    />
  );
}

export default OrderStats;
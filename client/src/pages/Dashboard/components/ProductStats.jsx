import Inventory2Icon from "@mui/icons-material/Inventory2";
import StatCard from "./StatCard";

function ProductStats({ value }) {
  return (
    <StatCard
      title="Products"
      value={value}
      color="#f59e0b"
      change="+3%"
      icon={<Inventory2Icon sx={{ color: "#f59e0b" }} />}
    />
  );
}

export default ProductStats;
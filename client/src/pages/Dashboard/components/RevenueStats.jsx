import PaidIcon from "@mui/icons-material/Paid";
import StatCard from "./StatCard";

function RevenueStats({ value }) {
  return (
    <StatCard
      title="Revenue"
      value={`₹ ${Number(value).toLocaleString("en-IN")}`}
      color="#9333ea"
      change="+15%"
      icon={<PaidIcon sx={{ color: "#9333ea" }} />}
    />
  );
}

export default RevenueStats;
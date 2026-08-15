import PeopleIcon from "@mui/icons-material/People";
import StatCard from "./StatCard";

function CustomerStats({ value }) {
  return (
    <StatCard
      title="Customers"
      value={value}
      color="#2563eb"
      change="+12%"
      icon={<PeopleIcon sx={{ color: "#2563eb" }} />}
    />
  );
}

export default CustomerStats;
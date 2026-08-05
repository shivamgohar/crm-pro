import DashboardOutlinedIcon from "@mui/icons-material/DashboardOutlined";
// import PeopleOutlineIcon from "@mui/icons-material/PeopleOutline";
import PeopleAltOutlinedIcon from "@mui/icons-material/PeopleAltOutlined";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import PaymentsOutlinedIcon from "@mui/icons-material/PaymentsOutlined";
import AssessmentOutlinedIcon from "@mui/icons-material/AssessmentOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";

export const navigationItems = [
  {
    title: "Dashboard",
    icon: DashboardOutlinedIcon,
    path: "/dashboard",
  },
  {
    title: "Customers",
    icon: PeopleAltOutlinedIcon,
    path: "/customers",
  },
  {
    title: "Products",
    icon: Inventory2OutlinedIcon,
    path: "/products",
  },
  {
    title: "Orders",
    icon: ShoppingCartOutlinedIcon,
    path: "/orders",
  },
  {
    title: "Payments",
    icon: PaymentsOutlinedIcon,
    path: "/payments",
  },
  {
    title: "Reports",
    icon: AssessmentOutlinedIcon,
    path: "/reports",
  },
  {
    title: "Settings",
    icon: SettingsOutlinedIcon,
    path: "/settings",
  },
];
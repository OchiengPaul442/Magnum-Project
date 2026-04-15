import {
  Activity,
  BadgeDollarSign,
  Building2,
  ClipboardList,
  CreditCard,
  LayoutDashboard,
  Receipt,
  Settings,
  ShoppingBag,
  UserCircle2,
  Users,
  UsersRound,
  Wallet,
} from "lucide-react";

export const NAV_SECTIONS = [
  {
    label: "Overview",
    items: [{ label: "Dashboard", href: "/dashboard", icon: LayoutDashboard }],
  },
  {
    label: "Core Records",
    items: [
      { label: "Schools", href: "/schools", icon: Building2 },
      {
        label: "School Personnel",
        href: "/school-personnel",
        icon: UsersRound,
      },
      { label: "Students", href: "/students", icon: Users },
      { label: "Parents", href: "/parents", icon: UserCircle2 },
      { label: "Vendors", href: "/vendors", icon: ShoppingBag },
      { label: "Vendor Items", href: "/items", icon: ClipboardList },
    ],
  },
  {
    label: "Finance",
    items: [
      { label: "Sales", href: "/sales", icon: Receipt },
      { label: "Cards", href: "/cards", icon: CreditCard },
      { label: "Student Accounts", href: "/student-accounts", icon: Wallet },
      { label: "User Accounts", href: "/user-accounts", icon: BadgeDollarSign },
      { label: "Transactions", href: "/transactions", icon: BadgeDollarSign },
    ],
  },
  {
    label: "Admin",
    items: [
      { label: "Activity Logs", href: "/activity-logs", icon: Activity },
      { label: "Admin Users", href: "/admin-users", icon: UsersRound },
      {
        label: "Roles & Permissions",
        href: "/roles-permissions",
        icon: Settings,
      },
      { label: "Account & Security", href: "/account", icon: Settings },
    ],
  },
];

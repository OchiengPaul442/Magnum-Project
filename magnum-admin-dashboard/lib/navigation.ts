import {
  Activity,
  ArrowLeftRight,
  BadgeDollarSign,
  Building2,
  ClipboardList,
  CreditCard,
  KeyRound,
  LayoutDashboard,
  Receipt,
  ShieldCheck,
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
      { label: "Transactions", href: "/transactions", icon: ArrowLeftRight },
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
        icon: KeyRound,
      },
      { label: "Account & Security", href: "/account", icon: ShieldCheck },
    ],
  },
];

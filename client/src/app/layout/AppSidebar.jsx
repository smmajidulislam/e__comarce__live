"use client";
import { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSidebar } from "../context/SidebarContext";

import {
  LayoutDashboard,
  Users,
  Layers,
  Package,
  ShoppingCart,
  FileBarChart,
  UserCircle,
  FileText,
  Settings,
} from "lucide-react";

const navItems = [
  {
    name: "Dashboard",
    icon: <LayoutDashboard size={18} />,
    path: "/admin/admin",
  },
  {
    name: "Users",
    icon: <Users size={18} />,
    path: "/admin/admin/others-pages/users",
  },
  {
    name: "Category",
    icon: <Layers size={18} />,
    path: "/admin/admin/others-pages/category",
  },
  {
    name: "Products",
    icon: <Package size={18} />,
    path: "/admin/admin/others-pages/products",
  },
  {
    name: "Orders",
    icon: <ShoppingCart size={18} />,
    path: "/admin/admin/others-pages/orders",
  },
  {
    name: "Reports",
    icon: <FileBarChart size={18} />,
    path: "/admin/admin/others-pages/reports",
  },
  {
    name: "Profile",
    icon: <UserCircle size={18} />,
    path: "/admin/admin/others-pages/profile",
  },
  {
    name: "Pages",
    icon: <FileText size={18} />,
    subItems: [
      {
        name: "HomePage",
        path: "/admin/admin/others-pages/homepage",
        pro: false,
      },
      {
        name: "Site Settings",
        path: "/admin/admin/others-pages/site-settings",
        pro: false,
      },
    ],
  },
  {
    name: "Settings",
    icon: <Settings size={18} />,
    path: "/admin/admin/others-pages/settings",
  },
];

const AppSidebar = () => {
  const { isExpanded, isMobileOpen, isHovered, setIsHovered } = useSidebar();
  const pathname = usePathname();
  const [openSubmenu, setOpenSubmenu] = useState(null);
  const [subMenuHeight, setSubMenuHeight] = useState({});
  const subMenuRefs = useRef({});

  const isActive = useCallback((path) => path === pathname, [pathname]);

  const handleSubmenuToggle = (index, type) => {
    setOpenSubmenu((prev) =>
      prev?.type === type && prev?.index === index ? null : { type, index }
    );
  };

  useEffect(() => {
    let found = false;
    ["main", "others"].forEach((type) => {
      const items = type === "main" ? navItems : [];
      items.forEach((item, idx) => {
        item.subItems?.forEach((sub) => {
          if (isActive(sub.path)) {
            setOpenSubmenu({ type, index: idx });
            found = true;
          }
        });
      });
    });
    if (!found) setOpenSubmenu(null);
  }, [pathname, isActive]);

  useEffect(() => {
    if (openSubmenu !== null) {
      const key = `${openSubmenu.type}-${openSubmenu.index}`;
      if (subMenuRefs.current[key]) {
        setSubMenuHeight((prev) => ({
          ...prev,
          [key]: subMenuRefs.current[key]?.scrollHeight || 0,
        }));
      }
    }
  }, [openSubmenu]);

  const renderMenuItems = (items, type) => (
    <ul className="flex flex-col gap-2">
      {items.map((item, index) => (
        <li key={item.name}>
          {item.subItems ? (
            <button
              onClick={() => handleSubmenuToggle(index, type)}
              className={`menu-item flex items-center gap-3 w-full group ${
                openSubmenu?.type === type && openSubmenu?.index === index
                  ? "menu-item-active"
                  : "menu-item-inactive"
              }`}
            >
              <span>{item.icon}</span>
              {(isExpanded || isHovered || isMobileOpen) && (
                <span>{item.name}</span>
              )}
            </button>
          ) : (
            item.path && (
              <Link
                href={item.path}
                className={`menu-item flex items-center gap-3 group ${
                  isActive(item.path)
                    ? "menu-item-active"
                    : "menu-item-inactive"
                }`}
              >
                <span>{item.icon}</span>
                {(isExpanded || isHovered || isMobileOpen) && (
                  <span>{item.name}</span>
                )}
              </Link>
            )
          )}
          {item.subItems && (
            <div
              ref={(el) => (subMenuRefs.current[`${type}-${index}`] = el)}
              className="overflow-hidden transition-all duration-300"
              style={{
                height:
                  openSubmenu?.type === type && openSubmenu?.index === index
                    ? `${subMenuHeight[`${type}-${index}`]}px`
                    : "0px",
              }}
            >
              <ul className="ml-4 mt-2 space-y-1">
                {item.subItems.map((sub) => (
                  <li key={sub.name}>
                    <Link
                      href={sub.path}
                      className={`menu-dropdown-item flex items-center gap-2 ${
                        isActive(sub.path)
                          ? "menu-dropdown-item-active"
                          : "menu-dropdown-item-inactive"
                      }`}
                    >
                      <span>{sub.icon}</span>
                      {(isExpanded || isHovered || isMobileOpen) && (
                        <span>{sub.name}</span>
                      )}
                      {sub.new && <span className="badge ml-2">new</span>}
                      {sub.pro && <span className="badge ml-2">pro</span>}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </li>
      ))}
    </ul>
  );

  return (
    <aside
      className={`fixed top-0 left-0 z-50 h-screen bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 transition-all duration-300 ease-in-out
        ${
          isExpanded || isMobileOpen
            ? "w-[200px]"
            : isHovered
            ? "w-[200px]"
            : "w-[70px]"
        }
        ${
          isMobileOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 px-4 pt-4`}
      onMouseEnter={() => !isExpanded && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="text-center text-lg font-semibold mb-6">
        <Link href="/admin/admin" className="text-gray-900 dark:text-white">
          {isExpanded || isHovered || isMobileOpen ? "Admin Panel" : "AP"}
        </Link>
      </div>

      <nav className="flex flex-col gap-6 overflow-y-auto no-scrollbar pb-10">
        <div>
          <h2 className="text-xs text-gray-400 uppercase mb-2">
            {isExpanded || isHovered || isMobileOpen ? "Menu" : ""}
          </h2>
          {renderMenuItems(navItems, "main")}
        </div>
      </nav>
    </aside>
  );
};

export default AppSidebar;

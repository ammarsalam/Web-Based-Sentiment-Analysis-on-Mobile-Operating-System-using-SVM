import { useState } from 'react';
import { LayoutDashboard, ClipboardList, Smartphone, MonitorSmartphone, Server, Settings2, LogOut, Menu, ChevronDown, ChevronRight, MessageSquare, MessagesSquare, TrendingUp } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { Link } from "react-router-dom";

const SIDEBAR_ITEMS = [
  { name: "Overview", icon: LayoutDashboard, color: "#6366f1", href: "/overview" },
  { name: "Dashboard", icon: ClipboardList, color: "#8B5CF6", href: "/dashboard" },
  { name: "Android", icon: Smartphone, color: "#EC4899", href: "/android" },
  { name: "iOS", icon: MonitorSmartphone, color: "#10B981", href: "/ios" },
  { name: "HarmonyOS", icon: Server, color: "#F59E0B", href: "/harmonyos" },
  {
    name: "Analyzer",
    icon: Settings2,
    color: "#6EE7B7",
    children: [
      { name: "Single Sentiment", href: "/single" },
      { name: "Multiple Sentiment", href: "/multiple" },
      { name: "Real Time", href: "/realtime" },
    ],
  },
  { name: "Exit", icon: LogOut, color: "#EC4810", href: "/" },
];

const Sidebar = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [dropdownOpen, setDropdownOpen] = useState({});

  const toggleDropdown = (name) => {
    setDropdownOpen((prev) => ({
      ...prev,
      [name]: !prev[name],
    }));
  };

  return (
    <motion.div
      className={`relative z-10 transition-all duration-300 ease-in-out flex-shrink-0 ${
        isSidebarOpen ? "w-64" : "w-20"
      }`}
      animate={{ width: isSidebarOpen ? 256 : 80 }}
    >
      <div className="h-full bg-gray-800 bg-opacity-50 backdrop-blur-md p-4 flex flex-col border-r border-gray-700">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="p-2 rounded-full hover:bg-gray-700 transition-colors max-w-fit"
        >
          <Menu size={24} />
        </motion.button>

        <nav className="mt-8 flex-grow">
          {SIDEBAR_ITEMS.map((item) => {
            const Icon = item.icon;

            // If item has dropdown
            if (item.children) {
              const isOpen = dropdownOpen[item.name];

              return (
                <div key={item.name}>
                  <motion.div
                    className={`flex items-center justify-between p-4 text-sm font-medium rounded-lg cursor-pointer transition-colors mb-2 ${
                      isOpen ? "bg-gray-700 text-white" : "hover:bg-gray-700 text-white/80"
                    }`}
                    onClick={() => toggleDropdown(item.name)}
                  >
                    <div className="flex items-center gap-3">
                      <Icon size={20} style={{ color: item.color, minWidth: "20px" }} />
                      <AnimatePresence>
                        {isSidebarOpen && (
                          <motion.span
                            className="whitespace-nowrap"
                            initial={{ opacity: 0, width: 0 }}
                            animate={{ opacity: 1, width: "auto" }}
                            exit={{ opacity: 0, width: 0 }}
                            transition={{ duration: 0.2, delay: 0.3 }}
                          >
                            {item.name}
                          </motion.span>
                        )}
                      </AnimatePresence>
                    </div>
                    {isSidebarOpen &&
                      (isOpen ? (
                        <ChevronDown size={16} className="text-gray-300" />
                      ) : (
                        <ChevronRight size={16} className="text-gray-300" />
                      ))}
                  </motion.div>

                  {/* Children dropdown items */}
                  <AnimatePresence>
                    {isSidebarOpen && isOpen && (
                      <motion.div
                        className="ml-6 mb-2 flex flex-col gap-2"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{
                          duration: 0.25,
                          delay: isSidebarOpen ? 0.3 : 0,
                        }}
                      >
                        {item.children.map((child) => (
                          <Link to={child.href} key={child.href}>
                            <div className="flex items-center gap-3 h-12 px-2 text-sm text-white/80 hover:text-white hover:bg-gray-700 rounded-md transition">
                              {child.name === "Single sentence" ? (
                                <MessageSquare size={16} className="text-blue-400" />
                              ) : (
                                <MessagesSquare size={16} className="text-blue-400" />
                              )}
                              {child.name}
                            </div>
                          </Link>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            }

            // Regular sidebar item
            return (
              <Link key={item.href} to={item.href}>
                <motion.div className="flex items-center p-4 text-sm font-medium rounded-lg hover:bg-gray-700 text-white/80 hover:text-white transition-colors mb-2">
                  <Icon size={20} style={{ color: item.color, minWidth: "20px" }} />
                  <AnimatePresence>
                    {isSidebarOpen && (
                      <motion.span
                        className="ml-4 whitespace-nowrap"
                        initial={{ opacity: 0, width: 0 }}
                        animate={{ opacity: 1, width: "auto" }}
                        exit={{ opacity: 0, width: 0 }}
                        transition={{ duration: 0.2, delay: 0.3 }}
                      >
                        {item.name}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </motion.div>
              </Link>
            );
          })}
        </nav>
      </div>
    </motion.div>
  );
};

export default Sidebar;

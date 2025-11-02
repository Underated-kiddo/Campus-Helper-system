import { Link, useNavigate } from "react-router-dom";
import ThemeToggle from "./ThemeToggle";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { UserCircleIcon } from "@heroicons/react/24/solid";
// import { motion } from "framer-motion";

export default function Navbar() {
    const navigate = useNavigate();

    const logout = () => {
        localStorage.removeItem("token");
        navigate("/login");
    };

    return (
        <motion.nav
            initial={{ y: -40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ type: "spring", stiffness: 80, damping: 12 }}
            className="backdrop-blur-md bg-white/30 dark:bg-zinc-900/30 
                    border-b border-zinc-200 dark:border-zinc-800 
                    sticky top-0 z-50 shadow-sm px-4 py-3 flex justify-between items-center"
        >
            {/* Logo / Title */}
            <Link
                to="/dashboard"
                className="font-bold text-xl text-zinc-800 dark:text-zinc-100 hover:text-blue-600 transition-colors"
            >
                Helper Campus
            </Link>

            {/* Right Side Actions */}
            <div className="flex items-center gap-3">
                <ThemeToggle />

                {/* Profile Dropdown */}
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="hover:scale-110 transition-transform"
                        >
                            <UserCircleIcon className="h-7 w-7 text-zinc-700 dark:text-zinc-200" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                        align="end"
                        className="w-44 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md shadow-lg border border-zinc-200 dark:border-zinc-700"
                    >
                        <DropdownMenuItem
                            onClick={() => navigate("/settings")}
                            className="cursor-pointer hover:bg-blue-100 dark:hover:bg-zinc-800 transition"
                        >
                            Account
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            onClick={logout}
                            className="cursor-pointer text-red-500 hover:bg-red-100 dark:hover:bg-red-900/30 transition"
                        >
                            Logout
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </motion.nav>
    );
}

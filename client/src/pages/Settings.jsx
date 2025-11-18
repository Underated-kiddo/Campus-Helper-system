import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
    CardFooter,
} from "@/components/ui/card";
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/toast";
import { Camera, Trash2, Moon, Sun } from "lucide-react";
import API from "@/services/api";

export default function Settings() {
    const [settings, setSettings] = useState({
        name: "",
        email: "",
        accountType: "student",
        bio: "",
        contact: "",
        notifications: true,
        privateMode: false,
    });

    const [profilePic, setProfilePic] = useState(null);
    const [previewUrl, setPreviewUrl] = useState("");
    const [loading, setLoading] = useState(false);
    const [isDark, setIsDark] = useState(false);

    // Sync theme
    useEffect(() => {
        const updateTheme = () => {
            const theme = localStorage.getItem("theme") || "light";
            document.documentElement.classList.toggle("dark", theme === "dark");
            setIsDark(theme === "dark");
        };
        updateTheme();
        window.addEventListener("storage", updateTheme);
        return () => window.removeEventListener("storage", updateTheme);
    }, []);

    // Load settings from backend and persist local bio/profilePic
    useEffect(() => {
        async function loadSettings() {
            try {
                const res = await API.get("/settings");
                const data = res.data.user || res.data;

                // Load locally stored bio and profilePic first
                const storedPic = localStorage.getItem("profilePic");
                const storedBio = localStorage.getItem("userBio");

                setSettings({
                    name: data.name || "",
                    email: data.email || "",
                    accountType: data.role || "student",
                    bio: storedBio || data.bio || "",
                    contact: data.contact || "",
                    notifications: data.notifications ?? true,
                    privateMode: data.privateMode ?? false,
                });

                setPreviewUrl(
                    storedPic || data.profilePic || "https://via.placeholder.com/120?text=Profile"
                );
            } catch {
                toast({
                    title: "Error",
                    description: "Failed to load settings 😬",
                    variant: "destructive",
                });
            }
        }
        loadSettings();
    }, []);

    useEffect(() => {
        if (settings.bio !== undefined) {
            localStorage.setItem("userBio", settings.bio);
        }
    }, [settings.bio]);

    useEffect(() => {
        if (previewUrl) localStorage.setItem("profilePic", previewUrl);
    }, [previewUrl]);

    const toggleTheme = () => {
        const newTheme = isDark ? "light" : "dark";
        localStorage.setItem("theme", newTheme);
        document.documentElement.classList.toggle("dark", newTheme === "dark");
        setIsDark(!isDark);
        window.dispatchEvent(new Event("storage"));
    };

    const handleProfilePicChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setProfilePic(file);
            const url = URL.createObjectURL(file);
            setPreviewUrl(url); 
            localStorage.setItem("profilePic", url); 
        }
    };

    async function handleProfilePicUpload() {
        if (!profilePic)
            return toast({
                title: "Error",
                description: "No image selected.",
                variant: "destructive",
            });

        const formData = new FormData();
        formData.append("profilePic", profilePic);
        setLoading(true);
        try {
            await API.post("/settings/profile/upload", formData);
            toast({
                title: "Success",
                description: "Profile picture updated!",
            });
        } catch {
            toast({
                title: "Error",
                description: "Failed to upload image.",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    }

    async function handleProfilePicRemove() {
        if (!confirm("Remove your profile picture?")) return;
        try {
            await API.delete("/settings/profile/remove");
            const placeholder = "https://via.placeholder.com/120?text=Profile";
            setPreviewUrl(placeholder);
            setProfilePic(null);
            localStorage.removeItem("profilePic");
            toast({
                title: "Removed",
                description: "Profile picture removed.",
            });
        } catch {
            toast({
                title: "Error",
                description: "Failed to remove picture.",
                variant: "destructive",
            });
        }
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setLoading(true);
        try {
            await API.put("/settings", settings);
            toast({
                title: "Saved",
                description: "Settings updated successfully!",
            });
        } catch {
            toast({
                title: "Error",
                description: "Failed to save settings.",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    }

    async function handlePasswordChange(e) {
        e.preventDefault();
        const oldPassword = e.target.oldPassword.value;
        const newPassword = e.target.newPassword.value;
        setLoading(true);
        try {
            await API.post("/settings/password/change", {
                old_password: oldPassword,
                new_password: newPassword,
            });
            toast({
                title: "Success",
                description: "Password changed successfully!",
            });
            e.target.reset();
        } catch {
            toast({
                title: "Error",
                description: "Failed to change password.",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    }

    async function handleDeleteAccount() {
        if (!confirm("Are you sure? This action is irreversible.")) return;
        try {
            await API.delete("/settings/account/delete");
            toast({ title: "Account deleted." });
            window.location.href = "/login";
        } catch {
            toast({
                title: "Error",
                description: "Failed to delete account.",
                variant: "destructive",
            });
        }
    }

    return (
        <div
            className={`min-h-screen transition-all duration-500 ${isDark ? "bg-[#1a1a1a] text-white" : "bg-[#f4f2ee] text-gray-900"
                } flex justify-center items-start p-8`}
        >
            <div className="w-full max-w-3xl space-y-8">
                {/* Theme Toggle */}
                <div className="flex justify-end mb-4">
                    <Button
                        onClick={toggleTheme}
                        className={`flex items-center gap-2 px-4 py-2 rounded-md ${isDark
                            ? "bg-[#d2b48c] text-black hover:bg-[#c3a678]"
                            : "bg-[#2b4b6f] text-white hover:bg-[#223b58]"
                            }`}
                    >
                        {isDark ? (
                            <>
                                <Sun size={16} /> Light Mode
                            </>
                        ) : (
                            <>
                                <Moon size={16} /> Dark Mode
                            </>
                        )}
                    </Button>
                </div>

                {/* Profile */}
                <div className="flex flex-col sm:flex-row items-center gap-6 mb-8 relative">
                    <div className="relative group">
                        <img
                            src={previewUrl || "https://via.placeholder.com/120?text=Profile"}
                            alt="Profile"
                            className="w-28 h-28 rounded-full object-cover border-4 border-[#2b4b6f] dark:border-[#d2b48c]"
                        />
                        <label
                            htmlFor="profileUpload"
                            className="absolute bottom-0 right-0 bg-[#2b4b6f] dark:bg-[#d2b48c] text-white dark:text-black text-xs py-1 px-2 rounded cursor-pointer"
                        >
                            <Camera size={14} className="inline-block mr-1" /> Upload
                            <input
                                type="file"
                                id="profileUpload"
                                accept="image/*"
                                className="hidden"
                                onChange={handleProfilePicChange}
                            />
                        </label>
                    </div>

                    <div>
                        <button
                            onClick={handleProfilePicRemove}
                            className="absolute top-0 right-0 bg-red-600 text-white text-xs p-1 rounded-full hover:bg-red-700"
                        >
                            <Trash2 size={12} />
                        </button>
                    </div>

                    <div>
                        <h2 className="text-xl font-semibold">{settings.name || "Your Name"}</h2>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            {settings.email || "youremail@example.com"}
                        </p>
                        <Button
                            onClick={handleProfilePicUpload}
                            disabled={loading}
                            className="mt-2 text-xs bg-[#2b4b6f] text-white hover:bg-[#223b58]"
                        >
                            {loading ? "Uploading..." : "Save Picture"}
                        </Button>
                    </div>
                </div>

                {/* Account Settings */}
                <Card
                    className={`border ${isDark
                        ? "bg-[#2c2b29] border-[#3f3b38]"
                        : "bg-white border-[#d4c4b0]"
                        }`}
                >
                    <CardHeader>
                        <CardTitle className="text-[#2b4b6f] dark:text-[#d2b48c]">
                            Account Settings
                        </CardTitle>
                        <CardDescription>
                            Manage your personal information and preferences
                        </CardDescription>
                    </CardHeader>

                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid sm:grid-cols-2 gap-4">
                                <div>
                                    <Label>Name</Label>
                                    <Input
                                        value={settings.name}
                                        onChange={(e) =>
                                            setSettings({ ...settings, name: e.target.value })
                                        }
                                        placeholder="Your full name"
                                    />
                                </div>
                                <div>
                                    <Label>Email</Label>
                                    <Input
                                        type="email"
                                        value={settings.email}
                                        onChange={(e) =>
                                            setSettings({ ...settings, email: e.target.value })
                                        }
                                        placeholder="example@email.com"
                                    />
                                </div>
                            </div>

                            <div>
                                <Label>Bio</Label>
                                <Textarea
                                    value={settings.bio}
                                    onChange={(e) =>
                                        setSettings({ ...settings, bio: e.target.value })
                                    }
                                    placeholder="Tell others about yourself..."
                                />
                            </div>

                            <div>
                                <Label>Contact Info</Label>
                                <Input
                                    value={settings.contact}
                                    onChange={(e) =>
                                        setSettings({ ...settings, contact: e.target.value })
                                    }
                                    placeholder="e.g. +254700000000"
                                />
                            </div>

                            <div className="grid sm:grid-cols-2 gap-4">
                                <div>
                                    <Label>Account Type</Label>
                                    <Select
                                        value={settings.accountType}
                                        onValueChange={(val) =>
                                            setSettings({ ...settings, accountType: val })
                                        }
                                    >
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="student">Student</SelectItem>
                                            <SelectItem value="school">School</SelectItem>
                                            <SelectItem value="admin">Admin</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div>
                                    <Label>Notifications</Label>
                                    <div className="flex items-center gap-2 mt-2">
                                        <Switch
                                            checked={settings.notifications}
                                            onCheckedChange={(val) =>
                                                setSettings({
                                                    ...settings,
                                                    notifications: val,
                                                })
                                            }
                                        />
                                        <span>
                                            {settings.notifications ? "Enabled" : "Disabled"}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                <Switch
                                    checked={settings.privateMode}
                                    onCheckedChange={(val) =>
                                        setSettings({ ...settings, privateMode: val })
                                    }
                                />
                                <Label>Private Mode</Label>
                            </div>

                            <Button
                                type="submit"
                                className={`w-full ${isDark
                                    ? "bg-[#d2b48c] text-black hover:bg-[#c3a678]"
                                    : "bg-[#2b4b6f] text-white hover:bg-[#223b58]"
                                    }`}
                                disabled={loading}
                            >
                                {loading ? "Saving..." : "Save Changes"}
                            </Button>
                        </form>
                    </CardContent>
                </Card>

                <Card
                    className={`border-t-4 ${isDark
                        ? "bg-[#2c2b29] border-[#3f3b38] border-t-[#d2b48c]"
                        : "bg-white border-[#d4c4b0] border-t-[#2b4b6f]"
                        }`}
                >
                    <CardHeader>
                        <CardTitle className="text-[#2b4b6f] dark:text-[#d2b48c]">
                            Security
                        </CardTitle>
                        <CardDescription>
                            Change password or delete your account
                        </CardDescription>
                    </CardHeader>

                    <CardContent className="space-y-4">
                        <form onSubmit={handlePasswordChange} className="space-y-3">
                            <div>
                                <Label>Old Password</Label>
                                <Input type="password" name="oldPassword" required />
                            </div>

                            <div>
                                <Label>New Password</Label>
                                <Input type="password" name="newPassword" required />
                            </div>

                            <Button
                                type="submit"
                                className={`w-full ${isDark
                                    ? "bg-[#d2b48c] text-black hover:bg-[#c3a678]"
                                    : "bg-[#2b4b6f] text-white hover:bg-[#223b58]"
                                    }`}
                                disabled={loading}
                            >
                                {loading ? "Changing..." : "Change Password"}
                            </Button>
                        </form>

                        <div className="pt-4 border-t border-muted">
                            <Label className="text-red-500 font-semibold">Danger Zone</Label>
                            <p className="text-sm text-muted-foreground mb-2">
                                Once you delete your account, there’s no going back.
                            </p>
                            <Button
                                variant="destructive"
                                onClick={handleDeleteAccount}
                                className="w-full bg-red-600 hover:bg-red-700"
                            >
                                Delete My Account
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

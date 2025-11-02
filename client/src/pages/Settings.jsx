import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
} from "@/components/ui/card";
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Camera, Trash2 } from "lucide-react";
import API from "@/api"; // ✅ using your axios instance

export default function Settings() {
    const [settings, setSettings] = useState({
        appearance: "light",
        accountType: "student",
        email: "",
        password: "",
        notificationsToggle: "on",
    });

    const [loading, setLoading] = useState(false);
    const [profilePic, setProfilePic] = useState(null);
    const [previewUrl, setPreviewUrl] = useState("");

    // Load settings + profile
    useEffect(() => {
        async function loadSettings() {
            try {
                const res = await API.get("/user/settings/");
                const data = res.data;
                setSettings({
                    appearance: data.appearance || "light",
                    accountType: data.accountType || "student",
                    email: data.email || "",
                    password: "",
                    notificationsToggle: data.notificationsToggle || "on",
                });
                setPreviewUrl(
                    data.profilePic || "https://via.placeholder.com/120?text=Profile"
                );
            } catch {
                toast.error("Failed to load settings 😬");
            }
        }
        loadSettings();
    }, []);

    // Handle profile pic upload
    const handleProfilePicChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setProfilePic(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    async function handleProfilePicUpload() {
        if (!profilePic) return toast.error("No image selected.");
        const formData = new FormData();
        formData.append("profilePic", profilePic);
        setLoading(true);
        try {
            await API.post("/user/upload_profile/", formData);
            toast.success("Profile picture updated!");
        } catch {
            toast.error("Failed to upload image.");
        } finally {
            setLoading(false);
        }
    }

    async function handleProfilePicRemove() {
        if (confirm("Remove your profile picture?")) {
            try {
                await API.delete("/user/remove_profile_pic/");
                setPreviewUrl("https://via.placeholder.com/120?text=Profile");
                toast.success("Profile picture removed.");
            } catch {
                toast.error("Failed to remove picture.");
            }
        }
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setLoading(true);
        try {
            await API.post("/user/settings/", settings);
            toast.success("Settings updated!");
        } catch {
            toast.error("Failed to update settings.");
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
            await API.post("/user/change_password/", {
                old_password: oldPassword,
                new_password: newPassword,
            });
            toast.success("Password changed successfully!");
            e.target.reset();
        } catch {
            toast.error("Failed to change password.");
        } finally {
            setLoading(false);
        }
    }

    async function handleDeleteAccount() {
        if (confirm("Are you sure you want to request account deletion? This cannot be undone.")) {
            try {
                await API.post("/user/delete_account/");
                toast("Account deletion requested.");
                window.location.href = "/login";
            } catch {
                toast.error("Failed to request account deletion.");
            }
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex justify-center items-start p-8">
            <div className="w-full max-w-3xl space-y-8">
                {/* Profile Section */}
                <Card className="overflow-hidden shadow-lg border border-gray-200">
                    <CardContent className="flex flex-col items-center py-6 space-y-4">
                        <div className="relative group">
                            <img
                                src={previewUrl}
                                alt="Profile"
                                className="w-28 h-28 rounded-full object-cover border-4 border-primary/50 shadow-md transition hover:scale-105"
                            />
                            <label
                                htmlFor="profileUpload"
                                className="absolute inset-0 flex justify-center items-center bg-black/40 opacity-0 group-hover:opacity-100 transition rounded-full cursor-pointer"
                            >
                                <Camera className="text-white w-6 h-6" />
                                <input
                                    type="file"
                                    id="profileUpload"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={handleProfilePicChange}
                                />
                            </label>
                        </div>
                        <div className="flex gap-3">
                            <Button size="sm" onClick={handleProfilePicUpload} disabled={loading}>
                                Upload
                            </Button>
                            <Button
                                size="sm"
                                variant="destructive"
                                onClick={handleProfilePicRemove}
                                disabled={loading}
                            >
                                <Trash2 className="w-4 h-4 mr-1" /> Remove
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Account Settings */}
                <Card>
                    <CardHeader>
                        <CardTitle>Account Settings</CardTitle>
                        <CardDescription>
                            Manage your preferences and account information
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <Label>Appearance</Label>
                                    <Select
                                        value={settings.appearance}
                                        onValueChange={(val) =>
                                            setSettings({ ...settings, appearance: val })
                                        }
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select theme" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="light">Light</SelectItem>
                                            <SelectItem value="dark">Dark</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div>
                                    <Label>Account Type</Label>
                                    <Select
                                        value={settings.accountType}
                                        onValueChange={(val) =>
                                            setSettings({ ...settings, accountType: val })
                                        }
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select type" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="student">Student</SelectItem>
                                            <SelectItem value="school">School</SelectItem>
                                            <SelectItem value="admin">Admin</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div>
                                <Label>Email</Label>
                                <Input
                                    type="email"
                                    placeholder="your@email.com"
                                    value={settings.email}
                                    onChange={(e) =>
                                        setSettings({ ...settings, email: e.target.value })
                                    }
                                />
                            </div>

                            <div>
                                <Label>New Password</Label>
                                <Input
                                    type="password"
                                    placeholder="Enter new password"
                                    value={settings.password}
                                    onChange={(e) =>
                                        setSettings({ ...settings, password: e.target.value })
                                    }
                                />
                            </div>

                            <div>
                                <Label>Notifications</Label>
                                <Select
                                    value={settings.notificationsToggle}
                                    onValueChange={(val) =>
                                        setSettings({
                                            ...settings,
                                            notificationsToggle: val,
                                        })
                                    }
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="on">On</SelectItem>
                                        <SelectItem value="off">Off</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <Button type="submit" disabled={loading} className="w-full">
                                {loading ? "Saving..." : "Save Settings"}
                            </Button>
                        </form>
                    </CardContent>
                </Card>

                {/* Security Section */}
                <Card className="border-t-4 border-primary/60">
                    <CardHeader>
                        <CardTitle>Security</CardTitle>
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
                            <Button type="submit" disabled={loading} className="w-full">
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
                                className="w-full"
                            >
                                Request Account Deletion
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

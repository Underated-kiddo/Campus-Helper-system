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

export default function Settings() {
    const [settings, setSettings] = useState({
        appearance: "light",
        accountType: "student",
        email: "",
        password: "",
        notificationsToggle: "on",
    });

    const [loading, setLoading] = useState(false);

    useEffect(() => {
        async function loadSettings() {
            try {
                const res = await fetch("/api/user/settings/");
                const data = await res.json();
                setSettings({
                    appearance: data.appearance || "light",
                    accountType: data.accountType || "student",
                    email: data.email || "",
                    password: "",
                    notificationsToggle: data.notificationsToggle || "on",
                });
            } catch {
                toast.error("Failed to load settings 😬");
            }
        }
        loadSettings();
    }, []);

    async function handleSubmit(e) {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await fetch("/api/user/settings/", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(settings),
            });
            if (res.ok) toast.success("Settings updated!");
            else toast.error("Failed to update settings.");
        } catch {
            toast.error("Network error. Try again later.");
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
            const res = await fetch("/api/user/change_password/", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ old_password: oldPassword, new_password: newPassword }),
            });
            if (res.ok) {
                toast.success("Password changed successfully!");
                e.target.reset();
            } else toast.error("Failed to change password.");
        } catch {
            toast.error("Network error.");
        } finally {
            setLoading(false);
        }
    }

    async function handleDeleteAccount() {
        if (confirm("Are you sure you want to request account deletion? This cannot be undone.")) {
            try {
                const res = await fetch("/api/user/delete_account/", { method: "POST" });
                if (res.ok) {
                    toast("Account deletion requested.");
                    window.location.href = "login.html";
                } else toast.error("Failed to request account deletion.");
            } catch {
                toast.error("Network error.");
            }
        }
    }

    return (
        <div className="min-h-screen bg-background flex justify-center items-start p-6">
            <div className="w-full max-w-2xl space-y-6">
                {/* Account Settings */}
                <Card>
                    <CardHeader>
                        <CardTitle>Account Settings</CardTitle>
                        <CardDescription>Manage your personal preferences and account info</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <Label>Appearance</Label>
                                <Select
                                    value={settings.appearance}
                                    onValueChange={(val) => setSettings({ ...settings, appearance: val })}
                                >
                                    <SelectTrigger><SelectValue placeholder="Select theme" /></SelectTrigger>
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
                                    onValueChange={(val) => setSettings({ ...settings, accountType: val })}
                                >
                                    <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="student">Student</SelectItem>
                                        <SelectItem value="school">School</SelectItem>
                                        <SelectItem value="admin">Admin</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div>
                                <Label>Email</Label>
                                <Input
                                    type="email"
                                    placeholder="your@email.com"
                                    value={settings.email}
                                    onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                                />
                            </div>

                            <div>
                                <Label>New Password</Label>
                                <Input
                                    type="password"
                                    placeholder="Enter new password"
                                    value={settings.password}
                                    onChange={(e) => setSettings({ ...settings, password: e.target.value })}
                                />
                            </div>

                            <div>
                                <Label>Notifications</Label>
                                <Select
                                    value={settings.notificationsToggle}
                                    onValueChange={(val) => setSettings({ ...settings, notificationsToggle: val })}
                                >
                                    <SelectTrigger><SelectValue /></SelectTrigger>
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

                {/* Password & Danger Zone */}
                <Card>
                    <CardHeader>
                        <CardTitle>Security</CardTitle>
                        <CardDescription>Change password or delete your account</CardDescription>
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
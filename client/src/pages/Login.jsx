import { useState } from "react";
import { UseNavigate } from "react-router-dom";
import {Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card , CardContent, CardHeader, CardFooter , CardTittle} from "@/components/ui/card";
import API from "../services/api";

export default function Login(){
    const [email, setEmail] = useState("");
    const [password,setPassword ] = useState("");
    const navigate = UseNavigate();
    const[loading , setLoading] = useState(false);

    const handleLogin = async () =>{
        if(!email || !password) return alert("all fields are required");
        setLoading(true);
        try {
            const res = await API.post("/auth/login",{email,password });
            localStorage.setItem("token", res.data.token);
            navigate("/dashboard");
        } catch (error) {
            alert(error.response?.data?.message || "Login failed ");
        } finally{
            setLoading(false);
        }
    };

    return(
        <div className="flex min-h-screen items-center justify-center bg-gray-100 dark:bg-zinc-400">
            <Card className="w-full max-w-md shadow-xl animate-fade">
                <CardHeader>
                    <CardTittle className="text-center text-2-xl font-bold">Log-in</CardTittle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <Input
                    type="email"
                    placeholder="enter your email"
                    value= {email}
                    onChange ={e => setEmail(e.target.value)}
                    />
                    <Input
                    type="Password"
                    placeholder="enter your password"
                    value= {password}
                    onChange ={e => setPassword(e.target.value)}
                    />
                </CardContent>
                <CardFooter className="flex justify-between">
                    <Button onClick={handleLogin} disabled={loading} className="w-full">
                        {loading ? "Logging in ......." : "Log in"}
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
}
import {
    Dialog, DialogTrigger,DialogContent,DialogHeader,DialogTitle,
    DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea} from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function PostDialog ({ onSubmit}){
    const [title , setTitle ] = useState("");
    const [description , setDescription] = useState("")

    const handleCreate =() => {
        onSubmit({ title,description});
        setTitle("");
        setDescription("");
    };

    return(
        <Dialog>
            <DialogTrigger asChild>
                <Button>Add Post</Button>
            </DialogTrigger>

            <DialogContent>
                <DialogHeader>
                    <DialogTitle>New Post</DialogTitle>
                </DialogHeader>

                <Input placeholder ="title" value={title} onChang={ e => setTitle(e.target.value) } />
                <Textarea 
                placeholder="Description"
                className="mt-2"
                value={description}
                onChange={e => setDescription(e.target.value)}
                />
                
                <DialogFooter className="mt-4">
                    <DialogClose asChild>
                        <Button variant="outline">Cancel</Button>
                    </DialogClose>
                    <Button onClick ={handleCreate} >Create</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
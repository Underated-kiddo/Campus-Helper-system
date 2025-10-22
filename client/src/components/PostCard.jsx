import { Card, CardContent, CardHeader, CardFooter, CardTitle } from "@/components/ui/card";
import { CheckCircleIcon, TrashIcon } from "@heroicons/react/24/solid";
import { Button } from "@/components/ui/button";

export default function PostCard({ post, onToggle, onDelete }) {
    return (
        <Card
            className={`relative animate-fade ${post.completed ? "opacity-70" : ""
                }`}
        >
            <CardHeader>
                <CardTitle
                    className={`text-lg font-semibold ${post.completed ? "line-through text-zinc-400" : ""
                        }`}
                >
                    {post.title}
                </CardTitle>
            </CardHeader>

            <CardContent>
                <p className="text-sm dark:text-zinc-300">{post.description}</p>
            </CardContent>

            <CardFooter className="flex justify-end gap-2">
                <Button
                    size="icon"
                    variant={post.completed ? "outline" : "secondary"}
                    onClick={() => onToggle(post._id)}
                >
                    <CheckCircleIcon className="h-6 w-6" />
                </Button>

                <Button
                    size="icon"
                    variant="destructive"
                    onClick={() => onDelete(post._id)}
                >
                    <TrashIcon className="h-5 w-5" />
                </Button>
            </CardFooter>
        </Card>
    );
}

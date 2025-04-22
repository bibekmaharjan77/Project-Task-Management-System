
import { Button } from "@/components/ui/button";
import { RocketIcon } from "lucide-react";
import { Link } from "react-router-dom";

export default function NotFound() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-background to-muted p-6">
            <div className="max-w-md w-full space-y-8 text-center">
                <div className="space-y-4">
                    <div className="relative">
                        <h1 className="text-9xl font-bold text-primary opacity-20">404</h1>
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="space-y-2">
                                <RocketIcon className="w-16 h-16 mx-auto text-primary" />
                                <h2 className="text-3xl font-bold tracking-tight">Page Not Found</h2>
                                <p className="text-muted-foreground">
                                    Oops! The page you're looking for doesn't exist or has been moved.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
                        <Button asChild variant="default" className="shadow-sm">
                            <Link to="/">
                                Return Home
                                <span className="sr-only">Return to homepage</span>
                            </Link>
                        </Button>
                    </div>
                </div>

                <div className="pt-12 text-sm text-muted-foreground">
                    <p>While you're here, enjoy this space illustration</p>
                    <div className="mt-4 flex justify-center">
                        <div className="w-32 h-32 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-full animate-pulse"></div>
                    </div>
                </div>
            </div>
        </div>
    );
}
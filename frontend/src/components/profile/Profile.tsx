import { UserProfileType } from "../../types/user";
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "../ui/button";
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog";
import { useState } from "react";
import ChangePassword from "../Auth/ChangePassword";


const Profile = () => {
    const userData = window.localStorage.getItem("user_info");
    const user_info: UserProfileType | undefined = userData ? JSON.parse(userData) : undefined;
    const [open, setOpen] = useState(false)
    return (
        <div className="flex justify-center items-center min-h-[calc(100vh-4rem)] p-4">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle>Profile Page</CardTitle>
                    <CardDescription>
                        Here is some of your information.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <div className="grid grid-cols-3 gap-4">
                            <div className="text-sm font-medium text-muted-foreground">
                                Full name
                            </div>
                            <div className="col-span-2 text-sm">
                                {user_info?.firstname + " " + user_info?.lastname}
                            </div>
                        </div>

                        <div className="grid grid-cols-3 gap-4">
                            <div className="text-sm font-medium text-muted-foreground">
                                Email address
                            </div>
                            <div className="col-span-2 text-sm">
                                {user_info?.email}
                            </div>
                        </div>

                        <div className="grid grid-cols-3 gap-4">
                            <div className="text-sm font-medium text-muted-foreground">
                                Phone number
                            </div>
                            <div className="col-span-2 text-sm">
                                {user_info?.phone_number || "Not provided"}
                            </div>
                        </div>

                        <div className="grid grid-cols-3 gap-4">
                            <div className="text-sm font-medium text-muted-foreground">
                                Address
                            </div>
                            <div className="col-span-2 text-sm">
                                123 Main St<br />
                                Anytown, USA 12345
                            </div>
                        </div>

                        <div className="flex justify-end">
                            <Button onClick={() => setOpen(true)}>Change Password</Button>
                        </div>
                    </div>
                </CardContent>
            </Card>
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="sm:max-w-md lg:max-w-3xl">
                    <div className="flex justify-center items-center py-6"><ChangePassword email={user_info?.email}/></div>
                    <DialogFooter className="sm:justify-start">
                        <DialogClose asChild>
                            <Button type="button" variant="secondary">
                                Close
                            </Button>
                        </DialogClose>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default Profile;
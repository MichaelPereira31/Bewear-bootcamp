"use client";

import { LogIn, LogOut, MenuIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { authClient } from "@/lib/auth-client";

import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";

const Header = () => {
  const { data: session } = authClient.useSession();
  return (
    <header className="flex items-center justify-between p-5">
      <Link href={"/"}>
        <Image
          src="/imagens/Logo.png"
          alt="Bewear"
          width={100}
          height={26.14}
        />
      </Link>
      <div className="flex items-center">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline">
              <MenuIcon />
            </Button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle></SheetTitle>
              <div className="flex justify-between space-y-3 p-5">
                {session && session.user ? (
                  <>
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage
                          src={session?.user.image as string | undefined}
                        />
                        <AvatarFallback>
                          {session?.user?.name?.split(" ")[0][0]}
                        </AvatarFallback>
                      </Avatar>

                      <div>
                        <h3 className="font-semibold">{session?.user.name}</h3>
                        <span className="text-muted-foreground block text-xs">
                          {session?.user.email}
                        </span>
                      </div>
                    </div>
                    <Button
                      variant={"outline"}
                      title="Sair"
                      size={"icon"}
                      onClick={() => authClient.signOut()}
                    >
                      <LogOut />
                    </Button>
                  </>
                ) : (
                  <div className="flex items-center justify-between  w-full">
                    <h2 className="font-semibold">Olá. Faça seu login.</h2>
                    <Button size={"icon"} asChild variant={"outline"}>
                      <Link href={"/authentication"}>
                        <LogIn />
                      </Link>
                    </Button>
                  </div>
                )}
              </div>
            </SheetHeader>
            <SheetFooter>
              <Button type="submit">Save changes</Button>
              <SheetClose asChild>
                <Button variant="outline">Close</Button>
              </SheetClose>
            </SheetFooter>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
};

export default Header;

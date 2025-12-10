"use client";

import { LogIn, LogOut, MenuIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { authClient } from "@/lib/auth-client";

import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { Cart } from "./cart";

const Header = () => {
  const { data: session } = authClient.useSession();

  return (
    <header className="flex items-center justify-between p-5 bg-accent">
      <div className="flex items-center justify-between gap-4 w-full lg:max-w-[1024px] mx-auto">
        <Link href={"/"}>
          <Image
            src="/imagens/Logo.png"
            alt="NN Esportes"
            width={100}
            height={24.14}
          />
        </Link>
        <div className="flex items-center gap-3">
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
                          <h3 className="font-semibold">
                            {session?.user.name}
                          </h3>
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
                    <div className="flex w-full items-center justify-between">
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
            </SheetContent>
          </Sheet>
          <Cart />
        </div>
      </div>
    </header>
  );
};

export default Header;

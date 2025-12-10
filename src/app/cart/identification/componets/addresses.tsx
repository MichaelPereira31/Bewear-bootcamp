"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, ChevronLeft, MapPin, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { PatternFormat } from "react-number-format";
import { toast } from "sonner";
import z from "zod";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { shippingAddressTable } from "@/db/schema";
import { useCreateShippingAddress } from "@/hooks/mutations/use-create-shipping-address";
import { useUpdateCartShippingAddress } from "@/hooks/mutations/use-update-cart-shipping-address";
import { useUserAddresses } from "@/hooks/queries/use-user-addresses";

import { formatAddress } from "../helpers/address";

const formSchema = z.object({
  email: z.email("E-mail inválido"),
  fullName: z.string().min(1, "Nome completo é obrigatório"),
  cpf: z.string().min(14, "CPF inválido"),
  phone: z.string().min(15, "Celular inválido"),
  zipCode: z.string().min(9, "CEP inválido"),
  address: z.string().min(1, "Endereço é obrigatório"),
  number: z.string().min(1, "Número é obrigatório"),
  complement: z.string().optional(),
  neighborhood: z.string().min(1, "Bairro é obrigatório"),
  city: z.string().min(1, "Cidade é obrigatória"),
  state: z.string().min(1, "Estado é obrigatório"),
});

type FormValues = z.infer<typeof formSchema>;

interface AddressesProps {
  shippingAddresses: (typeof shippingAddressTable.$inferSelect)[];
  defaultShippingAddressId: string | null;
}

const Addresses = ({
  shippingAddresses,
  defaultShippingAddressId,
}: AddressesProps) => {
  const router = useRouter();
  const [selectedAddress, setSelectedAddress] = useState<string | null>(
    defaultShippingAddressId || null,
  );
  const [isAddingNew, setIsAddingNew] = useState(false);
  const createShippingAddressMutation = useCreateShippingAddress();
  const updateCartShippingAddressMutation = useUpdateCartShippingAddress();
  const { data: addresses, isLoading } = useUserAddresses({
    initialData: shippingAddresses,
  });

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      fullName: "",
      cpf: "",
      phone: "",
      zipCode: "",
      address: "",
      number: "",
      complement: "",
      neighborhood: "",
      city: "",
      state: "",
    },
  });

  const onSubmit = async (values: FormValues) => {
    try {
      const newAddress =
        await createShippingAddressMutation.mutateAsync(values);
      toast.success("Endereço criado com sucesso!");
      form.reset();
      setSelectedAddress(newAddress.id);
      setIsAddingNew(false);

      await updateCartShippingAddressMutation.mutateAsync({
        shippingAddressId: newAddress.id,
      });
      toast.success("Endereço vinculado ao carrinho!");
    } catch (error) {
      toast.error("Erro ao criar endereço. Tente novamente.");
      console.error(error);
    }
  };

  const handleGoToPayment = async () => {
    if (!selectedAddress || selectedAddress === "add_new") return;

    try {
      await updateCartShippingAddressMutation.mutateAsync({
        shippingAddressId: selectedAddress,
      });
      toast.success("Endereço selecionado para entrega!");
      router.push("/cart/confirmation");
    } catch (error) {
      toast.error("Erro ao selecionar endereço. Tente novamente.");
      console.error(error);
    }
  };

  return (
    <div className="mx-auto w-full max-w-6xl px-4 lg:px-0 ">
      <Card className="overflow-hidden border-2 shadow-xl transition-all duration-300 hover:shadow-2xl">
        <CardHeader className="from-primary/10 to-secondary/10 bg-gradient-to-r pb-6">
          <div className="flex items-center gap-4">
            <div className="bg-primary/20 flex h-12 w-12 items-center justify-center rounded-full">
              <MapPin className="text-primary h-6 w-6" />
            </div>
            <div className="flex-1">
              <CardTitle className="text-foreground text-2xl font-bold lg:text-3xl">
                Endereço de Entrega
              </CardTitle>
              <p className="text-muted-foreground mt-1 text-sm lg:text-base">
                Selecione ou cadastre um endereço para entrega
              </p>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-6 lg:p-8 ">
          {isLoading ? (
            <div className="py-12 text-center">
              <div className="inline-flex items-center justify-center">
                <div className="border-primary h-8 w-8 animate-spin rounded-full border-4 border-t-transparent"></div>
                <span className="text-muted-foreground ml-3 text-lg">
                  Carregando endereços...
                </span>
              </div>
            </div>
          ) : !isAddingNew ? (
            <>
              {addresses?.length === 0 ? (
                <div className="border-muted-foreground/20 bg-muted/30 rounded-2xl border-2 border-dashed py-12 text-center">
                  <div className="bg-primary/10 mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full">
                    <MapPin className="text-primary h-8 w-8" />
                  </div>
                  <p className="text-foreground mb-2 text-lg font-medium lg:text-xl">
                    Nenhum endereço cadastrado
                  </p>
                  <p className="text-muted-foreground mx-auto mb-6 max-w-md text-base">
                    Cadastre seu primeiro endereço para receber suas compras
                  </p>
                  <Button
                    onClick={() => setIsAddingNew(true)}
                    className="h-12 gap-2 px-8 text-base"
                    size="lg"
                  >
                    <Plus className="h-5 w-5" />
                    Cadastrar Endereço
                  </Button>
                </div>
              ) : (
                <>
                  <RadioGroup
                    value={selectedAddress || undefined}
                    onValueChange={setSelectedAddress}
                    className="space-y-4 lg:space-y-6 "
                  >
                    <div className="w-full">
                      {addresses?.map((address) => (
                        <Card
                          key={address.id}
                          className={`hover:border-primary cursor-pointer border-2 transition-all duration-300 hover:shadow-lg mb-5 ${
                            selectedAddress === address.id
                              ? "border-primary bg-primary/5"
                              : "border-border"
                          }`}
                          onClick={() => setSelectedAddress(address.id)}
                        >
                          <CardContent className="p-5 lg:p-6">
                            <div className="flex items-start gap-4">
                              <div className="flex-shrink-0">
                                <RadioGroupItem
                                  value={address.id}
                                  id={address.id}
                                  className="h-5 w-5 lg:h-6 lg:w-6"
                                />
                              </div>
                              <div className="min-w-0 flex-1">
                                <div className="mb-3 flex items-start justify-between">
                                  <div>
                                    <Label
                                      htmlFor={address.id}
                                      className="cursor-pointer"
                                    >
                                      <div className="mb-1 flex items-center gap-2">
                                        <p className="text-foreground text-base font-semibold lg:text-lg">
                                          {address.recipientName}
                                        </p>
                                        {address.id ===
                                          defaultShippingAddressId && (
                                          <Badge className="bg-primary text-xs">
                                            Principal
                                          </Badge>
                                        )}
                                      </div>
                                    </Label>
                                    <div className="text-muted-foreground space-y-1.5 text-sm lg:text-base">
                                      <p className="flex items-start gap-2">
                                        <MapPin className="mt-0.5 h-4 w-4 flex-shrink-0" />
                                        <span>{formatAddress(address)}</span>
                                      </p>
                                      {address.phone && (
                                        <p>📱 {address.phone}</p>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </RadioGroup>

                  <Separator className="my-8" />

                  <div className="flex flex-col items-center justify-between gap-4 lg:flex-row">
                    <Button
                      variant="outline"
                      onClick={() => setIsAddingNew(true)}
                      className="h-12 w-full gap-2 px-6 lg:w-auto"
                    >
                      <Plus className="h-5 w-5" />
                      Adicionar Novo Endereço
                    </Button>

                    <div className="w-full lg:w-auto">
                      <Button
                        onClick={handleGoToPayment}
                        className="from-primary to-primary/80 hover:from-primary/90 hover:to-primary h-12 w-full gap-2 bg-gradient-to-r px-8 text-base shadow-lg lg:text-lg"
                        size="lg"
                        disabled={
                          !selectedAddress ||
                          updateCartShippingAddressMutation.isPending
                        }
                      >
                        {updateCartShippingAddressMutation.isPending
                          ? "Processando..."
                          : "Continuar para Pagamento"}
                        <ArrowRight className="h-5 w-5" />
                      </Button>
                    </div>
                  </div>
                </>
              )}
            </>
          ) : (
            <div className="space-y-6">
              <div className="mb-6 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsAddingNew(false)}
                    className="h-10 w-10 rounded-full"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </Button>
                  <div>
                    <h3 className="text-xl font-bold lg:text-2xl">
                      Cadastrar Novo Endereço
                    </h3>
                    <p className="text-muted-foreground text-sm">
                      Preencha os dados do endereço de entrega
                    </p>
                  </div>
                </div>
              </div>

              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-8"
                >
                  <div className="border-border bg-card rounded-2xl border-2 p-6 lg:p-8">
                    <h4 className="mb-6 flex items-center gap-2 text-lg font-semibold lg:text-xl">
                      <div className="bg-primary h-2 w-2 rounded-full"></div>
                      Dados Pessoais
                    </h4>
                    <div className="grid gap-6 lg:grid-cols-2">
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-base font-medium">
                              Email *
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="seu@email.com"
                                {...field}
                                className="h-12 text-base"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="fullName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-base font-medium">
                              Nome Completo *
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Digite seu nome completo"
                                {...field}
                                className="h-12 text-base"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="cpf"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-base font-medium">
                              CPF *
                            </FormLabel>
                            <FormControl>
                              <PatternFormat
                                format="###.###.###-##"
                                placeholder="000.000.000-00"
                                customInput={Input}
                                className="h-12 text-base"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-base font-medium">
                              Celular *
                            </FormLabel>
                            <FormControl>
                              <PatternFormat
                                format="(##) #####-####"
                                placeholder="(11) 99999-9999"
                                customInput={Input}
                                className="h-12 text-base"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  <div className="border-border bg-card rounded-2xl border-2 p-6 lg:p-8">
                    <h4 className="mb-6 flex items-center gap-2 text-lg font-semibold lg:text-xl">
                      <div className="bg-primary h-2 w-2 rounded-full"></div>
                      Endereço de Entrega
                    </h4>
                    <div className="grid gap-6 lg:grid-cols-2">
                      <FormField
                        control={form.control}
                        name="zipCode"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-base font-medium">
                              CEP *
                            </FormLabel>
                            <FormControl>
                              <PatternFormat
                                format="#####-###"
                                placeholder="00000-000"
                                customInput={Input}
                                className="h-12 text-base"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="lg:col-span-2">
                        <FormField
                          control={form.control}
                          name="address"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-base font-medium">
                                Endereço *
                              </FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Rua, Avenida, etc."
                                  {...field}
                                  className="h-12 text-base"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <FormField
                        control={form.control}
                        name="number"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-base font-medium">
                              Número *
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="123"
                                {...field}
                                className="h-12 text-base"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="complement"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-base font-medium">
                              Complemento
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Apto, bloco, etc."
                                {...field}
                                className="h-12 text-base"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="neighborhood"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-base font-medium">
                              Bairro *
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Digite o bairro"
                                {...field}
                                className="h-12 text-base"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="city"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-base font-medium">
                              Cidade *
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Digite a cidade"
                                {...field}
                                className="h-12 text-base"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="state"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-base font-medium">
                              Estado *
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="SP, RJ, etc."
                                {...field}
                                className="h-12 text-base"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-4 lg:flex-row lg:gap-6">
                    <Button
                      type="submit"
                      className="from-primary to-primary/80 hover:from-primary/90 hover:to-primary h-12 flex-1 gap-2 bg-gradient-to-r text-base shadow-lg lg:text-lg"
                      size="lg"
                      disabled={
                        createShippingAddressMutation.isPending ||
                        updateCartShippingAddressMutation.isPending
                      }
                    >
                      {createShippingAddressMutation.isPending ||
                      updateCartShippingAddressMutation.isPending
                        ? "Salvando..."
                        : "Salvar Endereço"}
                    </Button>

                    <Button
                      type="button"
                      variant="outline"
                      className="h-12 text-base lg:text-lg"
                      size="lg"
                      onClick={() => setIsAddingNew(false)}
                    >
                      Cancelar
                    </Button>
                  </div>
                </form>
              </Form>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Addresses;

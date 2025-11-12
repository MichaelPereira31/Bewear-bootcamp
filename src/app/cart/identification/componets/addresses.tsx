"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { PatternFormat } from "react-number-format";
import { toast } from "sonner";
import z from "zod";

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
      console.log({ values });
      const newAddress =
        await createShippingAddressMutation.mutateAsync(values);
      toast.success("Endereço criado com sucesso!");
      form.reset();
      setSelectedAddress(newAddress.id);

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
    <Card className="mb-5 lg:mb-0 max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="text-xl lg:text-2xl xl:text-3xl">
          Identificação
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 lg:p-6">
        {isLoading ? (
          <div className="py-8 text-center">
            <p className="text-muted-foreground text-base lg:text-lg">
              Carregando endereços...
            </p>
          </div>
        ) : (
          <RadioGroup
            value={selectedAddress}
            onValueChange={setSelectedAddress}
            className="space-y-4 lg:space-y-6"
          >
            {addresses?.length === 0 && (
              <div className="py-8 text-center">
                <p className="text-muted-foreground text-base lg:text-lg">
                  Você ainda não possui endereços cadastrados.
                </p>
              </div>
            )}

            {addresses?.map((address) => (
              <Card
                key={address.id}
                className="hover:bg-muted/50 transition-colors"
              >
                <CardContent className="p-4 lg:p-6">
                  <div className="flex items-start space-x-3 lg:space-x-4">
                    <RadioGroupItem
                      value={address.id}
                      id={address.id}
                      className="mt-1 h-5 w-5 lg:h-6 lg:w-6"
                    />
                    <div className="min-w-0 flex-1">
                      <Label htmlFor={address.id} className="cursor-pointer">
                        <div className="space-y-1 lg:space-y-2">
                          <p className="text-base font-medium lg:text-lg xl:text-xl">
                            {address.recipientName}
                          </p>
                          <p className="text-muted-foreground text-sm lg:text-base">
                            {formatAddress(address)}
                          </p>
                          {address.phone && (
                            <p className="text-muted-foreground text-sm lg:text-base">
                              {address.phone}
                            </p>
                          )}
                        </div>
                      </Label>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            <Card className="hover:bg-muted/50 transition-colors">
              <CardContent className="p-4 lg:p-6">
                <div className="flex items-center space-x-3 lg:space-x-4">
                  <RadioGroupItem 
                    value="add_new" 
                    id="add_new" 
                    className="h-5 w-5 lg:h-6 lg:w-6"
                  />
                  <Label
                    htmlFor="add_new"
                    className="cursor-pointer text-base font-medium lg:text-lg xl:text-xl"
                  >
                    Adicionar novo endereço
                  </Label>
                </div>
              </CardContent>
            </Card>
          </RadioGroup>
        )}

        {selectedAddress && selectedAddress !== "add_new" && (
          <div className="mt-6">
            <Button
              onClick={handleGoToPayment}
              className="w-full lg:min-w-[200px] text-base lg:text-lg py-3 lg:py-4"
              size="lg"
              disabled={updateCartShippingAddressMutation.isPending}
            >
              {updateCartShippingAddressMutation.isPending
                ? "Processando..."
                : "Ir para pagamento"}
            </Button>
          </div>
        )}

        {selectedAddress === "add_new" && (
          <div className="mt-6 lg:mt-8">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6 lg:space-y-8"
              >
                <div className="grid gap-4 lg:gap-6 lg:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base lg:text-lg">
                          Email
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Digite seu email"
                            {...field}
                            className="text-base lg:text-lg h-12 lg:h-14"
                          />
                        </FormControl>
                        <FormMessage className="text-sm lg:text-base" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="fullName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base lg:text-lg">
                          Nome completo
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Digite seu nome completo"
                            {...field}
                            className="text-base lg:text-lg h-12 lg:h-14"
                          />
                        </FormControl>
                        <FormMessage className="text-sm lg:text-base" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="cpf"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base lg:text-lg">
                          CPF
                        </FormLabel>
                        <FormControl>
                          <PatternFormat
                            format="###.###.###-##"
                            placeholder="000.000.000-00"
                            customInput={Input}
                            className="text-base lg:text-lg h-12 lg:h-14"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage className="text-sm lg:text-base" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base lg:text-lg">
                          Celular
                        </FormLabel>
                        <FormControl>
                          <PatternFormat
                            format="(##) #####-####"
                            placeholder="(11) 99999-9999"
                            customInput={Input}
                            className="text-base lg:text-lg h-12 lg:h-14"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage className="text-sm lg:text-base" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="zipCode"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base lg:text-lg">
                          CEP
                        </FormLabel>
                        <FormControl>
                          <PatternFormat
                            format="#####-###"
                            placeholder="00000-000"
                            customInput={Input}
                            className="text-base lg:text-lg h-12 lg:h-14"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage className="text-sm lg:text-base" />
                      </FormItem>
                    )}
                  />

                  <div className="lg:col-span-2">
                    <FormField
                      control={form.control}
                      name="address"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-base lg:text-lg">
                            Endereço
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Digite seu endereço"
                              {...field}
                              className="text-base lg:text-lg h-12 lg:h-14"
                            />
                          </FormControl>
                          <FormMessage className="text-sm lg:text-base" />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="number"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base lg:text-lg">
                          Número
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Digite o número"
                            {...field}
                            className="text-base lg:text-lg h-12 lg:h-14"
                          />
                        </FormControl>
                        <FormMessage className="text-sm lg:text-base" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="complement"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base lg:text-lg">
                          Complemento
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Apto, bloco, etc. (opcional)"
                            {...field}
                            className="text-base lg:text-lg h-12 lg:h-14"
                          />
                        </FormControl>
                        <FormMessage className="text-sm lg:text-base" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="neighborhood"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base lg:text-lg">
                          Bairro
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Digite o bairro"
                            {...field}
                            className="text-base lg:text-lg h-12 lg:h-14"
                          />
                        </FormControl>
                        <FormMessage className="text-sm lg:text-base" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="city"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base lg:text-lg">
                          Cidade
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Digite a cidade"
                            {...field}
                            className="text-base lg:text-lg h-12 lg:h-14"
                          />
                        </FormControl>
                        <FormMessage className="text-sm lg:text-base" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="state"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base lg:text-lg">
                          Estado
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Digite o estado"
                            {...field}
                            className="text-base lg:text-lg h-12 lg:h-14"
                          />
                        </FormControl>
                        <FormMessage className="text-sm lg:text-base" />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="flex flex-col gap-4 lg:flex-row lg:gap-6">
                  <Button
                    type="submit"
                    className="w-full lg:flex-1 text-base lg:text-lg py-3 lg:py-4"
                    size="lg"
                    disabled={
                      createShippingAddressMutation.isPending ||
                      updateCartShippingAddressMutation.isPending
                    }
                  >
                    {createShippingAddressMutation.isPending ||
                    updateCartShippingAddressMutation.isPending
                      ? "Salvando..."
                      : "Salvar endereço"}
                  </Button>

                  {addresses && addresses.length > 0 && (
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full lg:w-auto text-base lg:text-lg py-3 lg:py-4"
                      size="lg"
                      onClick={() =>
                        setSelectedAddress(addresses[0]?.id || null)
                      }
                    >
                      Voltar para endereços
                    </Button>
                  )}
                </div>
              </form>
            </Form>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default Addresses;
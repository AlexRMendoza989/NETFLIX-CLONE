"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import axios, { AxiosError } from "axios";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";

// 📌 Corrección del esquema Zod
const formSchema = z
  .object({
    email: z.string().email("Correo inválido"),
    password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
    repeatPassword: z.string(),
  })
  .refine((data) => data.password === data.repeatPassword, {
    message: "Las contraseñas no coinciden",
    path: ["repeatPassword"],
  });

export function RegisterForm() {
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      repeatPassword: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    console.log("Valores enviados:", values);
    
    try {
      const response = await axios.post("/api/auth/register", values, {
        headers: { "Content-Type": "application/json" },
      });

      console.log("Respuesta de la API:", response.data);
      
      toast({
        title: "Usuario registrado correctamente",
      });

      router.push("/profiles");
    } catch (error: AxiosError) {
      console.error("Error en el registro:", error?.response?.data || error.message);

      toast({
        title: "Error al registrar usuario",
        description: error?.response?.data?.message || "Intenta de nuevo",
        variant: "destructive",
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Campo de Email */}
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input placeholder="Correo electrónico" {...field} className="h-14" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Campo de Contraseña */}
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input placeholder="Contraseña" {...field} className="h-14" type="password" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Campo de Repetir Contraseña */}
        <FormField
          control={form.control}
          name="repeatPassword"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input
                  placeholder="Repite la contraseña"
                  {...field}
                  className="h-14"
                  type="password"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full bg-[#E50914]">
          Registrarse
        </Button>
      </form>
    </Form>
  );
}

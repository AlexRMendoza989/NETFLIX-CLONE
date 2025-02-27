import { z } from "zod";

export const formSchema = z
  .object({
    email: z.string().min(1, {
      message: "El correo electrónico es requerido", // Mensaje si el campo está vacío
    }).email({
      message: "Correo electrónico inválido", // Mensaje si el correo no es válido
    }),
    password: z.string().min(6, {
      message: "La contraseña debe tener al menos 6 caracteres", // Mensaje si la contraseña es demasiado corta
    }),
    repeatPassword: z.string().min(1, {
      message: "Repetir la contraseña es requerido", // Mensaje si el campo está vacío
    }),
  })
  .refine((data) => data.password === data.repeatPassword, {
    message: "Las contraseñas no coinciden", // Mensaje si las contraseñas no coinciden
    path: ["repeatPassword"], // Indica que el error se debe mostrar en el campo repeatPassword
  });
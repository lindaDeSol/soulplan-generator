"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { useAppStore } from "../store/useAppStore";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { put } from "@vercel/blob";

const formSchema = z.object({
  fullname: z.string().min(2, {
    message: "Die Eingabe muss mindestens 2 Zeichen lang sein.",
  }),
});

export function InputForm() {
  const setFullname = useAppStore((state) => state.setFullname);
  const calculateSoulPlan = useAppStore((state) => state.calculateSoulPlan);
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullname: useAppStore.getState().fullname || "",
    },
  });

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {
    setFullname(values.fullname);
    calculateSoulPlan();

    const token = process.env.NEXT_PUBLIC_BLOB_READ_WRITE_TOKEN;
    console.log("Token:", token);

    const userInput = values.fullname;
    const { url } = await put("articles/blob.txt", "Log Name " + userInput, {
      access: "public",
      token: process.env.NEXT_PUBLIC_BLOB_READ_WRITE_TOKEN,
    });

    await router.push("/soulplan");
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="fullname"
          render={({ field }) => (
            <FormItem>
              <FormDescription>
                Bitte alle Vornamen und den Nachnamen im folgeneden Textfeld
                eingeben.
              </FormDescription>

              <FormControl>
                <Input placeholder="z.B. Max Josef Mustermann" {...field} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit">Berechnen</Button>
      </form>
    </Form>
  );
}

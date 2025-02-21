import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const bulkOrderSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  email: z.string().email("Invalid email address"),
  mangoType: z.string().min(1, "Please select mango type"),
  sixPieceQuantity: z.string().optional(),
  twelvePieceQuantity: z.string().optional(),
  twentyFourPieceQuantity: z.string().optional(),
  mangoSize: z.string().min(1, "Please select mango size"),
  city: z.string().min(2, "City must be at least 2 characters"),
  message: z.string().optional(),
});

type BulkOrderForm = z.infer<typeof bulkOrderSchema>;

export default function BulkOrder() {
  const form = useForm<BulkOrderForm>({
    resolver: zodResolver(bulkOrderSchema),
    defaultValues: {
      fullName: "",
      phone: "",
      email: "",
      mangoType: "",
      sixPieceQuantity: "",
      twelvePieceQuantity: "",
      twentyFourPieceQuantity: "",
      mangoSize: "",
      city: "",
      message: "",
    },
  });

  function onSubmit(data: BulkOrderForm) {
    console.log(data);
    // Handle bulk order submission
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Bulk Order</h1>
          <p className="text-xl text-gray-600">Start Your Own Store</p>
          <p className="text-2xl font-semibold text-primary mt-4">
            100% Naturally Ripen Alphonso Mango
          </p>
        </div>

        <Card>
          <CardContent className="p-6">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="fullName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name *</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone Number *</FormLabel>
                        <FormControl>
                          <Input type="tel" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email Address *</FormLabel>
                        <FormControl>
                          <Input type="email" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="mangoType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Types of Mango *</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select mango type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="ratnagiri">Ratnagiri</SelectItem>
                          <SelectItem value="devgad">Devgad</SelectItem>
                          <SelectItem value="others">Others</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="space-y-4">
                  <h3 className="font-medium">Type of Box *</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <FormField
                      control={form.control}
                      name="sixPieceQuantity"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>6 piece</FormLabel>
                          <FormControl>
                            <Input type="number" placeholder="Quantity" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="twelvePieceQuantity"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>12 piece</FormLabel>
                          <FormControl>
                            <Input type="number" placeholder="Quantity" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="twentyFourPieceQuantity"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>24 piece</FormLabel>
                          <FormControl>
                            <Input type="number" placeholder="Quantity" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                <FormField
                  control={form.control}
                  name="mangoSize"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Sizes of Mango *</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select size" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="king">King</SelectItem>
                          <SelectItem value="queen">Queen</SelectItem>
                          <SelectItem value="regular">Regular</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>City *</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Message</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Add any additional requirements or questions"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" className="w-full">
                  Send Message
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

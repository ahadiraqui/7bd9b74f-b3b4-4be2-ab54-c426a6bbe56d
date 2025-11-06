import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { LaptopRecord } from "@/pages/LaptopInOut";

const formSchema = z.object({
  employeeName: z.string().min(1, "Employee name is required"),
  laptopBrand: z.string().min(1, "Brand is required"),
  laptopModel: z.string().min(1, "Model is required"),
  serialNumber: z.string().min(1, "Serial number is required"),
  assignedDate: z.string().min(1, "Assigned date is required"),
  returnDate: z.string().optional(),
  status: z.enum(["in", "out"]),
  condition: z.string().min(1, "Condition is required"),
  remarks: z.string().optional(),
});

interface LaptopDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  laptop: LaptopRecord | null;
  onSave: (laptop: LaptopRecord) => void;
}

const LaptopDialog = ({
  open,
  onOpenChange,
  laptop,
  onSave,
}: LaptopDialogProps) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      employeeName: "",
      laptopBrand: "",
      laptopModel: "",
      serialNumber: "",
      assignedDate: "",
      returnDate: "",
      status: "out",
      condition: "Good",
      remarks: "",
    },
  });

  useEffect(() => {
    if (laptop) {
      form.reset({
        employeeName: laptop.employeeName,
        laptopBrand: laptop.laptopBrand,
        laptopModel: laptop.laptopModel,
        serialNumber: laptop.serialNumber,
        assignedDate: laptop.assignedDate,
        returnDate: laptop.returnDate || "",
        status: laptop.status,
        condition: laptop.condition,
        remarks: laptop.remarks || "",
      });
    } else {
      form.reset({
        employeeName: "",
        laptopBrand: "",
        laptopModel: "",
        serialNumber: "",
        assignedDate: "",
        returnDate: "",
        status: "out",
        condition: "Good",
        remarks: "",
      });
    }
  }, [laptop, form]);

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    onSave({
      id: laptop?.id || "",
      employeeName: values.employeeName,
      laptopBrand: values.laptopBrand,
      laptopModel: values.laptopModel,
      serialNumber: values.serialNumber,
      assignedDate: values.assignedDate,
      returnDate: values.returnDate,
      status: values.status,
      condition: values.condition,
      remarks: values.remarks,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {laptop ? "Edit Laptop Record" : "Add Laptop Record"}
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="employeeName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Employee Name</FormLabel>
                    <FormControl>
                      <Input placeholder="John Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="out">Out (Assigned)</SelectItem>
                        <SelectItem value="in">In (Returned)</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="laptopBrand"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Laptop Brand</FormLabel>
                    <FormControl>
                      <Input placeholder="Dell, HP, Lenovo..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="laptopModel"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Laptop Model</FormLabel>
                    <FormControl>
                      <Input placeholder="Latitude 5420" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="serialNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Serial Number</FormLabel>
                    <FormControl>
                      <Input placeholder="SN123456789" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="condition"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Condition</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select condition" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Excellent">Excellent</SelectItem>
                        <SelectItem value="Good">Good</SelectItem>
                        <SelectItem value="Fair">Fair</SelectItem>
                        <SelectItem value="Poor">Poor</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="assignedDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Assigned Date</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="returnDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Return Date (Optional)</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="remarks"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Remarks (Optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Any additional notes..."
                      className="resize-none"
                      rows={3}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button type="submit" className="flex-1">
                {laptop ? "Update" : "Save"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default LaptopDialog;

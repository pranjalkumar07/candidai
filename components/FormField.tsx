import { Controller, Control, FieldValues, Path } from "react-hook-form";

import {
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

interface FormFieldProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  label: string;
  placeholder?: string;
  type?: "text" | "email" | "password";
}

const FormField = <T extends FieldValues>({
  control,
  name,
  label,
  placeholder,
  type = "text",
}: FormFieldProps<T>) => {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className="space-y-1.5">
          <FormLabel className="text-xs font-semibold text-[#F5F7FF]">{label}</FormLabel>
          <FormControl>
            <Input
              className="bg-[#0B1224] border border-[rgba(110,120,180,0.22)] text-[#F5F7FF] placeholder:text-[#69748D] rounded-lg px-3.5 py-2 min-h-[42px] focus-visible:border-[#6D4AFF] focus-visible:ring-0 text-xs sm:text-sm outline-none transition-colors"
              type={type}
              placeholder={placeholder}
              {...field}
            />
          </FormControl>
          <FormMessage className="text-xs text-[#EF4444] font-medium" />
        </FormItem>
      )}
    />
  );
};

export default FormField;

import React from "react";
import {
  FormControl,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";
import { Controller, FieldValues, Path, Control } from "react-hook-form";

interface FormFieldProps<T extends FieldValues> {
  control: Control<T>; // Replace with the correct type for your control
    name: Path<T>;
    label: string;
    placeholder: string;
    type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'search' | 'date' | 'time' | 'datetime-local' | 'month' | 'week' | 'color' | 'file';
}

const FormField = <T extends FieldValues>({control, name, label, placeholder, type="text"}: FormFieldProps<T>) => (
  <Controller
    name={name}
    control={control}
    render={({ field }) => (
      <FormItem>
        <FormLabel className="label">{label}</FormLabel>
        <FormControl>
          <Input className="input" placeholder={placeholder} type={type} {...field} />
        </FormControl>
        <FormMessage />
      </FormItem>
    )}
  />
);

export default FormField;

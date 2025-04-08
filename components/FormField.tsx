import React from "react";
import {
  FormControl,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";
import { Controller, FieldValues, Path, Control } from "react-hook-form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";

interface FormFieldProps<T extends FieldValues> {
  control: Control<T>; 
    name: Path<T>;
    label: string;
    placeholder: string;
    type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'search' | 'date' | 'time' | 'datetime-local' | 'month' | 'week' | 'color' | 'file' | 'select';
    options?: { value: string; label: string }[];
}

const FormField = <T extends FieldValues>({control, name, label, placeholder, type="text", options = []}: FormFieldProps<T>) => (
  <Controller
    name={name}
    control={control}
    render={({ field }) => (
      <FormItem>
        <FormLabel className="label">{label}</FormLabel>
        <FormControl>
        {type === "select" ? (
            <Select
            onValueChange={(value) => field.onChange(value)}
          >
            <SelectTrigger className="input w-full">
              <SelectValue placeholder={placeholder || "Select an option"} />
            </SelectTrigger>
            <SelectContent>
              {options.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          ) : (
            <Input
              className="input"
              placeholder={placeholder}
              type={type}
              {...field}
            />
          )}
        </FormControl>
        <FormMessage />
      </FormItem>
    )}
  />
);

export default FormField;

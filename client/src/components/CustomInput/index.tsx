import React from "react";

import { Control, FieldPath } from "react-hook-form";
import { z } from "zod";
import { authFormSchema } from "@/lib/utils";
import { FormControl, FormField, FormLabel, FormMessage } from "../Form";
import { Input } from "./input";

const formSchema = authFormSchema("sign-up");

interface CustomInoputProps {
  control: Control<z.infer<typeof formSchema>>;
  name: FieldPath<z.infer<typeof formSchema>>;
  label: string;
  placeholder: string;
}
const CustomInput = ({
  control,
  name,
  label,
  placeholder,
}: CustomInoputProps) => {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <div className="form-item">
          <FormLabel className="form-label">{label}</FormLabel>
          <div className="flex w-full flex-col">
            <FormControl>
              <Input
                id={name}
                type={name === "password" ? "password" : "text"}
                {...field}
                placeholder={placeholder}
                className="input-class"
                onChange={(e) => {
                  const value = e.target.value;

                  field.onChange(value);
                }}
              />
            </FormControl>
            <FormMessage className="form-message mt-2" />
          </div>
        </div>
      )}
    />
  );
};

export default CustomInput;

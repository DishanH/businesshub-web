"use client"

import { useFieldArray, type UseFormReturn } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Trash2 } from "lucide-react"

// Define the form values type
type Attribute = {
  id?: string;
  name: string;
  type: "text" | "number" | "boolean" | "select" | "multiselect";
  options?: string[];
  required: boolean;
  description?: string;
};

type FormValues = {
  name: string;
  description: string;
  slug: string;
  icon?: string;
  subcategories: Array<{
    id?: string;
    name: string;
    description?: string;
    active: boolean;
  }>;
  attributes: Attribute[];
  active: boolean;
};

interface AttributesFormProps {
  form: UseFormReturn<FormValues>
}

export function AttributesForm({ form }: AttributesFormProps) {
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "attributes",
  })

  return (
    <div className="space-y-4">
      {fields.map((field, index) => (
        <Card key={field.id}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-base font-medium">Attribute {index + 1}</CardTitle>
            <Button type="button" variant="ghost" size="sm" className="text-destructive" onClick={() => remove(index)}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name={`attributes.${index}.name`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name={`attributes.${index}.type`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Type</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select attribute type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="text">Text</SelectItem>
                      <SelectItem value="number">Number</SelectItem>
                      <SelectItem value="boolean">Boolean</SelectItem>
                      <SelectItem value="select">Select</SelectItem>
                      <SelectItem value="multiselect">Multi-Select</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            {(form.watch(`attributes.${index}.type`) === "select" ||
              form.watch(`attributes.${index}.type`) === "multiselect") && (
              <FormField
                control={form.control}
                name={`attributes.${index}.options`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Options</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        value={field.value?.join("\n")}
                        onChange={(e) => field.onChange(e.target.value.split("\n"))}
                        placeholder="Enter options (one per line)"
                      />
                    </FormControl>
                    <FormDescription>Enter each option on a new line</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            <FormField
              control={form.control}
              name={`attributes.${index}.required`}
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Required</FormLabel>
                    <FormDescription>Make this attribute mandatory for businesses</FormDescription>
                  </div>
                  <FormControl>
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                </FormItem>
              )}
            />
          </CardContent>
        </Card>
      ))}
      <Button
        type="button"
        variant="outline"
        size="sm"
        className="mt-2"
        onClick={() => append({ name: "", type: "text", required: false })}
      >
        <Plus className="mr-2 h-4 w-4" />
        Add Attribute
      </Button>
    </div>
  )
}


"use client"

import { useFieldArray, type UseFormReturn } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Trash2 } from "lucide-react"

// Define the form values type
type Subcategory = {
  id?: string;
  name: string;
  description?: string;
  active: boolean;
};

type FormValues = {
  name: string;
  description: string;
  slug: string;
  icon?: string;
  subcategories: Subcategory[];
  attributes: Array<{
    id?: string;
    name: string;
    type: string;
    options?: string[];
    required: boolean;
    description?: string;
  }>;
  active: boolean;
};

interface SubcategoriesFormProps {
  form: UseFormReturn<FormValues>
}

export function SubcategoriesForm({ form }: SubcategoriesFormProps) {
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "subcategories",
  })

  return (
    <div className="space-y-4">
      {fields.map((field, index) => (
        <Card key={field.id}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-base font-medium">Subcategory {index + 1}</CardTitle>
            <Button type="button" variant="ghost" size="sm" className="text-destructive" onClick={() => remove(index)}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name={`subcategories.${index}.name`}
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
              name={`subcategories.${index}.description`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea {...field} />
                  </FormControl>
                  <FormDescription>Brief description of the subcategory</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name={`subcategories.${index}.active`}
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Active</FormLabel>
                    <FormDescription>Enable or disable this subcategory</FormDescription>
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
        onClick={() =>
          append({
            id: Math.random().toString(36).substr(2, 9),
            name: "",
            description: "",
            active: true,
          })
        }
      >
        <Plus className="mr-2 h-4 w-4" />
        Add Subcategory
      </Button>
    </div>
  )
}


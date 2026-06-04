"use client"

import { foodCourtSchema, FoodCourtSignUp } from "@/lib/schemas"
import { zodResolver } from "@hookform/resolvers/zod"
import { useState, Fragment } from "react"
import { useForm, Controller } from "react-hook-form"
import { FoodCourt } from "@/types/restaurant.types"
import {
  Field,
  FieldLabel,
  FieldError
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { formFields } from "@/constants/formFields"
import { toast } from "@/lib/toast"

const CourtOnboard = () => {
  const [data, setData] = useState<FoodCourt[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { handleSubmit, register, reset, control, formState: { errors } } = useForm<FoodCourtSignUp>({
    resolver: zodResolver(foodCourtSchema)
  });

  const onBoardFoodCourt = async (value: FoodCourtSignUp) => {
    setIsSubmitting(true);
    try {
      const response = await fetch("http://127.0.0.1:5000/api/auth/new-court", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(value),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to onboard food court");
      }

      toast.success("Food Court onboarded successfully!");
      reset();
    } catch (error: any) {
      console.error("Onboarding error:", error);
      toast.error(error, "An error occurred while onboarding.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
      <div className='p-6 max-w-xl mx-auto'>
        <main className="mb-6">
          <h1 className='text-3xl font-bold tracking-tight'>New Court</h1>
          <p className='text-sm text-muted-foreground mt-1'>
            Fill in the details below to register and onboard a new food court.
          </p>
        </main>

        <section>
          <form
            onSubmit={handleSubmit(onBoardFoodCourt)}
            className="space-y-6"
          >
            <div className="space-y-4">
              {formFields.map((field) => {
                const renderField = (
                  <div key={field.name} className="flex flex-col gap-1.5">
                    <Field>
                      <FieldLabel htmlFor={field.id}>
                        {field.label}
                      </FieldLabel>
                      <Input
                        id={field.id}
                        type={field.type}
                        placeholder={field.placeholder}
                        {...register(field.name)}
                      />
                    </Field>
                    {errors[field.name] && (
                      <FieldError>
                        {errors[field.name]?.message}
                      </FieldError>
                    )}
                  </div>
                );

                if (field.name === "password") {
                  return (
                    <Fragment key="currency-and-password">
                      <div className="flex flex-col gap-1.5">
                        <Field>
                          <FieldLabel htmlFor="currancy">Currency</FieldLabel>
                          <Controller
                            name="currancy"
                            control={control}
                            render={({ field: selectField }) => (
                              <Select onValueChange={selectField.onChange} value={selectField.value || ""}>
                                <SelectTrigger className="w-full">
                                  <SelectValue placeholder="Select Currency" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="USD">USD ($)</SelectItem>
                                  <SelectItem value="INR">INR (₹)</SelectItem>
                                </SelectContent>
                              </Select>
                            )}
                          />
                        </Field>
                        {errors.currancy && (
                          <FieldError>
                            {errors.currancy.message}
                          </FieldError>
                        )}
                      </div>

                      <div className="flex flex-col gap-1.5">
                        <Field>
                          <FieldLabel htmlFor="paymentSystem">Payment System</FieldLabel>
                          <Controller
                            name="paymentSystem"
                            control={control}
                            render={({ field: selectField }) => (
                              <Select onValueChange={selectField.onChange} value={selectField.value || ""}>
                                <SelectTrigger className="w-full">
                                  <SelectValue placeholder="Select Payment System" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="stripe">Stripe</SelectItem>
                                </SelectContent>
                              </Select>
                            )}
                          />
                        </Field>
                        {errors.paymentSystem && (
                          <FieldError>
                            {errors.paymentSystem.message}
                          </FieldError>
                        )}
                      </div>

                      {renderField}
                    </Fragment>
                  );
                }
                return renderField;
              })}
            </div>

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Onboarding..." : "Onboard Food Court"}
            </Button>
          </form>
        </section>
      </div>
    </>
  )
}

export default CourtOnboard
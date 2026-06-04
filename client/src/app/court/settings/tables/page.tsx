"use client"

import React from 'react'
import { useAddTable } from "@/hooks/mutations/useTableMutation"
import { useGetTables } from "@/hooks/queries/useTableQuery"
import { newTableSchema, TableInput } from "@/lib/schemas"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm, Controller } from "react-hook-form"
import { toast } from "@/lib/toast"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Armchair, Users, Plus, Loader2, Sparkles } from "lucide-react"

function Tables() {
    const { handleSubmit, register, reset, control, formState: { errors } } = useForm<TableInput>({
        resolver: zodResolver(newTableSchema)
    })

    const { data: tables, isLoading: isTablesLoading } = useGetTables()
    const { mutateAsync: addTable, isPending: isAdding } = useAddTable()

    const handleAddNewTable = handleSubmit(async (data) => {
        try {
            await addTable({
                number: String(data.number),
                occupacy: Number(data.occupacy),
                shape: String(data.shape),
                foodCourtId: "" // Automatically overridden by the server using the logged-in admin's foodCourtId
            })
            toast.success(`Table ${data.number} added successfully!`)
            reset()
        } catch (error: any) {
            toast.error(error.message || "Failed to add table")
        }
    })

    return (
        <section className="bg-card rounded-xl border shadow-sm p-6 h-full flex flex-col">
            <div className="mb-6 flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight mb-2">Manage Tables</h1>

                </div>
            </div>

            <div className="gap-8 ">
                {/* Left Side: Create Table Form */}
                <div className="w-full p-6 rounded-xl border flex flex-col justify-start h-fit ">
                    <div className="flex items-center gap-2 mb-6">
                        <h2 className="text-lg font-semibold text-foreground">Add New Table</h2>
                    </div>

                    <form onSubmit={handleAddNewTable} className="space-y-4">
                        <div>
                            <label htmlFor="number" className="block text-xs font-semibold tracking-wider text-muted-foreground mb-1.5">
                                Table Number
                            </label>
                            <input
                                id="number"
                                type="number"
                                placeholder="e.g. 1"
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                {...register("number", { valueAsNumber: true })}
                            />
                            {errors.number && (
                                <p className="text-xs text-destructive mt-1 font-medium">{errors.number.message}</p>
                            )}
                        </div>

                        <div>
                            <label htmlFor="occupacy" className="block text-xs font-semibold tracking-wider text-muted-foreground mb-1.5">
                                Max Occupancy
                            </label>
                            <input
                                id="occupacy"
                                type="number"
                                placeholder="e.g. 4"
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                {...register("occupacy", { valueAsNumber: true })}
                            />
                            {errors.occupacy && (
                                <p className="text-xs text-destructive mt-1 font-medium">{errors.occupacy.message}</p>
                            )}
                        </div>

                        <div>
                            <label htmlFor="shape" className="block text-xs font-semibold tracking-wider text-muted-foreground mb-1.5">
                                Shape
                            </label>
                            <Controller
                                name="shape"
                                control={control}
                                render={({ field }) => (
                                    <Select onValueChange={field.onChange} value={field.value || ""}>
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Select Shape" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Circle">Circle</SelectItem>
                                            <SelectItem value="Square">Square</SelectItem>
                                            <SelectItem value="Rectangle">Rectangle</SelectItem>
                                        </SelectContent>
                                    </Select>
                                )}
                            />
                            {errors.shape && (
                                <p className="text-xs text-destructive mt-1 font-medium">{errors.shape.message}</p>
                            )}
                        </div>

                        <Button 
                            type="submit" 
                            disabled={isAdding}
                            className="w-full flex items-center justify-center gap-2 mt-2 transition-transform hover:scale-[1.01]"
                        >
                            {isAdding ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                                <Plus className="h-4 w-4" />
                            )}
                            <span>{isAdding ? "Creating Table..." : "Create Table"}</span>
                        </Button>
                    </form>
                </div>

                {/* Right Side: Tables Grid List */}
                <div className="flex-1 border min-h-[200px] my-4 p-5 rounded-xl shadow-sm">
                    <div className="mb-4">
                        <h2 className="text-lg font-semibold text-foreground">Current Layout</h2>
                    </div>

                    {isTablesLoading ? (
                        <div className="flex w-full items-center justify-center p-12">
                            <Spinner className="h-8 w-8 text-primary" />
                        </div>
                    ) : !tables || tables.length === 0 ? (
                        <div className="p-12 text-center border-2 border-dashed rounded-xl border-border/50 flex flex-col items-center justify-center gap-4 bg-accent/5">
                            <Armchair className="h-12 w-12 text-muted-foreground/50" />
                            <div>
                                <p className="text-lg font-semibold text-foreground font-sans">No tables configured</p>
                                <p className="text-sm text-muted-foreground">
                                    Fill in the form on the left to add your food court's first table.
                                </p>
                            </div>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                            {tables.map((table) => (
                                <div
                                    key={table.id}
                                    className="p-5 rounded-xl bg-accent/10 border border-border/60 hover:bg-accent/20 transition-all hover:-translate-y-0.5 flex flex-col gap-3 group relative"
                                >
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
                                                {table.shape}
                                            </span>
                                            <h3 className="text-2xl font-bold text-foreground mt-1.5 font-sans">
                                                Table #{table.number}
                                            </h3>
                                        </div>

                                    </div>

                                    <div className="flex items-center gap-2 text-sm text-muted-foreground font-medium mt-1">
                                        <Users className="h-4 w-4 text-muted-foreground/75" />
                                        <span>Max: <strong className="text-foreground">{table.occupacy} people</strong></span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </section>
    )
}

export default Tables

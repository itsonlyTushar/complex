"use client"

import { useState, useMemo } from "react"
import {
  Field,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog"
import { toast } from "@/lib/toast"
import { useGetRestaurantsCommission } from "@/hooks/queries/useSpQuery"
import { useUpdateRestaurantCommission } from "@/hooks/mutations/useSpMutation"
import { Search, Percent, Store, ShieldAlert, CreditCard } from "lucide-react"

export default function PaymentsPage() {
  const { data: restaurants = [], isLoading } = useGetRestaurantsCommission()
  const updateMutation = useUpdateRestaurantCommission()

  const [searchTerm, setSearchTerm] = useState("")
  const [editingRestaurant, setEditingRestaurant] = useState<any | null>(null)
  const [commissionRate, setCommissionRate] = useState<string>("")

  // Filter restaurants
  const filteredRestaurants = useMemo(() => {
    return restaurants.filter((r: any) => {
      const nameMatch = r.name.toLowerCase().includes(searchTerm.toLowerCase())
      const courtMatch = r.foodCourt?.name.toLowerCase().includes(searchTerm.toLowerCase())
      return nameMatch || courtMatch
    })
  }, [restaurants, searchTerm])

  // Stats calculation
  const stats = useMemo(() => {
    if (!restaurants.length) return { total: 0, onboarded: 0, avgRate: 0 }
    const total = restaurants.length
    const onboarded = restaurants.filter((r: any) => r.onBoradingCompleted).length
    const totalRate = restaurants.reduce((sum: number, r: any) => sum + (r.commissionRate ?? 5.0), 0)
    const avgRate = totalRate / total
    return { total, onboarded, avgRate }
  }, [restaurants])

  const handleEditClick = (restaurant: any) => {
    setEditingRestaurant(restaurant)
    setCommissionRate(String(restaurant.commissionRate ?? 5.0))
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingRestaurant) return

    const rateNum = parseFloat(commissionRate)
    if (isNaN(rateNum) || rateNum < 0 || rateNum > 100) {
      toast.error("Please enter a valid percentage between 0 and 100.")
      return
    }

    try {
      await updateMutation.mutateAsync({
        id: editingRestaurant.id,
        commissionRate: rateNum,
      })
      toast.success("Commission rate updated successfully!")
      setEditingRestaurant(null)
    } catch (error: any) {
      console.error(error)
      toast.error(error.message || "Failed to update commission rate.")
    }
  }

  const isSaving = updateMutation.isPending

  // Helper for simulated order split
  const simulatedSplit = useMemo(() => {
    const rate = parseFloat(commissionRate) || 0
    const platform = 100 * (rate / 100)
    const vendor = 100 - platform
    return {
      platform: platform.toFixed(2),
      vendor: vendor.toFixed(2)
    }
  }, [commissionRate])

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
      {/* Header section */}
      <main className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">
            Payments
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage Stripe application fee settings and platform commission rates for each vendor.
          </p>
        </div>
      </main>

      {/* Table section */}
      <section className="bg-card border border-border/40 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="bg-muted/40 border-b border-border/40">
                <th className="p-4 font-semibold text-muted-foreground">Restaurant Name</th>
                <th className="p-4 font-semibold text-muted-foreground">Food Court</th>
                <th className="p-4 font-semibold text-muted-foreground">Stripe Account ID</th>
                <th className="p-4 font-semibold text-muted-foreground">Onboarding Status</th>
                <th className="p-4 font-semibold text-muted-foreground">Commission Rate</th>
                <th className="p-4 font-semibold text-muted-foreground text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/20">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-muted-foreground font-medium">
                    Loading restaurant payment data...
                  </td>
                </tr>
              ) : filteredRestaurants.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-muted-foreground font-medium">
                    No restaurants found.
                  </td>
                </tr>
              ) : (
                filteredRestaurants.map((res: any) => (
                  <tr key={res.id} className="hover:bg-muted/10 transition-colors">
                    <td className="p-4 font-semibold text-foreground flex items-center gap-2.5">

                      {res.name}
                    </td>
                    <td className="p-4 text-muted-foreground">{res.foodCourt?.name || "-"}</td>
                    <td className="p-4 font-mono text-xs text-muted-foreground">
                      {res.stripeAccountId || <span className="text-muted-foreground/50 italic">None</span>}
                    </td>
                    <td className="p-4">
                      {res.onBoradingCompleted ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-state-ready-bg text-state-ready border border-state-ready/30">
                          Active
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-state-aging-bg text-state-aging border border-state-aging/30">
                          Pending
                        </span>
                      )}
                    </td>
                    <td className="p-4">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-sm font-semibold bg-primary/10 text-primary border border-primary/20">
                        {res.commissionRate ?? 5.0}%
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <Button
                        variant="outline"
                        size="sm"
                        className="rounded-xl font-semibold border-border/40 hover:bg-primary hover:text-black hover:border-primary transition-all duration-200"
                        onClick={() => handleEditClick(res)}
                      >
                        Adjust Fee
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* Edit Dialog */}
      <Dialog open={editingRestaurant !== null} onOpenChange={(open) => !open && setEditingRestaurant(null)}>
        <DialogContent className="sm:max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold flex items-center gap-2">
              <Percent className="w-5 h-5 text-primary" /> Adjust Commission Rate
            </DialogTitle>
            <DialogDescription className="text-sm text-muted-foreground">
              Update the platform commission fee percentage for <span className="font-semibold text-foreground">{editingRestaurant?.name}</span>.
            </DialogDescription>
          </DialogHeader>

          {editingRestaurant && (
            <form onSubmit={handleSave} className="space-y-6 pt-4">
              <div className="space-y-4">
                <Field>
                  <FieldLabel htmlFor="edit-commission" className="font-semibold text-sm">
                    Platform Commission Rate (%)
                  </FieldLabel>
                  <div className="relative mt-1">
                    <Input
                      id="edit-commission"
                      type="number"
                      step="0.1"
                      min="0"
                      max="100"
                      value={commissionRate}
                      onChange={(e) => setCommissionRate(e.target.value)}
                      required
                      className="pr-10 rounded-xl border border-border/40 focus-visible:ring-1 focus-visible:ring-primary w-full"
                    />
                    <div className="absolute right-3.5 top-2.5 text-muted-foreground font-semibold">
                      %
                    </div>
                  </div>
                </Field>

                {/* Simulated Order Split Preview */}
                <div className="bg-accent/40 rounded-xl p-4 border border-border/20 space-y-3">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Simulated Payout Split (On $100 Order)</h4>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground flex items-center gap-1.5">
                      <div className="w-2.5 h-2.5 rounded-full bg-primary" />
                      Platform (App Fee)
                    </span>
                    <span className="font-semibold text-foreground">${simulatedSplit.platform}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground flex items-center gap-1.5">
                      <div className="w-2.5 h-2.5 rounded-full bg-state-ready" />
                      Restaurant (Vendor Payout)
                    </span>
                    <span className="font-semibold text-foreground">${simulatedSplit.vendor}</span>
                  </div>
                </div>

                {!editingRestaurant.onBoradingCompleted && (
                  <div className="p-3 bg-state-aging-bg text-state-aging rounded-xl border border-state-aging/30 text-xs flex gap-2.5 items-start">
                    <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" />
                    <span>
                      This restaurant has not onboarded Stripe yet. Adjusting the rate will apply to future transactions once Stripe is fully connected.
                    </span>
                  </div>
                )}
              </div>

              <DialogFooter className="gap-2 sm:gap-0">
                <Button
                  type="button"
                  variant="outline"
                  className="rounded-xl border-border/40"
                  onClick={() => setEditingRestaurant(null)}
                  disabled={isSaving}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="rounded-xl font-semibold bg-primary text-black hover:bg-primary/95"
                  disabled={isSaving}
                >
                  {isSaving ? "Saving..." : "Save Rate"}
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

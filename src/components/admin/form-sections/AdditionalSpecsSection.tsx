import * as React from "react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { UseFormReturn } from "react-hook-form";
import type { ProductFormData } from "@/schemas/productSchemas";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";

interface AdditionalSpecsSectionProps {
  form: UseFormReturn<ProductFormData>;
  productType: 'mobile' | 'laptop';
}

export function AdditionalSpecsSection({ form, productType }: AdditionalSpecsSectionProps) {
  if (productType !== 'mobile') {
    return null;
  }

  return (
    <div className="space-y-6 text-left">
      {/* Launch Details */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Launch Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="announced"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Announced</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., January 2024" {...field} />
                </FormControl>
                <FormDescription>When was the product announced?</FormDescription>
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
                <FormControl>
                  <Input placeholder="e.g., Available, Coming soon" {...field} />
                </FormControl>
                <FormDescription>Current market status</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>

      <Separator />

      {/* Platform */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Platform</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="chipset"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Chipset</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., Snapdragon 8 Gen 3" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="cpu_details"
            render={({ field }) => (
              <FormItem>
                <FormLabel>CPU Details</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., Octa-core (1x3.3 GHz + 3x3.0 GHz + 4x2.5 GHz)" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="gpu_details"
            render={({ field }) => (
              <FormItem>
                <FormLabel>GPU Details</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., Adreno 730" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>

      <Separator />

      {/* Memory */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Memory</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="memory_type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Memory Type</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., LPDDR5X" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="card_slot"
            render={({ field }) => (
              <FormItem className="flex items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel>Memory Card Slot</FormLabel>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </div>
      </div>

      <Separator />

      {/* Display */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Display</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="display_type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Display Type</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., AMOLED, IPS LCD" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="display_protection"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Display Protection</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., Gorilla Glass Victus" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>

      <Separator />

      {/* Network Bands */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Network Bands</h3>
        <div className="grid grid-cols-1 gap-4">
          {['2g', '3g', '4g', '5g'].map((band) => (
            <FormField
              key={band}
              control={form.control}
              name={`bands_${band}` as any}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{band.toUpperCase()} Bands</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder={`e.g., GSM 850 / 900 / 1800 / 1900${band === '5g' ? ' - SA/NSA/Sub6' : ''}`}
                      value={Array.isArray(field.value) ? field.value.join(', ') : field.value || ''}
                      onChange={(e) => {
                        const value = e.target.value;
                        field.onChange(value.split(',').map(s => s.trim()).filter(Boolean));
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          ))}
        </div>
      </div>

      <Separator />

      {/* Sound */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Sound</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="loudspeaker_type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Loudspeaker</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., Stereo speakers" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="audio_jack"
            render={({ field }) => (
              <FormItem className="flex items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel>3.5mm Jack</FormLabel>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </div>
      </div>

      <Separator />

      {/* Miscellaneous */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Miscellaneous</h3>
        <div className="grid grid-cols-1 gap-4">
          <FormField
            control={form.control}
            name="model_variants"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Model Variants (comma-separated)</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="e.g., A2849, SM-S918B"
                    value={Array.isArray(field.value) ? field.value.join(', ') : field.value || ''}
                    onChange={(e) => {
                      const value = e.target.value;
                      field.onChange(value.split(',').map(s => s.trim()).filter(Boolean));
                    }}
                  />
                </FormControl>
                <FormDescription>List all model variants/numbers</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>
    </div>
  );
}
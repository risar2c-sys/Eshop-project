"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { checkoutSchema, type CheckoutFormData, shippingMethods, paymentMethods } from "@/lib/checkout-schema";
import { useCart } from "@/context/CartContext";
import CheckoutStepper from "@/components/checkout/CheckoutStepper";
import OrderSummary from "@/components/checkout/OrderSummary";

const stepFields: Record<number, (keyof CheckoutFormData)[]> = {
  1: ["email", "firstName", "lastName", "phone"],
  2: ["street", "city", "zip", "shippingMethod"],
  3: ["paymentMethod"],
  4: [],
};

export default function CheckoutPage() {
  const { items, clearCart } = useCart();
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);

  const { register, handleSubmit, trigger, watch, formState: { errors } } = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: { createAccount: false, billingSameAsDelivery: true },
  });

  const billingSameAsDelivery = watch("billingSameAsDelivery");
  const selectedShipping = watch("shippingMethod");

  const goNext = async () => { if (await trigger(stepFields[step])) setStep((s) => Math.min(4, s + 1)); };
  const goBack = () => setStep((s) => Math.max(1, s - 1));

  const onSubmit = (data: CheckoutFormData) => {
    console.log("Objednávka:", data, items);
    setSubmitted(true);
    clearCart();
  };

  if (items.length === 0 && !submitted) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-24 text-center">
        <h1 className="section-heading mb-3">Košík je prázdný</h1>
        <p className="text-bark/60 mb-6">Než přejdete k pokladně, přidejte si nějaké produkty do košíku.</p>
        <Link href="/" className="btn-primary">Zpět na nákup</Link>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-24 text-center">
        <h1 className="section-heading mb-3">Děkujeme za objednávku!</h1>
        <p className="text-bark/60 mb-6">Potvrzení jsme odeslali na váš e-mail.</p>
        <Link href="/" className="btn-primary">Zpět na hlavní stránku</Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <h1 className="section-heading mb-8">Pokladna</h1>
      <CheckoutStepper current={step} />
      <div className="grid md:grid-cols-[1fr_360px] gap-10">
        <form onSubmit={handleSubmit(onSubmit)}>
          {step === 1 && (
            <fieldset className="space-y-4">
              <legend className="font-display text-xl text-forest mb-2">Kontaktní údaje</legend>
              <p className="text-sm text-bark/60">Máte účet? <Link href="/prihlaseni" className="underline text-forest">Přihlaste se</Link> nebo pokračujte jako host.</p>
              <Field label="E-mail" error={errors.email?.message}><input type="email" {...register("email")} className="input" /></Field>
              <div className="grid grid-cols-2 gap-4">
                <Field label="Jméno" error={errors.firstName?.message}><input {...register("firstName")} className="input" /></Field>
                <Field label="Příjmení" error={errors.lastName?.message}><input {...register("lastName")} className="input" /></Field>
              </div>
              <Field label="Telefon" error={errors.phone?.message}><input {...register("phone")} className="input" /></Field>
              <label className="flex items-center gap-2 text-sm pt-2"><input type="checkbox" {...register("createAccount")} className="accent-forest" /> Vytvořit si u nás účet pro příště</label>
            </fieldset>
          )}

          {step === 2 && (
            <fieldset className="space-y-4">
              <legend className="font-display text-xl text-forest mb-2">Doručovací údaje</legend>
              <Field label="Ulice a číslo popisné" error={errors.street?.message}><input {...register("street")} className="input" /></Field>
              <div className="grid grid-cols-2 gap-4">
                <Field label="Město" error={errors.city?.message}><input {...register("city")} className="input" /></Field>
                <Field label="PSČ" error={errors.zip?.message}><input {...register("zip")} className="input" /></Field>
              </div>
              <label className="flex items-center gap-2 text-sm pt-2"><input type="checkbox" {...register("billingSameAsDelivery")} className="accent-forest" /> Fakturační adresa je stejná jako doručovací</label>
              {!billingSameAsDelivery && (
                <div className="space-y-4 pt-2 border-t border-forest/10">
                  <div className="grid grid-cols-2 gap-4">
                    <Field label="Firma (nepovinné)"><input {...register("billingCompany")} className="input" /></Field>
                    <Field label="IČO (nepovinné)"><input {...register("billingIco")} className="input" /></Field>
                  </div>
                  <Field label="Fakturační ulice a č.p." error={errors.billingStreet?.message}><input {...register("billingStreet")} className="input" /></Field>
                  <div className="grid grid-cols-2 gap-4">
                    <Field label="Fakturační město"><input {...register("billingCity")} className="input" /></Field>
                    <Field label="Fakturační PSČ"><input {...register("billingZip")} className="input" /></Field>
                  </div>
                </div>
              )}
              <Field label="Poznámka k objednávce (nepovinné)"><textarea {...register("note")} rows={3} className="input" /></Field>
              <div className="pt-4">
                <p className="label-tag mb-3">Způsob dopravy</p>
                <div className="space-y-2">
                  {shippingMethods.map((m) => (
                    <label key={m.id} className="flex items-center justify-between border border-forest/15 rounded px-4 py-3 cursor-pointer has-[:checked]:border-gold">
                      <span className="flex items-center gap-3 text-sm"><input type="radio" value={m.id} {...register("shippingMethod")} className="accent-forest" />{m.label}</span>
                      <span className="text-sm text-bark/60">{m.price === 0 ? "zdarma" : `${m.price} Kč`}</span>
                    </label>
                  ))}
                </div>
                {errors.shippingMethod && <p className="text-sm text-red-700 mt-2">{errors.shippingMethod.message}</p>}
              </div>
            </fieldset>
          )}

          {step === 3 && (
            <fieldset className="space-y-3">
              <legend className="font-display text-xl text-forest mb-2">Způsob platby</legend>
              {paymentMethods.map((m) => (
                <label key={m.id} className="flex items-center gap-3 border border-forest/15 rounded px-4 py-3 cursor-pointer has-[:checked]:border-gold text-sm">
                  <input type="radio" value={m.id} {...register("paymentMethod")} className="accent-forest" />{m.label}
                </label>
              ))}
              {errors.paymentMethod && <p className="text-sm text-red-700">{errors.paymentMethod.message}</p>}
            </fieldset>
          )}

          {step === 4 && (
            <fieldset>
              <legend className="font-display text-xl text-forest mb-4">Rekapitulace objednávky</legend>
              <div className="space-y-3 text-sm bg-white border border-forest/10 rounded-organic p-5">
                <SummaryRow label="Jméno" value={`${watch("firstName")} ${watch("lastName")}`} />
                <SummaryRow label="E-mail" value={watch("email")} />
                <SummaryRow label="Telefon" value={watch("phone")} />
                <SummaryRow label="Doručovací adresa" value={`${watch("street")}, ${watch("city")}, ${watch("zip")}`} />
                <SummaryRow label="Doprava" value={shippingMethods.find((m) => m.id === watch("shippingMethod"))?.label ?? "—"} />
                <SummaryRow label="Platba" value={paymentMethods.find((m) => m.id === watch("paymentMethod"))?.label ?? "—"} />
                {watch("note") && <SummaryRow label="Poznámka" value={watch("note")!} />}
              </div>
              <p className="text-xs text-bark/50 mt-4">Odesláním objednávky souhlasíte s obchodními podmínkami.</p>
            </fieldset>
          )}

          <div className="flex justify-between mt-8">
            {step > 1 ? <button type="button" onClick={goBack} className="btn-outline">Zpět</button> : <span />}
            {step < 4 ? <button type="button" onClick={goNext} className="btn-primary">Pokračovat</button> : <button type="submit" className="btn-primary">Odeslat objednávku</button>}
          </div>
        </form>

        <OrderSummary selectedShippingId={selectedShipping} />
      </div>
    </div>
  );
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="text-sm text-bark/70 block mb-1">{label}</span>
      {children}
      {error && <span className="text-sm text-red-700 block mt-1">{error}</span>}
    </label>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return <div className="flex justify-between gap-4"><span className="text-bark/60">{label}</span><span className="text-right text-forest">{value}</span></div>;
}

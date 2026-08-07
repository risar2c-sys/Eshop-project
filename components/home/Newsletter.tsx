export default function Newsletter() {
  return (
    <section className="max-w-3xl mx-auto px-6 py-24 text-center">
      <p className="label-tag text-olive">nezmeškejte novou sklizeň</p>
      <h2 className="section-heading mt-3">Přihlaste se k odběru novinek</h2>
      <p className="text-bark/70 mt-3">Jednou měsíčně: nové úlovky, recepty a slevy pro odběratele.</p>
      <form className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
        <input type="email" required placeholder="Váš e-mail" className="px-5 py-3 rounded-organic border border-forest/20 bg-white focus:outline-none focus:ring-2 focus:ring-gold w-full sm:w-80" />
        <button type="submit" className="btn-primary justify-center">Odebírat</button>
      </form>
    </section>
  );
}

import Image from "next/image";

export default function Hero({ imageUrl }: { imageUrl: string }) {
  return (
    <section className="relative h-[86vh] min-h-[560px] w-full overflow-hidden">
      <Image src={imageUrl} alt="Sušené čajové lístky a koření" fill priority className="object-cover" />
      <div className="absolute inset-0 bg-gradient-to-t from-forest/80 via-forest/20 to-transparent" />
      <div className="relative h-full max-w-7xl mx-auto px-6 flex flex-col justify-end pb-20">
        <p className="label-tag text-gold">sklizeno s péčí · pražené v malých dávkách</p>
        <h1 className="font-display italic text-5xl md:text-7xl text-sand max-w-2xl mt-3 leading-[1.05]">
          Chuť, kterou lze vystopovat až k jejímu původu.
        </h1>
        <p className="text-sand/80 max-w-md mt-5">
          Ručně sbírané čaje z daleka.
        </p>
        <a href="#kategorie" className="btn-primary w-fit mt-8">Nakupovat</a>
      </div>
    </section>
  );
}

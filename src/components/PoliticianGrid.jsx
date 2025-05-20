import PoliticianProfile from "./PoliticianProfile";

export default function PoliticianGrid({ politicians }) {
  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      {!politicians || politicians.length === 0 ? (
        <p className="text-center text-white text-lg">No politicians found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {politicians.map((politician) => (
            <PoliticianProfile key={politician.slug} politician={politician} />
          ))}
        </div>
      )}
    </div>
  );
}

import { Link } from "react-router-dom";
import Button from "../components/Button";
import PoliticianGrid from "../components/PoliticianGrid";
import { useEffect, useState } from "react";
import {
  getAllPoliticians,
  getAllSixPoliticians,
} from "../services/politicianService";

export default function Home() {
  const [politician, setPolitician] = useState();
  const [loading, setLoading] = useState();

  useEffect(() => {
    getAllSixPoliticians()
      .then((data) => {
        setPolitician(data);
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
      });
  }, []);
  return (
    <section className="bg-green-800 text-white min-h-screen px-6 py-16 mt-10">
      <div className="text-center max-w-3xl mx-auto mb-12">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-4">
          🇿🇦 Unite, Speak, and Rate South Africa’s Leaders
        </h1>
        <p className="text-lg md:text-xl text-slate-200 mb-6">
          Honest ratings. Bold opinions. National impact.
        </p>
        <Link
          to="/search-politician"
          className="bg-yellow-400 hover:bg-yellow-500 text-slate-900 font-bold py-3 px-6 rounded-full text-lg transition duration-200"
        >
          Explore Politicians
        </Link>
      </div>

      <PoliticianGrid politicians={politician} />
      <div className="text-center max-w-3xl mx-auto mb-12">
        <Button whereto={"/search-politician"} buttonName="See more"></Button>
      </div>
    </section>
  );
}

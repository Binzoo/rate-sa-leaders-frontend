import { useEffect, useState } from "react";
import PoliticianGrid from "../components/PoliticianGrid";
import {
  getAllPoliticians,
  searchPoliticians,
} from "../services/politicianService";
import Layout from "../components/Layout";
import SearchBar from "../components/SearchBar";

function Politicians() {
  const [politicians, setPoliticians] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    getAllPoliticians()
      .then((data) => {
        setPoliticians(data);
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
      });
  }, []);

  const handleSearch = async (query) => {
    setLoading(true);
    try {
      const data = await searchPoliticians(query);
      setPoliticians(data);
    } catch (err) {
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <SearchBar
        onSearch={handleSearch}
        placeholder="Search by name, party, or region..."
      />
      {loading ? (
        <p className="text-white text-center mt-4">Loading...</p>
      ) : (
        <PoliticianGrid politicians={politicians} />
      )}
    </Layout>
  );
}

export default Politicians;

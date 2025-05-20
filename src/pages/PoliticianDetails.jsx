import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  getPoliticianBySlug,
  upvote,
  downvote,
  getAllSixPoliticians,
} from "../services/politicianService";
import PoliticianGrid from "../components/PoliticianGrid";

export default function PoliticianDetails() {
  const { slug } = useParams();
  const [politician, setPolitician] = useState(null);
  const [politicians, setPoliticians] = useState([]);
  const [loading, setLoading] = useState(true);

  // Voting state
  const [userVote, setUserVote] = useState(null); // 'up', 'down', or null
  const [localVoteCounts, setLocalVoteCounts] = useState({
    upvotes: 0,
    downvotes: 0,
    total_votes: 0,
  });
  const [isVoting, setIsVoting] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [showTooltip, setShowTooltip] = useState(null); // 'up', 'down', or null

  useEffect(() => {
    // Load politicians data
    getPoliticianBySlug(slug)
      .then((data) => {
        setPolitician(data);

        // Initialize vote counts
        setLocalVoteCounts({
          upvotes: data.upvotes || 0,
          downvotes: data.downvotes || 0,
          total_votes: data.total_votes || 0,
        });

        // Check if user has already voted for this politician
        const storedVotes = localStorage.getItem("politician_votes");
        const votesMap = storedVotes ? JSON.parse(storedVotes) : {};

        if (votesMap[slug]) {
          setUserVote(votesMap[slug]);
        } else {
          setUserVote(null);
        }

        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
      });

    getAllSixPoliticians()
      .then((data) => {
        setPoliticians(data);
      })
      .catch((err) => {});
  }, [slug]);

  const saveVote = (voteType) => {
    const storedVotes = localStorage.getItem("politician_votes");
    const votesMap = storedVotes ? JSON.parse(storedVotes) : {};

    votesMap[slug] = voteType;

    localStorage.setItem("politician_votes", JSON.stringify(votesMap));

    // Update state
    setUserVote(voteType);
  };

  const handleUpVote = async () => {
    // Prevent multiple votes or voting while a request is in progress
    if (userVote === "up" || isVoting) {
      // Show tooltip if already voted
      if (userVote === "up") {
        setShowTooltip("up");
        setTimeout(() => setShowTooltip(null), 2000); // Hide after 2 seconds
      }
      return;
    }

    try {
      setIsVoting(true);

      // If user had previously downvoted, we need to remove that downvote
      const previousVote = userVote;

      // Optimistically update UI
      setUserVote("up");
      setLocalVoteCounts((prev) => ({
        upvotes: prev.upvotes + 1,
        downvotes:
          previousVote === "down" ? prev.downvotes - 1 : prev.downvotes,
        total_votes:
          previousVote === null ? prev.total_votes + 1 : prev.total_votes,
      }));

      // Send request to server
      await upvote(slug);

      // Save vote to localStorage
      saveVote("up");

      // Refresh the data to keep server and client in sync
      const updated = await getPoliticianBySlug(slug);
      setPolitician(updated);
    } catch (error) {
      // Revert optimistic update on error
      setUserVote(userVote);
      if (politician) {
        setLocalVoteCounts({
          upvotes: politician.upvotes || 0,
          downvotes: politician.downvotes || 0,
          total_votes: politician.total_votes || 0,
        });
      }
    } finally {
      setIsVoting(false);
    }
  };

  const handleDownVote = async () => {
    // Prevent multiple votes or voting while a request is in progress
    if (userVote === "down" || isVoting) {
      // Show tooltip if already voted
      if (userVote === "down") {
        setShowTooltip("down");
        setTimeout(() => setShowTooltip(null), 2000); // Hide after 2 seconds
      }
      return;
    }

    try {
      setIsVoting(true);

      // If user had previously upvoted, we need to remove that upvote
      const previousVote = userVote;

      // Optimistically update UI
      setUserVote("down");
      setLocalVoteCounts((prev) => ({
        upvotes: previousVote === "up" ? prev.upvotes - 1 : prev.upvotes,
        downvotes: prev.downvotes + 1,
        total_votes:
          previousVote === null ? prev.total_votes + 1 : prev.total_votes,
      }));

      // Send request to server
      await downvote(slug);

      // Save vote to localStorage
      saveVote("down");

      // Refresh the data to keep server and client in sync
      const updated = await getPoliticianBySlug(slug);
      setPolitician(updated);
    } catch (error) {
      // Revert optimistic update on error
      setUserVote(userVote);
      if (politician) {
        setLocalVoteCounts({
          upvotes: politician.upvotes || 0,
          downvotes: politician.downvotes || 0,
          total_votes: politician.total_votes || 0,
        });
      }
    } finally {
      setIsVoting(false);
    }
  };

  if (loading) return <p className="text-center text-white">Loading...</p>;
  if (!politician)
    return <p className="text-center text-red-500">Politician not found</p>;

  // Calculate percentages for the vote bar
  const totalVotes = localVoteCounts.total_votes || 0;
  const upvotePercentage =
    totalVotes > 0
      ? Math.round((localVoteCounts.upvotes / totalVotes) * 100)
      : 50; // Default to 50% if no votes
  const downvotePercentage = 100 - upvotePercentage;

  // Generate initials as fallback
  const getInitials = () => {
    return politician.full_name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .substring(0, 2)
      .toUpperCase();
  };

  return (
    <div className="min-h-screen bg-green-800 py-10 px-4 mt-10">
      <div className="max-w-3xl mx-auto">
        {/* Back button */}
        <Link
          to="/"
          className="text-white/80 hover:text-white mb-6 inline-flex items-center"
        >
          ← Back to all politicians
        </Link>

        {/* Single Card */}
        <div className="bg-white rounded-xl overflow-hidden shadow-lg">
          <div className="md:flex">
            {/* Image area */}
            <div className="md:w-2/5 h-80 bg-gray-200 md:h-auto">
              {!imageError && politician.image_url ? (
                <img
                  src={politician.image_url}
                  alt={politician.full_name}
                  className="w-full h-full object-contain"
                  onError={() => setImageError(true)}
                  loading="lazy"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-200">
                  <span className="text-5xl font-bold text-gray-400">
                    {getInitials()}
                  </span>
                </div>
              )}
            </div>

            {/* Content */}
            <div className="md:w-3/5 p-6">
              <h1 className="text-2xl font-bold text-gray-800 mb-1">
                {politician.full_name}
              </h1>

              <div className="flex items-center mb-4">
                <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded">
                  {politician.party}
                </span>
                <span className="mx-2 text-gray-400">•</span>
                <span className="text-gray-600 text-sm">
                  {politician.position}
                </span>
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Region</h3>
                  <p className="text-gray-800">{politician.region}</p>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-500">About</h3>
                  <p className="text-gray-700 text-sm mt-1">
                    {politician.about ||
                      "No biographical information available."}
                  </p>
                </div>

                {/* Voting stats with bar */}
                <div className="mt-6 pt-4 border-t border-gray-200">
                  {/* Vote count numbers */}
                  <div className="flex justify-between mb-4">
                    <div className="text-center">
                      <p className="text-xl font-bold text-green-600">
                        {localVoteCounts.upvotes}
                      </p>
                      <p className="text-xs text-gray-500">Upvotes</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xl font-bold text-red-600">
                        {localVoteCounts.downvotes}
                      </p>
                      <p className="text-xs text-gray-500">Downvotes</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xl font-bold text-blue-600">
                        {localVoteCounts.total_votes}
                      </p>
                      <p className="text-xs text-gray-500">Total</p>
                    </div>
                  </div>

                  {/* Voting bar */}
                  <div className="mb-4">
                    <div className="flex justify-between text-xs mb-1">
                      <span>👍 {upvotePercentage}%</span>
                      <span>👎 {downvotePercentage}%</span>
                    </div>
                    <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-green-500 rounded-full transition-all duration-300"
                        style={{ width: `${upvotePercentage}%` }}
                      ></div>
                    </div>
                  </div>
                </div>

                {/* Voting buttons with tooltip container */}
                <div className="flex justify-center gap-4 mt-8 relative">
                  {/* Upvote button */}
                  <div className="relative">
                    <button
                      onClick={handleUpVote}
                      disabled={userVote === "up" || isVoting}
                      className={`flex items-center gap-2 ${
                        userVote === "up"
                          ? "bg-green-700 cursor-not-allowed opacity-70"
                          : isVoting
                          ? "bg-green-500 cursor-wait opacity-80"
                          : "bg-green-600 hover:bg-green-700"
                      } text-white font-medium py-2 px-5 rounded-lg transition shadow-sm`}
                      onMouseEnter={() =>
                        userVote === "up" && setShowTooltip("up")
                      }
                      onMouseLeave={() => setShowTooltip(null)}
                    >
                      <span className="text-lg">👍</span>
                      {userVote === "up" ? "Upvoted" : "Upvote"}
                    </button>

                    {/* Upvote tooltip */}
                    {showTooltip === "up" && (
                      <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-black/80 text-white text-xs py-1 px-2 rounded whitespace-nowrap z-10">
                        You already upvoted
                        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 rotate-45 w-2 h-2 bg-black/80"></div>
                      </div>
                    )}
                  </div>

                  {/* Downvote button */}
                  <div className="relative">
                    <button
                      onClick={handleDownVote}
                      disabled={userVote === "down" || isVoting}
                      className={`flex items-center gap-2 ${
                        userVote === "down"
                          ? "bg-red-700 cursor-not-allowed opacity-70"
                          : isVoting
                          ? "bg-red-500 cursor-wait opacity-80"
                          : "bg-red-600 hover:bg-red-700"
                      } text-white font-medium py-2 px-5 rounded-lg transition shadow-sm`}
                      onMouseEnter={() =>
                        userVote === "down" && setShowTooltip("down")
                      }
                      onMouseLeave={() => setShowTooltip(null)}
                    >
                      <span className="text-lg">👎</span>
                      {userVote === "down" ? "Downvoted" : "Downvote"}
                    </button>

                    {/* Downvote tooltip */}
                    {showTooltip === "down" && (
                      <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-black/80 text-white text-xs py-1 px-2 rounded whitespace-nowrap z-10">
                        You already downvoted
                        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 rotate-45 w-2 h-2 bg-black/80"></div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Other Politicians Section */}
      <div className="max-w-7xl mx-auto mt-12 px-4">
        <div className="flex items-center justify-center mb-8">
          <h2 className="text-white text-3xl font-bold">Other Leaders</h2>
        </div>

        <PoliticianGrid politicians={politicians} />
      </div>
    </div>
  );
}

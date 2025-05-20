import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { downvote, upvote } from "../services/politicianService";

export default function Politician({ politician }) {
  const [userVote, setUserVote] = useState(null); // 'up', 'down', or null
  const [localVoteCounts, setLocalVoteCounts] = useState({
    upvotes: politician?.upvotes || 0,
    downvotes: politician?.downvotes || 0,
    total_votes: politician?.total_votes || 0,
  });
  const [isVoting, setIsVoting] = useState(false); // Track voting in progress
  const [imageError, setImageError] = useState(false);

  // On component mount, check if user has already voted for this politician
  useEffect(() => {
    if (!politician) return;

    // Get votes from localStorage
    const storedVotes = localStorage.getItem("politician_votes");
    const votesMap = storedVotes ? JSON.parse(storedVotes) : {};

    // Check if user has voted for this politician
    if (votesMap[politician.slug]) {
      setUserVote(votesMap[politician.slug]);
    } else {
      setUserVote(null);
    }

    // Initialize local vote counts
    setLocalVoteCounts({
      upvotes: politician.upvotes || 0,
      downvotes: politician.downvotes || 0,
      total_votes: politician.total_votes || 0,
    });
  }, [politician]);

  if (!politician) return null;

  // Save user vote to localStorage
  const saveVote = (voteType) => {
    const storedVotes = localStorage.getItem("politician_votes");
    const votesMap = storedVotes ? JSON.parse(storedVotes) : {};

    // Save or update the vote
    votesMap[politician.slug] = voteType;

    // Store back to localStorage
    localStorage.setItem("politician_votes", JSON.stringify(votesMap));

    // Update state
    setUserVote(voteType);
  };

  const handleUpVote = async () => {
    // Prevent multiple votes or voting while a request is in progress
    if (userVote === "up" || isVoting) {
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
      const updateData = await upvote(politician.slug);
      saveVote("up");
    } catch (error) {
      // Revert optimistic update on error
      setUserVote(userVote);
      setLocalVoteCounts({
        upvotes: politician.upvotes || 0,
        downvotes: politician.downvotes || 0,
        total_votes: politician.total_votes || 0,
      });
    } finally {
      setIsVoting(false);
    }
  };

  const handleDownVote = async () => {
    // Prevent multiple votes or voting while a request is in progress
    if (userVote === "down" || isVoting) {
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
      const updateData = await downvote(politician.slug);

      // Save vote to localStorage
      saveVote("down");
    } catch (error) {
      // Revert optimistic update on error
      setUserVote(userVote);
      setLocalVoteCounts({
        upvotes: politician.upvotes || 0,
        downvotes: politician.downvotes || 0,
        total_votes: politician.total_votes || 0,
      });
    } finally {
      setIsVoting(false);
    }
  };

  // Generate initials as fallback
  const getInitials = () => {
    return politician.full_name
      .split(" ")
      .map((name) => name.charAt(0))
      .join("")
      .substring(0, 2)
      .toUpperCase();
  };

  return (
    <div className="max-w-4xl mx-auto w-full flex flex-col justify-between bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
      <div>
        {/* Clickable Image & Overlay */}
        <Link to={`/politicians/${politician.slug}`}>
          <div className="relative h-96 cursor-pointer bg-gray-100">
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
                <span className="text-7xl font-bold text-gray-400">
                  {getInitials()}
                </span>
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
            <div className="absolute bottom-0 w-full p-6 text-white">
              <h2 className="text-3xl font-bold tracking-tight">
                {politician.full_name}
              </h2>
              <div className="flex items-center mt-1">
                <span className="px-2 py-1 bg-blue-600/70 text-xs font-medium rounded-full">
                  {politician.party}
                </span>
                <span className="mx-2 text-gray-300">•</span>
                <span className="text-sm">{politician.position}</span>
              </div>
              <p className="text-xs mt-2 text-gray-300">
                Region: <span className="font-medium">{politician.region}</span>
              </p>
            </div>
          </div>
        </Link>

        {/* About Section */}
        <div className="p-6">
          <p className="text-gray-700 text-base leading-relaxed">
            {politician.about ||
              "No information available about this politician."}
          </p>

          {/* Stats */}
          <div className="mt-8 flex justify-between px-4 py-3 rounded-xl">
            <div className="text-center">
              <p className="text-xl font-bold text-green-600">
                {localVoteCounts.upvotes}
              </p>
              <p className="text-xs text-gray-500 font-medium">Upvotes</p>
            </div>
            <div className="text-center">
              <p className="text-xl font-bold text-red-600">
                {localVoteCounts.downvotes}
              </p>
              <p className="text-xs text-gray-500 font-medium">Downvotes</p>
            </div>
            <div className="text-center">
              <p className="text-xl font-bold text-blue-600">
                {localVoteCounts.total_votes}
              </p>
              <p className="text-xs text-gray-500 font-medium">Total Votes</p>
            </div>
          </div>
        </div>
      </div>

      {/* Approval Rating Bar */}
      {localVoteCounts.total_votes > 0 && (
        <div className="px-6 pb-4">
          <div className="flex justify-between text-sm mb-1">
            <span className="text-green-600 font-medium">
              Approval:{" "}
              {Math.round(
                (localVoteCounts.upvotes / localVoteCounts.total_votes) * 100
              )}
              %
            </span>
          </div>
          <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-green-500 rounded-full transition-all duration-300"
              style={{
                width: `${Math.round(
                  (localVoteCounts.upvotes / localVoteCounts.total_votes) * 100
                )}%`,
              }}
            ></div>
          </div>
        </div>
      )}

      {/* Vote Buttons */}
      <div className="px-6 pb-6">
        <div className="flex justify-center gap-4">
          <button
            onClick={handleUpVote}
            disabled={userVote === "up" || isVoting}
            className={`flex items-center gap-2 ${
              userVote === "up"
                ? "bg-green-700 cursor-not-allowed opacity-70"
                : isVoting
                ? "bg-green-500 cursor-wait opacity-80"
                : "bg-green-600 hover:bg-green-700"
            } text-white font-medium py-3 px-6 rounded-lg transition shadow-sm relative`}
          >
            <span className="text-lg">👍</span>
            {userVote === "up" ? "Upvoted" : "Upvote"}

            {/* Tooltip for upvoted state */}
            {userVote === "up" && (
              <span className="absolute -top-9 left-1/2 transform -translate-x-1/2 bg-black/80 text-white text-xs py-1 px-2 rounded whitespace-nowrap">
                You already upvoted
              </span>
            )}
          </button>

          <button
            onClick={handleDownVote}
            disabled={userVote === "down" || isVoting}
            className={`flex items-center gap-2 ${
              userVote === "down"
                ? "bg-red-700 cursor-not-allowed opacity-70"
                : isVoting
                ? "bg-red-500 cursor-wait opacity-80"
                : "bg-red-600 hover:bg-red-700"
            } text-white font-medium py-3 px-6 rounded-lg transition shadow-sm relative`}
          >
            <span className="text-lg">👎</span>
            {userVote === "down" ? "Downvoted" : "Downvote"}

            {/* Tooltip for downvoted state */}
            {userVote === "down" && (
              <span className="absolute -top-9 left-1/2 transform -translate-x-1/2 bg-black/80 text-white text-xs py-1 px-2 rounded whitespace-nowrap">
                You already downvoted
              </span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

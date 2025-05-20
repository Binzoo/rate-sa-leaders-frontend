import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { downvote, upvote } from "../services/politicianService";

export default function PoliticianProfile({ politician }) {
  const [showMore, setShowMore] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [userVote, setUserVote] = useState(null);
  const [localVoteCounts, setLocalVoteCounts] = useState({
    upvotes: politician?.upvotes || 0,
    downvotes: politician?.downvotes || 0,
    total_votes: politician?.total_votes || 0,
  });
  const [isVoting, setIsVoting] = useState(false);

  useEffect(() => {
    if (!politician) return;

    const storedVotes = localStorage.getItem("politician_votes");
    const votesMap = storedVotes ? JSON.parse(storedVotes) : {};

    if (votesMap[politician.slug]) {
      setUserVote(votesMap[politician.slug]);
    } else {
      setUserVote(null);
    }

    setLocalVoteCounts({
      upvotes: politician.upvotes || 0,
      downvotes: politician.downvotes || 0,
      total_votes: politician.total_votes || 0,
    });
  }, [politician]);

  if (!politician) return null;
  const saveVote = (voteType) => {
    const storedVotes = localStorage.getItem("politician_votes");
    const votesMap = storedVotes ? JSON.parse(storedVotes) : {};

    votesMap[politician.slug] = voteType;

    localStorage.setItem("politician_votes", JSON.stringify(votesMap));

    setUserVote(voteType);
  };

  const handleUpVote = async () => {
    if (userVote === "up" || isVoting) {
      return;
    }

    try {
      setIsVoting(true);

      const previousVote = userVote;

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
    if (userVote === "down" || isVoting) {
      return;
    }

    try {
      setIsVoting(true);

      const previousVote = userVote;

      setUserVote("down");
      setLocalVoteCounts((prev) => ({
        upvotes: previousVote === "up" ? prev.upvotes - 1 : prev.upvotes,
        downvotes: prev.downvotes + 1,
        total_votes:
          previousVote === null ? prev.total_votes + 1 : prev.total_votes,
      }));

      const updateData = await downvote(politician.slug);

      saveVote("down");
    } catch (error) {
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

  const getInitials = () => {
    return politician.full_name
      .split(" ")
      .map((name) => name.charAt(0))
      .join("")
      .substring(0, 2)
      .toUpperCase();
  };

  return (
    <div className="max-w-md w-full h-[620px] flex flex-col justify-between bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
      <div>
        {/* Clickable Image & Overlay */}
        <Link to={`/politicians/${politician.slug}`}>
          <div className="relative h-72 cursor-pointer bg-gray-100">
            {!imageError && politician.image_url ? (
              <div className="w-full h-full flex items-center justify-center overflow-hidden">
                {/* Fixed position approach to ensure face is visible */}
                <img
                  src={politician.image_url}
                  alt={politician.full_name}
                  className="w-full h-full object-contain"
                  onError={() => setImageError(true)}
                  loading="lazy"
                />
              </div>
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-200">
                <span className="text-5xl font-bold text-gray-400">
                  {getInitials()}
                </span>
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
            <div className="absolute bottom-0 w-full p-6 text-white">
              <h2 className="text-2xl font-bold tracking-tight">
                {politician.full_name}
              </h2>
              <div className="flex items-center mt-1 flex-wrap">
                <span className="px-2 py-1 bg-blue-600/70 text-xs font-medium rounded-full">
                  {politician.party}
                </span>
                <span className="mx-2 text-gray-300">•</span>
                <span className="text-sm truncate max-w-[200px]">
                  {politician.position}
                </span>
              </div>
              <p className="text-xs mt-2 text-gray-300">
                Region: <span className="font-medium">{politician.region}</span>
              </p>
            </div>
          </div>
        </Link>

        {/* About Section */}
        <div className="p-6">
          <div className="relative">
            <p
              className={`text-gray-700 text-sm leading-relaxed transition-all ${
                showMore ? "" : "line-clamp-3"
              }`}
            >
              {politician.about ||
                "No information available about this politician."}
            </p>

            {!showMore && politician.about && politician.about.length > 120 && (
              <div className="absolute bottom-0 left-0 w-full h-6 bg-gradient-to-t from-white to-transparent"></div>
            )}

            {politician.about && politician.about.length > 120 && (
              <button
                onClick={() => setShowMore(!showMore)}
                className="mt-2 text-sm text-blue-600 hover:underline font-medium"
              >
                {showMore ? "Show less" : "Show more"}
              </button>
            )}
          </div>

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
            } text-white font-medium py-2 px-5 rounded-lg transition shadow-sm relative`}
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
            } text-white font-medium py-2 px-5 rounded-lg transition shadow-sm relative`}
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

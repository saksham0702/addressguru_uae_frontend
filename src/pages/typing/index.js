import React, { useState, useEffect, useRef } from "react";
import { RotateCcw, Award, Target, Clock, Zap } from "lucide-react";
import { get_all_jobs_listings } from "@/api/listings";
import {
  getSectionSitemap,
  getSectionTypeSitemap,
  getSitemap,
} from "@/api/sitemap";
import { get_job_categories } from "@/api/postAds";
import { get_job_filter } from "@/api/filter";
import {
  get_marketplace_by_id,
  get_marketplace_listing,
} from "@/api/showlistings";

const TypingTester = () => {
  const paragraphs = [
    "The quick brown fox jumps over the lazy dog near the riverbank. Every morning, the sun rises with a golden glow that spreads across the vast horizon, painting the sky in shades of orange and pink.",
    "Technology has revolutionized the way we communicate and interact with the world around us. From smartphones to artificial intelligence, innovation continues to shape our daily lives in unprecedented ways that were once considered science fiction.",
    "Mountains stand tall against the azure sky, their peaks covered in pristine white snow. The valleys below echo with the sounds of rushing streams and chirping birds, creating a symphony of natural beauty that captivates every visitor.",
    "Learning new skills requires dedication, practice, and patience. Whether mastering a musical instrument or acquiring a new language, consistent effort over time leads to remarkable improvements that transform beginners into experts.",
    "The ocean's waves crash against the sandy shore with rhythmic precision. Seagulls soar overhead while children build sandcastles, their laughter mixing with the salty breeze that carries the essence of summer adventure and endless possibilities.",
  ];

  const [currentParagraph, setCurrentParagraph] = useState("");
  const [userInput, setUserInput] = useState("");
  const [timeLeft, setTimeLeft] = useState(60);
  const [isActive, setIsActive] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [wpm, setWpm] = useState(0);
  const [accuracy, setAccuracy] = useState(100);
  const [correctChars, setCorrectChars] = useState(0);
  const [totalChars, setTotalChars] = useState(0);
  const inputRef = useRef(null);

  useEffect(() => {
    selectRandomParagraph();
  }, []);

  useEffect(() => {
    // const fetchJobsCategories = async () => {
    //   const res = await get_job_categories();
    //   console.log("response jobs categories", res);
    // };

    // const fetchJobFilter = async () => {
    //   const res = await get_job_filter();
    //   console.log("response job filter", res);
    // };

    // const fetchSitemap = async () => {
    //   const res = await getSitemap();
    //   console.log("response sitemap", res);
    // };

    // const fetchSectionSitemap = async () => {
    //   const res = await getSectionSitemap("jobs");
    //   console.log("response section sitemap", res);
    // };

    // const fetchSectionTypeSitemap = async () => {
    //   const res = await getSectionTypeSitemap("listing", "category");
    //   console.log("response section type sitemap", res);
    // };

    const fetchMarketplaceListings = async () => {
      const res = await get_marketplace_listing();
      console.log("response marketplace listings", res);
    };

    const fetchMarketplaceById = async () => {
      const res = await get_marketplace_by_id(13);
      console.log("response marketplace by id", res);
    };
    // fetchJobsCategories();
    // fetchSitemap();
    // fetchSectionSitemap();
    // fetchSectionTypeSitemap();
    // fetchJobFilter();
    fetchMarketplaceListings();
    fetchMarketplaceById(13);
  }, []);

  useEffect(() => {
    let interval = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((time) => time - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      finishTest();
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  const selectRandomParagraph = () => {
    const randomIndex = Math.floor(Math.random() * paragraphs.length);
    setCurrentParagraph(paragraphs[randomIndex]);
  };

  const handleInputChange = (e) => {
    const value = e.target.value;

    if (!isActive && value.length > 0) {
      setIsActive(true);
    }

    setUserInput(value);

    // Calculate accuracy in real-time
    let correct = 0;
    for (let i = 0; i < value.length; i++) {
      if (value[i] === currentParagraph[i]) {
        correct++;
      }
    }
    setCorrectChars(correct);
    setTotalChars(value.length);

    if (value.length > 0) {
      const acc = (correct / value.length) * 100;
      setAccuracy(Math.round(acc));
    }

    // Calculate WPM
    const timeElapsed = (60 - timeLeft) / 60;
    if (timeElapsed > 0) {
      const wordsTyped = value.trim().split(/\s+/).length;
      const currentWpm = Math.round(wordsTyped / timeElapsed);
      setWpm(currentWpm);
    }
  };

  const finishTest = () => {
    setIsActive(false);
    setIsFinished(true);

    // Final calculations
    const wordsTyped = userInput.trim().split(/\s+/).length;
    const finalWpm = Math.round(wordsTyped);
    setWpm(finalWpm);
  };

  const resetTest = () => {
    selectRandomParagraph();
    setUserInput("");
    setTimeLeft(60);
    setIsActive(false);
    setIsFinished(false);
    setWpm(0);
    setAccuracy(100);
    setCorrectChars(0);
    setTotalChars(0);
    inputRef.current?.focus();
  };

  const getCharColor = (index) => {
    if (index >= userInput.length) return "text-gray-400";
    return userInput[index] === currentParagraph[index]
      ? "text-green-600"
      : "text-red-500";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-indigo-900 mb-2 flex items-center justify-center gap-3">
            <Zap className="text-yellow-500" size={48} />
            Typing Speed Test
          </h1>
          <p className="text-gray-600 text-lg">
            Test your typing speed and accuracy!
          </p>
        </div>

        {/* Typing Area */}
        <div className="bg-white rounded-xl shadow-2xl  p-3 ">
          {/* Stats Bar */}
          <div className="grid grid-cols-3 gap-2  max-w-sm   max-h-20 ">
            <div className="bg-white w-30 h-25 rounded-xl shadow-lg p-3 text-center border-t-4  border-blue-500">
              <Clock className="mx-auto mb-1 text-blue-500" size={20} />
              <p className="text-gray-600 text-sm font-medium">Time Left</p>
              <p className="text-xl font-bold text-gray-800">{timeLeft}s</p>
            </div>
            <div className="bg-white w-30 h-25 rounded-xl shadow-lg p-3 text-center border-t-4 border-green-500">
              <Zap className="mx-auto mb-1 text-green-500" size={20} />
              <p className="text-gray-600 text-sm font-medium">WPM</p>
              <p className="text-xl font-bold text-gray-800">{wpm}</p>
            </div>
            <div className="bg-white w-30 h-25 rounded-xl shadow-lg p-3 text-center border-t-4 border-purple-500">
              <Target className="mx-auto mb-1 text-purple-500" size={20} />
              <p className="text-gray-600 text-sm font-medium">Accuracy</p>
              <p className="text-xl font-bold text-gray-800">{accuracy}%</p>
            </div>
          </div>
          {/* Reference Text */}
          <div className="mb-6 p-6 bg-gray-50 rounded-lg border-2 border-gray-200">
            <p className="text-xl leading-relaxed font-mono">
              {currentParagraph.split("").map((char, index) => (
                <span key={index} className={getCharColor(index)}>
                  {char}
                </span>
              ))}
            </p>
          </div>

          {/* Input Area */}
          <textarea
            ref={inputRef}
            value={userInput}
            onChange={handleInputChange}
            disabled={isFinished || timeLeft === 0}
            placeholder="Start typing here..."
            className="w-full h-40 p-4 text-xl font-mono border-2 border-indigo-300 rounded-lg focus:outline-none focus:ring-4 focus:ring-indigo-200 focus:border-indigo-500 resize-none disabled:bg-gray-100 disabled:cursor-not-allowed"
            autoFocus
          />

          {/* Progress Bar */}
          <section className="flex justify-between gap-5  items-center">
            <div className="mt-4 w-full">
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>Progress</span>
                <span>
                  {Math.min(
                    100,
                    Math.round(
                      (userInput.length / currentParagraph.length) * 100,
                    ),
                  )}
                  %
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-gradient-to-r from-indigo-500 to-purple-600 h-3 rounded-full transition-all duration-300"
                  style={{
                    width: `${Math.min(
                      100,
                      (userInput.length / currentParagraph.length) * 100,
                    )}%`,
                  }}
                ></div>
              </div>
            </div>

            {/* Try Again Button */}
            <div className="text-center whitespace-nowrap">
              <button
                onClick={resetTest}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 px-8 rounded-xl shadow-lg transform transition hover:scale-105 active:scale-95 flex items-center gap-3 mx-auto"
              >
                <RotateCcw size={24} />
                Try Again
              </button>
            </div>
          </section>
        </div>

        {/* Results & Controls */}
        {isFinished && (
          <div className="bg-gradient-to-r from-green-400 to-blue-500 rounded-xl shadow-2xl p-8 text-white text-center mb-6">
            <Award className="mx-auto mb-4" size={64} />
            <h2 className="text-3xl font-bold mb-4">Test Complete!</h2>
            <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
              <div className="bg-white bg-opacity-20 text-black rounded-lg p-4">
                <p className="text-sm  opacity-90">Final WPM</p>
                <p className="text-4xl font-bold">{wpm}</p>
              </div>
              <div className="bg-white bg-opacity-20 text-black rounded-lg p-4">
                <p className="text-sm opacity-90">Accuracy</p>
                <p className="text-4xl font-bold">{accuracy}%</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TypingTester;

import React, { useEffect, useState } from "react";
import InputWithTitle from "../InputWithTitle";
import axios from "axios";
import { GEMINI_KEY } from "@/services/constants";

const SearchEngine = ({ seo, setSeo, business, error, clearError, refs }) => {
  //                                                   ^^^^^^^^^^^^^^^^^^^^^ ADD THESE PROPS
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [availableModels, setAvailableModels] = useState([]);
  const [checkingModels, setCheckingModels] = useState(true);

  // Fetch available AI models
  useEffect(() => {
    const fetchAvailableModels = async () => {
      setCheckingModels(true);
      try {
        if (!GEMINI_KEY) {
          console.error("❌ GEMINI_KEY is not set");
          setCheckingModels(false);
          return;
        }

        console.log("🔍 Fetching available models from API...");

        const response = await axios.get(
          `https://generativelanguage.googleapis.com/v1beta/models?key=${GEMINI_KEY}`
        );

        if (response.data && response.data.models) {
          const generateModels = response.data.models
            .filter((model) =>
              model.supportedGenerationMethods?.includes("generateContent")
            )
            .map((model) => model.name.replace("models/", ""));

          console.log("✅ Available models:", generateModels);
          setAvailableModels(generateModels);
        }
      } catch (error) {
        console.error("❌ Error fetching models:", error);
      } finally {
        setCheckingModels(false);
      }
    };

    fetchAvailableModels();
  }, []);

  // Set default meta title when business name is available
  useEffect(() => {
    if (business?.name && !seo.title) {
      setSeo((prev) => ({
        ...prev,
        title: business.name,
      }));
    }
  }, [business?.name, seo.title, setSeo]);

  // Generic handler for updating SEO state
  const handleChange = (field, value, errorKey) => {
    // ADD errorKey parameter
    setSeo((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Clear error when user starts typing
    if (clearError && errorKey) {
      clearError(errorKey);
    }
  };

  // Check if we can generate (need business name and description)
  const canGenerate = business?.name?.trim() && business?.description?.trim();

  // Generate SEO meta description using AI
  const generateMetaDescription = async () => {
    if (!canGenerate) {
      alert("Please complete business name and description in Step 1 first");
      return;
    }

    if (availableModels.length === 0) {
      alert(
        "No compatible Gemini models found. Please check your API key at https://aistudio.google.com/app/apikey"
      );
      return;
    }

    setLoading(true);
    setErrorMsg("");

    // Try each available model
    for (const modelName of availableModels) {
      try {
        const prompt = `Write an SEO-optimized meta description for a business listing. 

Business Name: "${business.name}"
Business Description: "${business.description}"
${business.address ? `Location: "${business.address}"` : ""}

Requirements:
- Length: 150-160 characters (strict limit)
- Include primary keywords naturally
- Compelling and action-oriented
- Highlight unique value proposition
- No emojis, icons, or special characters
- Use clear, engaging language
- Focus on what makes this business stand out

Provide ONLY the meta description text, nothing else.`;

        console.log(`🔑 Generating meta description with model: ${modelName}`);

        const response = await axios.post(
          `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${GEMINI_KEY}`,
          {
            contents: [
              {
                parts: [
                  {
                    text: prompt,
                  },
                ],
              },
            ],
            generationConfig: {
              temperature: 0.7,
              maxOutputTokens: 200,
            },
          }
        );

        const generatedText =
          response.data?.candidates?.[0]?.content?.parts?.[0]?.text;

        if (generatedText) {
          // Remove any icons, emojis, or special characters
          const cleanText = generatedText
            .replace(/[\u{1F300}-\u{1F9FF}]/gu, "") // Remove emojis
            .replace(/[✨🎉🌟⭐💫🔥👍✓✔️❤️]/g, "") // Remove common icons
            .trim();

          // Truncate to 160 characters if needed
          const finalText =
            cleanText.length > 160
              ? cleanText.substring(0, 157) + "..."
              : cleanText;

          handleChange("description", finalText, "seoDescription"); // ADD errorKey
          console.log(
            "✨ Meta description generated successfully with",
            modelName
          );
          setLoading(false);
          return; // Success!
        }
      } catch (error) {
        console.log(`❌ Failed with ${modelName}:`, error.message);
        continue; // Try next model
      }
    }

    // All models failed
    setLoading(false);
    const userMessage =
      "Failed to generate meta description with all available models. Please try again later.";
    setErrorMsg(userMessage);
    alert(userMessage);
  };

  return (
    <section className="space-y-4">
      <h3 className="text-xl font-semibold my-10 uppercase text-gray-800">
        SEO Friendly Keywords
      </h3>

      {/* Meta Title - wrapped with ref */}
      <div ref={refs?.seoTitleRef}>
        <InputWithTitle
          required={true}
          error={error?.seoTitle}
          title="Meta Title"
          isTextarea={false}
          placeholder="Enter Meta Title"
          value={seo.title || business?.name || ""}
          onChange={(e) => handleChange("title", e.target.value, "seoTitle")}
          //                                                       ^^^^^^^^^^ ADD errorKey
        />
      </div>

      {/* Meta Description with AI Generation - wrapped with ref */}
      <div ref={refs?.seoDescriptionRef}>
        <div className="flex items-center justify-between mb-2">
          <span className="flex items-center gap-1">
            <h3 className="text-[#696969] 2xl:text-lg relative capitalize font-semibold">
              Meta Description
              <span className="text-red-600 ml-1">&#42;</span>
            </h3>
            {error?.seoDescription && (
              <p className="text-red-500 text-sm ml-2">
                {error?.seoDescription}
              </p>
            )}
          </span>

          {/* Model Status Indicator */}
          <div className="flex items-center gap-2">
            {checkingModels && (
              <span className="text-xs text-gray-500 flex items-center gap-1">
                <div className="w-3 h-3 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                Checking AI...
              </span>
            )}
            {!checkingModels && availableModels.length > 0 && (
              <span className="text-xs text-green-600 flex items-center gap-1 bg-green-50 px-2 py-1 rounded">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                AI Ready
              </span>
            )}
            {!checkingModels && availableModels.length === 0 && (
              <span className="text-xs text-red-600 flex items-center gap-1 bg-red-50 px-2 py-1 rounded">
                <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                AI Unavailable
              </span>
            )}
          </div>
        </div>

        {/* Error Message */}
        {!checkingModels && availableModels.length === 0 && (
          <div className="mb-3 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            <p className="font-semibold">AI Generation Not Available</p>
            <p className="mt-1">
              Please check your API key at{" "}
              <a
                href="https://aistudio.google.com/app/apikey"
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-red-800"
              >
                Google AI Studio
              </a>
            </p>
          </div>
        )}

        {loading && (
          <div className="mb-3 p-4 bg-blue-50 border border-blue-200 rounded-lg flex items-center justify-center gap-3">
            <div className="w-5 h-5 border-3 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-blue-700 font-medium">
              Generating SEO description...
            </span>
          </div>
        )}

        {errorMsg && (
          <div className="mb-3 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            {errorMsg}
          </div>
        )}

        <div className="relative">
          <textarea
            className="w-full border border-gray-200 p-2 pr-32 rounded-md resize-none focus:ring-2 focus:ring-blue-400 focus:outline-none"
            rows={4}
            placeholder="Enter meta description or generate using AI (150-160 characters)"
            value={seo.description || ""}
            onChange={(e) =>
              handleChange("description", e.target.value, "seoDescription")
            }
            //                                                             ^^^^^^^^^^^^^^^^ ADD errorKey
            maxLength={160}
          />
          <button
            onClick={generateMetaDescription}
            disabled={!canGenerate || loading || availableModels.length === 0}
            className="absolute top-2 right-2 px-3 py-1.5 text-xs rounded-md bg-blue-500 text-white hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
            title={
              availableModels.length === 0
                ? "AI model not available"
                : !canGenerate
                ? "Complete business information in Step 1 first"
                : "Generate SEO meta description"
            }
          >
            {loading ? "Generating..." : "Generate AI"}
          </button>
          <div className="text-xs text-gray-500 mt-1 text-right">
            {seo.description?.length || 0} / 160 characters
          </div>
        </div>
      </div>
    </section>
  );
};

export default SearchEngine;

import { useState } from "react";
import Head from "next/head";

export default function Home() {
  const [comicText, setComicText] = useState(Array(10).fill(""));
  const [comicImages, setComicImages] = useState(Array(10).fill(""));
  const [loading, setLoading] = useState(false);

  const handleTextChange = (index, value) => {
    const newText = [...comicText];
    newText[index] = value;
    setComicText(newText);
  };

  const generateComic = async () => {
    setLoading(true);

    // Replace these with your actual API key and endpoint
    const apiKey = process.env.NEXT_PUBLIC_API_KEY;
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;

    const images = await Promise.all(
      comicText.map(async (text) => {
        const startTime = new Date();
        const response = await fetch(apiUrl, {
          headers: {
            Accept: "image/png",
            Authorization: `Bearer ${apiKey}`,
            "Content-Type": "application/json",
          },
          method: "POST",
          body: JSON.stringify({ inputs: text }),
        });
        const imageUrl = URL.createObjectURL(await response.blob());
        const endTime = new Date();
        console.log(imageUrl, `Time Required: ${endTime - startTime}`);
        return imageUrl;
      })
    );

    // Display the generated comic images
    setComicImages(images);
    setLoading(false);
  };

  return (
    <div className="container mx-auto p-4 bg-dark text-light">
      <Head>
        <title>Comic Generator</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <h1 className="text-3xl font-bold mb-8">Comic Generator</h1>

      <form className="mb-8 grid grid-cols-1 gap-4">
        {comicText.map((text, index) => (
          <div key={index} className="mb-4">
            <label className="block text-sm font-semibold text-gray-300">
              Panel {index + 1}
            </label>
            <input
              type="text"
              className="mt-1 p-2 border border-gray-600 rounded w-full bg-gray-700 text-gray-200"
              value={text}
              onChange={(e) => handleTextChange(index, e.target.value)}
            />
          </div>
        ))}
        <button
          type="button"
          onClick={generateComic}
          className="bg-blue-600 text-white p-3 rounded-full col-span-2 mx-auto"
          disabled={loading || comicText.filter((item) => item).length <= 0}
        >
          {loading ? "Generating Comic..." : "Generate"}
        </button>
      </form>

      {comicImages.filter((item) => item).length > 0 && (
        <div>
          <h2 className="text-xl font-bold mb-4">Generated Comic:</h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {comicImages?.map((image, index) => (
              <img
                key={index}
                src={image}
                alt={`Comic Panel ${index + 1}`}
                className="mb-4 w-full h-auto"
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

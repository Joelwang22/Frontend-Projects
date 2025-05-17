import axios from "axios";
import * as fs from "fs";
import "dotenv/config";          // loads PLACES_API_KEY

const key = process.env.PLACES_API_KEY;
const url = `https://places.googleapis.com/v1/places:searchNearby?key=${key}`;

(async () => {
  try {
    const { data } = await axios.post(
      url,
      {
        includedTypes: ["restaurant"],
        maxResultCount: 5,
        locationRestriction: {
          circle: {
            center: { latitude: 1.2839, longitude: 103.8515 }, // Raffles Place
            radius: 1500,
          },
        },
      },
      {
        headers: {
          "Content-Type": "application/json",
          /** Only the five fields you asked for */
          "X-Goog-FieldMask":
            "places.id,places.displayName,places.formattedAddress,places.rating,places.photos",
        },
      }
    );

    console.log("✅ Got", data.places.length, "places");
    console.log("First place sample:", data.places[0]);
    fs.writeFileSync("places-nearby.json", JSON.stringify(data, null, 2));
  } catch (e) {
    console.error("❌ API error", e.response?.data || e.message);
  }
})();
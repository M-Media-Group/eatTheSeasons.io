// Get the translated string using fetch()

import { Country } from "./types/foodItem";

export async function getTranslatedString(
  string: string,
  language: Country
): Promise<string> {
  const url = `https://api.funtranslations.com/translate/shakespeare.json?text=${string}&to=${language}`;
  const response = await fetch(url);
  const data = await response.json();
  return data.contents.translated;
}

export async function getBestImageUrl(foodItemName: string) {
  const searchEndpoint = `https://www.pngplay.com/wp-json/wp/v2/search?search=
    ${foodItemName}&type=post&per_page=100`;
  const response = await fetch(searchEndpoint);
  const data = await response.json();

  let finalImageUrl = "";
  // If the title in the searchResults contains the name, then get the first result
  const searchResults = data.filter(
    (searchResult: { title: string }) =>
      !searchResult.title.toLowerCase().includes("juice") &&
      searchResult.title.toLowerCase().includes(foodItemName.toLowerCase())
  );
  if (searchResults.length > 0) {
    // return searchResults[0];
    // Loop for each searchResults
    for (let i = 0; i < searchResults.length; i++) {
      const result = searchResults[i];

      const imagePostUrl = result._links.self[0].href;
      const imagePostResponse = await fetch(imagePostUrl);
      const imagePostData = await imagePostResponse.json();
      // console.log('imagePostData', imagePostData);
      const imageId = imagePostData.featured_media;
      const imageData = await fetch(
        "https://www.pngplay.com/wp-json/wp/v2/media/" + imageId
      );
      const imageDataJson = await imageData.json();
      console.log("imagePostData2", imageDataJson);
      const imageUrl = imageDataJson.guid.rendered;
      finalImageUrl = imageUrl;
      break;
    }
  }
  return finalImageUrl;
}

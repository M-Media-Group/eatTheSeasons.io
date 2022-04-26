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

export function updateIndexedDB(table: string, event: any) {
  const db = event.target.result;
  console.log("upgrade", db);
  const objectStore = db.createObjectStore(table, {
    keyPath: "eaten_id",
  });
  objectStore.createIndex("eaten_id", "eaten_id", { unique: true });
  objectStore.createIndex("food_id", "food_id", { unique: false });
  objectStore.createIndex("grams", "grams", { unique: false });
  objectStore.createIndex("date", "date", { unique: false });
}

export function addToIndexedDB(
  value: {
    eaten_id: number;
    food_id: number;
    grams: number;
    date: Date;
  },
  table = "eatenFoodItems",
  dbName = "foodie"
) {
  console.log("addToIndexedDB", value);
  // Add record to indexeddb
  if (!window.indexedDB) {
    console.log(
      "Your browser doesn't support a stable version of IndexedDB. Such and such feature will not be available."
    );
  }
  const request = window.indexedDB.open(dbName, 3);
  request.onerror = function (event) {
    console.log("error: ");
  };
  request.onupgradeneeded = function (event: any) {
    updateIndexedDB(table, event);
  };
  request.onsuccess = function (event: any) {
    const db = request.result;
    console.log("add", db);
    const tx = db.transaction(table, "readwrite");
    const store = tx.objectStore(table);
    const data = {
      eaten_id: value.eaten_id,
      food_id: value.food_id,
      grams: value.grams,
      date: new Date().toISOString(),
    };
    store.put(data);
  };
}

export function getFromIndexedDB(
  table = "eatenFoodItems",
  dbName = "foodie"
): Promise<any> {
  return new Promise((resolve, reject) => {
    if (!window.indexedDB) {
      console.log(
        "Your browser doesn't support a stable version of IndexedDB. Such and such feature will not be available."
      );
    }
    const request = window.indexedDB.open(dbName, 3);
    request.onerror = function (event) {
      console.log("error: ");
    };

    request.onupgradeneeded = function (event: any) {
      updateIndexedDB(table, event);
    };

    request.onsuccess = function (event: any) {
      const db = request.result;
      if (!request.result) {
        reject(new Error("No database found"));
      }
      const tx = db.transaction(table, "readwrite");
      const store = tx.objectStore(table);
      const data = store.getAll();
      data.onsuccess = function (event: any) {
        resolve(event.target.result);
      };
    };
  });
}

export function deleteFromIndexedDB(
  id: number,
  table = "eatenFoodItems",
  dbName = "foodie"
) {
  if (!window.indexedDB) {
    console.log(
      "Your browser doesn't support a stable version of IndexedDB. Such and such feature will not be available."
    );
  }
  const request = window.indexedDB.open(dbName, 3);
  request.onerror = function (event) {
    console.log("error: ");
  };
  request.onsuccess = function (event: any) {
    const db = request.result;
    if (!request.result) {
      console.log("No database found");
    }
    const tx = db.transaction(table, "readwrite");
    const store = tx.objectStore(table);
    store.delete(id);
  };
}

export function deleteAllIndexedDBs() {
  indexedDB.databases().then((dbs) => {
    const promises = dbs.map((db: any) => {
      return new Promise((resolve, reject) => {
        const req = indexedDB.deleteDatabase(db.Name);
        req.onsuccess = resolve;
        req.onerror = reject;
        req.onblocked = reject;
      });
    });
    Promise.all(promises).then(console.log).catch(console.error);
  });
}

// export function deleteIndexedDBTable() {
//   if (!window.indexedDB) {
//     console.log(
//       "Your browser doesn't support a stable version of IndexedDB. Such and such feature will not be available."
//     );
//   }
//   const request = window.indexedDB.open("foodie", 3);
//   request.onerror = function (event) {
//     console.log("error: ");
//   };
//   request.onsuccess = function (event: any) {
//     const db = request.result;
//     if (!request.result) {
//       console.log("No database found");
//     }
//     const tx = db.transaction("eatenFoodItems", "readwrite");
//     const store = tx.objectStore("eatenFoodItems");
//     store.clear();
//   };
// }

export function deleteIndexedDB(db = "foodie") {
  console.log("request to delete db", db);
  const DBDeleteRequest = window.indexedDB.deleteDatabase(db);

  DBDeleteRequest.onerror = function (event) {
    console.log("Error deleting database.");
  };

  DBDeleteRequest.onsuccess = function (event) {
    console.log("Database deleted successfully");

    console.log(event); // should be undefined
  };

  DBDeleteRequest.onblocked = function (event) {
    console.log("Database deletion blocked");
  };

  DBDeleteRequest.onupgradeneeded = function (event) {
    console.log("Database deletion upgrade needed");
  };
}

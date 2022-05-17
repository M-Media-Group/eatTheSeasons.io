// Get the translated string using fetch()

import { consumedItem } from "./types/consumedItem";
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

export async function getBestImageUrl(foodItemName: string): Promise<string> {
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
      // console.log("imagePostData2", imageDataJson);
      const imageUrl = imageDataJson.guid.rendered;
      finalImageUrl = imageUrl;
      break;
    }
  }
  return finalImageUrl;
}

export function addMinutes(time: string, minutes: number) {
  return new Date(new Date(time).getTime() + minutes * 60000).toTimeString();
}

export function updateIndexedDB(table: string, event: any) {
  const db = event.target.result;
  console.log("upgrade", db);
  const objectStore = db.createObjectStore(table, {
    keyPath: "id",
  });
  objectStore.createIndex("id", "id", { unique: true });
  objectStore.createIndex("name", "name", { unique: false });
  objectStore.createIndex("description", "description", {
    unique: false,
  });
  objectStore.createIndex("food_id", "food_id", { unique: false });
  objectStore.createIndex("grams", "grams", { unique: false });
  objectStore.createIndex("kcal", "kcal", { unique: false });
  objectStore.createIndex("water", "water", { unique: false });
  objectStore.createIndex("protein", "protein", { unique: false });
  objectStore.createIndex("carbohydrate", "carbohydrate", { unique: false });
  objectStore.createIndex("fat", "fat", { unique: false });
  objectStore.createIndex("fiber", "fiber", { unique: false });
  objectStore.createIndex("alcohol", "alcohol", { unique: false });
  objectStore.createIndex("created_at", "created_at", { unique: false });
  objectStore.createIndex("updated_at", "updated_at", { unique: false });
}

export function addToIndexedDB(
  value: consumedItem,
  table = "eatenFoodItems",
  dbName = "foodie"
) {
  console.log("addToIndexedDB", value);

  // Drop the foodItem from value
  delete value.foodItem;

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
    console.log("Store result", store, value);
    store.put(value);
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

export function debounce<T extends unknown[], U>(
  callback: (...args: T) => PromiseLike<U> | U,
  wait = 1400
): (...args: T) => Promise<U> {
  let timer: ReturnType<typeof setTimeout>;
  return (...args: T): Promise<U> => {
    clearTimeout(timer);
    return new Promise((resolve) => {
      timer = setTimeout(() => resolve(callback(...args)), wait);
    });
  };
}

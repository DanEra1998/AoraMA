import { Client, ID, Query, TablesDB } from "react-native-appwrite";

// make two functions
// track the searches made by a user
// NOTE: THE EXCLAMATION POINT AT ITS END TELLS TYPESCRIPT, WE KNOW VALUE IS THERE BECAUSE TYPESCRIPT CAN NOT KNOW OUR .ENV
const DATABASE_ID = process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID!;
const COLLECTION_ID = process.env.EXPO_PUBLIC_APPWRITE_COLLECTION_ID!;

// EXPO_PUBLIC_APPWRITE_ENDPOINT=https://sfo.cloud.appwrite.io/v1
const client = new Client()
  .setEndpoint(process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT!)
  .setProject(process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID!);

const tablesDB = new TablesDB(client);

export const updateSearchCount = async (query: string, movie: Movie) => {
  try {
    const result = await tablesDB.listRows({
      databaseId: DATABASE_ID,
      tableId: COLLECTION_ID,
      queries: [Query.equal("searchTerm", query)],
    });

    console.log(result);

    if (result.rows.length > 0) {
      const existingMovie = result.rows[0];

      await tablesDB.updateRow({
        databaseId: DATABASE_ID,
        tableId: COLLECTION_ID,
        rowId: existingMovie.$id,
        data: { count: existingMovie.count + 1 },
      });
    } else {
      await tablesDB.createRow({
        databaseId: DATABASE_ID,
        tableId: COLLECTION_ID,
        rowId: ID.unique(),
        data: {
          searchTerm: query,
          movie_id: movie.id,
          count: 1,
          title: movie.title,
          poster_url: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
        },
      });
    }
  } catch (error) {
    console.error(error);
    throw error;
  }
};

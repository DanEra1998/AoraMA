import MovieCard from "@/components/MovieCard";
import SearchBar from "@/components/SearchBar";
import { icons } from "@/constants/icons";
import { images } from "@/constants/images";
import { fetchMovies } from "@/services/api";
import useFetch from "@/services/useFetch";
import { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, Image, Text, View } from "react-native";

const Search = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const {
    data: movies,
    loading,
    error,
    refetch: loadMovies,
    reset,

    /////////continue here///////////
    /*
      You're passing a space as the query, so instead of hitting the discover endpoint
      (which returns popular movies), it's hitting the search endpoint with a blank search 
      — which returns nothing.
    */
  } = useFetch(() => fetchMovies({ query: searchQuery }), false);
  // March 17, 2025

  //////////////////////////////////////////////////
  /////////////// BEFORE DEBOUNCING,////////////////
  /////////////////////////////////////////////////
  /*
    before "debouncing", when you type, each letter is treated 
    like an independenct query call, which is expensive so to handle it
    we do something called debouncing
*/

  // useEffect(() => {
  //   const func = async () => {
  //     if (searchQuery.trim()) {
  //       await loadMovies();
  //     } else {
  //       reset();
  //     }
  //   };
  //   func();
  // }, [searchQuery]);

  //////////////////////////////////////////////////
  /////////////// AFTER DEBOUNCING,////////////////
  /////////////////////////////////////////////////
  /*
  Yes exactly. The fix is debouncing 
  you wait until the user stops typing for a short period (e.g. 500ms) before firing the API call.
  */

  useEffect(() => {
    const timeoutId = setTimeout(async () => {
      if (searchQuery.trim()) {
        await loadMovies();
      } else {
        reset();
      }
    }, 500);

    return () => clearTimeout(timeoutId);
    /* clearTimeout Purpose: 
      Think of it like a countdown. Every time you type a letter:

      A 500ms countdown starts
      If you type another letter before it finishes, clearTimeout cancels that countdown
      A fresh 500ms countdown starts

      Without clearTimeout, every keystroke would stack up its own timer and they'd all fire eventually 
      defeating the whole point of debouncing.
    */
  }, [searchQuery]);

  return (
    <View className="flex-1 bg-primary">
      <Image
        source={images.bg}
        className="flex-1 absolute w-full z-0"
        resizeMode="cover"
      />
      <FlatList
        data={movies}
        renderItem={({ item }) => <MovieCard {...item} />}
        keyExtractor={(item) => item.id.toString()}
        className="px-5"
        numColumns={3}
        columnWrapperStyle={{
          justifyContent: "center",
          gap: 16,
          marginVertical: 16,
        }}
        contentContainerStyle={{ paddingBottom: 100 }}
        ListHeaderComponent={
          <>
            <View className="w-full flex-row justify-center mt-20 items-center">
              <Image source={icons.logo} className="w-12 h-10" />
            </View>

            <View className="my-5">
              <SearchBar
                placeholder="Search movies ..."
                value={searchQuery}
                onChangeText={(text: string) => setSearchQuery(text)}
              />
            </View>
            {loading && (
              <ActivityIndicator
                size="large"
                color="#0000ff"
                className="my-3"
              />
            )}

            {error && (
              <Text className="text-red-500 px-5 my-4">
                Error: {error.message}
              </Text>
            )}

            {!loading && !error && searchQuery.trim() && movies?.length > 0 && (
              <Text className="text-xl text-white font-bold">
                Search Results for{" "}
                <Text className="text-darkAccent">{searchQuery}</Text>
              </Text>
            )}
          </>
        }
        ListEmptyComponent={
          !loading && !error ? (
            <View className="mt-10 px-5">
              <Text className="text-center text-gray-500 ">
                {searchQuery.trim() ? "no movies found " : "Search for a movie"}
              </Text>
            </View>
          ) : null
        }
      />
    </View>
  );
};

export default Search;

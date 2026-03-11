import SearchBar from "@/components/SearchBar";
import { icons } from "@/constants/icons";
import { images } from "@/constants/images";
import { fetchMovies } from "@/services/api";
import useFetch from "@/services/useFetch";
import { useRouter } from "expo-router";
import {
  ActivityIndicator,
  FlatList,
  Image,
  ScrollView,
  Text,
  View,
} from "react-native";

export default function HomeScreen() {
  // March 11,2025
  const router = useRouter();
  const {
    data: movies,
    loading: moviesLoading,
    error: moviesError,

    /////////continue here///////////
    /*
      You're passing a space as the query, so instead of hitting the discover endpoint
      (which returns popular movies), it's hitting the search endpoint with a blank search 
      — which returns nothing.
    */
  } = useFetch(() => fetchMovies({ query: "" }));

  // Feb 18, 2026, we end at 1:06:40
  return (
    <View className="flex-1 bg-primary">
      <Image source={images.bg} className="absolute w-full z-0" />
      <ScrollView
        className="flex-1 px-5"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ minHeight: "100%", paddingBottom: 10 }}
      >
        <Image
          source={icons.logo}
          className="w-12 h-10 mt-20 mb-5 mx-auto"
        ></Image>

        {moviesLoading ? (
          <ActivityIndicator
            size="large"
            color="#0000ff"
            className="mt-10 self-center"
          />
        ) : moviesError ? (
          <Text>Error: {moviesError?.message}</Text>
        ) : (
          <View className="flex-1 mt-5">
            <SearchBar
              onPress={() => router.push("/search")}
              placeholder="Search for a movie"
            />
            <>
              <Text className="text-lg font-bold mt-5 mb-3 text-white">
                Latest Movies
              </Text>

              {/* Flatlist accepts alot of prop, for it to work, you don't need much 
                other than passing it a prop or props 
                
                Claude like any ai assume that my error was caused by the input. it immediately 
                started trying to fix this file. My gut said Claude was wrong and I was write. 

                We first went into the fetchMovies function inside the api.ts file
                and we noticed a bug. My endpoint contained two // which was a slash to many. 
                We removed a slash from the baseURL and it went from '/3/' to '/3' which is correct

                From there we found another bug which was that in this file index.tsx, my empty string 
                was not an empty string, i was passing a " " (space) ... scroll above and you will see the 
                comment identified by -> /////////continue here///////////
                
                */}
              <FlatList
                data={movies}
                renderItem={({ item }) => (
                  <Text className="text-white text-sm">{item.title}</Text>
                )}
                keyExtractor={(item) => item.id.toString()}
                numColumns={3}
                columnWrapperStyle={{
                  justifyContent: "flex-start",
                  gap: 20,
                  paddingRight: 5,
                  marginBottom: 10,
                }}
                className="mt-2 pb-32"
                scrollEnabled={false}
              />
            </>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

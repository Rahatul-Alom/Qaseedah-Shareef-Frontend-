import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";

import { apiQuery } from "@/lib/helpers";

export const useFetchTopCharts = () => {
  const { isPending, isSuccess, isError, isFetching, error, data } = useQuery({
    queryKey: ["topCharts"],

    queryFn: async () => {
    

      const tracks = await apiQuery({
        endpoint: `tracks`,
      });

      const artists = await apiQuery({
        endpoint: `artists`,
      });

      const albums = await apiQuery({
        endpoint: `albums`,
      });

      const resp = { ["tracks"]: tracks, ["artists"]: artists, ["albums"]: albums };
      console.log("resp",resp);
      return resp;
    },
  });

  return { isPending, isSuccess, isError, isFetching, error, data };
};

export const useFetchNewReleases = ({ tracks }) => {
  const { isPending, isSuccess, isError, isFetching, error, data } = useQuery({
    queryKey: [`newReleases_${tracks}`, { tracks }],
    queryFn: async () => {
      try {
        if (tracks) {
          const data = await apiQuery({
            endpoint: `${tracks}`,
          });

          return { ["releases"]: data };
        } else {
          return null;
          // throw new Error("Invalid params");
        }
      } catch (error) {
        // console.log(error);
      }
    },
  });

  return { isPending, isSuccess, isError, isFetching, error, data };
};

export const useFetchTopSelection = ({ tracks }) => {
  const { isPending, isSuccess, isError, isFetching, error, data } = useQuery({
    queryKey: [`topSelection_${tracks}`, { tracks }],
    queryFn: async () => {
      try {
        if (tracks) {
          const data = await apiQuery({
            endpoint: `${tracks}`,
          });

          return { ["selection"]: data };
        } else {
          return null;
        }
      } catch (error) {
        // console.log(error);
      }
    },
  });

  return { isPending, isSuccess, isError, isFetching, error, data };
};

export const useFetchGenres = () => {
  const { isPending, isSuccess, isError, isFetching, error, data } = useQuery({
    queryKey: ["genres"],
    queryFn: async () => {
      try {
        const response = await apiQuery({
          endpoint: `genre`,
        });
        return response?.data?.filter((item) => item.name !== "All");
      } catch (error) {
        // console.log(error);
      }
    },
  });

  return { isPending, isSuccess, isError, isFetching, error, data };
};

export const useFetchGenreById = ({ tracks }) => {
  const { isPending, isSuccess, isError, isFetching, error, data } = useQuery({
    queryKey: [`genreBytracks_${tracks}`, { tracks }],
    queryFn: async () => {
      try {
        if (tracks) {
          const response = await apiQuery({
            endpoint: `genre/${tracks}`,
          });
          return response;
        } else {
          return null;
        }
      } catch (error) {
        // console.log(error);
      }
    },
  });

  return { isPending, isSuccess, isError, isFetching, error, data };
};

export const useFetchGenreBySection = ({ tracks, section }) => {
  const { isPending, isSuccess, isError, isFetching, error, data } = useQuery({
    queryKey: [`genreBySection_${section}_${tracks}`, { tracks, section }],
    queryFn: async () => {
      try {
        if (tracks && section) {
          const response = await apiQuery({
            endpoint: `tracks`,
          });

          return response;
        } else {
          return null;
        }
      } catch (error) {
        // console.log(error);
      }
    },
  });

  return { isPending, isSuccess, isError, isFetching, error, data };
};

export const useFetchArtist = ({ id }) => {
  const { isPending, isSuccess, isError, isFetching, error, data } = useQuery({
    queryKey: [`artist_${id}`, { id }],
    queryFn: async () => {
      try {
        if (id) {
          const limit = "?limit=20";

          const [
            details,
            topTracks,
            albums,
            relatedArtists,
            playlists,
            radios,
          ] = await Promise.all([
            apiQuery({ endpoint: `artist/${id}` }),
            apiQuery({ endpoint: `artist/${id}/top${limit}` }),
            apiQuery({ endpoint: `artist/${id}/albums${limit}` }),
            apiQuery({ endpoint: `artist/${id}/related${limit}` }),
            apiQuery({ endpoint: `artist/${id}/playlists${limit}` }),
            apiQuery({ endpoint: `artist/${id}/radio` }),
          ]);

          return {
            details,
            topTracks,
            albums,
            relatedArtists,
            playlists,
            radios,
          };
        } else {
          return null;
        }
      } catch (error) {
        console.log(error);
      }
    },
  });

  return { isPending, isSuccess, isError, isFetching, error, data };
};

export const useFetchChartBySection = ({ id, section }) => {
  const { isPending, isSuccess, isError, isFetching, error, data } = useQuery({
    queryKey: [`chartsBySection_${section}_${id}`, { id, section }],
    queryFn: async () => {
      try {
        if (id && section) {
          const response = await apiQuery({
            endpoint: `tracks`,
          });

          return response;
        } else {
          return null;
        }
      } catch (error) {
        // console.log(error);
      }
    },
  });

  return { isPending, isSuccess, isError, isFetching, error, data };
};

export const useFetchPlaylists = ({ tracks, section }) => {
  const { isPending, isSuccess, isError, isFetching, error, data } = useQuery({
    queryKey: [`playlist_${section}_${tracks}`, { tracks, section }],
    queryFn: async () => {
      try {
        if (tracks && section) {
          const response = await apiQuery({
            endpoint: `${section}/${tracks}`,
          });

          return response;
        } else {
          return null;
        }
      } catch (error) {
        // console.log(error);
      }
    },
  });

  return { isPending, isSuccess, isError, isFetching, error, data };
};

export const fetchMultiplePlaylists = async (data) => {
  try {
    if (!data) {
      throw new Error("Invalid params");
    }
    const mappedData = data.map(async (item) => {
      const values = Object.values(item)?.[0];
      const { id, type } = values;

      if (!id || !type) {
        throw new Error("Invalid params");
      }
      return await apiQuery({
        endpoint: `${type}/${id}`,
      });
    });

    return await Promise.all(mappedData);
  } catch (error) {
    // console.log(error);
  }
};

export const useFetchTracks = () => {
  const [getId, setGetId] = useState(null);

  const { mutate: fetchTracks, isPending: isSubmitting } = useMutation({
    mutationFn: async (params) => {
      const { id, type, callback } = params || {};

      if (id && type) {
        try {
          setGetId(id);

          const response = await apiQuery({
            endpoint: `${id}/tracks`,
          });

          if (callback) callback(response.data);
        } catch (error) {
          console.log(error);
        } finally {
          setGetId(null);
        }
      } else {
        return null;
      }
    },
  });

  return {
    fetchTracks,
    isSubmitting,
    getId,
  };
};

export const useFetchSearch = ({ searchText }) => {
  const { isPending, error, isError, isSuccess, data } = useQuery({
    queryKey: ["fetchSearch", { searchText }],
    queryFn: async () => {
      const limit = "";

      if (searchText?.trim()) {
        const [tracks, albums, artists, playlists, radios] = await Promise.all([
          apiQuery({
            endpoint: `search/track?q=${searchText}${limit}`,
          }),
          apiQuery({
            endpoint: `search/album?q=${searchText}${limit}`,
          }),
          apiQuery({
            endpoint: `search/artist?q=${searchText}${limit}`,
          }),
          apiQuery({
            endpoint: `search/playlist?q=${searchText}${limit}`,
          }),
          apiQuery({
            endpoint: `search/radio?q=${searchText}${limit}`,
          }),
        ]);

        return {
          tracks,
          albums,
          artists,
          playlists,
          radios,
        };
      } else {
        return null;
      }
    },
  });

  return { isPending, error, isError, isSuccess, data };
};

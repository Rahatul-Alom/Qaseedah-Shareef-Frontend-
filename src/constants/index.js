export const navlinks = [
  {
    name: "Home",
    subLinks: [
      { name: "home", to: "/home", icon: "BiPlayCircle" },
      { name: "Browse", to: "/browse", icon: "RiListIndefinite" },
      { name: "Search", to: "/search", icon: "FaSearchengin" },
    ],
  },
  {
    name: "Your Library",
    subLinks: [
      {
        name: "Liked Songs",
        to: "/liked-songs",
        icon: "MdOutlineFavoriteBorder",
      },
      { name: "My Playlists", to: "/my-playlist", icon: "PiPlaylistBold" },
    ],
  },
  {
    name: "Account",
    subLinks: [
      { name: "Profile", to: "/profile", icon: "BiUser" },
      { name: "Logout", to: "/logout", icon: "MdLogout" },
    ],
  },
];

export const logo = {
  name: "Qaseedah Shareef",
  icon: "PiMusicNoteFill",
};

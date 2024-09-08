/* eslint-disable react-hooks/exhaustive-deps */
import { Fragment, useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

import { classNames } from "@/lib/utils";
import { useAppUtil, useAppModal, useCurrentUser } from "@/lib/store";
import { useLogout } from "@/lib/actions";

import { useTheme } from "@/hooks";
import { themeConfig, defaultThemeConfig } from "@/configs";

import { Icon, Overlay, Title, Tooltip, Button, Skeletons } from "@/components";

const User = () => {
  const { currentUser } = useCurrentUser();

  const { user } = currentUser || {};
  const { email, name, imageUrl } = user || {};

  return (
    <Link
      className="gap-2 p-2 rounded flex_justify_between bg-main"
      to="/profile"
    >
      <div className="w-10 h-10 rounded-full flex_justify_center bg-sidebar">
        {imageUrl ? (
          <img src={imageUrl} className="w-full h-full rounded-full" />
        ) : (
          <Icon name="FaRegUser" size={16} />
        )}
      </div>

      {email && (
        <div className="flex flex-col flex-1 text-sm">
          <span className="">@{name}</span>
          <span className="break-all text-secondary">{email}</span>
        </div>
      )}
    </Link>
  );
};

const CreatePlaylistTooltipContent = ({ hideTooltip }) => {
  const navigate = useNavigate();

  return (
    <div className="p-4 rounded bg-card">
      <Title
        name="Create a Playlist?"
        desc="Log in to create and share playlists."
        type="small"
      />
      <div className="flex justify-end gap-2 item-center">
        <Button
          label="Not now"
          variant="outlined"
          className="border-0"
          onClick={hideTooltip}
        />
        <Button
          label="Sign In"
          variant="contained"
          onClick={() => navigate("/login")}
        />
      </div>
    </div>
  );
};

const Sidebar = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [toggleNav, setToggleNav] = useState(false);

  const { logout: signOut } = useLogout();
  const { currentUser } = useCurrentUser();

  const { isLoaded: isLoadedUser, user } = currentUser || {};

  const { getToggleMenu, toggleMenu, searchRef, getToggleSearch } =
    useAppUtil();

  const [theme] = useTheme();

  const { close: modalClose } = useAppModal();

  const { sidebar, orientation, isMobile } = theme || defaultThemeConfig;
  const isHorizontal = orientation === "horizontal" && !isMobile;

  const isFolded = sidebar === "folded";

  useEffect(() => {
    getToggleMenu && getToggleMenu(false);
  }, [pathname]);

  const [dedications, setDedications] = useState([]);

  useEffect(() => {
    const fetchDedications = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/api/v1/dedications");

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const contentType = response.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
          throw new TypeError("Oops, we haven't got JSON!");
        }

        const data = await response.json();
        console.log("Dedications:", data);
        setDedications(data.data);
      } catch (error) {
        console.error("Error fetching dedications:", error);
      }
    };

    fetchDedications();
  }, []);

  const navlinks = useMemo(() => {
    return [
      {
        name: "Menu",
        subLinks: [
          {
            id: "home",
            name: "Home",
            to: "/home",
            icon: "BiPlayCircle",
            tooltip: "hover",
          },
          {
            id: "browse",
            name: "Browse",
            to: "/browse",
            icon: "RiListIndefinite",
            tooltip: "hover",
          },
          {
            id: "search",
            name: "Search",
            to: "/search",
            icon: "FaSearchengin",
            refFocus: searchRef,
            tooltip: "hover",
          },
        ],
      },
      {
        name: "শান  মুবারক",
        style: { fontFamily: "'Hind Siliguri', sans-serif", fontWeight: 700 },
        subLinks: dedications.map((dedication) => ({
          id: dedication.id,
          name: dedication.name,
          to: `/dedication/${dedication.id}`,
          icon: "FaRegUser",
          tooltip: "hover",
        })),
      },
    ];
  }, [user]);

  const hideTooltip = (hideFunc) => {
    setToggleNav(false);
    if (hideFunc) hideFunc();
  };

  const hoverWidth = themeConfig.sidebars.full;

  return (
    <section
      className={classNames(
        "sidebar_section z-[1100] fixed top-0",
        isMobile &&
        classNames(
          "transition-all duration-500",
          toggleMenu && !isHorizontal ? "left-0" : "-left-sidebar"
        ),

        isHorizontal
          ? "top-navbar sidebar_horizontal_width bg-sidebar-0 shadow-dialog"
          : "h-full"
      )}
    >
      <Overlay isOpen={toggleMenu} handleIsOpen={getToggleMenu} />

      <div
        {...(!isHorizontal && {
          onMouseOver: () => setToggleNav(true),
          onMouseOut: () => setToggleNav(false),
        })}
        {...(toggleNav &&
          !isHorizontal && { style: { width: `${hoverWidth}px` } })}
        className={classNames(
          "nav-list overflow-auto hide_scrollbar relative",
          isHorizontal
            ? "h-navbar bg-card-skeleton"
            : "top-navbar sidebar_height w-sidebar duration-500 transition-all pb-[100px] bg-sidebar"
        )}
      >
        <div
          className={classNames(
            "relative text-white text-base",
            isHorizontal && "flex h-full border-t border-divider"
          )}
        >
          {isLoadedUser ? (
            <>
              {navlinks.map((item) => (
                <div
                  key={item.name}
                  className={classNames("mt-4", isHorizontal && "flex gap-3")}
                >
                  {((!isFolded && !isHorizontal) || toggleNav) && (
                    <span
                      className={classNames(
                        "block p-3 mx-3 text-white text-base uppercase font-bold"
                      )}
                    >
                      {item.name}
                    </span>
                  )}

                  <ul className={classNames(isHorizontal && "flex")}>
                    {item.subLinks.map((link) => (
                      <Fragment key={link.name}>
                        <li
                          key={link.name}
                          className={classNames(
                            `dropdown_${link.id}`,
                            "relative px-[10px] group",
                            isHorizontal && "flex_justify_center"
                          )}
                        >
                          <Tooltip
                            id={link.id}
                            tooltipType={link.tooltip}
                            arrowPos={link?.arrowPos}
                            arrowClassName={link?.arrowClassName}
                            TooltipComp={link?.tooltipContent}
                            disabled={link.tooltip === "hover"}
                            hideTooltipFunc={hideTooltip}
                          >
                            <button
                              onClick={() => {
                                if (link?.onClick) {
                                  link?.onClick();
                                } else if (link?.dialog) {
                                  return null;
                                } else if (link?.refFocus) {
                                  link?.refFocus?.current?.focus();
                                  getToggleSearch(true);
                                } else {
                                  navigate(link.to);
                                }
                                modalClose();
                              }}
                              className={classNames(
                                "flex flex-row items-center gap-2 h-12 w-full outline-0 border-none",
                                isHorizontal ? "items-center p-3" : "pl-[20px]",
                                pathname.includes(link.to) &&
                                "rounded bg-primary-opacity"
                              )}
                            >
                              <Icon
                                name={link.icon}
                                className={classNames(
                                  "group-hover:!text-primary",
                                  pathname.includes(link.to) && "!text-primary"
                                )}
                                size={20}
                              />

                              <div
                                className={classNames(
                                  "group-hover:text-primary text-sm flex items-center gap-3 whitespace-nowrap",
                                  pathname.includes(link.to)
                                    ? "text-primary"
                                    : "text-onNeutralBg",
                                  !(isFolded && !isHorizontal && !isMobile) ||
                                    toggleNav
                                    ? "opacity-100 transition-opacity duration-1000"
                                    : "invisible w-0 opacity-0"
                                )}
                              >
                                {link.name}
                                {link.badgeCount && (
                                  <div className="flex items-center justify-center w-4 h-4 rounded-full right-2 bg-primary animate-bounce group-hover:bg-white">
                                    <span className="text-xs text-white group-hover:text-primary">
                                      {3}
                                    </span>
                                  </div>
                                )}
                              </div>
                            </button>
                          </Tooltip>
                        </li>
                      </Fragment>
                    ))}
                  </ul>
                </div>
              ))}
            </>
          ) : (
            <Skeletons.NavlistSkeleton />
          )}
          {isLoadedUser && user && isMobile && isLoadedUser && (
            <div className="fixed bottom-0 p-2 bg-sidebar w-sidebar max-h-[100px]">
              <User />
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Sidebar;

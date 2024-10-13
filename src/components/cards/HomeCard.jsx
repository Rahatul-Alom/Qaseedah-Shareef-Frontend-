
import { Link, } from "react-router-dom";


import { useCurrentUser } from "@/lib/store";
import {
    classNames,
    formatDuration,
    formatIndexToDouble,
    truncate,
} from "@/lib/utils";

import { IconButton} from "@/components";


const HomeCard = ({
                       item,
                       trackId,
                       trackType,
                       playlistId,
                       details,
                       isPlaying,
                       myPlaylistId,
                       listDivider,
                       disableRowList,
                       handleTrackClick,
                   }) => {
    const { currentUser } = useCurrentUser();
    const { user, isLoaded } = currentUser || {};

    const { id, type, index } = item || {};
    const isCurrentTrack =
        trackId === id && trackType === type && playlistId === details.id;
    const isCurrentPlaying = isCurrentTrack && isPlaying;

    return (
        <li
            key={item.id}
            className={classNames(
                "relative p-3 flex items-center text-base !text-onNeutralBg hover:bg-card-hover hover:rounded cursor-pointer group border-divider focus-within:bg-divider focus-within:rounded",
                listDivider ? "py-3" : "py-2",
                index !== 0 && " border-t"
            )}
        >
            <div className="relative flex justify-center w-full items-between group">
                <div className="flex items-center justify-start flex-1 gap-2 xs:gap-4">
                    {!disableRowList?.includes("no") && (
                        <span className="block mr-0 text-sm xs:mr-2">
              {formatIndexToDouble(index + 1)}
            </span>
                    )}
                    <div className="relative w-12 h-12">
                        <div
                            className={classNames(
                                "absolute w-full h-full group-hover:bg-main group-hover:opacity-70",
                                isCurrentTrack ? "bg-main opacity-70" : "bg-transparent"
                            )}
                        />
                        <img
                            src={item.image}
                            alt={item.name}
                            className={classNames("h-full w-full rounded aspect-square")}
                        />

                        <div className="absolute top-0 flex items-center justify-center w-full h-full">
                            <IconButton
                                name={
                                    isCurrentTrack
                                        ? !isCurrentPlaying
                                            ? "BsFillPlayFill"
                                            : "BsFillPauseFill"
                                        : "BsFillPlayFill"
                                }
                                className={classNames(
                                    "h-7 w-7 rounded-full bg-primary text-white",
                                    isCurrentTrack ? "" : "group-hover:flex hidden"
                                )}
                                iconClassName="text-white"
                                onClick={() => handleTrackClick({ id, type, index })}
                            />
                        </div>
                    </div>
                    <div className="flex flex-col flex-1 w-full gap-1 text-onNeutralBg">
                        <span className="text-sm">{truncate(item.name, 15)}</span>
                        <div className="flex flex-col xs:flex-row">
                            <Link
                                title="Artist"
                                to={`/artist/${item.artistId}`}
                                className="text-secondary text-[14px] hover:underline underline-offset-4 cursor-pointer"
                            >
                                {item.artistName}
                            </Link>

                            {!disableRowList?.includes("album") && (
                                <>
                  <span className="hidden xs:inline-block">
                    &nbsp;&nbsp;{"."}&nbsp;&nbsp;
                  </span>
                                    <Link
                                        title="Album"
                                        to={`/album/${item.albumId}`}
                                        className="text-[14px] cursor-pointer hover:underline underline-offset-4 text-secondary"
                                    >
                                        {truncate(item.albumTitle, 15)}
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                </div>
                <div className="absolute right-0 flex items-center gap-2">
                    {!disableRowList?.includes("duration") && (
                        <div className="flex items-end justify-end text-sm text-right">
                            {formatDuration(item.duration)}
                        </div>
                    )}

                    {user && isLoaded && (
                        <>
                            {!disableRowList?.includes("more_button") && (
                                <div className="flex items-center justify-end gap-2 text-sm text-right">
                                    <MoreButtonDropDown
                                        trackId={id}
                                        type={type}
                                        myPlaylistId={myPlaylistId}
                                        imageUrl={item.image}
                                        artistId={item.artistId}
                                        albumId={item.albumId}
                                    />
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </li>
    );
};

export default HomeCard;

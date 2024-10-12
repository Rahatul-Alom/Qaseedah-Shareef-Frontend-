import {
  useFetchRecentPlayed,
  useFetchTopCharts,
  useFetchNewReleases,
} from "@/lib/actions";
import { Sections, TopPlay } from "@/components";
import {useId} from "react";
import HomeSection from "../../components/sections/HomeSection.jsx";

export default function Home() {
  const {
    data: recentPlayed,
    isPending: isRecentPlayedDataPending,
    isSuccess: isRecentPlayedDataSucsess,
  } = useFetchRecentPlayed();
  const topPickId = useId();
  const {
    data: topChartData,
    isPending: isTopChartDataPending,
    isSuccess: isTopChartDataSuccess,
  } = useFetchTopCharts();

  const {
    data: newReleases,
    isPending: isNewReleaseDataPending,
    isSuccess: isNewReleaseDataSuccess,
  } = useFetchNewReleases({
    id: "0",
  });

  const { artists, tracks, albums } = topChartData || {};
  console.log('artists, tracks', artists, tracks);

  const { releases } = newReleases || {};

  return (
    <section className="home_page">
      <div className="flex flex-col gap-y-16">
        {/* {recentPlayed && recentPlayed?.length ? (
          <div className="relative">
            <Sections.MediaSectionMinified
              data={recentPlayed}
              title="Recent Played"
              titleType="large"
              subTitle="Rehome the Soundtrack of Your Moments."
              type="playlist"
              gridNumber={3}
              cardItemNumber={9}
              bgColor
              showPattern
              isLoading={isRecentPlayedDataPending}
              isSuccess={isRecentPlayedDataSucsess}
            />
          </div>
        ) : null} */}

        <HomeSection
          data={tracks?.data}
          details={{
            id: topPickId,
            type: "chart",
          }}
          disableHeader
          disableRowList={[
            "no",
            "album",
            "duration",
            "more_button",
            "like_button",
            "dateCreated",
          ]}
          imageDims="11"
          enableTitle
          titleName="Home"
          titleType="medium"
          titleDivider={false}
          isLoading={isTopChartDataPending}
          isSuccess={isTopChartDataSuccess}
        />

{/* <TopPlay /> */}

        <Sections.MediaSection
          data={artists?.data}
          title="Top Artists"
          subTitle="home new sounds with handpicked artists tailored to your taste."
          skeletonItemNumber={10}
          randomListNumber={10}
          cardItemNumber={10}
          type="artist"
          isLoading={isTopChartDataPending}
          isSuccess={isTopChartDataSuccess}
        />

          {/* {console.log("albums", albums)} */}
          
        <Sections.MediaSection
          data={albums?.data}
          title="Top Albums"
          subTitle="Curation of standout tracks."
          cardItemNumber={10}
          type="album"
          isLoading={isTopChartDataPending}
          isSuccess={isTopChartDataSuccess}
        />

        {/* <Sections.MediaSection
          data={releases?.data}
          title="New Releases"
          subTitle="home fresh and latest soundscapes in our collection."
          cardItemNumber={10}
          type="album"
          isLoading={isNewReleaseDataPending}
          isSuccess={isNewReleaseDataSuccess}
        /> */}

        {/* <Sections.MediaSection
          data={podcasts?.data}
          title="Podcasts For You"
          subTitle="Listen and enjoy personalized audio content just for you."
          gridNumber={4}
          type="podcast"
          isLoading={isTopChartDataPending}
          isSuccess={isTopChartDataSuccess}
        /> */}
      </div>
    </section>
  );
}

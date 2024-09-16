import { Sections } from "@/components";

export default function Albums({ albums, isPending, isSuccess }) {
  console.log("albums", albums);
  return (
    <div className="relative mt-8 album_tab_content">
      <Sections.MediaSection
        data={albums?.data}
        enableTitle={false}
        type="album"
        isLoading={isPending}
        isSuccess={isSuccess}
      />
    </div>
  );
}

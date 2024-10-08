import { Link } from "react-router-dom";

import { Title, Icon } from "@/components";

const downloadBtnList = [
  { name: "App Store", desc: "Download on", icon: "FaApple" },
  {
    name: "Google Play",
    desc: "Get it on",
    icon: "IoLogoGooglePlaystore",
  },
];



export default function Footer() {
  return (
    <div className="footer">
      <div className="py-4 border-t border-divider">
        <Title name="Lyrics" divider={false} />
      <div className="mt-5">
        <p className="my-1">পাচঁ সিতারা</p>
        <p className="my-1"> ইলাহী হাবীবা</p>
        <p className="my-1">শাহযাদাজী আছ ছলাতু ওয়াস সালাম</p>
        <p className="my-1">সুন্নতী সামা হয়</p>

      </div>
        <div className="footer_links">
          <div className="flex gap-2 mt-4">
          </div>
          <div className="mt-2 footer_copyright">
            {/* <p className="text-xs text-secondary"> © Copyright 2023</p> */}
          </div>
        </div>
      </div>
    </div>
  );
}

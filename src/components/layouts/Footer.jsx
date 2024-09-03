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
        {/* <Title name="Go mobile" divider={false} /> */}
        <div className="download_buttons">
          <div className="grid grid-cols-1 gap-3 xs:grid-cols-2">
            {downloadBtnList.map((item) => (
              <div key={item.name} className="col-span-1">
              </div>
            ))}
          </div>
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

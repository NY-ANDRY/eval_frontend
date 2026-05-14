import SidebarMainButton from "./SidebarMainButton";
import SidebarFooterButton from "./SidebarFooterButton";
import SidebarButton from "./SidebarButton";
import { GaugeIcon, FileTypeCorner, FileImageIcon, DatabaseIcon, ScrollIcon } from "lucide-react";

const navs = [
  {
    title: "pages",
    links: [
      {
        label: "dashboard",
        url: "/backoffice/",
        icon: <GaugeIcon />
      },
      {
        label: "order",
        url: "/backoffice/order",
        icon: <ScrollIcon />
      }
    ]
  },
  {
    title: "data",
    links: [
      {
        label: "data",
        url: "/backoffice/data",
        icon: <DatabaseIcon />
      },
      {
        label: "import",
        url: "/backoffice/import",
        icon: <FileTypeCorner />
      },
      {
        label: "import image",
        url: "/backoffice/importImage",
        icon: <FileImageIcon />
      }
    ]
  }
];

const Sidebar = () => {

  return (
    <nav className="flex flex-col border border-neutral-200 bg-neutral-50 w-60 gap-4 px-2 py-2">
      <SidebarMainButton />

      {navs.map(nav => (

        <div key={nav.title} className="flex flex-col gap-1.5">
          <div className="flex capitalize text-xs font-inter-l px-2 text-neutral-500 mt-1 mb-0.5">{nav.title}</div>

          {nav.links.map(link => (
            <SidebarButton key={link.url} to={link.url} label={link.label} icon={link.icon} />
          ))}

        </div>

      ))}

      <div className="flex-1" />
      <SidebarFooterButton />
    </nav>
  );
};

export default Sidebar;
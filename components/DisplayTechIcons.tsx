import Image from "next/image";

import { cn, getTechLogos } from "@/lib/utils";

const DisplayTechIcons = async ({ techStack }: TechIconProps) => {
  const techIcons = await getTechLogos(techStack || []);

  if (!techIcons || techIcons.length === 0) {
    return (
      <span className="text-[11px] text-slate-500 font-medium">General Tech</span>
    );
  }

  return (
    <div className="flex items-center -space-x-2">
      {techIcons.slice(0, 4).map(({ tech, url }, index) => (
        <div
          key={`${tech}-${index}`}
          className={cn(
            "relative group size-7 rounded-full bg-slate-800 border-2 border-slate-900 flex items-center justify-center p-1 transition-transform hover:scale-110 hover:z-10 shadow-sm"
          )}
        >
          {/* Tooltip */}
          <span className="absolute bottom-full mb-1.5 hidden group-hover:block px-2 py-0.5 text-[10px] font-semibold text-white bg-slate-800 border border-slate-700 rounded-md shadow-lg whitespace-nowrap z-20 pointer-events-none">
            {tech}
          </span>

          <Image
            src={url}
            alt={tech}
            width={24}
            height={24}
            className="size-4 object-contain"
          />
        </div>
      ))}
      {techIcons.length > 4 && (
        <div className="size-7 rounded-full bg-slate-800 border-2 border-slate-900 flex items-center justify-center text-[10px] font-bold text-slate-400">
          +{techIcons.length - 4}
        </div>
      )}
    </div>
  );
};

export default DisplayTechIcons;

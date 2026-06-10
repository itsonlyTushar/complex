import { FaCaretUp } from "react-icons/fa6";

export default function AdminPage() {
  return (
    <>
      <section className="py-10 grid grid-cols-2 place-items-start ">
        {/* Main Revenue Card  */}
        <div>
          <span className="font-semibold">Revenue</span>
          <div className="flex gap-2 items-center ">
            <h1 className="text-5xl">5239.69</h1>
            <div className="flex items-center gap-0.5 text-[12px] font-semibold px-1.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-700 border border-emerald-500/20 dark:bg-emerald-400/10 dark:text-emerald-400 dark:border-emerald-400/20">
              5%
              <FaCaretUp size={12} />
            </div>
          </div>
          <span className="text-xs font-bold">As of Jun 1 - Aug 31, 2026</span>
        </div>

        {/* 3 metrics cards  */}
        <div className="flex items-center gap-4">
          <div className="flex flex-col gap-1 p-5 min-w-[240px] bg-card text-card-foreground border border-border rounded-xl h-28">
            <span className="text-[12px] font-semibold tracking-wider text-muted-foreground">
              Top Sales
            </span>
            <h3 className="text-4xl font-bold text-foreground font-heading">
              73
            </h3>
          </div>

          <div className="flex flex-col gap-1 p-5 min-w-[240px] bg-card text-card-foreground border border-border rounded-xl h-28">
            <span className="text-[12px] font-semibold tracking-wider text-muted-foreground">
              Top Sales
            </span>
            <h3 className="text-4xl font-bold text-foreground font-heading">
              73
            </h3>
          </div>
          <div className="flex flex-col gap-1 p-5 min-w-[240px] bg-card text-card-foreground border border-border rounded-xl h-28">
            <span className="text-[12px] font-semibold tracking-wider text-muted-foreground">
              Top Sales
            </span>
            <h3 className="text-4xl font-bold text-foreground font-heading">
              73
            </h3>
          </div>
        </div>
      </section>
    </>
  );
}

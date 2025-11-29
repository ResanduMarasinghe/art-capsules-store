const CapsuleSkeleton = () => {
  return (
    <div className="animate-pulse rounded-[28px] border border-slate-100 bg-white/80 p-4 shadow-frame">
      <div className="mb-4 aspect-[4/5] w-full overflow-hidden rounded-3xl bg-slate-200/70" />
      <div className="space-y-3">
        <div className="h-3 w-24 rounded-full bg-slate-200/90" />
        <div className="h-5 w-3/4 rounded-full bg-slate-200/90" />
        <div className="h-3 w-1/2 rounded-full bg-slate-200/80" />
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        <span className="inline-flex h-6 w-16 rounded-full bg-slate-200/80" />
        <span className="inline-flex h-6 w-20 rounded-full bg-slate-200/80" />
        <span className="inline-flex h-6 w-14 rounded-full bg-slate-100" />
      </div>
      <div className="mt-5 flex items-center justify-between">
        <span className="h-5 w-16 rounded-full bg-slate-200/90" />
        <span className="h-10 w-24 rounded-full bg-slate-200" />
      </div>
    </div>
  );
};

export default CapsuleSkeleton;

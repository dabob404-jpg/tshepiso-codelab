export default function Home() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-6 text-center">
      <div className="max-w-md w-full p-8 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl space-y-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">
          ⚠️ Temporarily Offline
        </div>
        
        <h1 className="text-3xl font-extrabold text-white tracking-tight">
          Coming Soon
        </h1>
        
        <p className="text-slate-400 text-sm leading-relaxed">
          Tshepiso is still at Campus. Visit <span className="text-sky-400 font-medium">Wits University</span> to talk to him.
        </p>
        
        <div className="pt-4 border-t border-slate-800 text-xs text-slate-500">
          Tshepiso CodeLab • Offline Notice
        </div>
      </div>
    </main>
  );
}

import React from 'react';

export default function PromptParameterCustomizer({
  variables = {},
  onVariableChange = () => {}
}) {
  const variableKeys = Object.keys(variables);
  if (variableKeys.length === 0) return null;

  return (
    <div className="bg-slate-50 dark:bg-zinc-900/60 p-4 rounded-xl border border-slate-200/80 dark:border-white/10 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <h4 className="text-xs font-bold text-obsidian dark:text-white uppercase tracking-wider">
          Kustomisasi Parameter Prompt
        </h4>
        <span className="text-[10px] text-zinc-500">
          {variableKeys.length} Variabel Ditemukan
        </span>
      </div>
      <p className="text-xs text-zinc-500 font-normal leading-relaxed">
        Ubah nilai variabel di bawah untuk menyesuaikan hasil teks prompt secara otomatis.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mt-1">
        {variableKeys.map((key) => (
          <div key={key} className="flex flex-col gap-1">
            <label className="text-[11px] font-semibold text-zinc-700 dark:text-zinc-300 capitalize truncate">
              {key}
            </label>
            <input
              type="text"
              value={variables[key]}
              onChange={(e) => onVariableChange(key, e.target.value)}
              className="w-full h-8 px-3 rounded-lg text-xs bg-white dark:bg-zinc-800 text-obsidian dark:text-white border border-zinc-200 dark:border-zinc-700 focus:outline-none focus:ring-2 focus:ring-purple-500/40 transition-all font-mono"
            />
          </div>
        ))}
      </div>
    </div>
  );
}

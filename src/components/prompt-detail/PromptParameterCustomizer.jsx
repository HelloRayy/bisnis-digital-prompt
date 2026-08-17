import React from 'react';

/**
 * Clean Minimalist Prompt Parameter Customizer (1 Input per Row, No Container Background)
 */
export default function PromptParameterCustomizer({
  variables = {},
  variableKeys = [],
  onChange = () => {}
}) {
  const keys = variableKeys && variableKeys.length > 0 ? variableKeys : Object.keys(variables);
  if (keys.length === 0) return null;

  return (
    <div className="flex flex-col gap-3 py-1">
      <div className="flex items-center justify-between px-0.5">
        <h4 className="text-xs font-bold text-obsidian dark:text-white uppercase tracking-wider">
          Kustomisasi Parameter
        </h4>
        <span className="text-[11px] text-zinc-500 dark:text-zinc-400 font-medium">
          {keys.length} Variabel
        </span>
      </div>

      <div className="flex flex-col gap-3">
        {keys.map((key) => {
          const formattedLabel = key
            .replace(/[_-]/g, ' ')
            .replace(/^./, str => str.toUpperCase());

          return (
            <div key={key} className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                {formattedLabel}
              </label>
              <input
                type="text"
                value={variables[key] ?? ''}
                onChange={(e) => onChange(key, e.target.value)}
                placeholder={`Ubah nilai ${formattedLabel.toLowerCase()}...`}
                className="w-full h-11 px-3.5 rounded-xl text-base sm:text-sm bg-white dark:bg-zinc-800 text-obsidian dark:text-white border border-black/10 dark:border-white/10 shadow-2xs focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-500 transition-all font-medium"
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}

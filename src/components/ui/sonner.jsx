import { Toaster as Sonner } from "sonner";

const Toaster = ({ ...props }) => {
  return (
    <Sonner
      theme="light"
      className="toaster group"
      position="top-right"
      offset="24px"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-white/95 dark:group-[.toaster]:bg-zinc-900/95 group-[.toaster]:text-obsidian dark:group-[.toaster]:text-zinc-100 group-[.toaster]:border-black/10 dark:group-[.toaster]:border-white/10 group-[.toaster]:shadow-xl group-[.toaster]:rounded-2xl font-sans text-xs p-3.5 sm:p-4 backdrop-blur-md",
          description: "group-[.toast]:text-zinc-500",
          actionButton:
            "group-[.toast]:bg-obsidian group-[.toast]:text-white font-medium rounded-full",
          cancelButton:
            "group-[.toast]:bg-zinc-100 group-[.toast]:text-zinc-500 rounded-full",
        },
      }}
      {...props}
    />
  );
};

export { Toaster };

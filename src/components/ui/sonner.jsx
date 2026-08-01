import { Toaster as Sonner } from "sonner";

const Toaster = ({ ...props }) => {
  return (
    <Sonner
      theme="light"
      className="toaster group"
      position="bottom-right"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-white group-[.toaster]:text-obsidian group-[.toaster]:border-zinc-200 group-[.toaster]:shadow-xl group-[.toaster]:rounded-xl font-sans text-xs p-4",
          description: "group-[.toast]:text-zinc-500",
          actionButton:
            "group-[.toast]:bg-obsidian group-[.toast]:text-white font-medium",
          cancelButton:
            "group-[.toast]:bg-zinc-100 group-[.toast]:text-zinc-500",
        },
      }}
      {...props}
    />
  );
};

export { Toaster };

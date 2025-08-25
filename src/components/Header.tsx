import { ThemeToggle } from "@/components/ThemeToggle";

export const Header = () => {
  return (
    <div className="flex w-full items-center justify-between">
      <div className="flex items-center gap-2">
        <h1 className="text-lg font-semibold">Battle Simulator</h1>
      </div>
      <div className="flex items-center gap-2">
        <ThemeToggle />
      </div>
    </div>
  );
};

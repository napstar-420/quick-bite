import { Search } from "lucide-react";
import { Input } from "./ui/input";
import { cn } from "@/lib/utils";
import { Command, CommandEmpty, CommandItem, CommandList } from "./ui/command";
import { RefObject, useEffect, useMemo, useRef, useState } from "react";
import { debounce } from "lodash";
import { LoadingSpinner } from "../components/loading-spinner";

export function AutoComplete<T>({
  className,
  inputClassName,
  placeholder,
  options,
  isLoading,
  emptyMessage,
  value,
  controller,
  defaultInputValue,
  filterFunction,
  optionLabel,
  optionValue,
  onSelect,
  onInputChange,
  ...inputprops
}: {
  className?: string;
  inputClassName?: string;
  placeholder?: string;
  options?: T[];
  isLoading?: boolean;
  emptyMessage?: string;
  value: T | T[];
  defaultInputValue?: string;
  filterFunction?: (value: string, options: T[]) => T[] | Promise<T[]>;
  optionLabel?: (option: T) => string;
  optionValue?: (option: T) => string;
  onSelect?: (value: T | T[]) => void;
  controller?: RefObject<null | AbortController>;
  onInputChange?: (value: string) => void;
  inputprops: React.ComponentProps<"input">;
}) {
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState(defaultInputValue || "");
  const inputRef = useRef<HTMLInputElement>(null);
  const [filteredOptions, setFilteredOptions] = useState<T[]>(options || []);
  const popoverRef = useRef<HTMLDivElement>(null);

  const debouncedFilterCall = useMemo(() => {
    return debounce(async (value: string) => {
      if (filterFunction) {
        const filteredOptions = await filterFunction(value, options || []);
        setFilteredOptions(filteredOptions);
      }
    }, 300);
  }, [filterFunction, options]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    onInputChange?.(e.target.value);
    if (!open) {
      setOpen(true);
    }
    debouncedFilterCall.cancel();
    debouncedFilterCall(e.target.value);
  };

  // Clean up when closing
  useEffect(() => {
    if (!open && controller?.current) {
      controller.current.abort();
    }
  }, [open, controller]);

  return (
    <div className={cn("relative", className)}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={inputValue}
          ref={inputRef}
          className={cn("pl-12", inputClassName)}
          placeholder={placeholder}
          onChange={handleInputChange}
          onFocus={() => setOpen(true)}
          onBlur={() => setTimeout(() => setOpen(false), 200)}
          autoComplete="off"
          {...inputprops}
        />
      </div>

      {open && (
        <div
          ref={popoverRef}
          className="absolute z-50 w-full mt-1 bg-popover rounded-md border shadow-md"
          onMouseDown={(e) => e.preventDefault()}
        >
          <div className="p-2">
            <Command>
              <CommandList className="">
                {isLoading ? (
                  <div className="px-4 py-2 flex items-center gap-2">
                    <LoadingSpinner size="sm" />{" "}
                    <span className="text-muted-foreground">Loading...</span>
                  </div>
                ) : filteredOptions.length ? (
                  filteredOptions?.map((option) => (
                    <CommandItem
                      key={optionValue?.(option) || String(option)}
                      className="rounded-sm cursor-pointer"
                      onSelect={() => {
                        onSelect?.(option);
                        setOpen(false);
                        setInputValue(optionLabel?.(option) || String(option));
                      }}
                    >
                      {optionLabel?.(option) || String(option)}
                    </CommandItem>
                  ))
                ) : (
                  <CommandEmpty className="text-muted-foreground px-4 py-2 text-sm">
                    {emptyMessage}
                  </CommandEmpty>
                )}
              </CommandList>
            </Command>
          </div>
        </div>
      )}
    </div>
  );
}

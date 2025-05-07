import { useEffect, useRef, useState } from "react";
import { Tabs, TabsList, TabsTrigger } from "../ui/tabs";
import { Button } from "../ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Separator } from "../ui/separator";

export function MenuTabs({ menus, onTabChange }) {
  const [activeTab, setActiveTab] = useState(menus?.[0]?._id || "all");
  const tabsListRef = useRef(null);
  const [disableRightScroll, setDisableRightScroll] = useState(false);
  const [disableLeftScroll, setDisableLeftScroll] = useState(true);

  const scrollTabsRight = () => {
    if (!tabsListRef.current) return;
    tabsListRef.current.scrollBy({ left: 200, behavior: "smooth" });
  };

  const scrollTabsLeft = () => {
    if (!tabsListRef.current) return;
    tabsListRef.current.scrollBy({ left: -200, behavior: "smooth" });
  };

  const handleScroll = () => {
    if (!tabsListRef.current) return;

    const { scrollLeft, scrollWidth, clientWidth } = tabsListRef.current;
    setDisableLeftScroll(scrollLeft <= 0);
    setDisableRightScroll(scrollLeft + clientWidth >= scrollWidth - 10);
  };

  useEffect(() => {
    const observer = new ResizeObserver(() => {
      handleScroll();
    });

    if (tabsListRef.current) {
      observer.observe(tabsListRef.current);
      handleScroll();
    }

    return () => observer.disconnect();
  }, [menus]);

  useEffect(() => {
    const tabsList = tabsListRef.current;
    if (!tabsList) return;

    tabsList.addEventListener("scroll", handleScroll);
    return () => tabsList.removeEventListener("scroll", handleScroll);
  }, []);

  const handleTabChange = (value) => {
    setActiveTab(value);
    if (onTabChange) {
      onTabChange(value);
    }
  };

  return (
    <div className="sticky top-0 z-10 pb-2 bg-background">
      <div className="flex items-center w-full relative gap-2">
        {!disableLeftScroll && (
            <Button
              variant="outline"
              size="icon"
              onClick={scrollTabsLeft}
              className="flex-shrink-0 rounded-full size-12 shadow-md"
            >
              <ChevronLeft className="size-5" />
            </Button>
        )}

        <div className="flex-1 overflow-hidden">
          <Tabs
            defaultValue={activeTab}
            onValueChange={handleTabChange}
            className="w-full pb-0 rounded-none"
          >
            <TabsList
              ref={tabsListRef}
              className="w-full h-auto flex overflow-x-auto scrollbar-hidden rounded-none py-0 justify-start bg-background"
              onScroll={handleScroll}
            >
              {menus &&
                menus.map((menu) => (
                  <TabsTrigger
                    key={menu._id}
                    value={menu._id}
                    className="px-6 py-4 cursor-pointer mx-1 whitespace-nowrap data-[state=active]:bg-primary/10 data-[state=active]:text-primary data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none font-semibold text-base"
                  >
                    {menu.name}
                  </TabsTrigger>
                ))}
            </TabsList>
          </Tabs>
        </div>

        {!disableRightScroll && (
          <Button
            variant="outline"
            size="icon"
            onClick={scrollTabsRight}
            className="flex-shrink-0 rounded-full size-12 shadow-md"
        >
            <ChevronRight className="size-5" />
          </Button>
        )}
      </div>

      <Separator />
    </div>
  );
}

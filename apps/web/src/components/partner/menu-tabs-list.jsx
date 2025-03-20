import { useEffect, useRef, useState } from "react";
import { TabsList, TabsTrigger } from "../../components/ui/tabs";
import { Button } from "../../components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

export function MenuTabsList({ menus }) {
  const tabsListRef = useRef(null);
  const [disableRightScroll, setDisableRightScroll] = useState(false);
  const [disableLeftScroll, setDisableLeftScroll] = useState(false);
  const [isOverflowing, setIsOverflowing] = useState(false);

  const scrollTabsRight = () => {
    if (!tabsListRef.current) {
      return;
    }

    tabsListRef.current.scroll({
      left: tabsListRef.current.scrollLeft + 60,
      behavior: "smooth",
    });
  };

  const scrollTabsLeft = () => {
    if (!tabsListRef.current) {
      return;
    }

    tabsListRef.current.scroll({
      left: tabsListRef.current.scrollLeft - 60,
      behavior: "smooth",
    });
  };

  const handleScroll = () => {
    setDisableRightScroll(
      tabsListRef.current.scrollLeftMax === tabsListRef.current.scrollLeft,
    );
    setDisableLeftScroll(tabsListRef.current.scrollLeft === 0);
  };

  const checkOverflow = () => {
    const isOverflowing =
      tabsListRef.current.scrollWidth > tabsListRef.current.clientWidth;

    setIsOverflowing(isOverflowing);
    handleScroll()
  };

  useEffect(() => {
    const tabsListElement = tabsListRef.current;

    if (!tabsListElement) {
      return;
    }

    // Initial check
    checkOverflow();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(checkOverflow, [menus]);

  return (
    <div className="flex justify-between items-center mb-4">
      {isOverflowing && (
        <Button
          variant="secondary"
          size="icon"
          onClick={scrollTabsLeft}
          disabled={disableLeftScroll}
        >
          <ChevronLeft />
        </Button>
      )}
      <TabsList
        ref={tabsListRef}
        className="flex-1 flex items-center justify-start overflow-x-auto scrollbar-hidden"
        style={{
          gridTemplateColumns: `repeat(${menus.length}, minmax(0, 1fr))`,
        }}
        onScroll={handleScroll}
      >
        {menus.map((menu) => (
          <TabsTrigger
            key={menu._id}
            value={menu._id}
            className="cursor-pointer flex-none"
          >
            {menu.name} {!menu.isAvailable && "(Hidden)"}
          </TabsTrigger>
        ))}
      </TabsList>
      {isOverflowing && (
        <Button
          variant="secondary"
          size="icon"
          onClick={scrollTabsRight}
          disabled={disableRightScroll}
        >
          <ChevronRight />
        </Button>
      )}
    </div>
  );
}

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface TabNavProps {
  activeTab: string
  onTabChange: (tab: string) => void
  tabs: Array<{ id: string; label: string }>
}

export function TabNav({ activeTab, onTabChange, tabs }: TabNavProps) {
  return (
    <div className="border-b">
      <div className="flex overflow-x-auto">
        {tabs.map((tab) => (
          <Button
            key={tab.id}
            variant="ghost"
            className={cn("shrink-0 rounded-none px-4", activeTab === tab.id && "border-b-2 border-primary")}
            onClick={() => onTabChange(tab.id)}
          >
            {tab.label}
          </Button>
        ))}
      </div>
    </div>
  )
}

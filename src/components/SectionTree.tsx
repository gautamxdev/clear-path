import { getSectionsForClientFY, getItemCountForSection } from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import { ChevronRight, FolderOpen } from "lucide-react";

interface SectionTreeProps {
  clientId: string;
  financialYearId: string;
  selectedSectionId: string | null;
  onSelectSection: (sectionId: string) => void;
}

export function SectionTree({ clientId, financialYearId, selectedSectionId, onSelectSection }: SectionTreeProps) {
  const sections = getSectionsForClientFY(clientId, financialYearId);

  return (
    <div className="space-y-0.5">
      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide px-2 mb-2">Sections</p>
      {sections.map((section) => {
        const count = getItemCountForSection(section.id);
        const isActive = selectedSectionId === section.id;
        return (
          <button
            key={section.id}
            onClick={() => onSelectSection(section.id)}
            className={cn(
              "w-full flex items-center gap-2 px-2 py-2 rounded-md text-sm text-left transition-colors",
              isActive
                ? "bg-accent text-accent-foreground font-medium"
                : "text-muted-foreground hover:bg-accent/50 hover:text-foreground"
            )}
          >
            {isActive ? (
              <FolderOpen className="w-3.5 h-3.5 flex-shrink-0" />
            ) : (
              <ChevronRight className="w-3.5 h-3.5 flex-shrink-0" />
            )}
            <span className="flex-1 truncate">{section.name}</span>
            {count > 0 && (
              <span className={cn(
                "text-xs px-1.5 py-0.5 rounded-full",
                isActive ? "bg-background text-foreground" : "bg-secondary text-muted-foreground"
              )}>
                {count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

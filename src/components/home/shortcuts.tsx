import { navigation } from "@/lib/navigation";
import { Shortcut } from "../native";

/** Discovery shortcuts in navigation order — Food & Restaurants first, highlighted. */
const hrefs = ["/restaurants", "/market", "/tours", "/nearby", "/events", "/saved"];

export function HomeShortcuts() {
  const items = hrefs.map((h) => navigation.find((n) => n.href === h)!);
  return (
    <ul className="grid grid-cols-3 gap-1 sm:gap-3 lg:grid-cols-6">
      {items.map((n) => (
        <li key={n.href}>
          <Shortcut href={n.href} label={n.label} icon={n.icon} highlight={n.href === "/restaurants"} />
        </li>
      ))}
    </ul>
  );
}

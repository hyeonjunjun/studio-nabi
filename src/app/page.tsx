import { PIECES } from "@/constants/pieces";
import { CoverGrid } from "@/components/CoverGrid";

export default function HomePage() {
  return <CoverGrid pieces={PIECES} />;
}

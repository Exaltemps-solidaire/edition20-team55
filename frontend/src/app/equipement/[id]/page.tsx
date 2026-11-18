import { EQUIPEMENTS } from "@/lib/equipements";
import { FicheEquipement } from "./FicheEquipement";

export function generateStaticParams() {
  return EQUIPEMENTS.map((e) => ({ id: e.id }));
}

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <FicheEquipement id={id} />;
}

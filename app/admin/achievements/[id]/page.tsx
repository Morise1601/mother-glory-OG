import { redirect } from "next/navigation";

export default async function EditAchievementRedirect({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  if (id) {
    redirect(`/admin/achievements?edit=${encodeURIComponent(id)}`);
  } else {
    redirect("/admin/achievements");
  }
}

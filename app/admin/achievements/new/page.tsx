import { redirect } from "next/navigation";

export default function NewAchievementRedirect() {
  redirect("/admin/achievements?new=true");
}

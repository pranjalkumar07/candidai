import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/actions/auth.action";
import CreateInterviewForm from "@/components/CreateInterviewForm";

const Page = async () => {
  const user = await getCurrentUser();
  if (!user?.id) redirect("/sign-in");

  return <CreateInterviewForm userName={user.name} userId={user.id} />;
};

export default Page;

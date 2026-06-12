import { redirect } from "next/navigation";

import { getTrainer } from "@/app/(auth)/api/auth/auth.api";
import { GlobalNavigation } from "@/components/global/navigation";
import { Container } from "@/components/ui/container";

import { ProfileForm } from "./ui/profile-form";

export default async function AccountProfilePage() {
	const trainer = await getTrainer();
	if (!trainer) redirect("/");

	return (
		<div>
			<GlobalNavigation trainer={trainer.user} />
			<Container
				className="relative min-h-160 sm:my-8 flex flex-col gap-4 py-4 sm:py-0 md:px-4"
				padded
			>
				<ProfileForm trainer={trainer} />
			</Container>
		</div>
	);
}

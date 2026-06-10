import { GlobalNavigation } from "@/components/global/navigation";

export default function Page() {
	return (
		<div>
			<GlobalNavigation trainer={null} />
			<div className="min-h-svh flex items-center justify-center">
				Hello World
			</div>
		</div>
	);
}

import type { ModalSettings } from '@skeletonlabs/skeleton';

export async function displayModal(
	title: string,
	body: string,
	modalStore: { trigger: (arg0: ModalSettings) => void; close: () => void },
	timeout: number = 2000
): Promise<void> {
	const modalSettings: ModalSettings = {
		type: 'alert',
		title,
		body
	};
	modalStore.trigger(modalSettings);
	await new Promise((resolve) => {
		setTimeout(resolve, timeout);
	});
	modalStore.close();
}

import type { ModalSettings, ModalStore } from '@skeletonlabs/skeleton';

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

export async function displayDismissableModal(
	title: string,
	body: string,
	modalStore: { trigger: (arg0: ModalSettings) => void }
): Promise<void> {
	return new Promise((resolve) => {
		const modalSettings: ModalSettings = {
			type: 'alert',
			title,
			body: `<div style="height:350px;overflow-y:scroll;white-space:pre-wrap;font-family:monospace;font-size:0.8em;word-break:break-word;">${body}</div>`,
			buttonTextCancel: 'Close',
			response: () => resolve()
		};
		modalStore.trigger(modalSettings);
	});
}

export async function displayErrorDetailModal(
	title: string,
	message: string,
	modalStore: ModalStore
): Promise<void> {
	return new Promise((resolve) => {
		const modalSettings: ModalSettings = {
			type: 'component',
			component: 'errorDetailModal',
			meta: { title, message },
			response: () => resolve()
		};
		modalStore.trigger(modalSettings);
	});
}

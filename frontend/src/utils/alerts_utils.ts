// import type { ModalSettings } from '@skeletonlabs/skeleton';
import { modalStore, type ModalSettings } from '@skeletonlabs/skeleton';

export const displayAlert = (title: string, body: string, timeout = 2000) => {
	const alertModal: ModalSettings = {
		type: 'alert',
		title,
		body
	};

	modalStore.trigger(alertModal);

	return new Promise((resolve) => setTimeout(resolve, timeout)).then(() => {
		modalStore.close();
		modalStore.clear();
	});
};

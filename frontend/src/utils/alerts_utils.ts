// import type { ModalSettings } from '@skeletonlabs/skeleton';
import { getModalStore } from '@skeletonlabs/skeleton';
import type { ModalSettings } from '@skeletonlabs/skeleton';

export const displayAlert = (title: string, body: string, timeout = 2000) => {
	const modalStore = getModalStore();

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

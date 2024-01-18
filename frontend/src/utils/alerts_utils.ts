// import type { ModalSettings } from '@skeletonlabs/skeleton';
import { modalStore, type ModalSettings } from '@skeletonlabs/skeleton';

export const displayAlert = (title:string, body:string) => {
	const alertModal:ModalSettings = {
	  type: 'alert',
	  title,
	  body
	};
  
	modalStore.trigger(alertModal);
  
	return new Promise((resolve) => setTimeout(resolve, 2000))
	  .then(() => {
		modalStore.close();
		modalStore.clear();
	  });
  };
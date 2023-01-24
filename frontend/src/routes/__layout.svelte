<script>
	import { username } from '../stores/stores';
	import '../styles/global.css';
</script>


<nav class="bg-white border-gray-200 px-2 sm:px-4 py-2.5 rounded dark:bg-gray-900">
	<div class="container flex flex-wrap items-center justify-between mx-auto">
	<a href='#' onclick="window.location.href='/'" class="flex items-center">
		<span class="self-center text-xl font-semibold whitespace-nowrap logo-custom">SIM PIPE</span>
	</a>
	<div class="flex items-center md:order-2">
		<button type="button" class="flex mr-3 text-sm rounded-full md:mr-0 focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600" id="user-menu-button" aria-expanded="false" data-dropdown-toggle="user-dropdown" data-dropdown-placement="bottom">
		  <img class="w-8 h-8 rounded-full" src="../defaultuser.png" alt="USER">
		</button>
		<!-- Dropdown menu -->
		<div class="z-50 hidden my-4 text-base list-none bg-white divide-y divide-gray-100 rounded shadow dark:bg-gray-700 dark:divide-gray-600" id="user-dropdown">
		  <div class="px-4 py-3">
			<span class="block text-sm text-gray-900 dark:text-white align">{$username}</span>
			<!-- <span class="block text-sm font-medium text-gray-500 truncate dark:text-gray-400">name@flowbite.com</span> -->
		  </div>
		  <ul class="py-1" aria-labelledby="user-menu-button">	
			<li>
			  <a href="https://datacloud-auth.euprojects.net/auth/realms/user-authentication/protocol/openid-connect/logout" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white">Sign out</a>
			</li>
		  </ul>
		</div>
		<button data-collapse-toggle="mobile-menu-2" type="button" class="inline-flex items-center p-2 ml-1 text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600" aria-controls="mobile-menu-2" aria-expanded="false">
		  <span class="sr-only">Open main menu</span>
		  <svg class="w-6 h-6" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clip-rule="evenodd"></path></svg>
	  </button>
	</div>
	<div class="items-center justify-between hidden w-full md:flex md:w-auto md:order-1" id="mobile-menu-2">
		<!-- Maybe we will need a menu on the upper side of the navbar -->
	  <ul class="flex flex-col p-4 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:flex-row md:space-x-8 md:mt-0 md:text-sm md:font-medium md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
		<li>
		  <a href="#default" class="block py-2 pl-3 pr-4 text-white bg-blue-700 rounded md:bg-transparent md:text-blue-700 md:p-0 dark:text-white" aria-current="page">Home</a>
		</li>
		<li>
		  <a href="#default" class="block py-2 pl-3 pr-4 text-gray-700 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 dark:text-gray-400 md:dark:hover:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700">About</a>
		</li>
		<li>
		  <a href="#default" class="block py-2 pl-3 pr-4 text-gray-700 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 dark:text-gray-400 md:dark:hover:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700">Menu Item</a>
		</li>
		<li>
		  <a href="#default" class="block py-2 pl-3 pr-4 text-gray-700 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 dark:text-gray-400 md:dark:hover:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700">Menu Item</a>
		</li>
		<li>
		  <a href="#default" class="block py-2 pl-3 pr-4 text-gray-700 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 dark:text-gray-400 md:dark:hover:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700">Contact</a>
		</li>
	  </ul>
	</div>
	</div>
  </nav>
  
  <main>
	<!-- content comes here -->
	<slot />
</main>

<footer />

<style>
	main {
		margin: 10px auto;
	}
	footer {
		text-align: center;
	}
	.logo-custom {
		color: #1da2cd;
	}
	.align {
		text-align: center;
	}
</style>
<script>
	import { username } from '../stores/stores';
	import '../styles/global.css';
</script>

<header>
	<h1 style="text-align:center;">
		SIM-PIPE UI
		<span style="float:right; font-size:20px; padding:15px; ">👩‍🎓 {$username}</span>
	</h1>
	<!-- <div style="text-align:right; ">Log out*</div> -->
	<!-- <h5>
		{#if $username != ''}
			{$username} logged in 
		{/if}
	</h5> -->
</header>

<main>
	<!-- content comes here -->
	<slot />
</main>

<footer />

<style>
	header {
		/* justify-content: center; */
		/* display: flex; */
		padding: 0.2px;
		background-color: rgb(249, 163, 97);
	}
	h1 {
		color: black;
		font-size: 40px;
	}
	main {
		margin: 10px auto;
	}
	footer {
		text-align: center;
	}
</style>

<script>
    import '../styles/global.css'
</script>

<header>
    <h1>SIM-PIPE UI</h1>
</header>

<main>
    <!-- content comes here -->
    <slot></slot>
</main>

<footer>

</footer>

<style>
    header {        
        justify-content: center;
        display: flex;
        background-color: rgb(249, 163, 97);        
    }
    h1 {
        color: black;
        font-size: 40px;
    }
    main {
        margin: 20px auto;
    }
    footer {
        text-align: center;
    }
</style>
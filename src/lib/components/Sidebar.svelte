<script>
  import { page } from "$app/stores";
</script>

<nav>
  <div class="sidebar-item">
    <iconify-icon
      class="circle"
      class:active={$page.url.pathname == "/admin"}
      icon="material-symbols:dashboard-outline-rounded"
    />
    <a class:active={$page.url.pathname == "/admin"} href="/admin"> Dashboard </a>
  </div>
  <div class="sidebar-item">
    <iconify-icon class="circle" icon="clarity:details-line" />
    <a href="/permits"> Permits </a>
  </div>
  <div class="sidebar-item">
    <iconify-icon class="circle" icon="uit:house-user" />
    <a href="/residents"> Residents </a>
  </div>
  <div class="sidebar-item">
    <iconify-icon class="circle" icon="material-symbols:badge-outline" />
    <a href="/visitors"> Visitors </a>
  </div>
</nav>

<style>
  nav {
    background-color: white;
    display: flex;
    flex-direction: column;
    box-shadow: 0px 4px 60px rgba(0, 0, 0, 0.06);
    border-radius: 0px 18px 18px 0px;
    margin-top: 25px;
    margin-bottom: 25px;
    margin-right: 25px;
    padding-top: 35px;
  }

  iconify-icon {
    display: inline;
  }

  .sidebar-item {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 12px;
    margin: 25px 60px 25px 25px;
    font-size: 0.75rem;
  }

  a {
    text-decoration: none;
    color: #6d6d6d;
  }

  .circle {
    background-color: #f0f0f0;
    border-radius: 50px;
    padding: 10px;
    color: #8a8a8a;
  }

  iconify-icon.active {
    background-color: #13d380;
    color: white;
  }

  a.active {
    color: #13d380;
  }
</style>

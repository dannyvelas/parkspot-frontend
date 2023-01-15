<script>
  import { page } from "$app/stores";
</script>

<nav>
  <div class="sidebar-wrapper" class:active={$page.url.pathname == "/dashboard"}>
    <a href="/dashboard" class="sidebar-link" class:active={$page.url.pathname == "/dashboard"}>
      <iconify-icon
        class="circle"
        class:active={$page.url.pathname == "/dashboard"}
        icon="material-symbols:dashboard-outline-rounded"
      />
      Dashboard
    </a>
  </div>
  <div class="sidebar-wrapper" class:active={$page.url.pathname == "/permits"}>
    <a href="/permits" class="sidebar-link" class:active={$page.url.pathname == "/permits"}>
      <iconify-icon
        class="circle"
        class:active={$page.url.pathname == "/permits"}
        icon="clarity:details-line"
      />
      Permits
    </a>
  </div>
  <div class="sidebar-wrapper" class:active={$page.url.pathname == "/residents"}>
    <a href="/residents" class="sidebar-link" class:active={$page.url.pathname == "/residents"}>
      <iconify-icon
        class="circle"
        class:active={$page.url.pathname == "/residents"}
        icon="uit:house-user"
      />
      Residents
    </a>
  </div>
  <div class="sidebar-wrapper" class:active={$page.url.pathname == "/visitors"}>
    <a href="/visitors" class="sidebar-link" class:active={$page.url.pathname == "/visitors"}>
      <iconify-icon
        class="circle"
        class:active={$page.url.pathname == "/visitors"}
        icon="material-symbols:badge-outline"
      />
      Visitors
    </a>
  </div>
</nav>

<style>
  nav {
    background-color: white;
    display: flex;
    flex-direction: column;
    box-shadow: 0px 4px 60px rgba(0, 0, 0, 0.06);
    border-radius: 0px 18px 18px 0px;
    margin-bottom: 25px;
    padding-top: 35px;
  }

  iconify-icon {
    display: inline;
  }

  a {
    text-decoration: none;
    color: #6d6d6d;
  }

  .sidebar-link {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 12px;
    font-size: 0.75rem;
  }

  .sidebar-wrapper {
    padding: 12.5px 60px 12.5px 25px;
    margin: 12.5px 0 12.5px;
  }

  .circle {
    background-color: #f0f0f0;
    border-radius: 50px;
    padding: 10px;
    color: #8a8a8a;
  }

  .sidebar-wrapper.active {
    border-right: solid #13d380;
  }

  iconify-icon.active {
    background-color: #13d380;
    color: white;
  }

  a.active {
    color: #13d380;
  }
</style>

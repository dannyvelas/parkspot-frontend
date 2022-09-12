<svelte:head>
  <title>Resident Dashboard</title>
</svelte:head>

<h1>Resident Dashboard</h1>

<div>
  <p>
    List Active Parking Permits
    <a href="/permits/active"><button>Submit</button></a>
  </p>
  <p>
    List All Parking Permits:
    <a href="/permits/all"><button>Submit</button></a>
  </p>

  <hr />

  <p>
    Request a Guest Parking Permit:
    <a href="/permit"><button>Submit</button></a>
  </p>
  <p>
    Add a visitor:
    <a href="/visitor"><button>Submit</button></a>
  </p>
  <p>
    Your visitors:
    <a href="/visitors"><button>Submit</button></a>
  </p>
</div>

<style>
  h1,
  div {
    text-align: center;
  }
</style>

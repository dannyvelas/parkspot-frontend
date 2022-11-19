<script lang="ts">
  import hero from "$lib/assets/hero.png";
  import underline from "$lib/assets/landing/underline.png";
</script>

<header>
  <div class="hero-container">
    <h1>
      <span>Take Control</span> Of Your Community Parking With A Simple &
      <span>Easy-To-Use App</span>
    </h1>
    <div class="subhero-container">
      <h2>Welcome to ParkSpot!</h2>
      <img id="underline" alt="Underline" src={underline} />
    </div>
    <h3>
      A Modern Application That Helps Community Administrators Enforce Parking Rules For Their
      Residential Communities!
    </h3>
  </div>
  <img id="hero" alt="ParkSpot Hero" src={hero} />
</header>
<article>
  <section>
    <h2>Temporary Parking Permit Directions</h2>
    <ol>
      <li>
        <b>There exists only one account per apartment</b>
      </li>
      <li>
        <b>Usernames:</b>
        <ul>
          <li>A resident owner's username starts with "B". Eg: B8100123</li>
          <li>A tenant username starts with "T". Eg: T8100123</li>
        </ul>
      </li>
      <li>
        <b>Only Las Vistas residents can request parking permits</b>
      </li>
    </ol>
  </section>
  <section>
    <h2>Parking Regulations</h2>
    <ol>
      <li>
        <b>A permit request can last from 1 day to 15 days.</b> If a resident wants their guest to park
        for longer than 15 days, they must submit another request.
      </li>
      <li>
        <b>Each resident can give out max 20 days worth of parking permits per year.</b>
      </li>
      <li>
        <b>Each guest car can park max 20 days with temporary parking permits per year.</b>
      </li>
      <li>
        <b>A resident can have at most two active permits at a given time.</b>
        Residents can have allow two guests to park for the same days, but no more than two.
      </li>
      <li>
        <b>Permits must be displayed visibly on the dashboard.</b>
        A car without a visible parking visitor permit may be towed.
      </li>
      <li>
        <b>Residents that are caught faking permits will lose their guest parking privileges.</b>
        We do not support faking permits, as it is unfair to other residents and their parking rights.
      </li>
    </ol>
  </section>
</article>

<style>
  * {
    font-family: "Work Sans", sans-serif;
    font-weight: 300;
  }

  header {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }

  div.hero-container {
    padding: 0 15%;
  }

  h1 {
    font-size: 2.3em;
  }

  h1 > span {
    font-weight: 600;
  }

  h2 {
    font-size: 1.2em;
  }

  h3 {
    color: #6d6d6d;
  }

  div.subhero-container > h2 {
    margin-bottom: 0px;
  }

  img#hero {
    width: 500px;
    height: auto;
  }
</style>

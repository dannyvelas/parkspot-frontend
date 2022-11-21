<script lang="ts">
  import hero from "$lib/assets/hero.png";
  import underline from "$lib/assets/landing/underline.png";
  import cars from "$lib/assets/landing/cars.png";
</script>

<header>
  <div class="hero-text-container">
    <h1>
      <span>Take Control</span> Of Your Community Parking With A Simple &
      <span>Easy-To-Use App</span>
    </h1>
    <div class="subhero-text-container">
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
  <section class="simple">
    <div class="simple-text-container">
      <h2>Parking Management Made Simple</h2>
      <p>
        You can finally say goodbye to those daunting piles of paperwork lying on your desk! With
        our smart app, you can now keep a record of permits, residents, and their visitors all in
        one place! Issuing permits, granting additional parking days or unlimited parking days is
        only a few clicks away.
      </p>
    </div>
    <img id="cars" alt="Cars Parking" src={cars} />
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

  div.hero-text-container {
    padding: 0 15%;
  }

  h1 {
    font-size: 2.3em;
  }

  h1 span {
    font-weight: 600;
  }

  h2 {
    font-size: 1.2em;
  }

  h3 {
    color: #6d6d6d;
  }

  div.subhero-text-container h2 {
    margin-bottom: 0px;
  }

  img#hero {
    width: 35%;
    height: auto;
  }

  section {
    padding: 50px 15%;
  }

  article section h2 {
    font-weight: 600;
    text-align: center;
    font-size: 1.4em;
  }

  section.simple {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }

  div.simple-text-container {
    width: 45%;
  }

  img#cars {
    width: 35%;
    height: auto;
  }

  p {
    line-height: 1.75;
  }
</style>

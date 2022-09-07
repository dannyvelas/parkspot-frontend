<script lang="ts">
  import { post } from "$lib/api";
  import { messageDecoder } from "$lib/models";
  import { isOk } from "$lib/functional";

  let passwordsShown = false;
  $: passwordType = passwordsShown ? "text" : "password";
  let banner = "";

  const submit = async () => {
    if (fields.password !== confirmPassword) {
      banner = "Error: passwords do not match";
      return;
    } else if (fields.password === "") {
      banner = "Error: password cannot be empty";
      return;
    }

    const postRes = await post(`api/account`, fields, messageDecoder);
    if (!isOk(postRes)) {
      banner = postRes.message;
      return;
    }

    banner = postRes.data.message;
  };
</script>

<svelte:head>
  <title>Admin Dashboard</title>
</svelte:head>

<h1>Admin Dashboard</h1>

<p>
  List Active Parking Permits:
  <a href="/permits/active"><button>Submit</button></a>
</p>
<p>
  List All Parking Permits:
  <a href="/permits/all"><button>Submit</button></a>
</p>
<p>
  List Expired Parking Permits:
  <a href="/permits/expired"><button>Submit</button></a>
</p>
<p>
  List Exceptions:
  <a href="/permits/exceptions"><button>Submit</button></a>
</p>
<p>
  List Parking Days Given To Guests by Resident Id:
  <a href="/residents/days"><button>Submit</button></a>
</p>
<p>
  List Resident Accounts:
  <a href="/residents"><button>Submit</button></a>
</p>
<p>
  List Visitors:
  <a href="/visitors"><button>Submit</button></a>
</p>
<hr />
<p>
  Request a Guest Parking Permit for Resident:
  <a href="/permit"><button>Submit</button></a>
</p>
<hr />
<h2>Create User Account</h2>
{#if banner != ""}
  <div style="text-align: center">
    <p>{banner}</p>
  </div>
{/if}
<form on:submit|preventDefault={submit}>
  <input required type="text" name="residentID" placeholder="Resident ID" />
  <input required type="text" name="firstName" placeholder="First Name" />
  <input required type="text" name="lastName" placeholder="Last Name" />
  <input required type="text" name="phone" placeholder="Phone" />
  <input required type="text" name="email" placeholder="Email" />
  <input required type={passwordType} name="password" placeholder="Password" />
  <input required type={passwordType} name="confirmPassword" placeholder="Confirm Password" />
  <div style="margin:20px;">
    <label for="showPasswords">Show Passwords: </label>
    <input type="checkbox" id="showPasswords" bind:checked={passwordsShown} />
  </div>
  <button type="submit" style="margin:10px;">Submit</button>
</form>

<style>
  h2 {
    text-align: center;
  }

  form {
    margin: auto;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  input {
    margin: 5px;
    border: 1px solid #ccc;
    border-radius: 4px;
  }
</style>

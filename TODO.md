## Tech debt
- [x] add env variable for backend URL
- [x] delete \_LoadedCar.svelte
- [x] use Status<T> instead of result in car/[id].svelte
- [x] find a way to make exceptions list shorter (just make the list have the same amt of cols as other lists, use PermitList.svelte)
- [x] don't allow signed-in users to click login/register buttons
- [x] make the parameters to Pagination more similarly named to the parameters to PermitList
- [ ] removed `reversed` parameter from anywhere that is not a permit endpoint.
- [ ] (NOT NECESSARY) make error messages more abstracted and user friendly in login page
- [ ] (HARD) logout when token expires
- [ ] (NEW JS LIB) find a way to only define list styles once
- [ ] (DEPLOY) make `credentials=true` in fetch options, only work in dev if it's not necessary in prod
- [ ] (DEPLOY) test how different the user experience is without client side rendering works
## Major Missing From Spec
- [x] show actual number of all permits instead of just the amount on the page
- [x] edit and delete
- [x] not signing out on re-fresh
- [x] search functionality permits page
- [x] admin create parking permit
- [x] resident page
    - [x] resident create parking permit
    - [x] see active and all parking permits
    - [ ] create visitors
- [x] visitors page
- [x] re-print permit
- [ ] create user account
- [ ] edit resident parking days
## Minor Missing From Spec
- [x] nav bar at top of admin page
- [x] style logout button in navbar to be side-by-side with Go Back To Dashboard
- [ ] remove unnecessary session checking in load funcs since now it's done in root component
- [ ] sort residents by amt parking days
- [ ] resident repo edit and delete
- [ ] nav bar at bottom of list pages
- [ ] add support for security accounts
- [ ] search residents
## Low priority
- [ ] remove all session checking in load fns
- [ ] make /permits/\* pages automatically re-route to the resident dashboard if it's a resident that is trying to access them
- [ ] probably remove ability for residents to re-print all of their permits
- [ ] make all permits for resident filter in place
- [ ] move renderDate and tsToDate funcs to libs since both \_PermitsList and permit/[id] components use them
- [ ] move dashboard func to lib directory
- [ ] organize lib directory by separating helper funcs and components
- [ ] clean up to make sure that the order of `// props, // model, // init, // events, // helpers` is consistent
- [ ] add check to redirect signed-in users to the correct dashboard
- [ ] change resident pages from /resident/[id]/permits to me/permits, so that we don't have to worry about resident 123 trying to go to /resident/567/permits
- [ ] don't let people go to ?page=43 where 43 > total amount of pages
- [ ] make page amounts re-fresh when items are deleted from list
- [ ] find some way to get 401 and sign person out before API returns 401
- [ ] add `map` type to Status and Result
- [ ] find some way to copy less logic between index.svelte and login.svelte (also maybe shorten nav.svelte)
- [ ] add banner to parent component of nav when logout error happens
## Won't do
- [✗] make params a `{}` argument or use generated types in index.svelte
    * little value
- [✗] strongly type the Props of every `load` func.
    * little value
